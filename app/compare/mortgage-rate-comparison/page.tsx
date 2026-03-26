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
      faq={[
        { question: 'What affects mortgage APR?', answer: 'APR depends on your credit score, loan type, down payment, and lender fees.' },
        { question: 'Should I choose a 15-year or 30-year mortgage?', answer: '15-year loans often have lower rates but higher monthly payments; 30-year loans offer lower monthly payments.' }
      ]}
    />
  );
}
