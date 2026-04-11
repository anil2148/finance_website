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

const DISCLAIMER =
  'This tool provides educational decision-support estimates only. It is not financial, legal, or tax advice. All calculations use approximations and stated assumptions. Consult a qualified financial professional before making major financial decisions.';

function buildAssumptions(inputs: FinancialInputs, mode: DecisionMode): string[] {
  const assumptions: string[] = [];
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * 2080 : 0);

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
  const { inputs } = request;
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * 2080 : 0);
  const { monthlyNet, monthlyGross } = estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType);
  const obligations = calcMonthlyObligations(inputs);
  const leftover = Math.max(0, monthlyNet - obligations);

  const isC2C = inputs.employmentType === 'c2c' || inputs.employmentType === 'contractor';

  const summary = salary
    ? `Based on ${formatCurrency(salary)} annual salary${isC2C ? ' (C2C/contractor)' : ''} in ${inputs.state ?? 'your state'}, estimated monthly take-home is ${formatCurrency(monthlyNet)} with ${formatCurrency(leftover)} left after tracked obligations.`
    : 'Enter your salary or hourly rate to get a full comparison.';

  const recommendation = isC2C
    ? `C2C/contractor roles require 15–20% more gross pay than equivalent W2 to break even after self-employment taxes, benefits costs, and lack of employer match. The ${formatCurrency(salary)} offer needs careful comparison against W2 alternatives.`
    : `With ${formatCurrency(monthlyNet)} monthly take-home and ${formatCurrency(leftover)} surplus, evaluate whether the offer supports your savings goals and covers current obligations.`;

  const keyMetrics = [
    { label: 'Estimated monthly take-home', value: formatCurrency(monthlyNet), note: 'After estimated taxes' },
    { label: 'Monthly gross', value: formatCurrency(monthlyGross) },
    { label: 'Monthly obligations tracked', value: formatCurrency(obligations) },
    { label: 'Monthly surplus', value: formatCurrency(leftover) }
  ];

  if (isC2C) {
    keyMetrics.push({ label: 'Self-employment tax premium', value: '~15.3% of net earnings', note: 'Employer + employee FICA — fully on contractor' });
    keyMetrics.push({ label: 'Benefits value to add back', value: 'Estimate $6,000–$15,000/yr', note: 'Health, dental, vision, paid time off, 401(k) match' });
  }

  const sensitivities = [
    'If the role moves from W2 to C2C, net pay drops by roughly $800–$1,800/month at this income level.',
    'A 10% salary increase would add ~' + formatCurrency(salary * 0.1 / 12 * 0.75) + '/month after taxes.',
    'Moving to a no-income-tax state (TX, FL, NV) would add ~' + formatCurrency(salary * 0.05 / 12) + '/month net.',
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
  const { inputs } = request;
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * 2080 : 0);

  const summary = inputs.state
    ? `Relocation analysis for moving to ${inputs.state}. Key factors: state income tax differential, housing cost changes, and cost-of-living adjustment.`
    : 'Enter the destination state and salary to estimate the relocation financial impact.';

  const stateKey = inputs.state?.toUpperCase().trim();
  const noTaxStates = new Set(['TX', 'FL', 'NV', 'WA', 'SD', 'WY', 'AK', 'TN', 'NH']);
  const isNoTaxState = stateKey ? noTaxStates.has(stateKey) : false;

  const taxSavings = isNoTaxState && salary ? salary * 0.05 : 0;

  const recommendation = isNoTaxState && salary
    ? `Moving to ${inputs.state} (no state income tax) could save ~${formatCurrency(taxSavings)}/year in state taxes on ${formatCurrency(salary)} salary — roughly ${formatCurrency(taxSavings / 12)}/month. However, verify that housing and cost-of-living increases do not offset this gain.`
    : salary
      ? `The net financial benefit of relocation depends heavily on the tax rate differential and housing cost change. Enter both origin and destination scenario details to compare.`
      : 'Enter your salary and destination state to begin the relocation analysis.';

  const keyMetrics = [
    { label: 'Estimated annual state tax savings', value: isNoTaxState ? formatCurrency(taxSavings) : 'Enter both states', note: isNoTaxState ? 'Based on ~5% avg state rate differential' : undefined },
    { label: 'Monthly housing cost', value: inputs.monthlyRent ? formatCurrency(inputs.monthlyRent) : inputs.mortgage ? formatCurrency(inputs.mortgage) : 'Not entered' },
    { label: 'Destination state', value: inputs.state ?? 'Not specified' }
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
  const { inputs } = request;
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * 2080 : 0);
  const downPayment = inputs.cashOnHand ?? 0;
  const monthlyDebt = inputs.debtPayments ?? 0;

  const { maxHomePrice, monthlyPaymentEstimate, note } = salary
    ? calcHomeAffordability(salary, downPayment, monthlyDebt)
    : { maxHomePrice: 0, monthlyPaymentEstimate: 0, note: 'Enter salary to calculate.' };

  const summary = salary
    ? `Based on ${formatCurrency(salary)} annual income, ${formatCurrency(downPayment)} available down payment, and ${formatCurrency(monthlyDebt)}/month existing debt, the 28/36 rule suggests a maximum home price around ${formatCurrency(maxHomePrice)}.`
    : 'Enter your annual salary to calculate home affordability.';

  const recommendation = salary
    ? `Your estimated max monthly housing payment is ${formatCurrency(monthlyPaymentEstimate)}, which with 7% mortgage rate and 30-year term supports a loan of ~${formatCurrency(maxHomePrice - downPayment)}. A ${formatCurrency(maxHomePrice)} home is the upper bound — aim for 80–90% of this to maintain financial cushion.`
    : 'Enter your income and down payment to get a personalized affordability estimate.';

  const keyMetrics = [
    { label: 'Annual salary', value: salary ? formatCurrency(salary) : 'Not entered' },
    { label: 'Available down payment', value: formatCurrency(downPayment) },
    { label: 'Existing monthly debt', value: formatCurrency(monthlyDebt) },
    { label: 'Max monthly housing payment', value: salary ? formatCurrency(monthlyPaymentEstimate) : 'N/A', note: '28% of gross income rule' },
    { label: 'Max home price estimate', value: salary ? formatCurrency(maxHomePrice) : 'N/A', note },
    { label: 'Down payment percentage', value: maxHomePrice > 0 ? formatPercent(downPayment / maxHomePrice) : 'N/A' }
  ];

  const sensitivities = [
    'A 1% increase in mortgage rate reduces your max loan by roughly 10%.',
    'Each $500/month in existing debt reduces your max home price by ~' + formatCurrency(500 / (0.07 / 12) * ((1 - Math.pow(1 + 0.07 / 12, -360)) / 1)) + '.',
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
  const { inputs } = request;
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * 2080 : 0);
  const { monthlyNet, monthlyGross } = salary
    ? estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType)
    : { monthlyNet: 0, monthlyGross: 0 };

  const obligations = calcMonthlyObligations(inputs);
  const leftover = Math.max(0, monthlyNet - obligations);

  const stress10 = Math.max(0, monthlyNet * 0.9 - obligations);
  const stress20 = Math.max(0, monthlyNet * 0.8 - obligations);
  const stress30 = Math.max(0, monthlyNet * 0.7 - obligations);

  const summary = salary
    ? `At ${formatCurrency(monthlyNet)}/month take-home vs. ${formatCurrency(obligations)}/month in obligations, you have a ${formatCurrency(leftover)} buffer. Stress tests show how much buffer remains under income shocks.`
    : 'Enter your salary and monthly expenses to run a budget stress test.';

  const recommendation = leftover > 800
    ? `Your current budget has meaningful cushion. A 10% income reduction leaves ${formatCurrency(stress10)}/month, and a 20% shock leaves ${formatCurrency(stress20)}/month. Your plan holds under moderate stress.`
    : leftover > 0
      ? `Your buffer of ${formatCurrency(leftover)}/month is thin. A 10% income cut would leave only ${formatCurrency(stress10)}/month. Identify at least $300–$500/month in discretionary cuts that could activate quickly if income drops.`
      : `Your current obligations exceed or nearly meet your estimated take-home. This budget is under stress at baseline. Identify non-essential expenses to cut immediately.`;

  const keyMetrics = [
    { label: 'Monthly take-home', value: salary ? formatCurrency(monthlyNet) : 'Not entered' },
    { label: 'Monthly obligations', value: formatCurrency(obligations) },
    { label: 'Current monthly surplus', value: formatCurrency(leftover) },
    { label: 'Surplus at -10% income', value: salary ? formatCurrency(stress10) : 'N/A' },
    { label: 'Surplus at -20% income', value: salary ? formatCurrency(stress20) : 'N/A' },
    { label: 'Surplus at -30% income', value: salary ? formatCurrency(stress30) : 'N/A' },
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
  const { inputs } = request;
  const salary = inputs.annualSalary ?? (inputs.hourlyRate ? inputs.hourlyRate * 2080 : 0);
  const { monthlyNet } = salary
    ? estimateMonthlyNetIncome(salary, inputs.state, inputs.employmentType)
    : { monthlyNet: 0 };
  const obligations = calcMonthlyObligations(inputs);
  const leftover = Math.max(0, monthlyNet - obligations);

  const summary = salary
    ? `Based on ${formatCurrency(salary)} annual income and ${formatCurrency(obligations)}/month in tracked obligations, your estimated monthly surplus is ${formatCurrency(leftover)}.`
    : `Enter your income and expenses to get a personalized financial analysis. The question "${request.question}" can be analyzed with more data.`;

  const recommendation = salary
    ? `With a ${formatCurrency(leftover)}/month surplus, focus on: (1) ensuring emergency fund covers 3–6 months, (2) capturing employer 401(k) match, (3) eliminating high-rate debt. Use the specific decision modes above for more targeted analysis.`
    : 'Provide your income, housing cost, and key expenses to get a full analysis tailored to your question.';

  const keyMetrics = [
    { label: 'Monthly take-home estimate', value: salary ? formatCurrency(monthlyNet) : 'Not entered' },
    { label: 'Monthly obligations tracked', value: formatCurrency(obligations) },
    { label: 'Estimated monthly surplus', value: salary ? formatCurrency(leftover) : 'N/A' }
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

const MODE_HANDLERS: Record<DecisionMode, (req: CopilotRequest, scenarios: Scenario[]) => Partial<CopilotResponse>> = {
  'job-offer': jobOfferResponse,
  'relocation': relocationResponse,
  'debt-payoff': debtPayoffResponse,
  'roth-vs-traditional': rothVsTraditionalResponse,
  'emergency-fund': emergencyFundResponse,
  'home-affordability': homeAffordabilityResponse,
  'budget-stress-test': budgetStressTestResponse,
  'custom': customResponse
};

export function buildCopilotResponse(request: CopilotRequest): CopilotResponse {
  const mode = request.mode !== 'custom' ? request.mode : getModeFromQuestion(request.question);
  const effectiveMode: DecisionMode = mode;

  const computedScenarios = request.scenarios.length > 0
    ? compareScenarios(request.scenarios)
    : [];

  if (computedScenarios.length === 0 && (request.inputs.annualSalary || request.inputs.hourlyRate)) {
    computedScenarios.push({
      id: 'default',
      name: 'Current situation',
      inputs: request.inputs,
      results: computeScenarioResults(request.inputs)
    });
  }

  const missingData = extractMissingData(request.inputs, effectiveMode);
  const confidenceLevel = assessConfidence(request.inputs, effectiveMode);
  const assumptions = buildAssumptions(request.inputs, effectiveMode);

  const VALID_MODES = new Set<DecisionMode>([
    'job-offer', 'relocation', 'debt-payoff', 'roth-vs-traditional',
    'emergency-fund', 'home-affordability', 'budget-stress-test', 'custom'
  ]);
  const safeMode: DecisionMode = VALID_MODES.has(effectiveMode) ? effectiveMode : 'custom';
  const handler = MODE_HANDLERS[safeMode];
  const modeResponse = handler(request, computedScenarios);

  // ─── Baseline income validation (DATA VALIDATION RULE) ───────────────────
  const hasBaselineIncome = !!(request.inputs.annualSalary || request.inputs.hourlyRate);
  if (!hasBaselineIncome) {
    modeResponse.recommendation =
      'insufficient data — baseline income required. Please provide your annual salary or hourly rate to generate a recommendation.';
  }

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
  const { inputs } = request;

  /** Standard work-hours per year: 40h/week × 52 weeks */
  const HOURS_PER_YEAR = 2080;

  // Normalise income to annual, respecting incomePeriod field
  const periodMultiplier = inputs.incomePeriod === 'monthly' ? 12 : 1;
  const baseAnnual = inputs.annualSalary
    ? inputs.annualSalary * periodMultiplier
    : (inputs.hourlyRate ? inputs.hourlyRate * HOURS_PER_YEAR : undefined);
  const newAnnual = inputs.newAnnualSalary
    ? inputs.newAnnualSalary * periodMultiplier
    : (inputs.newHourlyRate ? inputs.newHourlyRate * HOURS_PER_YEAR : undefined);

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
