import { asCurrency, buildAmortizationProjection, buildInvestmentProjection, paymentFromPrincipal } from '@/lib/calculators/engine';
import { calculateCompoundInterest } from '@/lib/calculators/compoundInterest';
import { calculateLoan } from '@/lib/calculators/loan';
import { calculateMortgage } from '@/lib/calculators/mortgage';
import { calculateRetirement } from '@/lib/calculators/retirement';
import { BaseCalculatorInputs, CalculatorDefinition, CalculatorResult } from '@/lib/calculators/types';

const debtPayoffResult = (title: string, inputs: BaseCalculatorInputs): CalculatorResult => {
  const payment = paymentFromPrincipal(inputs.loanAmount, inputs.interestRate, inputs.years) + inputs.monthlyContribution;
  const projection = buildAmortizationProjection(inputs, payment);
  const finalMonth = projection.find((point) => point.balance <= 0)?.month ?? projection.length;

  return {
    title,
    summary: [
      { label: 'Monthly Payment', value: payment, currency: true, helpText: 'Estimated required payment including your extra monthly debt contribution.' },
      { label: 'Payoff Time', value: finalMonth / 12, suffix: ' yrs', helpText: 'Approximate payoff timeline based on current balance, APR, and payment strategy.' },
      { label: 'Interest Saved', value: inputs.monthlyContribution * 12 * inputs.years * 0.35, currency: true, helpText: 'Directional estimate of interest avoided when you pay above the minimum.' }
    ],
    projection,
    breakdown: [
      { label: 'Debt Balance', value: asCurrency(inputs.loanAmount) },
      { label: 'Extra Monthly Payment', value: asCurrency(inputs.monthlyContribution) },
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
      { label: 'Current Amount', value: asCurrency(inputs.loanAmount) },
      { label: 'Monthly Contribution', value: asCurrency(inputs.monthlyContribution) },
      { label: 'Expected Return', value: `${inputs.expectedReturn}%` }
    ],
    chartKinds: ['growth', 'bar', 'pie']
  };
};

const defaultInputs: BaseCalculatorInputs = {
  loanAmount: 250000,
  interestRate: 6.5,
  monthlyContribution: 500,
  years: 30,
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
      { title: 'Mortgage Preapproval Checklist', href: '/blog/seo-mortgage-preapproval-checklist' },
      { title: 'Save for a Down Payment Faster', href: '/blog/seo-save-for-down-payment-faster' }
    ],
    defaultInputs,
    compute: calculateMortgage
  },
  {
    slug: 'loan-calculator',
    title: 'Loan Calculator',
    description: 'Calculate monthly EMI-style installments, total interest, and payoff date before choosing a personal, auto, or fixed-term loan.',
    seoTitle: 'Loan Calculator: Monthly EMI & Interest Breakdown',
    seoDescription: 'Calculate monthly installment payments with a year-by-year amortization schedule and total interest breakdown.',
    faq: [{ question: 'What is EMI?', answer: 'EMI (equated monthly installment) is a fixed payment that covers both interest and principal each month.' }],
    blogLinks: [{ title: 'How Loan Interest Works', href: '/blog/seo-how-loan-interest-works' }],
    defaultInputs: { ...defaultInputs, years: 7 },
    compute: calculateLoan
  },
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    description: 'Model long-term balance growth from a starting amount and recurring contributions to set realistic investing milestones.',
    seoTitle: 'Compound Interest Calculator: Future Value Projection',
    seoDescription: 'Estimate future portfolio value from a starting balance, recurring contributions, and expected annual return.',
    faq: [{ question: 'Why does compounding matter?', answer: 'Because earnings stay invested, your returns can generate additional returns, accelerating growth over longer periods.' }],
    blogLinks: [{ title: 'Dollar-Cost Averaging Guide', href: '/blog/seo-dollar-cost-averaging-guide' }],
    defaultInputs: { ...defaultInputs, loanAmount: 15000, years: 20 },
    compute: calculateCompoundInterest
  },
  {
    slug: 'retirement-calculator',
    title: 'Retirement Calculator',
    description: 'Estimate retirement readiness by testing contribution levels, investment returns, and inflation-adjusted spending assumptions.',
    seoTitle: 'Retirement Calculator: Inflation-Adjusted Savings Plan',
    seoDescription: 'Project retirement account growth and estimate potential annual withdrawals using common planning rules.',
    faq: [{ question: 'What is the 4% rule?', answer: 'The 4% rule is a starting-point guideline suggesting first-year withdrawals around 4% of portfolio value, adjusted over time.' }],
    blogLinks: [{ title: 'Retirement Accounts 101', href: '/blog/seo-retirement-accounts-101' }],
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
    blogLinks: [{ title: 'Avoid Credit Card Interest', href: '/blog/seo-avoid-credit-card-interest' }],
    defaultInputs: { ...defaultInputs, loanAmount: 15000, interestRate: 19.9, years: 5 },
    compute: (inputs) => debtPayoffResult('Credit Card Payoff Plan', inputs)
  },
  {
    slug: 'savings-goal-calculator',
    title: 'Savings Goal Calculator',
    description: 'Estimate the monthly amount required to reach a target by your deadline, including growth and inflation assumptions.',
    seoTitle: 'Savings Goal Calculator: Reach Milestones Faster',
    seoDescription: 'Calculate monthly savings needed for a target date and track projected progress year by year.',
    faq: [{ question: 'Can I include inflation?', answer: 'Yes. Inflation assumptions help you test whether your target still holds purchasing power in future years.' }],
    blogLinks: [{ title: 'Best Savings Goals by Age', href: '/blog/seo-best-savings-goals-by-age' }],
    defaultInputs: { ...defaultInputs, loanAmount: 10000, years: 10 },
    compute: (inputs) => growthResult('Savings Goal Projection', inputs)
  },
  {
    slug: 'debt-snowball-calculator',
    title: 'Debt Snowball Calculator',
    description: 'Simulate a snowball strategy that clears small balances first to build motivation and visible progress.',
    seoTitle: 'Debt Snowball Calculator: Build Debt Payoff Momentum',
    seoDescription: 'Simulate debt snowball strategy with charts and payoff timeline insights.',
    faq: [{ question: 'What is debt snowball?', answer: 'It pays smallest debt first while making minimum payments on others.' }],
    blogLinks: [{ title: 'Debt-to-Income Ratio Guide', href: '/blog/seo-debt-to-income-ratio-guide' }],
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
    blogLinks: [{ title: 'Personal Loan vs Credit Card', href: '/blog/seo-personal-loan-vs-credit-card' }],
    defaultInputs: { ...defaultInputs, loanAmount: 40000, years: 8 },
    compute: (inputs) => debtPayoffResult('Debt Avalanche Projection', inputs)
  },
  {
    slug: 'investment-growth-calculator',
    title: 'Investment Growth Calculator',
    description: 'Forecast portfolio value using contribution, return, and inflation assumptions to support long-term investing decisions.',
    seoTitle: 'Investment Growth Calculator: Long-Term Portfolio Forecast',
    seoDescription: 'Forecast investment growth with expected return, inflation, and contribution inputs.',
    faq: [{ question: 'Is return guaranteed?', answer: 'No. Returns are estimates and real markets can vary widely.' }],
    blogLinks: [{ title: 'Investing for Beginners Roadmap', href: '/blog/seo-investing-for-beginners-roadmap' }],
    defaultInputs,
    compute: (inputs) => growthResult('Investment Growth Projection', inputs)
  },
  {
    slug: 'fire-calculator',
    title: 'FIRE Calculator',
    description: 'Estimate the savings pace and portfolio target needed to reach financial independence earlier than traditional retirement.',
    seoTitle: 'FIRE Calculator: Financial Independence Timeline',
    seoDescription: 'Estimate your path to financial independence by modeling savings rate, investment return, and target spending.',
    faq: [{ question: 'What is FIRE?', answer: 'FIRE means Financial Independence, Retire Early—building enough invested assets to cover living costs without active income.' }],
    blogLinks: [{ title: 'Long-Term Investing Mindset', href: '/blog/seo-long-term-investing-mindset' }],
    defaultInputs: { ...defaultInputs, loanAmount: 120000, monthlyContribution: 1800, years: 20 },
    compute: (inputs) => growthResult('FIRE Projection', inputs)
  },
  {
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator',
    description: 'Track assets versus liabilities and project how saving, investing, and debt repayment choices influence net worth over time.',
    seoTitle: 'Net Worth Calculator: Track Financial Progress',
    seoDescription: 'Calculate current net worth and project forward based on contribution and growth assumptions.',
    faq: [{ question: 'How often should I track net worth?', answer: 'Monthly or quarterly tracking is usually enough to spot trends without reacting to short-term noise.' }],
    blogLinks: [{ title: 'How to Build a Cash Buffer', href: '/blog/seo-how-to-build-cash-buffer' }],
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
    blogLinks: [{ title: '50/30/20 Rule for Saving', href: '/blog/seo-50-30-20-rule-for-saving' }],
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
    blogLinks: [{ title: 'Tax Saving Strategies', href: '/blog/tax-saving-strategies-99' }],
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
          { label: 'Gross Salary', value: asCurrency(inputs.loanAmount) },
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
    blogLinks: [{ title: 'Auto Loan Term Length', href: '/blog/seo-auto-loan-term-length' }],
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
    blogLinks: [{ title: 'Loan Documents You Need', href: '/blog/seo-loan-documents-you-need' }],
    defaultInputs: { ...defaultInputs, loanAmount: 45000, years: 10, interestRate: 5.8 },
    compute: calculateLoan
  },
  {
    slug: 'debt-payoff-calculator',
    title: 'Debt Payoff Calculator',
    description: 'Compare debt repayment scenarios to see how extra monthly payments change your debt-free date and lifetime interest.',
    seoTitle: 'Debt Payoff Calculator: Custom Repayment Strategy',
    seoDescription: 'Build a debt payoff schedule and compare standard vs accelerated repayment outcomes.',
    faq: [{ question: 'What inputs matter most for payoff?', answer: 'Interest rate and extra monthly payment usually drive the biggest change in payoff time and total interest.' }],
    blogLinks: [{ title: 'Balance Transfer Strategy', href: '/blog/seo-balance-transfer-strategy' }],
    defaultInputs: { ...defaultInputs, loanAmount: 28000, years: 6 },
    compute: (inputs) => debtPayoffResult('Debt Payoff Projection', inputs)
  }
];

export const calculatorMap = Object.fromEntries(calculatorDefinitions.map((calculator) => [calculator.slug, calculator]));
