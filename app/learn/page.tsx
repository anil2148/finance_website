import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

const hubCards = [
  {
    href: '/learn/investing',
    title: 'Investing Hub',
    description: 'Build a long-term investing plan with account, fee, and platform decisions mapped step by step.'
  },
  {
    href: '/learn/credit-cards',
    title: 'Credit Cards Hub',
    description: 'Compare rewards, annual fees, and utilization strategies before choosing or changing cards.'
  },
  {
    href: '/learn/loans',
    title: 'Loans Hub',
    description: 'Understand APR trade-offs, payment stress tests, and payoff acceleration options.'
  },
  {
    href: '/learn/budgeting',
    title: 'Budgeting Hub',
    description: 'Create a spending system you can sustain with practical guardrails and automation.'
  },
  {
    href: '/learn/passive-income',
    title: 'Passive Income Hub',
    description: 'Explore savings yield, dividends, and repeatable systems for long-term cash flow.'
  }
];

export const metadata: Metadata = createPageMetadata({
  title: 'Learn Hubs | FinanceSphere',
  description: 'Explore FinanceSphere learning hubs for investing, credit cards, loans, budgeting, and passive income.',
  pathname: '/learn'
});

export default function LearnIndexPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">FinanceSphere Learn</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Choose a learning hub</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Start with the topic that matches your goal. Each hub gives you an action path with guides, calculators, and comparisons.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hubCards.map((hub) => (
          <article key={hub.href} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">{hub.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{hub.description}</p>
            <Link href={hub.href} className="mt-4 inline-flex font-semibold text-blue-700 hover:underline">
              Open hub →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
