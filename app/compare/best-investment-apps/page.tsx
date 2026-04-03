import type { Metadata } from 'next';
import Link from 'next/link';
import { SeoComparisonPage } from '@/components/comparison/SeoComparisonPage';

export const metadata: Metadata = {
  title: 'Investment App Comparison Framework | FinanceSphere',
  description:
    'Use FinanceSphere\'s side-by-side investment app comparison table to evaluate fees, ratings, account features, and platform fit.',
  alternates: {
    canonical: '/best-investment-apps'
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

      <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
        <h3 className="text-lg font-semibold text-slate-900">How to choose the best investment app for you</h3>
        <p className="mt-2 text-sm text-slate-700">
          Stop comparing features and start matching the platform to your actual behavior. The best app is the one you fund consistently—with fees and automation that reduce friction rather than add noise.
        </p>
        <p className="mt-2 text-sm font-medium italic text-slate-700">
          A simpler plan you stick to for 20 years beats a sophisticated one you abandon after a bad quarter.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>Choose your primary use case (retirement, taxable investing, or both).</li>
          <li>Compare total cost, including advisory fees and fund expense ratios.</li>
          <li>Verify core features: recurring buys, fractional shares, and account transfers.</li>
          <li>Check tax tools and reporting quality if you invest in taxable accounts.</li>
          <li>Pick one platform and automate contributions before optimizing anything else.</li>
        </ol>
      </section>

      <SeoComparisonPage
        pageTitle="Best Investment Apps"
        intro="Investing $600/month for 25 years at 8% gross return can produce a gap of over $90,000 between a 0.2% and a 1.0% annual all-in fee profile. Start with cost, then evaluate which features you will actually use."
        category="investment_app"
        slug="best-investment-apps"
        pathname="/best-investment-apps"
        faq={[
          { question: 'Which app setup is usually best for beginners?', answer: 'Beginners often do best with recurring contributions, broad-market funds, and guardrails that reduce impulse trading.' },
          { question: 'Are zero-commission apps always the lowest-cost option?', answer: 'Not always. Include advisory fees, fund expense ratios, spread quality, and subscription tiers in your annual cost check.' }
        ]}
      />
    </div>
  );
}
