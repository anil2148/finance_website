import type { Metadata } from 'next';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Mortgage Rate Comparison | Compare APR & Lenders',
  description: 'Compare mortgage lenders by APR, fees, ratings, and pros/cons to find the best home loan rates.'
};

export default function MortgageRateComparisonPage() {
  return (
    <SeoComparisonPage
      pageTitle="Mortgage Rate Comparison"
      intro="Review fixed and refinance mortgage offers with transparent APR data, lender fees, and qualification details before locking your rate."
      category="mortgages"
      slug="mortgage-rate-comparison"
      faq={[
        { question: 'What affects mortgage APR?', answer: 'APR depends on your credit score, loan type, down payment, and lender fees.' },
        { question: 'Should I choose a 15-year or 30-year mortgage?', answer: '15-year loans often have lower rates but higher monthly payments; 30-year loans offer lower monthly payments.' }
      ]}
    />
  );
}
