import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Mortgage Lender Comparison Framework | FinanceSphere',
  description: 'Compare mortgage lender types using total borrowing cost, timeline reliability, support quality, and borrower fit.',
  pathname: '/compare/mortgage-rate-comparison'
});

export default function MortgageRateComparisonPage() {
  return (
    <SeoComparisonPage
      pageTitle="Mortgage Rate Comparison"
      intro="On a $400,000 mortgage, a lender with a 6.25% rate and $9,500 in fees can cost more than a 6.40% quote with $2,500 in fees—depending on how long you stay in the home. Compare total borrowing cost, not just the rate you are quoted on day one."
      category="mortgage_lender"
      slug="mortgage-rate-comparison"
      pathname="/compare/mortgage-rate-comparison"
      faq={[
        { question: 'What usually moves mortgage APR the most?', answer: 'Loan-level pricing factors include credit profile, loan-to-value ratio, property type, lock timing, and lender fee structure.' },
        { question: 'How should I decide between a 15-year and 30-year term?', answer: 'Compare both terms using payment resilience first. If the 15-year payment is tight in a bad month, the 30-year often provides safer cash-flow flexibility.' }
      ]}
    />
  );
}
