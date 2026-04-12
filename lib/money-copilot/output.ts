import type { CopilotRequest, CopilotResponse, DecisionMode, FinancialInputs, Scenario, ScenarioResults } from './types';
import {
  calcHomeAffordability,
  calcMonthlyObligations,
  estimateMonthlyNetIncome,
  formatCurrency,
  formatPercent,
  scoreScenario
} from './calculators';
import { assessConfidence, compareScenarios, computeScenarioResults, extractMissingData } from './scenario';
import { getModeFromQuestion } from './prompts';
import { mergeNlpIntoInputs, parseFinancialDataFromText } from './nlp-parser';

// ─── Shared constants ─────────────────────────────────────────────────────────
/** Standard work hours per year: 40h/week × 52 weeks */
const ANNUAL_WORK_HOURS = 2080;

/** Rate used to estimate the total compensation premium needed for C2C/contractor
 *  roles to break even with W2 (covers self-employment tax + benefits offset).
 *  Mid-point of the commonly cited 15–20% range. */
const C2C_BENEFITS_OFFSET_RATE = 0.17;

/** Average state income tax rate used as a proxy when state is unknown. */
const AVG_STATE_TAX_RATE = 0.05;

/** Approximate max loan reduction per $500/month of additional debt at 7% APR
 *  over a 30-year term: $500 / (0.07/12) * (1 - (1.07/12)^-360) ≈ $65,000. */
const DEBT_TO_HOME_PRICE_MULTIPLIER = 65_000;

const DISCLAIMER =
  'This tool provides educational decision-support estimates only. It is not financial, legal, or tax advice. All calculations use approximations and stated assumptions. Consult a qualified financial professional before making major financial decisions.';

// ─── Default assumption models ────────────────────────────────────────────────
// Used when user inputs are missing so the AI always produces a useful answer.
const REFINEMENT_PROMPT = 'Want me to personalize this with your numbers?';

const US_DEFAULTS = {
  annualSalary: 65_000,
  newAnnualSalary: 75_000,
  housing: 1_500,
  downPayment: 20_000,
  debtPayments: 300,
  homeIncome: 80_000,
  homeDebt: 300,
};

const INDIA_DEFAULTS = {
  annualSalary: 800_000, // ₹8 LPA
  newAnnualSalary: 1_000_000, // ₹10 LPA
  housing: 15_000, // ₹15K/month
  downPayment: 500_000, // ₹5L
  homeIncome: 1_000_000, // ₹10 LPA
  homeDebt: 5_000,
};

/** Apply reasonable defaults for missing income fields. Returns enriched inputs and a flag indicating defaults were used. */
function applyIncomeDefaults(inputs: FinancialInputs, region?: 'US' | 'India'): { inputs: FinancialInputs; usedDefaults: boolean } {
  const hasSalary = !!(inputs.annualSalary || inputs.hourlyRate);
  if (hasSalary) return { inputs, usedDefaults: false };
  const d = region === 'India' ? INDIA_DEFAULTS : US_DEFAULTS;
  return {
    inputs: { ...inputs, annualSalary: d.annualSalary },
    usedDefaults: true,
  };
}

function buildAssumptions(inputs: FinancialInputs, mode: DecisionMode): string[] {
  const assumptions: string[] = [];
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * ANNUAL_WORK_HOURS : 0);

  if (salary) {
    const { estimatedTaxRate, note } = estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType);
    assumptions.push(`Tax estimate: ~${Math.round(estimatedTaxRate * 100)}% effective rate. ${note}.`);
  }

  if (!inputs.state) assumptions.push('No state specified — used average 5% state income tax.');
  if (!inputs.employmentType) assumptions.push('Employment type not specified — assumed W2.');
  if (!inputs.groceries) assumptions.push('Groceries/food not entered — not included in obligation total.');
  if (!inputs.insurance) assumptions.push('Insurance costs not entered — not included.');
  if (!inputs.transportation) assumptions.push('Transportation costs not entered — not included.');

  if (mode === 'home-affordability') {
    assumptions.push('Mortgage rate assumed at 7% (30-year fixed). Actual rates vary — check current lender quotes.');
    assumptions.push('28/36 rule used: max 28% of gross income on housing, 36% on total debt.');
    assumptions.push('Property taxes and homeowner insurance not included in payment estimate.');
  }

  if (mode === 'roth-vs-traditional') {
    assumptions.push('Roth vs. traditional analysis assumes tax bracket does not change significantly in retirement without entering expected retirement income.');
    if (!inputs.timeHorizon) assumptions.push('Investment horizon defaulted to 20 years.');
    assumptions.push('Investment returns assumed at 7% annually (historical S&P 500 average).');
  }

  if (mode === 'debt-payoff') {
    assumptions.push('Debt interest rate not provided — payoff benefit could be higher with high-rate debt (>15% APR).');
  }

  return assumptions;
}

function jobOfferResponse(request: CopilotRequest, scenarios: Scenario[]): Partial<CopilotResponse> {
  const region = request.region ?? 'US';
  const d = region === 'India' ? INDIA_DEFAULTS : US_DEFAULTS;
  const { inputs: enriched, usedDefaults } = applyIncomeDefaults(request.inputs, region);
  const { inputs } = { ...request, inputs: enriched };

  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * ANNUAL_WORK_HOURS : d.annualSalary);
  const newSalary = inputs.newAnnualSalary ?? (inputs.newHourlyRate ? inputs.newHourlyRate * ANNUAL_WORK_HOURS : d.newAnnualSalary);
  const { monthlyNet, monthlyGross } = estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType);
  const { monthlyNet: newMonthlyNet } = estimateMonthlyNetIncome(newSalary, inputs.state, inputs.employmentType);
  const obligations = calcMonthlyObligations(inputs);
  const leftover = Math.max(0, monthlyNet - obligations);
  const netMonthlyGain = newMonthlyNet - monthlyNet;

  const isC2C = inputs.employmentType === 'c2c' || inputs.employmentType === 'contractor';

  const defaultNote = usedDefaults
    ? ` (using assumed ${region === 'India' ? '₹8L→₹10L CTC' : '$65K→$75K'} — ${REFINEMENT_PROMPT})`
    : '';

  const summary = `${isC2C ? 'C2C offer: ' : ''}Current take-home ~${formatCurrency(monthlyNet)}/month vs. new offer ~${formatCurrency(newMonthlyNet)}/month — net gain of ${formatCurrency(netMonthlyGain)}/month after taxes.${defaultNote}`;

  const recommendation = isC2C
    ? `C2C/contractor roles require 15–20% more gross pay than equivalent W2 to break even after self-employment taxes and benefits costs. The ${formatCurrency(newSalary)} offer needs ~${formatCurrency(newSalary * C2C_BENEFITS_OFFSET_RATE)} added to offset benefits loss vs. a W2. ${netMonthlyGain > 0 ? `Still nets +${formatCurrency(netMonthlyGain)}/month.` : 'Does not break even at this rate.'}`
    : netMonthlyGain > 200
      ? `Take the offer. The ${formatCurrency(newSalary)} package nets +${formatCurrency(netMonthlyGain)}/month (+${formatCurrency(netMonthlyGain * 12)}/year) after taxes. Confirm benefits package before signing.`
      : netMonthlyGain > 0
        ? `Marginal gain: only +${formatCurrency(netMonthlyGain)}/month after taxes on the ${formatCurrency(newSalary)} offer. Negotiate for more or factor in non-salary benefits (equity, PTO, flexibility).`
        : `The offers are roughly equivalent after taxes. Prioritize benefits, growth potential, and job security over base salary.`;

  const keyMetrics = [
    { label: 'Current take-home (est.)', value: formatCurrency(monthlyNet), note: 'After estimated taxes' },
    { label: 'New offer take-home (est.)', value: formatCurrency(newMonthlyNet), note: 'After estimated taxes' },
    { label: 'Monthly net gain', value: `${netMonthlyGain >= 0 ? '+' : ''}${formatCurrency(netMonthlyGain)}` },
    { label: 'Monthly obligations tracked', value: formatCurrency(obligations) },
    { label: 'Monthly surplus (new)', value: formatCurrency(Math.max(0, newMonthlyNet - obligations)) }
  ];

  if (isC2C) {
    keyMetrics.push({ label: 'Self-employment tax premium', value: '~15.3% of net earnings', note: 'Employer + employee FICA — fully on contractor' });
    keyMetrics.push({ label: 'Benefits value to add back', value: 'Estimate $6,000–$15,000/yr', note: 'Health, dental, vision, paid time off, 401(k) match' });
  }

  const sensitivities = [
    'If the role moves from W2 to C2C, net pay drops by roughly $800–$1,800/month at this income level.',
    'A 10% salary increase would add ~' + formatCurrency(salary * 0.1 / 12 * 0.75) + '/month after taxes.',
    'Moving to a no-income-tax state (TX, FL, NV) would add ~' + formatCurrency(salary * AVG_STATE_TAX_RATE / 12) + '/month net.',
    'Loss of employer 401(k) match could cost $2,000–$8,000/year in total compensation.'
  ];

  const risks = [
    'W2 vs. C2C comparison requires factoring health insurance cost, paid time off, and retirement match — not just base salary.',
    'Variable compensation (bonus, commission) adds income risk if not guaranteed.',
    'State income tax difference between current and new location is often overlooked in total comp.'
  ];

  const nextSteps = [
    'Request a full benefits breakdown (health, dental, vision, 401k match, PTO) from the employer.',
    'Compare the offer using an annualized total compensation view, not just base salary.',
    'If C2C: talk to a CPA about quarterly estimated taxes and deductible business expenses.',
    'Run the relocation mode if the job requires moving to a new state.'
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

function relocationResponse(request: CopilotRequest, scenarios: Scenario[]): Partial<CopilotResponse> {
  const region = request.region ?? 'US';
  const d = region === 'India' ? INDIA_DEFAULTS : US_DEFAULTS;
  const { inputs: enriched, usedDefaults } = applyIncomeDefaults(request.inputs, region);
  const { inputs } = { ...request, inputs: enriched };
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * ANNUAL_WORK_HOURS : d.annualSalary);

  const stateKey = inputs.state?.toUpperCase().trim();
  const noTaxStates = new Set(['TX', 'FL', 'NV', 'WA', 'SD', 'WY', 'AK', 'TN', 'NH']);
  const isNoTaxState = stateKey ? noTaxStates.has(stateKey) : false;

  const taxSavings = isNoTaxState ? salary * AVG_STATE_TAX_RATE : 0;
  const defaultNote = usedDefaults ? ` (assumed ${region === 'India' ? '₹8L CTC' : '$65K salary'} — ${REFINEMENT_PROMPT})` : '';

  const summary = inputs.state
    ? `Relocating to ${inputs.state}${isNoTaxState ? ' (no state income tax)' : ''} on ${formatCurrency(salary)}/year: ${isNoTaxState ? `estimated annual tax savings of ${formatCurrency(taxSavings)}` : 'tax differential depends on origin state'}.${defaultNote}`
    : `Relocation analysis: on ${formatCurrency(salary)}/year, moving to a no-income-tax state like TX or FL saves ~${formatCurrency(salary * AVG_STATE_TAX_RATE)}/year.${defaultNote}`;

  const recommendation = isNoTaxState && inputs.state
    ? `Move makes financial sense if housing cost increase is under ${formatCurrency(taxSavings / 12)}/month. Moving to ${inputs.state} (no state income tax) saves ~${formatCurrency(taxSavings)}/year (~${formatCurrency(taxSavings / 12)}/month). Break even on $5K moving costs in ~${Math.ceil(5000 / (taxSavings / 12))} months.`
    : `For most relocations, the financial case comes down to: (1) state tax differential, (2) housing cost change, (3) cost-of-living delta. Moving to TX, FL, or NV from a high-tax state saves ~5% of income annually. Moving within high-tax states breaks even only if housing improves.`;

  const keyMetrics = [
    { label: 'Annual state tax savings (est.)', value: isNoTaxState ? formatCurrency(taxSavings) : 'Depends on origin state', note: isNoTaxState ? 'Based on ~5% avg state rate' : 'Enter origin state for exact figure' },
    { label: 'Monthly savings', value: isNoTaxState ? formatCurrency(taxSavings / 12) : 'N/A' },
    { label: 'Monthly housing cost', value: inputs.monthlyRent ? formatCurrency(inputs.monthlyRent) : inputs.mortgage ? formatCurrency(inputs.mortgage) : `Assumed ${formatCurrency(d.housing)}` },
    { label: 'Destination state', value: inputs.state ?? 'Not specified (enter for exact analysis)' }
  ];

  const sensitivities = [
    'A $300/month housing increase in the new city would offset $3,600/year of tax savings.',
    'If salary is reduced to match the new city\'s market, verify that net income after taxes still leads.',
    'Cost-of-living index differences for groceries, transportation, and childcare can swing the total by $200–$600/month.',
    'Federal taxes are the same regardless of state — only state and local taxes change.'
  ];

  const risks = [
    'Cost-of-living indices are averages — your personal spending may differ significantly from the median.',
    'Moving costs ($2,000–$10,000+) are a one-time hit that can take 6–18 months to recoup via tax savings.',
    'Some no-income-tax states have higher sales taxes, property taxes, or vehicle registration fees.',
    'Job market and career trajectory in the destination city may differ from current location.'
  ];

  const nextSteps = [
    'Use a cost-of-living calculator to compare specific city-to-city spending differences.',
    'Get a housing market estimate for the target city before committing.',
    'Calculate the break-even timeline: (Moving cost) ÷ (Monthly net gain) = Months to break even.',
    'Add the relocation as Scenario A vs. staying as Scenario B using the scenario builder above.'
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

function debtPayoffResponse(request: CopilotRequest, scenarios: Scenario[]): Partial<CopilotResponse> {
  const { inputs } = request;
  const cashOnHand = inputs.cashOnHand ?? 0;
  const monthlyDebt = inputs.debtPayments ?? 0;
  const obligations = calcMonthlyObligations(inputs);

  const emergencyRunway = obligations > 0 ? (cashOnHand / obligations).toFixed(1) : 'N/A';
  const hasAdequateEmergencyFund = obligations > 0 && cashOnHand >= obligations * 3;

  const summary = `With ${formatCurrency(cashOnHand)} cash on hand and ${formatCurrency(monthlyDebt)}/month in debt payments, your emergency runway is ~${emergencyRunway} months of expenses.`;

  const recommendation = hasAdequateEmergencyFund
    ? `Your emergency fund covers 3+ months of expenses. It is reasonable to direct extra cash flow toward high-interest debt (>7% APR) before additional investing. Pay minimums on low-rate debt and attack the highest-rate balance first (avalanche method).`
    : `Your emergency runway is under 3 months. Prioritize building to a 3-month cushion before aggressively paying down debt — except high-rate credit cards (>15% APR) which are a guaranteed return at that rate.`;

  const keyMetrics = [
    { label: 'Cash on hand', value: formatCurrency(cashOnHand) },
    { label: 'Monthly debt payments', value: formatCurrency(monthlyDebt) },
    { label: 'Emergency runway', value: `${emergencyRunway} months` },
    { label: 'Monthly obligations total', value: formatCurrency(obligations) }
  ];

  const sensitivities = [
    'Every extra $200/month applied to a $10,000 loan at 15% APR saves ~$2,400 in interest.',
    'Keeping $1,000 less in savings to accelerate debt at 18% APR returns 18% guaranteed.',
    'If your income drops, having cash matters more than a lower debt balance.',
    'Adding employer 401k match before extra debt payments is almost always the right call — it\'s a 50–100% return.'
  ];

  const risks = [
    'Depleting cash reserves to pay debt faster leaves no buffer for income disruption.',
    'Not capturing the full employer 401(k) match while paying down low-rate debt is a common costly mistake.',
    'Variable interest rates on HELOCs or adjustable loans can change the payoff math quickly.'
  ];

  const nextSteps = [
    'List all debts by interest rate (APR), balance, and minimum payment.',
    'Confirm whether your employer 401(k) match is being fully captured before extra debt payments.',
    'Run the emergency fund mode to determine your exact savings target.',
    'Consider the debt avalanche method: pay minimums on all debt, then put surplus at highest-APR balance.'
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

function rothVsTraditionalResponse(request: CopilotRequest, scenarios: Scenario[]): Partial<CopilotResponse> {
  const { inputs } = request;
  const salary = inputs.annualSalary ?? 0;
  const timeHorizon = inputs.timeHorizon ?? 20;
  const currentTaxRate = inputs.taxAssumption ?? 0.22;

  const annualContribution = 23000;
  const growthRate = 0.07;

  const futureValueFactor = Math.pow(1 + growthRate, timeHorizon);
  const rothBalance = annualContribution * ((futureValueFactor - 1) / growthRate);
  const tradBalance = annualContribution * ((futureValueFactor - 1) / growthRate);

  const rothAfterTax = rothBalance;
  const tradAfterTax = tradBalance * (1 - 0.22);

  const prefersRoth = currentTaxRate <= 0.22 || timeHorizon >= 20;

  const summary = salary
    ? `At ${formatCurrency(salary)} salary with a ${Math.round(currentTaxRate * 100)}% current marginal tax rate and ${timeHorizon}-year horizon, Roth vs. traditional is a tax-timing decision.`
    : 'Enter your salary and tax rate to model the Roth vs. traditional tradeoff.';

  const recommendation = prefersRoth
    ? `Roth 401(k) is generally preferred at your income level and time horizon. Paying taxes now locks in today\'s rate. In ${timeHorizon} years, a ${formatCurrency(annualContribution)}/year Roth contribution could grow to ~${formatCurrency(rothAfterTax)} tax-free vs. ~${formatCurrency(tradAfterTax)} after-tax from traditional.`
    : `Traditional pre-tax contributions make sense if you expect to be in a significantly lower tax bracket in retirement. Deferring taxes now saves ${Math.round(currentTaxRate * 100)}% immediately, but withdrawals will be taxed.`;

  const keyMetrics = [
    { label: 'Current marginal tax rate', value: formatPercent(currentTaxRate), note: 'Used for Roth vs. traditional comparison' },
    { label: 'Investment horizon', value: `${timeHorizon} years` },
    { label: 'Max 401(k) contribution (2024)', value: formatCurrency(annualContribution) },
    { label: 'Projected Roth balance at end', value: `~${formatCurrency(rothAfterTax)}`, note: '7% assumed return, tax-free' },
    { label: 'Projected traditional (after-tax)', value: `~${formatCurrency(tradAfterTax)}`, note: '22% assumed withdrawal rate' },
    { label: 'Employer match', value: inputs.employerMatch ? formatPercent(inputs.employerMatch / 100) : 'Not entered', note: 'Always capture the full match regardless of Roth vs. traditional choice' }
  ];

  const sensitivities = [
    'If your tax rate drops to 12% in retirement, traditional wins by a wide margin.',
    'If Congress raises tax rates in the future, Roth locks in today\'s lower rate.',
    'State income tax in retirement vs. now adds another layer — some states exempt retirement income.',
    'A 1% higher investment return compounded over 20 years changes the balance by 20-25%.'
  ];

  const risks = [
    'Roth accounts have income limits for direct IRA contributions ($161k single / $240k married in 2024).',
    'Backdoor Roth IRA is an option above income limits but requires awareness of the pro-rata rule.',
    '100% Roth locks in tax diversification but reduces current take-home pay.',
    'Required Minimum Distributions (RMDs) apply to traditional accounts at 73 — not to Roth accounts.'
  ];

  const nextSteps = [
    'Confirm your current marginal federal tax rate (and state rate) using your most recent pay stub.',
    'Check if your employer plan offers a Roth 401(k) option — many do.',
    'Capture the full employer match first — then decide Roth vs. traditional for the remainder.',
    'Consider splitting contributions: part Roth, part traditional for tax diversification.'
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

function emergencyFundResponse(request: CopilotRequest, scenarios: Scenario[]): Partial<CopilotResponse> {
  const { inputs } = request;
  const cashOnHand = inputs.cashOnHand ?? 0;
  const targetMonths = inputs.targetEmergencyMonths ?? 6;
  const obligations = calcMonthlyObligations(inputs);
  const targetAmount = obligations * targetMonths;
  const deficit = Math.max(0, targetAmount - cashOnHand);
  const currentRunway = obligations > 0 ? cashOnHand / obligations : 0;

  const summary = `You have ${formatCurrency(cashOnHand)} in emergency savings, covering ~${currentRunway.toFixed(1)} months of tracked obligations (${formatCurrency(obligations)}/month). Your target is ${targetMonths} months = ${formatCurrency(targetAmount)}.`;

  const recommendation = deficit > 0
    ? `You need ${formatCurrency(deficit)} more to reach your ${targetMonths}-month target. At ${formatCurrency(500)}/month saved, that takes ${Math.ceil(deficit / 500)} months. Prioritize a high-yield savings account for this fund.`
    : `Your emergency fund is fully funded at ${targetMonths}+ months of expenses. Redirect surplus toward debt payoff or investing.`;

  const keyMetrics = [
    { label: 'Current emergency fund', value: formatCurrency(cashOnHand) },
    { label: 'Monthly obligations', value: formatCurrency(obligations) },
    { label: 'Current runway', value: `${currentRunway.toFixed(1)} months` },
    { label: 'Target months', value: `${targetMonths} months` },
    { label: 'Target amount', value: formatCurrency(targetAmount) },
    { label: 'Funding gap', value: deficit > 0 ? formatCurrency(deficit) : 'Fully funded ✓' }
  ];

  const sensitivities = [
    'If monthly obligations increase by $500, the same cash only covers ' + ((cashOnHand / (obligations + 500)).toFixed(1)) + ' months.',
    'Parking emergency funds in a 4.5-5% HYSA earns ~' + formatCurrency(cashOnHand * 0.045 / 12) + '/month in interest.',
    'A 2-income household may be comfortable with 3 months; single-income households should target 6+.',
    'Freelancers and contractors should target 6–9 months due to income variability.'
  ];

  const risks = [
    'Keeping emergency funds in a checking account earning near 0% costs real money vs. a HYSA.',
    'Lumping emergency funds with general savings makes it easy to accidentally spend.',
    'Underestimating monthly expenses leads to setting the target too low.',
    'Job loss often comes with temporary income interruption before severance or unemployment kicks in.'
  ];

  const nextSteps = [
    'Open a dedicated high-yield savings account (HYSA) for emergency funds — currently 4.5–5% APY.',
    'Set up an automatic monthly transfer to build the fund systematically.',
    'Define your actual monthly "survival budget" — it may be lower than your current spending.',
    'Once funded, shift extra cash flow to investing or debt payoff.'
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

function homeAffordabilityResponse(request: CopilotRequest, scenarios: Scenario[]): Partial<CopilotResponse> {
  const region = request.region ?? 'US';
  const d = region === 'India' ? INDIA_DEFAULTS : US_DEFAULTS;
  const { inputs: enriched, usedDefaults } = applyIncomeDefaults(request.inputs, region);
  const { inputs } = { ...request, inputs: enriched };
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * ANNUAL_WORK_HOURS : d.homeIncome);
  const downPayment = inputs.cashOnHand ?? d.downPayment;
  const monthlyDebt = inputs.debtPayments ?? d.homeDebt;

  const { maxHomePrice, monthlyPaymentEstimate, note } = calcHomeAffordability(salary, downPayment, monthlyDebt);

  const defaultNote = usedDefaults ? ` (assumed ${region === 'India' ? '₹10L income' : '$80K income'}, ${region === 'India' ? '₹5L' : '$20K'} down — ${REFINEMENT_PROMPT})` : '';

  const summary = `On ${formatCurrency(salary)}/year with ${formatCurrency(downPayment)} down and ${formatCurrency(monthlyDebt)}/month existing debt: max home ~${formatCurrency(maxHomePrice)} (28/36 rule, 7% rate).${defaultNote}`;

  const recommendation = `Your budget supports up to ~${formatCurrency(maxHomePrice)}. Monthly housing payment estimate: ${formatCurrency(monthlyPaymentEstimate)} (PITI). Aim for 80–90% of this ceiling (~${formatCurrency(maxHomePrice * 0.85)}) to keep a financial cushion. With 20% down you avoid PMI; on ${formatCurrency(maxHomePrice)} that means a ${formatCurrency(maxHomePrice * 0.20)} down payment.`;

  const keyMetrics = [
    { label: 'Annual income (used)', value: formatCurrency(salary) },
    { label: 'Down payment available', value: formatCurrency(downPayment) },
    { label: 'Existing monthly debt', value: formatCurrency(monthlyDebt) },
    { label: 'Max monthly housing payment', value: formatCurrency(monthlyPaymentEstimate), note: '28% of gross income rule' },
    { label: 'Max home price estimate', value: formatCurrency(maxHomePrice), note },
    { label: '20% down on max home', value: formatCurrency(maxHomePrice * 0.20), note: 'Required to avoid PMI' }
  ];

  const sensitivities = [
    'A 1% increase in mortgage rate reduces your max loan by roughly 10%.',
    `Each $500/month in existing debt reduces your max home price by ~${formatCurrency(DEBT_TO_HOME_PRICE_MULTIPLIER)}.`,
    'A 20% down payment eliminates PMI (~0.5–1.5% annually on loan balance).',
    'Property taxes and homeowner insurance typically add $300–$800/month to true housing cost.'
  ];

  const risks = [
    'The 28/36 rule is a guideline, not a guarantee — lenders may approve more or less.',
    'Buying at the maximum limit leaves no room for maintenance (budget 1–2% of home value/year).',
    'Interest rates are variable — get pre-approved at current rates before house hunting.',
    'PMI adds cost if down payment is under 20%, reducing the affordability advantage.'
  ];

  const nextSteps = [
    'Get pre-approved with a lender to see actual rates and terms based on your credit profile.',
    'Budget for closing costs (2–5% of purchase price) on top of the down payment.',
    'Calculate all-in monthly costs: mortgage + taxes + insurance + HOA + maintenance reserve.',
    'Stress-test: can you afford the home if your income drops 20% temporarily?'
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

function budgetStressTestResponse(request: CopilotRequest, scenarios: Scenario[]): Partial<CopilotResponse> {
  const region = request.region ?? 'US';
  const d = region === 'India' ? INDIA_DEFAULTS : US_DEFAULTS;
  const { inputs: enriched, usedDefaults } = applyIncomeDefaults(request.inputs, region);
  const { inputs } = { ...request, inputs: enriched };
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * ANNUAL_WORK_HOURS : d.annualSalary);
  const { monthlyNet, monthlyGross } = estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType);

  const obligations = calcMonthlyObligations(inputs);
  const leftover = Math.max(0, monthlyNet - obligations);

  const stress10 = Math.max(0, monthlyNet * 0.9 - obligations);
  const stress20 = Math.max(0, monthlyNet * 0.8 - obligations);
  const stress30 = Math.max(0, monthlyNet * 0.7 - obligations);

  const defaultNote = usedDefaults ? ` (assumed ${region === 'India' ? '₹8L salary' : '$65K salary'} — ${REFINEMENT_PROMPT})` : '';

  const summary = `At ${formatCurrency(monthlyNet)}/month take-home vs. ${formatCurrency(obligations)}/month in obligations: ${formatCurrency(leftover)}/month buffer. -10% income → ${formatCurrency(stress10)} buffer; -20% → ${formatCurrency(stress20)}.${defaultNote}`;

  const recommendation = leftover > 800
    ? `Your budget has solid cushion. A 10% income drop leaves ${formatCurrency(stress10)}/month — still manageable. Ensure 3 months of expenses (${formatCurrency(obligations * 3)}) is in a HYSA before increasing fixed costs.`
    : leftover > 0
      ? `Your buffer of ${formatCurrency(leftover)}/month is thin. A 10% income cut would leave only ${formatCurrency(stress10)}/month. Identify at least $300–$500/month in discretionary cuts that could activate quickly if income drops.`
      : `Your obligations nearly exceed your take-home. This budget is under stress at baseline — identify non-essential expenses to cut now before any income disruption.`;

  const keyMetrics = [
    { label: 'Monthly take-home', value: formatCurrency(monthlyNet) },
    { label: 'Monthly obligations', value: formatCurrency(obligations) },
    { label: 'Current monthly surplus', value: formatCurrency(leftover) },
    { label: 'Surplus at -10% income', value: formatCurrency(stress10) },
    { label: 'Surplus at -20% income', value: formatCurrency(stress20) },
    { label: 'Surplus at -30% income', value: formatCurrency(stress30) },
    { label: 'Housing burden', value: monthlyGross > 0 ? formatPercent((inputs.monthlyRent ?? inputs.mortgage ?? 0) / monthlyGross) : 'N/A' }
  ];

  const sensitivities = [
    'Your largest fixed costs (rent/mortgage, debt) are the ones you cannot cut quickly — they determine your floor.',
    'A $200/month grocery reduction during stress is achievable but requires planning ahead.',
    'Pausing discretionary subscriptions and dining out could save $100–$400/month as a first-response measure.',
    'Having 3+ months of savings means income disruption is survivable without taking on new debt.'
  ];

  const risks = [
    'Fixed obligations (rent, debt minimums, insurance) are the danger zone — they do not flex with income.',
    'Underestimating discretionary spending leads to incorrect leftover calculations.',
    'A two-income household has hidden income concentration risk if one income represents 70%+ of the total.',
    'Credit cards used to fill budget gaps during stress quickly become high-interest debt.'
  ];

  const nextSteps = [
    'Identify your "survival budget": what is the minimum you need each month to cover non-negotiables?',
    'Create a 3-tier spending plan: normal, 10% cut, 20% cut — know which categories to trim first.',
    'Ensure 3 months of obligations are in an accessible HYSA before taking on new fixed costs.',
    'Review subscriptions and auto-charges to identify quick wins if income drops.'
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

function customResponse(request: CopilotRequest, scenarios: Scenario[]): Partial<CopilotResponse> {
  const region = request.region ?? 'US';
  const d = region === 'India' ? INDIA_DEFAULTS : US_DEFAULTS;
  const { inputs: enriched, usedDefaults } = applyIncomeDefaults(request.inputs, region);
  const { inputs } = { ...request, inputs: enriched };
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * ANNUAL_WORK_HOURS : d.annualSalary);
  const { monthlyNet } = estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType);
  const obligations = calcMonthlyObligations(inputs);
  const leftover = Math.max(0, monthlyNet - obligations);

  const defaultNote = usedDefaults ? ` (assumed ${region === 'India' ? '₹8L salary' : '$65K salary'} — ${REFINEMENT_PROMPT})` : '';

  const summary = `On ${formatCurrency(salary)}/year: ~${formatCurrency(monthlyNet)}/month take-home, ${formatCurrency(obligations)}/month tracked obligations, ${formatCurrency(leftover)}/month surplus.${defaultNote}`;

  const recommendation = leftover > 500
    ? `With ${formatCurrency(leftover)}/month surplus: (1) ensure 3-month emergency fund (${formatCurrency(obligations * 3)}), (2) capture full employer 401(k) match, (3) then attack any high-rate debt (>7% APR). Use a specific mode above for deeper analysis.`
    : `With ${formatCurrency(leftover)}/month surplus, cash flow is tight. Prioritize: (1) minimum payments on all debt, (2) one month emergency buffer, (3) identify $200–$400/month in discretionary cuts. Don't invest until high-rate debt is under control.`;

  const keyMetrics = [
    { label: 'Monthly take-home', value: formatCurrency(monthlyNet) },
    { label: 'Monthly obligations tracked', value: formatCurrency(obligations) },
    { label: 'Estimated monthly surplus', value: formatCurrency(leftover) },
    { label: '3-month emergency target', value: formatCurrency(obligations * 3) }
  ];

  const sensitivities = [
    'The accuracy of this analysis depends on the completeness of your inputs.',
    'Add specific decision mode context (job offer, relocation, etc.) for more targeted recommendations.',
    'Tax estimates assume W2 employment unless specified otherwise.'
  ];

  const risks = [
    'Generic analysis without a specific decision mode may miss important factors for your situation.',
    'Verify all estimates against your actual pay stubs and bank statements.',
    'This tool cannot account for local cost of living differences without city-level data.'
  ];

  const nextSteps = [
    'Select the decision mode that best matches your question for more specific analysis.',
    'Add a second scenario to compare two options side by side.',
    'Input all major expense categories for the most accurate surplus estimate.'
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

function ambiguousOfferResponse(
  request: CopilotRequest,
  _scenarios: Scenario[]
): Partial<CopilotResponse> {
  // Provide a useful recommendation immediately, treating it as a job offer (most common case)
  const region = request.region ?? 'US';
  const d = region === 'India' ? INDIA_DEFAULTS : US_DEFAULTS;
  const { inputs: enriched, usedDefaults } = applyIncomeDefaults(request.inputs, region);
  const { inputs } = { ...request, inputs: enriched };
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * ANNUAL_WORK_HOURS : d.annualSalary);
  const newSalary = inputs.newAnnualSalary ?? d.newAnnualSalary;
  const { monthlyNet } = estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType);
  const { monthlyNet: newMonthlyNet } = estimateMonthlyNetIncome(newSalary, inputs.state, inputs.employmentType);
  const netGain = newMonthlyNet - monthlyNet;

  const defaultNote = usedDefaults ? ` (assumed ${region === 'India' ? '₹8L→₹10L' : '$65K→$75K'})` : '';

  const summary = `Treating this as a job offer${defaultNote}: +${formatCurrency(netGain)}/month net after taxes. ${REFINEMENT_PROMPT} — or tell me if this is a loan, credit card, or mortgage offer.`;

  const recommendation = netGain > 0
    ? `Take it. A +${formatCurrency(netGain)}/month net gain (+${formatCurrency(netGain * 12)}/year) is meaningful. Confirm the full benefits package (health, 401k match, PTO) adds at least $8,000–$15,000/year in value on top. If this is a loan or credit card offer instead, the evaluation framework is completely different — let me know.`
    : `The offers appear roughly equivalent after taxes${defaultNote}. Look beyond base salary: benefits, equity, flexibility, and growth potential often tip the balance. If this is a loan or mortgage offer, share the APR and terms for a full analysis.`;

  const keyMetrics = [
    { label: 'Assumed offer type', value: 'Job offer (most common)', note: 'Tell me if this is a loan, credit card, or mortgage offer' },
    { label: 'Current take-home (est.)', value: formatCurrency(monthlyNet) },
    { label: 'New take-home (est.)', value: formatCurrency(newMonthlyNet) },
    { label: 'Monthly net gain', value: `${netGain >= 0 ? '+' : ''}${formatCurrency(netGain)}` },
  ];

  const sensitivities = [
    'For a job offer: benefits value ($8K–$20K/year) often matters more than base salary difference.',
    'For a loan offer: APR and term length determine total cost — share those for an exact analysis.',
    'For a credit card offer: balance transfer fee vs. interest savings is the key calculation.',
    'For a mortgage/refinance offer: closing costs vs. monthly savings determines break-even timeline.',
  ];

  const risks = [
    'Treating this as the wrong offer type may lead to an incorrect framework — confirm the offer type.',
    'Different offer types require completely different evaluation criteria.',
    'Benefits, equity, and non-cash compensation are easy to overlook in any offer comparison.',
  ];

  const nextSteps = [
    `Tell me the offer type (job, loan, credit card, or mortgage) and share the key terms for a full analysis.`,
    'For any offer: get everything in writing before accepting.',
    'Compare the full economic value over 3 years, not just the first-year numbers.',
  ];

  return { summary, recommendation, keyMetrics, sensitivities, risks, nextSteps };
}

const MODE_HANDLERS: Record<DecisionMode, (req: CopilotRequest, scenarios: Scenario[]) => Partial<CopilotResponse>> = {
  'job-offer': jobOfferResponse,
  'relocation': relocationResponse,
  'debt-payoff': debtPayoffResponse,
  'roth-vs-traditional': rothVsTraditionalResponse,
  'emergency-fund': emergencyFundResponse,
  'home-affordability': homeAffordabilityResponse,
  'budget-stress-test': budgetStressTestResponse,
  'ambiguous-offer': ambiguousOfferResponse,
  'custom': customResponse
};

export function buildCopilotResponse(request: CopilotRequest): CopilotResponse {
  const mode = request.mode !== 'custom' ? request.mode : getModeFromQuestion(request.question);
  const effectiveMode: DecisionMode = mode;

  // ─── NLP fallback: extract salary / offer data from natural language ──────
  // Only run the parser when structured inputs are missing to avoid overwriting
  // explicit user-entered values with approximate NLP extractions.
  const hasStructuredIncome = !!(request.inputs.annualSalary || request.inputs.hourlyRate);
  const enrichedInputs: FinancialInputs = hasStructuredIncome
    ? request.inputs
    : (() => {
        const region = request.region ?? 'US';
        const parsed = parseFinancialDataFromText(request.question, request.context, region);
        return mergeNlpIntoInputs(request.inputs, parsed);
      })();

  // Use the potentially-enriched inputs for the remainder of the function
  const enrichedRequest: CopilotRequest = hasStructuredIncome
    ? request
    : { ...request, inputs: enrichedInputs };

  const computedScenarios = enrichedRequest.scenarios.length > 0
    ? compareScenarios(enrichedRequest.scenarios)
    : [];

  // Always create a default scenario using income defaults when none are provided
  if (computedScenarios.length === 0) {
    const d = (request.region ?? 'US') === 'India' ? INDIA_DEFAULTS : US_DEFAULTS;
    const scenarioInputs = enrichedRequest.inputs.annualSalary || enrichedRequest.inputs.hourlyRate
      ? enrichedRequest.inputs
      : { ...enrichedRequest.inputs, annualSalary: d.annualSalary };
    computedScenarios.push({
      id: 'default',
      name: 'Current situation',
      inputs: scenarioInputs,
      results: computeScenarioResults(scenarioInputs)
    });
  }

  const missingData = extractMissingData(enrichedRequest.inputs, effectiveMode);
  const confidenceLevel = assessConfidence(enrichedRequest.inputs, effectiveMode);
  const assumptions = buildAssumptions(enrichedRequest.inputs, effectiveMode);

  const VALID_MODES = new Set<DecisionMode>([
    'job-offer', 'relocation', 'debt-payoff', 'roth-vs-traditional',
    'emergency-fund', 'home-affordability', 'budget-stress-test', 'ambiguous-offer', 'custom'
  ]);
  const safeMode: DecisionMode = VALID_MODES.has(effectiveMode) ? effectiveMode : 'custom';
  const handler = MODE_HANDLERS[safeMode];
  const modeResponse = handler(enrichedRequest, computedScenarios);

  // ─── Scenario comparison (when user provides two explicit scenarios) ───────
  const hasBaselineIncome = !!(enrichedRequest.inputs.annualSalary || enrichedRequest.inputs.hourlyRate);
  if (computedScenarios.length === 2) {
    const s0 = computedScenarios[0].results;
    const s1 = computedScenarios[1].results;
    if (s0 && s1) {
      const score0 = scoreScenario(s0);
      const score1 = scoreScenario(s1);
      const winner = score0 >= score1 ? computedScenarios[0].name : computedScenarios[1].name;
      if (modeResponse.recommendation && hasBaselineIncome) {
        modeResponse.recommendation = `Scenario comparison: "${winner}" scores higher on overall financial health. ` + modeResponse.recommendation;
      }
    }
  }

  // ─── Decision engine structured fields ───────────────────────────────────
  const { inputs } = enrichedRequest;

  // Normalise income to annual, respecting incomePeriod field
  const periodMultiplier = inputs.incomePeriod === 'monthly' ? 12 : 1;
  const baseAnnual = inputs.annualSalary
    ? inputs.annualSalary * periodMultiplier
    : (inputs.hourlyRate ? inputs.hourlyRate * ANNUAL_WORK_HOURS : undefined);
  const newAnnual = inputs.newAnnualSalary
    ? inputs.newAnnualSalary * periodMultiplier
    : (inputs.newHourlyRate ? inputs.newHourlyRate * ANNUAL_WORK_HOURS : undefined);

  const { monthlyNet: baseMonthlyNet } = baseAnnual
    ? estimateMonthlyNetIncome(baseAnnual, inputs.state, inputs.employmentType)
    : { monthlyNet: 0 };
  const { monthlyNet: newMonthlyNet } = newAnnual
    ? estimateMonthlyNetIncome(newAnnual, inputs.state, inputs.employmentType)
    : { monthlyNet: 0 };

  const netChangeMonthly = baseAnnual && newAnnual ? newMonthlyNet - baseMonthlyNet : undefined;

  // Benefits impact: use provided value or flag as unknown
  const benefitsAnnual = inputs.benefitsValueAnnual;
  const benefitsImpact = benefitsAnnual !== undefined
    ? `${formatCurrency(benefitsAnnual / 12)}/mo (${formatCurrency(benefitsAnnual)}/yr estimated)`
    : 'unknown';
  const benefitsUnknownAndMaterial =
    benefitsAnnual === undefined &&
    (effectiveMode === 'job-offer' || effectiveMode === 'relocation');

  // Risk score: 0–100 (higher = riskier).
  // Weights: housing burden ratio (max safe: 0.36) → 30 pts, debt load ratio (max safe: 0.20) → 30 pts,
  // emergency runway shortfall vs 6-month target → 40 pts.
  const HOUSING_BURDEN_MAX = 0.36;
  const DEBT_LOAD_MAX = 0.2;
  const EMERGENCY_TARGET_MONTHS = 6;
  const HOUSING_WEIGHT = 30;
  const DEBT_WEIGHT = 30;
  const EMERGENCY_WEIGHT = 40;

  const defaultResults = computedScenarios[0]?.results;
  let riskScore = 50;
  if (defaultResults) {
    const { housingBurdenRatio, debtLoadRatio, emergencyRunwayMonths } = defaultResults;
    riskScore = Math.min(
      100,
      Math.round(
        (housingBurdenRatio / HOUSING_BURDEN_MAX) * HOUSING_WEIGHT +
        (debtLoadRatio / DEBT_LOAD_MAX) * DEBT_WEIGHT +
        Math.max(0, (EMERGENCY_TARGET_MONTHS - emergencyRunwayMonths) / EMERGENCY_TARGET_MONTHS) * EMERGENCY_WEIGHT
      )
    );
  }

  // Confidence score: 0–100 (higher = more confident)
  const confidenceScore =
    confidenceLevel === 'high' ? 85 : confidenceLevel === 'medium' ? 55 : 25;

  // If benefits unknown and material, make recommendation conditional
  if (benefitsUnknownAndMaterial && hasBaselineIncome) {
    if (modeResponse.recommendation && !modeResponse.recommendation.includes('insufficient data')) {
      modeResponse.recommendation +=
        ' Note: benefits value is unknown — the final recommendation may change once benefits (health, dental, 401k match) are factored in.';
    }
  }

  const riskLevelLabel: 'Low' | 'Medium' | 'High' =
    riskScore < 34 ? 'Low' : riskScore < 67 ? 'Medium' : 'High';
  const confidenceLevelLabel: 'High' | 'Medium' | 'Low' =
    confidenceLevel === 'high' ? 'High' : confidenceLevel === 'medium' ? 'Medium' : 'Low';

  const decisionEngine = {
    currentIncome: baseAnnual ? formatCurrency(baseMonthlyNet) + '/mo' : 'unknown',
    newIncome: newAnnual ? formatCurrency(newMonthlyNet) + '/mo' : 'unknown',
    netChange: netChangeMonthly !== undefined ? formatCurrency(netChangeMonthly) + '/mo' : 'N/A',
    benefitsImpact,
    riskScore,
    confidenceScore
  };

  const decisionSummary = {
    confidenceLevel: confidenceLevelLabel,
    monthlyTakeHome: hasBaselineIncome ? formatCurrency(baseMonthlyNet) : 'insufficient data',
    riskLevel: riskLevelLabel
  };

  // Insight: build a focused 1–2 sentence tradeoff summary from available data.
  // Prefer the first sensitivity item (most likely to contain a magnitude), then risks,
  // then a fallback built from the decision engine metrics.
  let insight = modeResponse.sensitivities?.[0] ?? modeResponse.risks?.[0] ?? '';
  if (!insight && hasBaselineIncome) {
    insight = netChangeMonthly !== undefined
      ? `Switching from ${decisionEngine.currentIncome} to ${decisionEngine.newIncome} results in a net change of ${decisionEngine.netChange} in monthly take-home pay.`
      : `Estimated monthly take-home is ${decisionEngine.currentIncome} with a ${riskLevelLabel.toLowerCase()} risk profile (risk score ${riskScore}/100).`;
  }

  return {
    summary: modeResponse.summary ?? 'Enter your financial information to receive a personalized analysis.',
    recommendation: modeResponse.recommendation ?? 'Complete the form with your income and expense details to get a recommendation.',
    assumptions,
    keyMetrics: modeResponse.keyMetrics ?? [],
    scenarios: computedScenarios,
    sensitivities: modeResponse.sensitivities ?? [],
    risks: modeResponse.risks ?? [],
    nextSteps: modeResponse.nextSteps ?? [],
    disclaimer: DISCLAIMER,
    confidenceLevel,
    missingData,
    decisionEngine,
    decisionSummary,
    insight
  };
}
