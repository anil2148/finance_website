/**
 * Per-calculator insight layer.
 *
 * Each entry provides:
 * - whatItMeans: plain-language explanation of the primary metric
 * - realWorldImpact: illustrative dollar/time examples derived from the inputs
 * - recommendations: actionable guidance based on the result
 * - topRisks: common mistakes or failure points specific to this calculator
 * - nextSteps: 3–4 concrete actions the reader should take after running the calculation
 */

import { BaseCalculatorInputs } from '@/lib/calculators/types';
import { buildAmortizationProjection, paymentFromPrincipal } from '@/lib/calculators/engine';

export type CalculatorInsight = {
  whatItMeans: string;
  realWorldImpact: string[];
  recommendations: string[];
  topRisks: string[];
  nextSteps: string[];
};

function fmt(value: number, currency = true): string {
  if (currency) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }
  return value.toLocaleString('en-US', { maximumFractionDigits: 1 });
}

/** Monthly P&I for a fixed-rate mortgage: P*r*(1+r)^n / ((1+r)^n - 1) */
function mortgagePayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function getMortgageInsight(inputs: BaseCalculatorInputs): CalculatorInsight {
  const principal = Math.max(0, (inputs.homePrice ?? 0) - (inputs.downPayment ?? 0));
  const { interestRate, years } = inputs;
  const hasValidInputs = principal > 0 && interestRate >= 0 && years > 0;

  if (!hasValidInputs) {
    return {
      whatItMeans:
        'Enter home price, down payment, APR, and term to generate a complete mortgage interpretation. Narrative guidance appears only after all required values are valid.',
      realWorldImpact: [
        'Add your baseline numbers first, then review payment, total interest, and payoff path together.',
        'Use the same scenario for both summary cards and narrative interpretation to avoid contradictory planning.'
      ],
      recommendations: [
        'Set realistic property tax, insurance, and PMI assumptions before evaluating affordability.',
        'Run one baseline and one stress-test scenario (+1% APR) before comparing lenders.'
      ],
      topRisks: [
        'Making affordability decisions from incomplete inputs.',
        'Comparing lender offers before validating total monthly housing cost.'
      ],
      nextSteps: [
        'Fill all mortgage inputs.',
        'Review the updated summary cards.',
        'Then ask AI to explain the result with your current numbers.'
      ]
    };
  }

  const basePayment = paymentFromPrincipal(principal, interestRate, years);
  const extraPrincipal = Math.max(0, inputs.monthlyContribution ?? 0);
  const payment = basePayment + extraPrincipal;
  const projection = buildAmortizationProjection({ ...inputs, loanAmount: principal }, payment);
  const payoffMonths = projection.find((point) => point.balance <= 0)?.month ?? years * 12;
  const totalInterest = Math.abs(projection.at(-1)?.interestEarned ?? 0);
  const totalPaid = payment * payoffMonths;
  const interestPct = principal > 0 ? Math.round((totalInterest / principal) * 100) : 0;
  const escrowMonthly = (inputs.propertyTax ?? 0) / 12 + (inputs.insurance ?? 0) / 12 + (inputs.pmi ?? 0);
  const totalHousing = payment + escrowMonthly;

  // Extra $200/month impact
  const extraPayment = 200;
  const extraMonthly = basePayment + extraPayment;
  // Approximate months to payoff with extra payment
  const r = interestRate / 100 / 12;
  const extraPayoffMonths =
    r > 0 ? Math.ceil(-Math.log(1 - (principal * r) / extraMonthly) / Math.log(1 + r)) : years * 12;
  const normalMonths = years * 12;
  const monthsSaved = Math.max(0, normalMonths - extraPayoffMonths);
  const yearsSaved = Math.floor(monthsSaved / 12);
  const interestSaved = Math.max(0, totalInterest - (extraMonthly * extraPayoffMonths - principal));

  // Stress test: rate +1%
  const stressMonthly = paymentFromPrincipal(principal, interestRate + 1, years);
  const stressIncrease = stressMonthly - basePayment;

  return {
    whatItMeans: `Monthly P&I (principal + interest only) is ${fmt(basePayment)}. Estimated Total Monthly Cost is ${fmt(totalHousing)}, which adds property tax, insurance, PMI, and any extra principal input. Over approximately ${(payoffMonths / 12).toFixed(1)} years, this scenario produces about ${fmt(totalInterest)} in interest (${interestPct}% of the ${fmt(principal)} mortgage principal).`,
    realWorldImpact: [
      `Projected principal-and-interest paid across the modeled payoff timeline: ${fmt(totalPaid)}.`,
      `If you add ${fmt(extraPayment, false)}/month in extra principal, you could save roughly ${fmt(interestSaved)} in interest and pay off the mortgage ${yearsSaved > 0 ? `about ${yearsSaved} year${yearsSaved > 1 ? 's' : ''}` : 'several months'} earlier.`,
      `A 1-point rate increase (to ${fmt(interestRate + 1, false)}%) raises your monthly payment by ${fmt(stressIncrease)} — that is an extra ${fmt(stressIncrease * 12)} per year you need to budget for.`
    ],
    recommendations: [
      'Run the stress test at your rate plus 1% before applying. If that payment feels tight, the loan amount is likely too high for your real cash flow.',
      'Add property tax, insurance, and HOA to your monthly estimate to get a true affordability picture. For a $400,000 home, these often add $600–$1,000/month.',
      'Compare a 15-year vs 30-year scenario side by side. A shorter term almost always pays less total interest despite higher monthly payments.',
      'If you plan to sell in under 10 years, total interest paid is more important than monthly savings — a lower-rate loan with higher upfront fees can cost more in practice.'
    ],
    topRisks: [
      'Qualifying for a payment is not the same as affording it. Lenders approve based on gross income; your budget is net income minus all expenses.',
      'Forgetting to budget for maintenance (1–2% of home value per year) and insurance increases can turn a comfortable payment into a stressful one.',
      'ARM rates can reset significantly after the introductory period — always model the worst-case reset rate, not just the teaser.',
      'Rate-lock windows are finite. If closing is delayed, re-locking at a higher rate can cost thousands.'
    ],
    nextSteps: [
      'Test your payment at your rate plus 0.75% to stress-test against an unexpected rate environment.',
      'Add estimated taxes and insurance to see your true PITI (principal, interest, taxes, insurance) payment.',
      'Use the debt-payoff calculator to see how extra principal payments shorten your timeline.',
      'Read the mortgage preapproval checklist before meeting with lenders.'
    ]
  };
}

export function getDebtPayoffInsight(inputs: BaseCalculatorInputs): CalculatorInsight {
  const { loanAmount, interestRate, monthlyContribution, years } = inputs;
  const monthlyInterestCost = (loanAmount * (interestRate / 100)) / 12;
  const basePayment = mortgagePayment(loanAmount, interestRate, years);
  const totalWithExtra = basePayment + monthlyContribution;

  const r = interestRate / 100 / 12;
  const payoffMonthsWithExtra =
    r > 0 && totalWithExtra > monthlyInterestCost
      ? Math.ceil(-Math.log(1 - (loanAmount * r) / totalWithExtra) / Math.log(1 + r))
      : years * 12;
  const baseMonths = years * 12;
  const monthsSaved = Math.max(0, baseMonths - payoffMonthsWithExtra);
  const yearsSaved = Math.floor(monthsSaved / 12);

  const totalInterestBase = basePayment * baseMonths - loanAmount;
  const totalInterestWithExtra = Math.max(0, totalWithExtra * payoffMonthsWithExtra - loanAmount);
  const interestSaved = Math.max(0, totalInterestBase - totalInterestWithExtra);

  // Daily interest cost
  const dailyInterest = (loanAmount * (interestRate / 100)) / 365;

  return {
    whatItMeans: `At ${interestRate}% APR, this ${fmt(loanAmount)} balance costs you approximately ${fmt(monthlyInterestCost)} in interest every month — or ${fmt(dailyInterest)} per day — just to hold it. Every extra dollar you pay toward principal reduces that daily interest cost permanently. The fastest way to reduce this balance is to eliminate new spending on the same account while you pay it down.`,
    realWorldImpact: [
      `Monthly interest charge on the current balance: ${fmt(monthlyInterestCost)} (this is money that builds no equity and returns nothing).`,
      monthlyContribution > 0
        ? `With your extra ${fmt(monthlyContribution)} monthly payment, you could save roughly ${fmt(interestSaved)} in total interest${yearsSaved > 0 ? ` and finish ${yearsSaved} year${yearsSaved > 1 ? 's' : ''} earlier` : ''}.`
        : 'Add even a small extra monthly payment to see how dramatically it can shorten your payoff timeline.',
      `For every $100/month you add above the minimum, you reduce total interest paid and compress the payoff date. Run the slider up by $100 to see the impact in real time.`
    ],
    recommendations: [
      'Prioritize paying off any balance above 18% APR before building taxable investments — no investment strategy reliably beats a guaranteed 20%+ return from eliminating high-APR debt.',
      'If you have multiple debts, compare the avalanche method (highest APR first) versus snowball (lowest balance first). Avalanche saves the most money; snowball often builds more behavioral momentum.',
      'Once you pay off this debt, redirect the payment to savings or investing automatically — do not allow lifestyle inflation to absorb the freed cash flow.',
      'If the monthly payment feels unsustainable, explore balance-transfer options to lower your APR window, but only with a strict payoff plan before the intro period ends.'
    ],
    topRisks: [
      'Continuing to charge to a card while paying it down is the most common reason payoff plans fail. A balance-transfer approach only works with a no-new-spend rule.',
      'Paying only minimums on high-APR debt creates a compounding trap — a $5,000 balance at 24% APR can take 15+ years to pay off on minimums alone.',
      'Underestimating how long payoff takes leads to discouragement and abandonment. Set monthly milestones instead of focusing only on the final date.',
      'Overlooking origination and balance-transfer fees when comparing refinance options — a 3% fee on $10,000 is $300 you need to break even on before saving anything.'
    ],
    nextSteps: [
      'Set a specific extra payment amount you can sustain even in a below-average income month — consistency beats aggressive short-term goals.',
      'List all debts with APR and balance, then order by payoff priority using the avalanche method.',
      'Set up automatic extra payments through your lender to remove the decision every month.',
      'Check whether a balance-transfer card or personal loan consolidation lowers your effective APR.'
    ]
  };
}

export function getCompoundInterestInsight(inputs: BaseCalculatorInputs): CalculatorInsight {
  const { loanAmount, monthlyContribution, years, expectedReturn, inflationRate } = inputs;
  const totalContributions = loanAmount + monthlyContribution * years * 12;

  // Future value calculation
  const r = expectedReturn / 100 / 12;
  const n = years * 12;
  const fvLump = loanAmount * Math.pow(1 + r, n);
  const fvContribs = r > 0 ? monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) : monthlyContribution * n;
  const endingBalance = fvLump + fvContribs;
  const growthAmount = Math.max(0, endingBalance - totalContributions);

  // Real return (inflation-adjusted)
  const realReturn = Math.max(0, expectedReturn - inflationRate);
  const realR = realReturn / 100 / 12;
  const realFvLump = loanAmount * Math.pow(1 + realR, n);
  const realFvContribs = realR > 0 ? monthlyContribution * ((Math.pow(1 + realR, n) - 1) / realR) : monthlyContribution * n;
  const realBalance = realFvLump + realFvContribs;

  // Rule of 72
  const doublingYears = expectedReturn > 0 ? Math.round(72 / expectedReturn) : 0;

  // Extra $100/month impact
  const extraR = r;
  const extraContribFv = extraR > 0 ? 100 * ((Math.pow(1 + extraR, n) - 1) / extraR) : 100 * n;

  return {
    whatItMeans: `Your ${fmt(loanAmount)} starting balance and ${fmt(monthlyContribution)}/month contributions grow to an estimated ${fmt(endingBalance)} over ${years} years at ${expectedReturn}% annual return. Of that, ${fmt(totalContributions)} is money you actually put in — and ${fmt(growthAmount)} is investment growth from compounding. Adjusted for ${inflationRate}% inflation, the real purchasing power of your ending balance is approximately ${fmt(realBalance)}.`,
    realWorldImpact: [
      `The Rule of 72: at ${expectedReturn}% return, money roughly doubles every ${doublingYears} years. Starting earlier matters more than starting with more.`,
      `Every extra $100/month added to your contributions today could grow to approximately ${fmt(extraContribFv)} more over ${years} years — compounding turns small recurring amounts into significant sums over time.`,
      `If your return drops 1% (to ${expectedReturn - 1}%), your ending balance decreases. If you stop contributing for 12 months, you lose not just those contributions but all future growth on them.`
    ],
    recommendations: [
      'Automate contributions so they happen before you have a chance to spend the money. Contribution consistency beats contribution size — especially early in the accumulation phase.',
      'Use tax-advantaged accounts (401(k), IRA, Roth IRA) before taxable accounts to keep more of your growth. The compounding impact of tax deferral is often larger than the difference between investment choices.',
      'Do not attempt to time the market. Missing the 10 best days in a 20-year period can cut your return in half. Staying invested through downturns is more valuable than any short-term tactical adjustment.',
      'Review your expected return assumption conservatively. Historical US stock market returns average roughly 7–8% after inflation over long periods. Using 10%+ assumptions can produce dangerously optimistic projections.'
    ],
    topRisks: [
      'Pausing contributions during market downturns is the most expensive mistake in long-run investing — you buy fewer shares when prices are high, then stop buying when prices fall.',
      'Overestimating return assumptions leads to under-saving. A 2% difference in annual return over 30 years can mean hundreds of thousands of dollars in final portfolio value.',
      'Ignoring investment fees: a 1% annual advisory fee on a $500,000 portfolio costs $5,000 per year — and more in compounded growth lost over time.',
      'Treating this projection as a guarantee. Market returns vary by decade and sequence-of-returns risk matters especially in the years just before retirement.'
    ],
    nextSteps: [
      'Set up automatic monthly contributions in a tax-advantaged account before modeling in a taxable account.',
      'Check your current employer 401(k) match — unclaimed employer match is the highest guaranteed return available to most workers.',
      'Run the scenario at 5%, 7%, and 9% return to understand the range of outcomes before relying on one projection.',
      'Compare this projection to your retirement target to check whether your current pace is on track.'
    ]
  };
}

export function getInvestmentGrowthInsight(inputs: BaseCalculatorInputs): CalculatorInsight {
  // Reuses compound interest logic since it is the same math
  return getCompoundInterestInsight(inputs);
}

export function getRetirementInsight(inputs: BaseCalculatorInputs): CalculatorInsight {
  const { loanAmount, monthlyContribution, years, expectedReturn, inflationRate } = inputs;

  // Simple future value for retirement context
  const r = expectedReturn / 100 / 12;
  const n = years * 12;
  const fvLump = loanAmount * Math.pow(1 + r, n);
  const fvContribs = r > 0 ? monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) : monthlyContribution * n;
  const projectedBalance = fvLump + fvContribs;

  // 4% safe withdrawal rate
  const annualWithdrawal = projectedBalance * 0.04;
  const monthlyWithdrawal = annualWithdrawal / 12;

  // 25x rule (inverse of 4% rule)
  const targetByExpenses = monthlyContribution * 12 * 25;

  // Inflation impact on monthly withdrawal over 20 years
  const realWithdrawal = monthlyWithdrawal / Math.pow(1 + inflationRate / 100, 20);

  return {
    whatItMeans: `Based on your current savings pace, you may accumulate approximately ${fmt(projectedBalance)} by retirement. Using the 4% safe withdrawal rule, this could support roughly ${fmt(monthlyWithdrawal)}/month in retirement income (${fmt(annualWithdrawal)}/year). After 20 years of ${inflationRate}% inflation, the purchasing power of that withdrawal falls to approximately ${fmt(realWithdrawal)}/month in today's dollars — plan for this reduction.`,
    realWorldImpact: [
      `The 25× rule: to support your current lifestyle in retirement, aim for a portfolio 25 times your expected annual expenses. If you need $60,000/year, your target is ${fmt(1500000)}.`,
      `A 1% increase in annual contribution now can meaningfully change your ending balance — compounding amplifies contribution increases made early in the accumulation phase.`,
      `Missing 3 years of contributions in your 30s has more impact on your retirement balance than missing 5 years in your 50s, because early contributions compound for longer.`
    ],
    recommendations: [
      'Front-load retirement savings early in your career. A dollar contributed at 30 typically grows to more than 4× what a dollar contributed at 45 can, assuming similar returns.',
      'Prioritize tax-advantaged accounts: 401(k) up to employer match first, then Roth IRA up to the limit ($7,000 in 2026 for under 50), then back to 401(k) if contribution room remains.',
      'Plan for healthcare costs in retirement — these often run $500–$1,500/month pre-Medicare and are not covered by Social Security.',
      'Revisit your target every 5 years as your expenses, family situation, and expected retirement age change.'
    ],
    topRisks: [
      'Sequence-of-returns risk: a major market downturn in the first 5 years of retirement can permanently impair a portfolio even if long-run returns recover.',
      'Underestimating longevity: if you retire at 65 and live to 92, you need 27 years of income — many retirement models underplan for this.',
      'Social Security adjustments and tax law changes can affect your effective retirement income — do not plan as if these are fixed.',
      'Withdrawing from tax-deferred accounts in retirement is taxable income. Large Required Minimum Distributions can push you into higher tax brackets.'
    ],
    nextSteps: [
      'Calculate your personal retirement number: annual spending target × 25.',
      'Check your Social Security earnings estimate at ssa.gov to include it in your total retirement income picture.',
      'If you are within 10 years of retirement, model your sequence-of-returns risk by simulating a 30% market drop in year 1 of retirement.',
      'Work with a fee-only financial planner for a full retirement income plan if your retirement is within 15 years.'
    ]
  };
}

export function getSavingsGoalInsight(inputs: BaseCalculatorInputs): CalculatorInsight {
  const { loanAmount, monthlyContribution, years, expectedReturn } = inputs;
  const targetAmount = loanAmount;
  const totalContributions = monthlyContribution * years * 12;

  const r = expectedReturn / 100 / 12;
  const n = years * 12;
  const projectedBalance = r > 0 ? monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) : monthlyContribution * n;
  const shortfall = Math.max(0, targetAmount - projectedBalance);
  const surplus = Math.max(0, projectedBalance - targetAmount);

  // Months to reach target with interest
  let monthsToTarget = n;
  if (r > 0 && monthlyContribution > 0) {
    monthsToTarget = Math.ceil(Math.log(1 + (targetAmount * r) / monthlyContribution) / Math.log(1 + r));
  } else if (monthlyContribution > 0) {
    monthsToTarget = Math.ceil(targetAmount / monthlyContribution);
  }
  const yearsToTarget = Math.min(monthsToTarget / 12, years);

  return {
    whatItMeans: `At ${fmt(monthlyContribution)}/month over ${years} years at ${expectedReturn}% return, you may accumulate approximately ${fmt(projectedBalance)}. ${shortfall > 0 ? `That leaves a shortfall of ${fmt(shortfall)} from your ${fmt(targetAmount)} goal — you need to increase monthly contributions, extend the timeline, or reduce the target.` : `That projects to ${fmt(surplus)} above your ${fmt(targetAmount)} goal — you are on track, or you could reach your target in about ${Math.round(yearsToTarget * 10) / 10} years.`}`,
    realWorldImpact: [
      `Your ${fmt(monthlyContribution)}/month contribution becomes ${fmt(totalContributions)} in raw contributions plus interest growth over ${years} years.`,
      shortfall > 0
        ? `To close the ${fmt(shortfall)} gap, you would need to increase your monthly contribution by approximately ${fmt(Math.ceil(shortfall / n))}/month, or extend your timeline.`
        : `You could achieve your goal in roughly ${Math.round(yearsToTarget * 10) / 10} years at your current pace — ${years - Math.round(yearsToTarget * 10) / 10 > 0 ? `about ${Math.round((years - yearsToTarget) * 10) / 10} years ahead of schedule` : 'right on track'}.`,
      `Even a $50 reduction in monthly contributions to ${fmt(monthlyContribution - 50)} adds up to ${fmt(50 * years * 12)} less in contributions alone over ${years} years, plus compounded growth lost on that amount.`
    ],
    recommendations: [
      'Separate savings goals by timeline: keep under-2-year goals in high-yield savings (liquid, FDIC-insured), 2–5-year goals in CDs or short-duration bonds, and 5+ year goals in diversified investments.',
      'Automate every saving goal with a dedicated account and automatic transfer on payday. Decision fatigue and temptation are the primary reasons savings plans fail, not the math.',
      'Build a $1,500–$2,000 emergency buffer before aggressively funding other goals — an unexpected expense without a buffer drains savings and derails timelines.',
      'Prioritize goals that have a hard deadline (house down payment in 3 years) over open-ended goals (vacation fund) when cash flow is limited.'
    ],
    topRisks: [
      'Withdrawing from the savings goal account for non-emergency expenses is the most common reason goals are missed.',
      'Not accounting for inflation: a $30,000 down payment target set today will require more than $30,000 if home prices or closing costs rise over your savings horizon.',
      'Over-investing short-horizon goals (under 3 years) in volatile assets risks a market decline depleting the fund just when you need it.',
      'Forgetting to adjust the monthly contribution after a raise or expense change — most people set contributions once and never revisit them.'
    ],
    nextSteps: [
      'Open a dedicated savings account specifically for this goal — separating it from general checking reduces the temptation to spend it.',
      'Set up an automatic transfer for your monthly contribution the day after payday.',
      'Add an annual "savings raise" of $25–$50/month whenever your income increases.',
      'Review your goal amount and timeline annually to adjust for cost changes and income shifts.'
    ]
  };
}

export function getGenericInsight(inputs: BaseCalculatorInputs, primaryMetricLabel: string): CalculatorInsight {
  const { loanAmount, interestRate, monthlyContribution, years } = inputs;
  return {
    whatItMeans: `Your inputs reflect a ${fmt(loanAmount)} starting balance at ${interestRate}% and a ${years}-year horizon. The top metric shown above is the most decision-relevant output from those assumptions. Use the breakdown table to understand how each component contributes to the final result.`,
    realWorldImpact: [
      `A ${fmt(monthlyContribution)}/month contribution over ${years} years totals ${fmt(monthlyContribution * years * 12)} in raw contributions — compounding builds on top of that.`,
      `A 1-point change in your interest rate or return assumption can materially shift the outcome over long horizons.`,
      `The projected ${primaryMetricLabel} is a scenario estimate — validate final numbers with your provider or advisor before committing.`
    ],
    recommendations: [
      'Run the calculation at your baseline, an optimistic scenario (+1%), and a conservative scenario (−1%) to understand the realistic range of outcomes.',
      'Do not rely on a single projection — use this as a decision support tool, then verify current terms and rates with providers before taking action.',
      'Choose the path that remains manageable if income drops or expenses rise temporarily.',
      'Read the related guide linked below to understand the qualitative decision factors that the calculator does not capture.'
    ],
    topRisks: [
      'Overconfidence in a single projection: real outcomes depend on rates, behavior, and market conditions that change over time.',
      'Using an aggressive return assumption without stress-testing at a lower rate.',
      'Treating this estimate as a quote or guarantee rather than a planning scenario.',
      'Skipping the "bad month" stress test — if the worst-case scenario is uncomfortable, adjust the plan before committing.'
    ],
    nextSteps: [
      'Run the calculation at your worst-case rate and lowest realistic contribution to stress-test the plan.',
      'Read the matched guide linked below to understand common mistakes for this type of decision.',
      'Compare two scenarios before choosing — the option with the lower payment is not always the lower total cost.',
      'Verify final terms and eligibility directly with providers the same day you are ready to act.'
    ]
  };
}

const insightBuilders: Record<string, (inputs: BaseCalculatorInputs) => CalculatorInsight> = {
  'mortgage-calculator': getMortgageInsight,
  'loan-calculator': getDebtPayoffInsight,
  'debt-payoff-calculator': getDebtPayoffInsight,
  'debt-avalanche-calculator': getDebtPayoffInsight,
  'debt-snowball-calculator': getDebtPayoffInsight,
  'credit-card-payoff-calculator': getDebtPayoffInsight,
  'compound-interest-calculator': getCompoundInterestInsight,
  'investment-growth-calculator': getInvestmentGrowthInsight,
  'retirement-calculator': getRetirementInsight,
  'fire-calculator': getRetirementInsight,
  'savings-goal-calculator': getSavingsGoalInsight
};

export function getCalculatorInsight(slug: string, inputs: BaseCalculatorInputs, primaryMetricLabel = 'result'): CalculatorInsight {
  const builder = insightBuilders[slug];
  if (builder) {
    try {
      return builder(inputs);
    } catch {
      // Fall through to generic
    }
  }
  return getGenericInsight(inputs, primaryMetricLabel);
}
