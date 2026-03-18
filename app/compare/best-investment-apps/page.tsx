import type { Metadata } from 'next';
import Link from 'next/link';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Investment App Comparison Table | Fees, Ratings, and Features',
  description:
    'Use FinanceSphere\'s side-by-side investment app comparison table to evaluate fees, ratings, account features, and platform fit.',
  alternates: {
    canonical: '/investing-apps'
  }
};

export default function BestInvestmentAppsPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Comparison page</p>
        <h2 className="mt-1 text-2xl font-bold">Best Investment Apps Comparison</h2>
        <p className="mt-2 text-sm text-slate-600">
          Need the full framework first? Start with the <Link href="/investing-apps" className="font-semibold text-blue-700 hover:underline">Investing Apps Hub</Link> for methodology, use-case guidance, and platform selection strategy.
        </p>
      </section>

      <SeoComparisonPage
        pageTitle="Best Investment Apps"
        intro="Compare beginner-friendly and advanced investing apps by cost, account tools, automation features, and user experience to choose the right platform."
        category="investment_app"
        slug="best-investment-apps"
        faq={[
          { question: 'What is the best app for beginners?', answer: 'Beginner investors often prefer apps with no minimums, fractional shares, and automated portfolios.' },
          { question: 'Do investment apps charge commissions?', answer: 'Many apps offer zero-commission stock trades, but may charge for options, margin, or premium data.' }
        ]}
      />
    </div>
  );
}
