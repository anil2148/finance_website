import { buildAmortizationProjection, buildInvestmentProjection, currencyBreakdown, paymentFromPrincipal } from '@/lib/calculators/engine';
import { calculateCompoundInterest } from '@/lib/calculators/compoundInterest';
import { calculateLoan } from '@/lib/calculators/loan';
import { calculateMortgage } from '@/lib/calculators/mortgage';
import { calculateRetirement } from '@/lib/calculators/retirement';
import { BaseCalculatorInputs, CalculatorDefinition, CalculatorResult } from '@/lib/calculators/types';

const debtPayoffResult = (title: string, inputs: BaseCalculatorInputs): CalculatorResult => {
  const requiredPayment = inputs.minimumPayment > 0 ? inputs.minimumPayment : paymentFromPrincipal(inputs.loanAmount, inputs.interestRate, inputs.years);
  const payment = requiredPayment + inputs.monthlyContribution;
  const projection = buildAmortizationProjection(inputs, payment);
  const finalMonth = projection.find((point) => point.balance <= 0)?.month ?? projection.length;
  const baselineProjection = buildAmortizationProjection(inputs, requiredPayment);
  const baselineInterest = Math.abs(baselineProjection.at(-1)?.interestEarned ?? 0);
  const acceleratedInterest = Math.abs(projection.at(-1)?.interestEarned ?? 0);

  return {
    title,
    summary: [
      { label: 'Monthly Payment', value: payment, currency: true, helpText: 'Minimum payment plus your extra monthly payment.' },
      { label: 'Payoff Time', value: finalMonth / 12, suffix: ' yrs', helpText: 'Approximate payoff timeline based on current balance, APR, and payment strategy.' },
      { label: 'Interest Saved', value: Math.max(0, baselineInterest - acceleratedInterest), currency: true, helpText: 'Estimated interest avoided versus paying only the minimum amount.' }
    ],
    projection,
    breakdown: [
      currencyBreakdown('Debt Balance', inputs.loanAmount),
      currencyBreakdown('Minimum Payment', requiredPayment),
      currencyBreakdown('Extra Monthly Payment', inputs.monthlyContribution),
      { label: 'Interest Rate', value: `${inputs.interestRate}%` }
    ],
    chartKinds: ['amortization', 'bar', 'pie']
  };
};

const growthResult = (title: string, inputs: BaseCalculatorInputs): CalculatorResult => {
  const projection = buildInvestmentProjection(inputs);
  const endingBalance = projection.at(-1)?.balance ?? 0;

  return {
    title,
    summary: [
      { label: 'Ending Balance', value: endingBalance, currency: true, helpText: 'Projected ending value using your starting amount, contribution rate, and return assumptions.' },
      { label: 'Contributions', value: inputs.loanAmount + inputs.monthlyContribution * inputs.years * 12, currency: true, helpText: 'Total dollars you contributed over the full projection period.' },
      { label: 'Real Return', value: inputs.expectedReturn - inputs.inflationRate, suffix: '%', helpText: 'Estimated return net of inflation to reflect real purchasing-power growth.' }
    ],
    projection,
    breakdown: [
      currencyBreakdown('Current Amount', inputs.loanAmount),
      currencyBreakdown('Monthly Contribution', inputs.monthlyContribution),
      { label: 'Expected Return', value: `${inputs.expectedReturn}%` }
    ],
    chartKinds: ['growth', 'bar', 'pie']
  };
};

const defaultInputs: BaseCalculatorInputs = {
  loanAmount: 250000,
  homePrice: 320000,
  downPayment: 64000,
  interestRate: 6.5,
  minimumPayment: 0,
  monthlyContribution: 500,
  years: 30,
  propertyTax: 3600,
  insurance: 1800,
  pmi: 0,
  inflationRate: 2.5,
  expectedReturn: 7
};

export const calculatorDefinitions: CalculatorDefinition[] = [
  {
    slug: 'mortgage-calculator',
    title: 'Mortgage Calculator',
    description: 'Estimate principal-and-interest payments, total interest cost, and amortization pace before buying or refinancing.',
    seoTitle: 'Mortgage Calculator: Payment & Amortization Schedule',
    seoDescription: 'Model monthly mortgage payments, lifetime interest, and payoff progression with an interactive amortization view.',
    faq: [
      { question: 'How is mortgage payment calculated?', answer: 'We use the fixed-rate amortization formula: payment is based on loan amount, APR, and term with monthly compounding.' },
      { question: 'Does this include taxes and insurance?', answer: 'No. Results focus on principal and interest. Add property tax, homeowners insurance, and HOA separately for full housing cost.' }
    ],
    blogLinks: [
      { title: 'Mortgage Preapproval Checklist', href: '/blog/mortgage-preapproval-checklist-underwriting' },
      { title: 'Save for a Down Payment Faster', href: '/blog/mortgage-preapproval-checklist-underwriting' }
    ],
    defaultInputs,
    compute: calculateMortgage
  },
  {
    slug: 'loan-calculator',
    title: 'Loan Calculator',
    description: 'Estimate monthly installments, total borrowing cost, and payoff date so you can compare loan offers with confidence.',
    seoTitle: 'Loan Calculator: Monthly Payment & Interest Breakdown',
    seoDescription: 'Calculate monthly loan payments with a year-by-year amortization schedule and total interest breakdown.',
    faq: [{ question: 'How can this help me compare two loan offers?', answer: 'Enter each offer separately and compare the monthly installment, total interest, and payoff length to see the real trade-off.' }],
    blogLinks: [{ title: 'How Loan Interest Works', href: '/blog/personal-loan-comparison-for-bad-month-resilience' }],
    defaultInputs: { ...defaultInputs, years: 7 },
    compute: calculateLoan
  },
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    description: 'Project how an initial balance and recurring contributions grow over time so you can set practical long-term savings milestones.',
    seoTitle: 'Compound Interest Calculator: Future Value Projection',
    seoDescription: 'Estimate future portfolio value from a starting balance, recurring contributions, and expected annual return.',
    faq: [{ question: 'Do small monthly contributions really make a difference?', answer: 'Yes. Even modest recurring deposits can materially increase your ending balance when compounding has years to work.' }],
    blogLinks: [{ title: 'Dollar-Cost Averaging Guide', href: '/blog/beginner-investing-roadmap-year-one-milestones' }],
    defaultInputs: { ...defaultInputs, loanAmount: 15000, years: 20 },
    compute: calculateCompoundInterest
  },
  {
    slug: 'retirement-calculator',
    title: 'Retirement Calculator',
    description: 'Check retirement readiness by testing contribution levels, timeline changes, and inflation-aware return assumptions before you retire.',
    seoTitle: 'Retirement Calculator: Inflation-Adjusted Savings Plan',
    seoDescription: 'Project retirement account growth and estimate potential annual withdrawals using common planning rules.',
    faq: [{ question: 'How should I use this for retirement planning?', answer: 'Treat the results as a planning baseline, then test conservative and optimistic scenarios to set a contribution target you can maintain.' }],
    blogLinks: [{ title: 'Retirement Accounts 101', href: '/blog/tax-efficient-investing-account-location-decisions' }],
    defaultInputs,
    compute: calculateRetirement
  },
  {
    slug: 'credit-card-payoff-calculator',
    title: 'Credit Card Payoff Calculator',
    description: 'Plan how fast to clear card balances by comparing minimum payments with larger monthly payoff amounts.',
    seoTitle: 'Credit Card Payoff Calculator: Debt-Free Timeline',
    seoDescription: 'Estimate card payoff month, total interest, and repayment impact when you raise monthly payments.',
    faq: [{ question: 'Does paying more each month help?', answer: 'Yes. Higher monthly payments reduce principal sooner, which lowers interest and shortens payoff time.' }],
    blogLinks: [{ title: 'Avoid Credit Card Interest', href: '/blog/credit-utilization-statement-cycle-playbook' }],
    defaultInputs: { ...defaultInputs, loanAmount: 15000, interestRate: 19.9, years: 5 },
    compute: (inputs) => debtPayoffResult('Credit Card Payoff Plan', inputs)
  },
  {
    slug: 'savings-goal-calculator',
    title: 'Savings Goal Calculator',
    description: 'Estimate how much to save each month for a target amount by a specific deadline, then adjust the timeline if contributions feel unrealistic.',
    seoTitle: 'Savings Goal Calculator: Reach Milestones Faster',
    seoDescription: 'Calculate monthly savings needed for a target date and track projected progress year by year.',
    faq: [{ question: 'Can I include inflation?', answer: 'Yes. Inflation assumptions help you test whether your target still holds purchasing power in future years.' }],
    blogLinks: [{ title: 'Best Savings Goals by Age', href: '/blog/emergency-fund-target-by-recovery-timeline' }],
    defaultInputs: { ...defaultInputs, loanAmount: 10000, years: 10 },
    compute: (inputs) => growthResult('Savings Goal Projection', inputs)
  },
  {
    slug: 'debt-snowball-calculator',
    title: 'Debt Snowball Calculator',
    description: 'For borrowers with multiple balances, simulate the debt snowball sequence to build motivation while staying consistent in difficult months.',
    seoTitle: 'Debt Snowball Calculator (2026): Payoff Order, Timeline, and Interest',
    seoDescription: 'Model debt snowball payoff order, monthly momentum, and total interest so you can choose a realistic debt reduction plan.',
    faq: [{ question: 'What is debt snowball?', answer: 'It pays smallest debt first while making minimum payments on others.' }],
    blogLinks: [{ title: 'Debt-to-Income Ratio Guide', href: '/blog/debt-to-income-ratio-90-day-plan' }],
    defaultInputs: { ...defaultInputs, loanAmount: 40000, years: 8 },
    compute: (inputs) => debtPayoffResult('Debt Snowball Projection', inputs)
  },
  {
    slug: 'debt-avalanche-calculator',
    title: 'Debt Avalanche Calculator',
    description: 'Model an avalanche strategy that targets high-interest balances first to reduce total interest paid.',
    seoTitle: 'Debt Avalanche Calculator: Minimize Interest Paid',
    seoDescription: 'Model debt avalanche payoff and compare savings across repayment plans.',
    faq: [{ question: 'What is debt avalanche?', answer: 'It focuses extra payments on the highest-interest debt first.' }],
    blogLinks: [{ title: 'Personal Loan vs Credit Card', href: '/blog/personal-loan-comparison-for-bad-month-resilience' }],
    defaultInputs: { ...defaultInputs, loanAmount: 40000, years: 8 },
    compute: (inputs) => debtPayoffResult('Debt Avalanche Projection', inputs)
  },
  {
    slug: 'investment-growth-calculator',
    title: 'Investment Growth Calculator',
    description: 'Forecast long-term portfolio value across different contribution levels and return assumptions before committing to an investing plan.',
    seoTitle: 'Investment Growth Calculator: Long-Term Portfolio Forecast',
    seoDescription: 'Forecast investment growth with expected return, inflation, and contribution inputs.',
    faq: [{ question: 'How should I choose an expected return input?', answer: 'Use a conservative range first, then compare against a higher-return case to understand how sensitive long-term outcomes are.' }],
    blogLinks: [{ title: 'Investing for Beginners Roadmap', href: '/blog/beginner-investing-roadmap-year-one-milestones' }],
    defaultInputs,
    compute: (inputs) => growthResult('Investment Growth Projection', inputs)
  },
  {
    slug: 'fire-calculator',
    title: 'FIRE Calculator',
    description: 'Estimate the portfolio and savings pace needed for early retirement, and test whether your plan is sustainable over the long term.',
    seoTitle: 'FIRE Calculator: Financial Independence Timeline',
    seoDescription: 'Estimate your path to financial independence by modeling savings rate, investment return, and target spending.',
    faq: [{ question: 'How does this calculator support FIRE planning?', answer: 'It helps you test how savings rate, expected return, and time horizon interact so you can set a realistic independence target.' }],
    blogLinks: [{ title: 'Long-Term Investing Mindset', href: '/blog/beginner-investing-roadmap-year-one-milestones' }],
    defaultInputs: { ...defaultInputs, loanAmount: 120000, monthlyContribution: 1800, years: 20 },
    compute: (inputs) => growthResult('FIRE Projection', inputs)
  },
  {
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator',
    description: 'Track assets and liabilities in one view, then project how debt payoff and monthly saving decisions can change net worth over time.',
    seoTitle: 'Net Worth Calculator: Track Financial Progress',
    seoDescription: 'Calculate current net worth and project forward based on contribution and growth assumptions.',
    faq: [{ question: 'What should I include in net worth?', answer: 'Include major assets like cash, investments, and home equity, then subtract liabilities such as credit cards, loans, and mortgage balance.' }],
    blogLinks: [{ title: 'How to Build a Cash Buffer', href: '/blog/emergency-fund-target-by-recovery-timeline' }],
    defaultInputs: { ...defaultInputs, loanAmount: 50000, years: 15 },
    compute: (inputs) => growthResult('Net Worth Projection', inputs)
  },
  {
    slug: 'budget-planner',
    title: 'Budget Planner',
    description: 'Model how spending, debt payments, and monthly saving decisions influence your cash flow and future balances.',
    seoTitle: 'Budget Planner: Monthly Spending & Savings Forecast',
    seoDescription: 'Estimate how reallocating monthly cash changes debt payoff speed and savings progress.',
    faq: [{ question: 'Can this replace a detailed budget app?', answer: 'No. It works best as a planning calculator for scenarios, not as a transaction-by-transaction budgeting app.' }],
    blogLinks: [{ title: '50/30/20 Rule for Saving', href: '/blog/budget-rule-based-reset' }],
    defaultInputs: { ...defaultInputs, loanAmount: 12000, years: 5 },
    compute: (inputs) => growthResult('Budget Planning Projection', inputs)
  },
  {
    slug: 'salary-after-tax-calculator',
    title: 'Salary After Tax Calculator',
    description: 'Estimate annual and monthly take-home pay using an effective tax-rate assumption and inflation adjustment.',
    seoTitle: 'Salary After Tax Calculator: Estimate Take-Home Pay',
    seoDescription: 'Estimate net salary after taxes and compare nominal income to inflation-adjusted purchasing power.',
    faq: [{ question: 'Is this exact tax advice?', answer: 'No. This is a planning estimate using simplified assumptions, not tax preparation or personalized tax advice.' }],
    blogLinks: [{ title: 'Tax-Efficient Investing Tips', href: '/blog/tax-efficient-investing-account-location-decisions' }],
    defaultInputs: { ...defaultInputs, loanAmount: 90000, interestRate: 24, years: 1, monthlyContribution: 0, expectedReturn: 0 },
    compute: (inputs) => {
      const afterTax = inputs.loanAmount * (1 - inputs.interestRate / 100);
      const monthly = afterTax / 12;
      const inflationAdjusted = afterTax / (1 + inputs.inflationRate / 100);
      return {
        title: 'Salary After Tax',
        summary: [
          { label: 'After-Tax Salary', value: afterTax, currency: true, helpText: 'Estimated annual net pay after applying the effective tax-rate input.' },
          { label: 'Monthly Take Home', value: monthly, currency: true, helpText: 'Estimated monthly take-home amount based on annual net pay.' },
          { label: 'Inflation Adjusted', value: inflationAdjusted, currency: true, helpText: 'Estimated inflation-adjusted value of your annual net pay.' }
        ],
        projection: [{ month: 12, year: 1, balance: afterTax, contributed: afterTax, interestEarned: 0 }],
        breakdown: [
          currencyBreakdown('Gross Salary', inputs.loanAmount),
          { label: 'Effective Tax Rate', value: `${inputs.interestRate}%` },
          { label: 'Inflation', value: `${inputs.inflationRate}%` }
        ],
        chartKinds: ['bar', 'pie']
      };
    }
  },
  {
    slug: 'auto-loan-calculator',
    title: 'Auto Loan Calculator',
    description: 'Estimate monthly car-loan payments, total financing cost, and affordability before visiting a dealership.',
    seoTitle: 'Auto Loan Calculator: Car Payment and Interest Breakdown',
    seoDescription: 'Model auto-loan payments, cumulative interest, and payoff timing across different terms and APRs.',
    faq: [{ question: 'How much should a car payment be?', answer: 'A common rule of thumb is keeping auto costs manageable relative to take-home pay, but the right cap depends on your budget.' }],
    blogLinks: [{ title: 'Auto Loan Term Length', href: '/blog/personal-loan-comparison-for-bad-month-resilience' }],
    defaultInputs: { ...defaultInputs, loanAmount: 32000, years: 6, interestRate: 7.1 },
    compute: calculateLoan
  },
  {
    slug: 'student-loan-calculator',
    title: 'Student Loan Calculator',
    description: 'Estimate student-loan payment amounts, payoff timeline, and total interest across repayment assumptions.',
    seoTitle: 'Student Loan Calculator: Repayment Plan and Timeline',
    seoDescription: 'Compare repayment scenarios and see how extra payments change total interest and payoff date.',
    faq: [{ question: 'Can I pay student loans early?', answer: 'Yes. Paying above the required amount can reduce interest cost and shorten your repayment timeline.' }],
    blogLinks: [{ title: 'Debt-to-Income Ratio Guide', href: '/blog/debt-to-income-ratio-90-day-plan' }],
    defaultInputs: { ...defaultInputs, loanAmount: 45000, years: 10, interestRate: 5.8 },
    compute: calculateLoan
  },
  {
    slug: 'debt-payoff-calculator',
    title: 'Debt Payoff Calculator',
    description: 'Compare payoff strategies to see how extra monthly payments change your debt-free timeline and total interest paid.',
    seoTitle: 'Debt Payoff Calculator: Custom Repayment Strategy',
    seoDescription: 'Build a debt payoff schedule and compare standard vs accelerated repayment outcomes.',
    faq: [{ question: 'What should I test first in debt payoff planning?', answer: 'Start by increasing your extra monthly payment in small steps and compare how much sooner each option gets you debt-free.' }],
    blogLinks: [{ title: 'Credit Utilization Explained', href: '/blog/credit-utilization-statement-cycle-playbook' }],
    defaultInputs: { ...defaultInputs, loanAmount: 28000, years: 6 },
    compute: (inputs) => debtPayoffResult('Debt Payoff Projection', inputs)
  }
];

export const calculatorMap = Object.fromEntries(calculatorDefinitions.map((calculator) => [calculator.slug, calculator]));
