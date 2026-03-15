import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Best Credit Cards 2026 | Compare Rewards, APR & Fees',
  description: 'Compare the best credit cards for 2026 with ratings, APR details, annual fees, pros and cons, and affiliate offers.'
};

export default function BestCreditCards2026Page() {
  return (
    <SeoComparisonPage
      pageTitle="Best Credit Cards 2026"
      intro="Our editorial team reviewed top U.S. credit cards to help you compare rewards value, APR ranges, annual fees, and approval requirements before you apply."
      category="credit_card"
      slug="best-credit-cards-2026"
      faq={[
        { question: 'What credit score do I need for premium cards?', answer: 'Most premium rewards cards require good to excellent credit, typically 690 and above.' },
        { question: 'Do no-annual-fee cards still offer rewards?', answer: 'Yes, many no-annual-fee cards provide cashback or points, though premium perks may be limited.' }
      ]}
    />
  );
}
