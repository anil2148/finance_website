import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Mortgage Rate Comparison | Compare APR & Lenders',
  description: 'Compare mortgage lenders by APR, fees, ratings, and pros/cons to find the best home loan rates.',
  pathname: '/compare/mortgage-rate-comparison'
});

export default function MortgageRateComparisonPage() {
  return (
    <SeoComparisonPage
      pageTitle="Mortgage Rate Comparison"
      intro="Review fixed and refinance mortgage offers with transparent APR data, lender fees, and qualification details before locking your rate."
      category="mortgage_lender"
      slug="mortgage-rate-comparison"
      faq={[
        { question: 'What affects mortgage APR?', answer: 'APR depends on your credit score, loan type, down payment, and lender fees.' },
        { question: 'Should I choose a 15-year or 30-year mortgage?', answer: '15-year loans often have lower rates but higher monthly payments; 30-year loans offer lower monthly payments.' }
      ]}
    />
  );
}
