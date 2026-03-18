import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Best Credit Cards 2026 | Compare Rewards, APR & Fees',
  description: 'Compare 2026 credit cards with issuer data, fee math, and approval-fit guidance so you can choose rewards that match your spending profile.'
};

export default function BestCreditCards2026Page() {
  return (
    <SeoComparisonPage
      pageTitle="Best Credit Cards 2026"
      intro="Compare leading U.S. cards by net first-year value, APR downside risk, annual fees, and issuer approval profile before submitting any application."
      category="credit_card"
      slug="best-credit-cards-2026"
      faq={[
        { question: 'What credit score do I need for premium cards?', answer: 'Most premium rewards cards require good to excellent credit, typically 690 and above.' },
        { question: 'Do no-annual-fee cards still offer rewards?', answer: 'Yes, many no-annual-fee cards provide cashback or points, though premium perks may be limited.' }
      ]}
    />
  );
}
