import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Credit Card Comparison Framework (2026) | FinanceSphere',
  description: 'Use a transparent framework to compare credit card options by annual value, downside APR risk, and approval fit.'
};

export default function BestCreditCards2026Page() {
  return (
    <SeoComparisonPage
      pageTitle="Best Credit Cards 2026"
      intro="Use this framework to compare credit card options by annual value, APR downside risk, and approval fit before you apply."
      category="credit_card"
      slug="best-credit-cards-2026"
      pathname="/best-credit-cards-2026"
      faq={[
        { question: 'What credit score range is typically needed for premium cards?', answer: 'Most premium cards target good-to-excellent credit profiles, but approval still depends on income, existing debt, and recent applications.' },
        { question: 'Can a no-annual-fee card still beat a premium card?', answer: 'Yes. If you will not consistently use premium credits or transfer partners, a no-fee card can produce higher net annual value.' }
      ]}
    />
  );
}
