export type RelatedLink = { label: string; href: string; type: 'article' | 'calculator' | 'comparison' | 'hub' };

const categoryLinks: Record<string, RelatedLink[]> = {
  investing: [
    { label: 'Investing hub', href: '/learn/investing', type: 'hub' },
    { label: 'Best investment apps', href: '/best-investment-apps', type: 'comparison' },
    { label: 'Investment growth calculator', href: '/calculators/investment-growth-calculator', type: 'calculator' }
  ],
  'credit-cards': [
    { label: 'Credit cards hub', href: '/learn/credit-cards', type: 'hub' },
    { label: 'Best credit cards 2026', href: '/best-credit-cards-2026', type: 'comparison' },
    { label: 'Credit card payoff calculator', href: '/calculators/credit-card-payoff-calculator', type: 'calculator' }
  ],
  loans: [
    { label: 'Loans hub', href: '/learn/loans', type: 'hub' },
    { label: 'Personal loan comparisons', href: '/comparison?category=personal_loan', type: 'comparison' },
    { label: 'Loan calculator', href: '/calculators/loan-calculator', type: 'calculator' }
  ],
  budgeting: [
    { label: 'Budgeting hub', href: '/learn/budgeting', type: 'hub' },
    { label: 'Budget planner', href: '/calculators/budget-planner', type: 'calculator' },
    { label: 'Savings goal calculator', href: '/calculators/savings-goal-calculator', type: 'calculator' }
  ],
  'passive-income': [
    { label: 'Passive income hub', href: '/learn/passive-income', type: 'hub' },
    { label: 'Best savings accounts', href: '/best-savings-accounts-usa', type: 'comparison' },
    { label: 'Compound interest calculator', href: '/calculators/compound-interest-calculator', type: 'calculator' }
  ]
};

const fallbackByKeyword: Array<{ keyword: string; key: keyof typeof categoryLinks }> = [
  { keyword: 'invest', key: 'investing' },
  { keyword: 'retirement', key: 'investing' },
  { keyword: 'credit', key: 'credit-cards' },
  { keyword: 'loan', key: 'loans' },
  { keyword: 'mortgage', key: 'loans' },
  { keyword: 'budget', key: 'budgeting' },
  { keyword: 'sav', key: 'passive-income' },
  { keyword: 'tax', key: 'investing' }
];

export function getRelatedLinks(category: string) {
  if (categoryLinks[category]) return categoryLinks[category];

  const normalized = category.toLowerCase();
  const fallback = fallbackByKeyword.find((item) => normalized.includes(item.keyword));

  return fallback ? categoryLinks[fallback.key] : categoryLinks.budgeting;
}
