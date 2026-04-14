import type { BaseCalculatorInputs } from '@/lib/calculators/types';

export type CalculatorFieldMeta = {
  key: keyof BaseCalculatorInputs;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
};

export const CALCULATOR_INPUT_SCHEMAS: Record<string, CalculatorFieldMeta[]> = {
  'mortgage-calculator': [
    { key: 'homePrice', label: 'Home Price', tooltip: 'Purchase price of the home you are evaluating.', min: 50000, max: 4000000, step: 1000, prefix: '$' },
    { key: 'downPayment', label: 'Down Payment', tooltip: 'Cash paid upfront to reduce the mortgage principal.', min: 0, max: 1000000, step: 1000, prefix: '$' },
    { key: 'interestRate', label: 'Mortgage APR', tooltip: 'Annual mortgage interest rate used to calculate principal-and-interest payments.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Loan Term', tooltip: 'Length of the mortgage repayment period in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'propertyTax', label: 'Property Tax (Annual)', tooltip: 'Estimated annual property taxes for this home.', min: 0, max: 30000, step: 50, prefix: '$' },
    { key: 'insurance', label: 'Home Insurance (Annual)', tooltip: 'Estimated annual homeowners-insurance premium.', min: 0, max: 20000, step: 50, prefix: '$' },
    { key: 'pmi', label: 'PMI (Monthly)', tooltip: 'Private mortgage insurance paid monthly until equity requirements are met.', min: 0, max: 2000, step: 10, prefix: '$' },
    { key: 'monthlyContribution', label: 'Extra Monthly Principal', tooltip: 'Additional principal paid each month to reduce payoff time and interest.', min: 0, max: 25000, step: 25, prefix: '$' }
  ],
  'loan-calculator': [
    { key: 'loanAmount', label: 'Loan Principal', tooltip: 'Amount borrowed before any payments are made.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Loan APR', tooltip: 'Annual percentage rate used to calculate your payment schedule.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Loan Term', tooltip: 'Length of time to repay the loan.', min: 1, max: 50, step: 1, suffix: 'y' }
  ],
  'auto-loan-calculator': [
    { key: 'loanAmount', label: 'Auto Loan Principal', tooltip: 'Amount financed for the vehicle after down payment and trade-in credits.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Auto Loan APR', tooltip: 'Annual percentage rate offered for your car loan.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Loan Term', tooltip: 'Length of the auto-loan repayment period in years.', min: 1, max: 50, step: 1, suffix: 'y' }
  ],
  'student-loan-calculator': [
    { key: 'loanAmount', label: 'Student Loan Balance', tooltip: 'Current student-loan principal to be repaid.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Loan APR', tooltip: 'Average annual percentage rate across your student loans.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Repayment Term', tooltip: 'Planned repayment period in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Additional amount paid each month above the required student-loan payment.', min: 0, max: 25000, step: 25, prefix: '$' }
  ],
  'debt-payoff-calculator': [
    { key: 'loanAmount', label: 'Current Debt Balance', tooltip: 'Outstanding debt principal you want to repay.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Interest Rate', tooltip: 'APR for loans or liabilities.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'minimumPayment', label: 'Minimum Payment', tooltip: 'Required minimum monthly payment before extra payoff amount.', min: 0, max: 20000, step: 25, prefix: '$' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Additional amount paid each month above your minimum payment.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Payoff Target', tooltip: 'Optional target timeline to compare your current payment strategy.', min: 1, max: 50, step: 1, suffix: 'y' }
  ],
  'debt-snowball-calculator': [
    { key: 'loanAmount', label: 'Combined Debt Balances', tooltip: 'Total outstanding balance across debts included in your snowball plan.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Average APR', tooltip: 'Weighted average APR across debts while you target the smallest balance first.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'minimumPayment', label: 'Combined Minimum Payment', tooltip: 'Total minimum payment due each month across all included debts.', min: 0, max: 20000, step: 25, prefix: '$' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Additional payment rolled into the next debt after each balance is cleared.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Payoff Target', tooltip: 'Optional payoff horizon to test whether your payment pace is realistic.', min: 1, max: 50, step: 1, suffix: 'y' }
  ],
  'debt-avalanche-calculator': [
    { key: 'loanAmount', label: 'Total Debt Balance', tooltip: 'Combined remaining balance across all debts in your payoff plan.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Blended APR', tooltip: 'Average APR across debts while prioritizing highest-rate balances first.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'minimumPayment', label: 'Combined Minimum Payment', tooltip: 'Total required monthly payment before you add any extra avalanche payment.', min: 0, max: 20000, step: 25, prefix: '$' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Extra payment amount focused on your highest-rate debt each month.', min: 0, max: 25000, step: 25, prefix: '$' }
  ],
  'credit-card-payoff-calculator': [
    { key: 'loanAmount', label: 'Current Card Balance', tooltip: 'Total revolving credit-card debt included in this payoff plan.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Card APR', tooltip: 'Average annual percentage rate applied to your card balances.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'minimumPayment', label: 'Current Minimum Payment', tooltip: 'Your current required monthly card payment from statements.', min: 0, max: 20000, step: 25, prefix: '$' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Additional amount paid each month above your card minimum payment.', min: 0, max: 25000, step: 25, prefix: '$' }
  ],
  'salary-after-tax-calculator': [
    { key: 'loanAmount', label: 'Gross Annual Salary', tooltip: 'Your yearly income before taxes and payroll deductions.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Effective Tax Rate', tooltip: 'Estimated blended tax rate used to calculate annual and monthly take-home pay.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Assumption', tooltip: 'Expected inflation used to estimate the purchasing power of take-home income.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'compound-interest-calculator': [
    { key: 'loanAmount', label: 'Starting Balance', tooltip: 'Amount already invested before new monthly contributions.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount you plan to invest every month.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Estimated annual return used for long-term projection.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation used to estimate real purchasing power.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'investment-growth-calculator': [
    { key: 'loanAmount', label: 'Starting Balance', tooltip: 'Amount already invested before monthly additions.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount added to your portfolio each month.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'retirement-calculator': [
    { key: 'loanAmount', label: 'Current Savings', tooltip: 'Current value of retirement accounts and long-term investment balances.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount you plan to add each month until retirement.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years to Retirement', tooltip: 'Years remaining until your planned retirement date.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'fire-calculator': [
    { key: 'loanAmount', label: 'Current Savings', tooltip: 'Current investable assets available for your FIRE plan.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount you plan to add each month until FI.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years to FI Target', tooltip: 'Years you plan to continue saving before financial independence.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'savings-goal-calculator': [
    { key: 'loanAmount', label: 'Current Savings', tooltip: 'Money already saved toward your target goal.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount you plan to add each month toward your target.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'net-worth-calculator': [
    { key: 'loanAmount', label: 'Current Net Worth', tooltip: 'Net assets minus liabilities right now.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Improvement', tooltip: 'Expected net monthly contribution to net worth.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual growth of assets.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'budget-planner': [
    { key: 'loanAmount', label: 'Starting Cash Buffer', tooltip: 'Current cash or reserve available.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Savings Capacity', tooltip: 'Amount available each month after core spending.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual growth on saved funds.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ]
};
