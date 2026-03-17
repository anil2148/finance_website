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
      { label: 'Monthly Payment', value: payment, currency: true, helpText: 'Required monthly payment including extra payoff amount.' },
      { label: 'Payoff Time', value: finalMonth / 12, suffix: ' yrs', helpText: 'Estimated time needed to eliminate the debt.' },
      { label: 'Interest Saved', value: inputs.monthlyContribution * 12 * inputs.years * 0.35, currency: true, helpText: 'Estimated interest saved by accelerating repayment.' }
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
      { label: 'Ending Balance', value: endingBalance, currency: true, helpText: 'Projected ending balance based on assumptions provided.' },
      { label: 'Contributions', value: inputs.loanAmount + inputs.monthlyContribution * inputs.years * 12, currency: true, helpText: 'Combined initial and recurring contributions.' },
      { label: 'Real Return', value: inputs.expectedReturn - inputs.inflationRate, suffix: '%', helpText: 'Expected return after inflation.' }
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
    description: 'Estimate monthly mortgage costs and total interest before buying or refinancing a home.',
    seoTitle: 'Mortgage Calculator: Payment & Amortization Schedule',
    seoDescription: 'Calculate monthly mortgage payments, total interest, and view an interactive amortization chart.',
    faq: [
      { question: 'How is mortgage payment calculated?', answer: 'The calculator uses the standard fixed-rate mortgage formula with monthly compounding.' },
      { question: 'Does this include taxes and insurance?', answer: 'This calculator focuses on principal and interest. Taxes and insurance can be added manually.' }
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
    description: 'Calculate monthly EMI, total interest, and payoff timing for personal, auto, or other fixed loans.',
    seoTitle: 'Loan Calculator: Monthly EMI & Interest Breakdown',
    seoDescription: 'Calculate monthly loan payments with an amortization schedule and loan cost breakdown.',
    faq: [{ question: 'What is EMI?', answer: 'EMI is the equal monthly installment made toward principal and interest.' }],
    blogLinks: [{ title: 'How Loan Interest Works', href: '/blog/seo-how-loan-interest-works' }],
    defaultInputs: { ...defaultInputs, years: 7 },
    compute: calculateLoan
  },
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    description: 'Project how your savings and regular contributions can grow through compounding over time.',
    seoTitle: 'Compound Interest Calculator: Future Value Projection',
    seoDescription: 'Estimate your future value with monthly contributions and visual growth projections.',
    faq: [{ question: 'Why does compounding matter?', answer: 'Compounding allows returns to generate additional returns over time.' }],
    blogLinks: [{ title: 'Dollar-Cost Averaging Guide', href: '/blog/seo-dollar-cost-averaging-guide' }],
    defaultInputs: { ...defaultInputs, loanAmount: 15000, years: 20 },
    compute: calculateCompoundInterest
  },
  {
    slug: 'retirement-calculator',
    title: 'Retirement Calculator',
    description: 'Estimate retirement savings progress with inflation-aware projections and withdrawal planning context.',
    seoTitle: 'Retirement Calculator: Inflation-Adjusted Savings Plan',
    seoDescription: 'Calculate projected retirement balance and estimate sustainable retirement income.',
    faq: [{ question: 'What is the 4% rule?', answer: 'It is a guideline for annual retirement withdrawals to reduce depletion risk.' }],
    blogLinks: [{ title: 'Retirement Accounts 101', href: '/blog/seo-retirement-accounts-101' }],
    defaultInputs,
    compute: calculateRetirement
  },
  {
    slug: 'credit-card-payoff-calculator',
    title: 'Credit Card Payoff Calculator',
    description: 'Estimate payoff timeline and cost for revolving balances.',
    seoTitle: 'Credit Card Payoff Calculator: Debt-Free Timeline',
    seoDescription: 'Calculate how long it will take to pay off your credit card and compare strategies.',
    faq: [{ question: 'Does paying more each month help?', answer: 'Yes. Extra payments reduce principal faster and lower interest costs.' }],
    blogLinks: [{ title: 'Avoid Credit Card Interest', href: '/blog/seo-avoid-credit-card-interest' }],
    defaultInputs: { ...defaultInputs, loanAmount: 15000, interestRate: 19.9, years: 5 },
    compute: (inputs) => debtPayoffResult('Credit Card Payoff Plan', inputs)
  },
  {
    slug: 'savings-goal-calculator',
    title: 'Savings Goal Calculator',
    description: 'Track monthly savings needed to hit future goals.',
    seoTitle: 'Savings Goal Calculator: Reach Milestones Faster',
    seoDescription: 'Estimate how much to save each month and visualize your progress over time.',
    faq: [{ question: 'Can I include inflation?', answer: 'Yes. Use inflation inputs to estimate real purchasing power.' }],
    blogLinks: [{ title: 'Best Savings Goals by Age', href: '/blog/seo-best-savings-goals-by-age' }],
    defaultInputs: { ...defaultInputs, loanAmount: 10000, years: 10 },
    compute: (inputs) => growthResult('Savings Goal Projection', inputs)
  },
  {
    slug: 'debt-snowball-calculator',
    title: 'Debt Snowball Calculator',
    description: 'Prioritize smallest balances first for momentum.',
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
    description: 'Prioritize highest-interest balances to minimize cost.',
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
    description: 'Project long-term portfolio growth under varied assumptions.',
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
    description: 'Estimate time to Financial Independence / Retire Early.',
    seoTitle: 'FIRE Calculator: Financial Independence Timeline',
    seoDescription: 'Calculate your FIRE number and timeline using savings rate and expected return.',
    faq: [{ question: 'What is FIRE?', answer: 'FIRE stands for Financial Independence, Retire Early.' }],
    blogLinks: [{ title: 'Long-Term Investing Mindset', href: '/blog/seo-long-term-investing-mindset' }],
    defaultInputs: { ...defaultInputs, loanAmount: 120000, monthlyContribution: 1800, years: 20 },
    compute: (inputs) => growthResult('FIRE Projection', inputs)
  },
  {
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator',
    description: 'Visualize net worth trajectory with assets and liabilities.',
    seoTitle: 'Net Worth Calculator: Track Financial Progress',
    seoDescription: 'Compute and project your net worth growth with charts and contribution assumptions.',
    faq: [{ question: 'How often should I track net worth?', answer: 'Monthly or quarterly updates can help keep goals on track.' }],
    blogLinks: [{ title: 'How to Build a Cash Buffer', href: '/blog/seo-how-to-build-cash-buffer' }],
    defaultInputs: { ...defaultInputs, loanAmount: 50000, years: 15 },
    compute: (inputs) => growthResult('Net Worth Projection', inputs)
  },
  {
    slug: 'budget-planner',
    title: 'Budget Planner',
    description: 'Forecast savings and debt outcomes based on monthly cash flow.',
    seoTitle: 'Budget Planner: Monthly Spending & Savings Forecast',
    seoDescription: 'Use this budget planner to map monthly contribution, debt payoff, and savings growth.',
    faq: [{ question: 'Can this replace a detailed budget app?', answer: 'It is best used as a scenario planner rather than transaction tracking tool.' }],
    blogLinks: [{ title: '50/30/20 Rule for Saving', href: '/blog/seo-50-30-20-rule-for-saving' }],
    defaultInputs: { ...defaultInputs, loanAmount: 12000, years: 5 },
    compute: (inputs) => growthResult('Budget Planning Projection', inputs)
  },
  {
    slug: 'salary-after-tax-calculator',
    title: 'Salary After Tax Calculator',
    description: 'Estimate annual take-home salary after taxes and inflation.',
    seoTitle: 'Salary After Tax Calculator: Estimate Take-Home Pay',
    seoDescription: 'Calculate estimated after-tax salary and compare purchasing power over time.',
    faq: [{ question: 'Is this exact tax advice?', answer: 'No. This is an estimate and does not replace professional tax guidance.' }],
    blogLinks: [{ title: 'Tax Saving Strategies', href: '/blog/tax-saving-strategies-99' }],
    defaultInputs: { ...defaultInputs, loanAmount: 90000, interestRate: 24, years: 1, monthlyContribution: 0, expectedReturn: 0 },
    compute: (inputs) => {
      const afterTax = inputs.loanAmount * (1 - inputs.interestRate / 100);
      const monthly = afterTax / 12;
      const inflationAdjusted = afterTax / (1 + inputs.inflationRate / 100);
      return {
        title: 'Salary After Tax',
        summary: [
          { label: 'After-Tax Salary', value: afterTax, currency: true, helpText: 'Estimated annual salary after taxes.' },
          { label: 'Monthly Take Home', value: monthly, currency: true, helpText: 'Estimated monthly net income after taxes.' },
          { label: 'Inflation Adjusted', value: inflationAdjusted, currency: true, helpText: 'Estimated purchasing power after inflation.' }
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
    description: 'Evaluate car loan affordability and interest cost.',
    seoTitle: 'Auto Loan Calculator: Car Payment and Interest Breakdown',
    seoDescription: 'Estimate monthly auto loan payments and full-term financing costs with charts.',
    faq: [{ question: 'How much should a car payment be?', answer: 'Many planners target 10-15% of monthly take-home pay.' }],
    blogLinks: [{ title: 'Auto Loan Term Length', href: '/blog/seo-auto-loan-term-length' }],
    defaultInputs: { ...defaultInputs, loanAmount: 32000, years: 6, interestRate: 7.1 },
    compute: calculateLoan
  },
  {
    slug: 'student-loan-calculator',
    title: 'Student Loan Calculator',
    description: 'Estimate repayment term and cost for education debt.',
    seoTitle: 'Student Loan Calculator: Repayment Plan and Timeline',
    seoDescription: 'Compare student loan repayment outcomes and visualize payoff progress.',
    faq: [{ question: 'Can I pay student loans early?', answer: 'Yes. Extra payments can reduce total interest and shorten payoff period.' }],
    blogLinks: [{ title: 'Loan Documents You Need', href: '/blog/seo-loan-documents-you-need' }],
    defaultInputs: { ...defaultInputs, loanAmount: 45000, years: 10, interestRate: 5.8 },
    compute: calculateLoan
  },
  {
    slug: 'debt-payoff-calculator',
    title: 'Debt Payoff Calculator',
    description: 'See how extra monthly payments can shorten payoff time and reduce total debt interest.',
    seoTitle: 'Debt Payoff Calculator: Custom Repayment Strategy',
    seoDescription: 'Project debt payoff schedules, interest costs, and acceleration benefits.',
    faq: [{ question: 'What inputs matter most for payoff?', answer: 'Interest rate and extra monthly payments have the largest impact.' }],
    blogLinks: [{ title: 'Balance Transfer Strategy', href: '/blog/seo-balance-transfer-strategy' }],
    defaultInputs: { ...defaultInputs, loanAmount: 28000, years: 6 },
    compute: (inputs) => debtPayoffResult('Debt Payoff Projection', inputs)
  }
];

export const calculatorMap = Object.fromEntries(calculatorDefinitions.map((calculator) => [calculator.slug, calculator]));
