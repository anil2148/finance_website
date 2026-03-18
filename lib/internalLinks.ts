export type RelatedLink = { label: string; href: string; type: 'article' | 'calculator' | 'comparison' | 'hub' };

const categoryLinks: Record<string, RelatedLink[]> = {
  investing: [
    { label: 'Investing hub', href: '/learn/investing', type: 'hub' },
    { label: 'Best investment apps', href: '/best-investment-apps', type: 'comparison' },
    { label: 'Investment growth calculator', href: '/calculators/investment-growth-calculator', type: 'calculator' },
    { label: 'How to read expense ratios', href: '/blog/seo-how-to-read-expense-ratios', type: 'article' }
  ],
  'credit-cards': [
    { label: 'Credit cards hub', href: '/learn/credit-cards', type: 'hub' },
    { label: 'Credit card comparisons', href: '/comparison?category=credit_card', type: 'comparison' },
    { label: 'Credit card payoff calculator', href: '/calculators/credit-card-payoff-calculator', type: 'calculator' },
    { label: 'Avoid credit card interest', href: '/blog/seo-avoid-credit-card-interest', type: 'article' }
  ],
  loans: [
    { label: 'Loans hub', href: '/learn/loans', type: 'hub' },
    { label: 'Personal loan comparisons', href: '/comparison?category=personal_loan', type: 'comparison' },
    { label: 'Loan calculator', href: '/calculators/loan-calculator', type: 'calculator' },
    { label: 'Loan origination fees explained', href: '/blog/seo-how-to-compare-personal-loan-apr', type: 'article' }
  ],
  mortgages: [
    { label: 'Loans hub', href: '/learn/loans', type: 'hub' },
    { label: 'Mortgage lender comparisons', href: '/comparison?category=mortgage_lender', type: 'comparison' },
    { label: 'Mortgage calculator', href: '/calculators/mortgage-calculator', type: 'calculator' },
    { label: 'Mortgage preapproval checklist', href: '/blog/seo-mortgage-preapproval-checklist', type: 'article' }
  ],
  budgeting: [
    { label: 'Budgeting hub', href: '/learn/budgeting', type: 'hub' },
    { label: 'Best savings accounts', href: '/best-savings-accounts-usa', type: 'comparison' },
    { label: 'Budget planner', href: '/calculators/budget-planner', type: 'calculator' },
    { label: 'Emergency fund guide', href: '/blog/seo-emergency-fund-3-to-6-months', type: 'article' }
  ],
  savings: [
    { label: 'Budgeting hub', href: '/learn/budgeting', type: 'hub' },
    { label: 'Best savings accounts', href: '/best-savings-accounts-usa', type: 'comparison' },
    { label: 'Savings goal calculator', href: '/calculators/savings-goal-calculator', type: 'calculator' },
    { label: 'Automate your savings plan', href: '/blog/seo-automate-your-savings-plan', type: 'article' }
  ],
  'passive-income': [
    { label: 'Passive income hub', href: '/learn/passive-income', type: 'hub' },
    { label: 'Investment account comparisons', href: '/comparison?category=investment_app', type: 'comparison' },
    { label: 'Compound interest calculator', href: '/calculators/compound-interest-calculator', type: 'calculator' },
    { label: 'Building a passive income portfolio', href: '/blog/seo-tax-efficient-investing-tips', type: 'article' }
  ],
  'credit cards': [
    { label: 'Credit cards hub', href: '/learn/credit-cards', type: 'hub' },
    { label: 'Credit card comparisons', href: '/comparison?category=credit_card', type: 'comparison' },
    { label: 'Credit card payoff calculator', href: '/calculators/credit-card-payoff-calculator', type: 'calculator' },
    { label: 'Avoid credit card interest', href: '/blog/seo-avoid-credit-card-interest', type: 'article' }
  ]
};

const fallbackByKeyword: Array<{ keyword: string; key: keyof typeof categoryLinks }> = [
  { keyword: 'invest', key: 'investing' },
  { keyword: 'retirement', key: 'investing' },
  { keyword: 'credit', key: 'credit-cards' },
  { keyword: 'loan', key: 'loans' },
  { keyword: 'mortgage', key: 'mortgages' },
  { keyword: 'budget', key: 'budgeting' },
  { keyword: 'sav', key: 'savings' },
  { keyword: 'passive', key: 'passive-income' },
  { keyword: 'tax', key: 'investing' }
];

export function getRelatedLinks(category: string) {
  if (categoryLinks[category]) return categoryLinks[category];

  const normalized = category.toLowerCase();
  const fallback = fallbackByKeyword.find((item) => normalized.includes(item.keyword));

  return fallback ? categoryLinks[fallback.key] : categoryLinks.budgeting;
}
