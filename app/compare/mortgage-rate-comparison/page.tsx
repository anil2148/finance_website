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
    <div className="space-y-5">
      <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">The number that changes the comparison most</h2>
        <p className="mt-2 text-sm text-slate-700">
          On a $400,000 loan, the difference between 6.5% and 6.75% is roughly $65/month—or $23,400 over 30 years. That sounds significant. But a lender with a $7,000 higher fee stack can cost more over 5 years than the rate difference saves.
        </p>
        <p className="mt-3 text-sm text-slate-700">
          Run both calculations using your expected time in the home before deciding which variable matters more.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-800 italic">
          The rate you see on day one and the rate you close at are not always the same number.
        </p>
      </section>
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
    </div>
  );
}
