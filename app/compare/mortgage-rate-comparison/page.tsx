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
      intro="Use this framework to compare mortgage lender channels by all-in cost, execution reliability, and fit for your borrower profile."
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
