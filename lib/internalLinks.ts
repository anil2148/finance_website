export type RelatedLink = { label: string; href: string; type: 'article' | 'calculator' | 'comparison' | 'hub' };

const categoryLinks: Record<string, RelatedLink[]> = {
  investing: [
    { label: 'Investing hub', href: '/learn/investing', type: 'hub' },
    { label: 'Best investment apps', href: '/best-investment-apps', type: 'comparison' },
    { label: 'Investment growth calculator', href: '/calculators/investment-growth-calculator', type: 'calculator' },
    { label: 'Tax-efficient investing rules', href: '/blog/seo-tax-efficient-investing-tips', type: 'article' }
  ],
  tax: [
    { label: '2026 federal tax brackets guide', href: '/blog/2026-federal-tax-brackets-marginal-rate-decisions', type: 'hub' },
    { label: 'Roth vs traditional 401(k)', href: '/blog/roth-vs-traditional-401k-decision-guide', type: 'article' },
    { label: 'Lower tax bracket strategy', href: '/blog/how-to-stay-in-a-lower-tax-bracket', type: 'article' },
    { label: 'Capital gains 0% harvesting', href: '/blog/capital-gains-tax-strategy-0-percent-harvesting-2026', type: 'article' },
    { label: 'Pre-tax vs post-tax contributions', href: '/blog/pre-tax-vs-post-tax-contributions-simple-guide', type: 'article' },
    { label: 'Salary after-tax calculator', href: '/calculators/salary-after-tax-calculator', type: 'calculator' }
  ],
  'credit-cards': [
    { label: 'Credit cards hub', href: '/learn/credit-cards', type: 'hub' },
    { label: 'Credit card comparisons', href: '/best-credit-cards-2026', type: 'comparison' },
    { label: 'Credit card payoff calculator', href: '/calculators/credit-card-payoff-calculator', type: 'calculator' },
    { label: 'Credit utilization operating system', href: '/blog/credit-utilization-statement-cycle-playbook', type: 'article' }
  ],
  loans: [
    { label: 'Loans hub', href: '/learn/loans', type: 'hub' },
    { label: 'Personal loan comparisons', href: '/loans', type: 'comparison' },
    { label: 'Loan calculator', href: '/calculators/loan-calculator', type: 'calculator' },
    { label: 'Debt-to-income approval prep', href: '/blog/debt-to-income-ratio-90-day-plan', type: 'article' }
  ],
  mortgages: [
    { label: 'Loans hub', href: '/learn/loans', type: 'hub' },
    { label: 'Mortgage lender comparisons', href: '/mortgage-rate-comparison', type: 'comparison' },
    { label: 'Mortgage calculator', href: '/calculators/mortgage-calculator', type: 'calculator' },
    { label: 'Mortgage preapproval checklist', href: '/blog/mortgage-preapproval-checklist-underwriting', type: 'article' }
  ],
  budgeting: [
    { label: 'Budgeting hub', href: '/learn/budgeting', type: 'hub' },
    { label: 'Best savings accounts', href: '/best-savings-accounts-usa', type: 'comparison' },
    { label: 'Budget planner', href: '/calculators/budget-planner', type: 'calculator' },
    { label: 'Emergency fund target method', href: '/blog/emergency-fund-target-by-recovery-timeline', type: 'article' }
  ],
  savings: [
    { label: 'Budgeting hub', href: '/learn/budgeting', type: 'hub' },
    { label: 'Best savings accounts', href: '/best-savings-accounts-usa', type: 'comparison' },
    { label: 'Savings goal calculator', href: '/calculators/savings-goal-calculator', type: 'calculator' },
    { label: 'Emergency fund target method', href: '/blog/emergency-fund-target-by-recovery-timeline', type: 'article' }
  ],
  'savings-accounts': [
    { label: 'Budgeting hub', href: '/learn/budgeting', type: 'hub' },
    { label: 'Best savings accounts', href: '/best-savings-accounts-usa', type: 'comparison' },
    { label: 'Savings goal calculator', href: '/calculators/savings-goal-calculator', type: 'calculator' },
    { label: 'How to choose a high-yield account', href: '/blog/how-to-choose-a-high-yield-savings-account', type: 'article' }
  ],
  'passive-income': [
    { label: 'Passive income hub', href: '/learn/passive-income', type: 'hub' },
    { label: 'Investment account comparisons', href: '/best-investment-apps', type: 'comparison' },
    { label: 'Compound interest calculator', href: '/calculators/compound-interest-calculator', type: 'calculator' },
    { label: 'Tax-efficient investing rules', href: '/blog/seo-tax-efficient-investing-tips', type: 'article' }
  ],
  'credit cards': [
    { label: 'Credit cards hub', href: '/learn/credit-cards', type: 'hub' },
    { label: 'Credit card comparisons', href: '/best-credit-cards-2026', type: 'comparison' },
    { label: 'Credit card payoff calculator', href: '/calculators/credit-card-payoff-calculator', type: 'calculator' },
    { label: 'Credit utilization operating system', href: '/blog/credit-utilization-statement-cycle-playbook', type: 'article' }
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
