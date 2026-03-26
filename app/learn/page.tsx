import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

const hubCards = [
  {
    href: '/learn/investing',
    title: 'Investing Hub',
    description: 'Build a long-term investing plan with account, fee, and platform decisions mapped step by step.',
    audience: 'Best for readers choosing account type, contribution cadence, and app workflow.'
  },
  {
    href: '/learn/credit-cards',
    title: 'Credit Cards Hub',
    description: 'Compare rewards, annual fees, and utilization strategies before choosing or changing cards.',
    audience: 'Best for households that want rewards without carrying expensive revolving debt.'
  },
  {
    href: '/learn/loans',
    title: 'Loans Hub',
    description: 'Understand APR trade-offs, payment stress tests, and payoff acceleration options.',
    audience: 'Best for borrowers applying in the next 30–120 days.'
  },
  {
    href: '/learn/budgeting',
    title: 'Budgeting Hub',
    description: 'Create a spending system you can sustain with practical guardrails and automation.',
    audience: 'Best for cash-flow resets, irregular income planning, and fixed-cost triage.'
  },
  {
    href: '/learn/passive-income',
    title: 'Passive Income Hub',
    description: 'Explore savings yield, dividends, and repeatable systems for long-term cash flow.',
    audience: 'Best for readers separating stable cash reserves from market-risk income goals.'
  }
];

const decisionPath = [
  {
    step: '1) Define the decision',
    text: 'Choose one concrete decision (example: “Should I prioritize debt payoff or investing this quarter?”).'
  },
  {
    step: '2) Pick the matching hub',
    text: 'Open a hub built for that decision type so guidance, calculators, and comparisons stay aligned.'
  },
  {
    step: '3) Pressure-test your plan',
    text: 'Run one calculator scenario and compare at least two options before taking action.'
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
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Choose a learning hub for your next decision</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          These hubs are built for decision support, not passive reading. Each one maps a clear path: what to do first, what to avoid, which calculator to run,
          and where to compare options before committing.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {decisionPath.map((item) => (
            <article key={item.step} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">{item.step}</h2>
              <p className="mt-1 text-sm text-slate-700">{item.text}</p>
            </article>
          ))}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hubCards.map((hub) => (
          <article key={hub.href} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">{hub.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{hub.description}</p>
            <p className="mt-2 text-xs text-slate-500">{hub.audience}</p>
            <Link href={hub.href} className="mt-4 inline-flex font-semibold text-blue-700 hover:underline">
              Open hub →
            </Link>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Trust and methodology</h2>
        <p className="mt-1 text-sm text-slate-700">
          FinanceSphere learning hubs are educational. We publish frameworks and scenario logic, not personalized financial advice or guaranteed outcomes.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/editorial-policy" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Editorial policy</Link>
          <Link href="/affiliate-disclosure" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Affiliate disclosure</Link>
          <Link href="/financial-disclaimer" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Financial disclaimer</Link>
        </div>
      </section>
    </section>
  );
}
