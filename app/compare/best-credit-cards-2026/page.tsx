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
      faq={[
        { question: 'What credit score do I need for premium cards?', answer: 'Most premium rewards cards require good to excellent credit, typically 690 and above.' },
        { question: 'Do no-annual-fee cards still offer rewards?', answer: 'Yes, many no-annual-fee cards provide cashback or points, though premium perks may be limited.' }
      ]}
    />
  );
}
