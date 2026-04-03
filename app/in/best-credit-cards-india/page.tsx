import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import { IndiaArticleRenderer } from '@/components/india/IndiaArticleRenderer';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Credit Cards India (2026): Fees, Rewards, and User-Type Fit',
  description: 'Compare top Indian credit cards with annual fee, reward rate, and waiver rules by user profile.',
  pathname: '/in/best-credit-cards-india'
});

const sections = [
  {
    type: 'table' as const,
    title: 'Comparison snapshot',
    table: {
      headers: ['Card', 'Joining/Annual fee', 'Reward potential', 'Best for'],
      rows: [
        { Card: 'HDFC Millennia', 'Joining/Annual fee': '₹1,000/₹1,000', 'Reward potential': 'Up to 5% on selected merchants', 'Best for': 'Online-first spenders' },
        { Card: 'SBI Cashback Card', 'Joining/Annual fee': '₹999/₹999', 'Reward potential': '5% online cashback (caps apply)', 'Best for': 'Simple cashback optimization' },
        { Card: 'ICICI Amazon Pay', 'Joining/Annual fee': '₹0/₹0', 'Reward potential': 'Amazon-biased cashback', 'Best for': 'No-fee, low-maintenance users' }
      ]
    }
  },
  {
    type: 'text' as const,
    title: 'Choose card depth by annual spend band',
    content:
      '₹1–2 lakh annual spend: no-fee cards often win because waiver miss-risk is high. ₹5–10 lakh: paid cashback can dominate if your categories align. Frequent travel: premium cards only work when redemption value clearly beats fee drag.'
  },
  {
    type: 'decision-panel' as const,
    title: 'Skip premium cards when…',
    tone: 'amber' as const,
    points: [
      { label: 'Waiver threshold is uncertain', text: 'Missing the spend waiver turns reward points into negative net value.' },
      { label: 'You may revolve balances', text: 'High APR and late fees can wipe out months of rewards.' },
      { label: 'Spend categories are fragmented', text: 'Multiple cards with poor tracking can lower total reward capture.' }
    ]
  },
  {
    type: 'cta-block' as const,
    title: 'Continue with linked money decisions',
    links: [
      { label: 'Banking hub', href: '/in/banking' },
      { label: 'Savings accounts comparison', href: '/in/best-savings-accounts-india' },
      { label: 'Personal loan comparison', href: '/in/personal-loan-comparison-india' },
      { label: 'Home loan rates comparison', href: '/in/home-loan-interest-rates-india' },
      { label: 'Investment apps comparison', href: '/in/best-investment-apps-india' },
      { label: 'EMI calculator', href: '/in/calculators/emi-calculator' },
      { label: 'SIP calculator', href: '/in/calculators/sip-calculator' }
    ]
  }
];

export default function BestCardsIndiaPage() {
  return (
    <IndiaArticleRenderer
      title="Best credit cards in India (2026): choose by annual spend, not by launch offer"
      description="Built for users selecting one primary card based on yearly spend and waiver eligibility, not banner rewards."
      subtitle="India banking decision guide"
      sections={sections}
    />
  );
}
