import { calculatorDefinitions } from '@/lib/calculators/registry';
import type { FinancialCategory } from '@/lib/financialProducts';

const FALLBACK_CALCULATOR_HREF = '/calculators';

const existingCalculatorHrefs = new Set(calculatorDefinitions.map((calculator) => `/calculators/${calculator.slug}`));

const normalizePath = (href: string) => href.split(/[?#]/)[0].replace(/\/$/, '') || '/';

export function resolveCalculatorHref(href?: string | null) {
  if (!href) return FALLBACK_CALCULATOR_HREF;

  const normalizedHref = normalizePath(href);
  if (normalizedHref === FALLBACK_CALCULATOR_HREF || existingCalculatorHrefs.has(normalizedHref)) {
    return normalizedHref;
  }

  return FALLBACK_CALCULATOR_HREF;
}

export const matchingCalculatorLinksByBlogCategory: Record<string, Array<{ label: string; href: string }>> = {
  budgeting: [
    { label: 'Budget Planner', href: '/calculators/budget-planner' },
    { label: 'Debt Payoff Calculator', href: '/calculators/debt-payoff-calculator' }
  ],
  investing: [
    { label: 'Investment Growth Calculator', href: '/calculators/investment-growth-calculator' },
    { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' }
  ],
  mortgages: [
    { label: 'Mortgage Calculator', href: '/calculators/mortgage-calculator' },
    { label: 'Savings Goal Calculator', href: '/calculators/savings-goal-calculator' }
  ],
  'credit cards': [
    { label: 'Credit Card Payoff Calculator', href: '/calculators/credit-card-payoff-calculator' },
    { label: 'Debt Avalanche Calculator', href: '/calculators/debt-avalanche-calculator' }
  ]
};

export const matchingCalculatorLinksByFinancialCategory: Partial<Record<FinancialCategory, Array<{ label: string; href: string }>>> = {
  credit_card: [
    { label: 'Credit Card Payoff Calculator', href: '/calculators/credit-card-payoff-calculator' },
    { label: 'Debt Avalanche Calculator', href: '/calculators/debt-avalanche-calculator' }
  ],
  savings_account: [
    { label: 'Savings Goal Calculator', href: '/calculators/savings-goal-calculator' },
    { label: 'Net Worth Calculator', href: '/calculators/net-worth-calculator' }
  ],
  investment_app: [
    { label: 'Investment Growth Calculator', href: '/calculators/investment-growth-calculator' },
    { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' }
  ],
  mortgage_lender: [
    { label: 'Mortgage Calculator', href: '/calculators/mortgage-calculator' },
    { label: 'Loan Calculator', href: '/calculators/loan-calculator' }
  ],
  personal_loan: [
    { label: 'Debt Payoff Calculator', href: '/calculators/debt-payoff-calculator' },
    { label: 'Loan Calculator', href: '/calculators/loan-calculator' }
  ]
};

export const defaultMatchingCalculatorLinks = [{ label: 'Explore all calculators', href: FALLBACK_CALCULATOR_HREF }];
