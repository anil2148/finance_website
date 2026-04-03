import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

const hubCards = [
  {
    href: '/learn/investing',
    title: 'Investing Hub',
    description: 'Build a long-term portfolio with practical account selection, contribution cadence, and fee comparisons mapped step by step.',
    audience: 'Best for readers choosing account type, contribution schedule, and app workflow.',
    cta: 'Start investing plan →'
  },
  {
    href: '/learn/credit-cards',
    title: 'Credit Cards Hub',
    description: 'Evaluate rewards, annual fees, and utilization strategies before choosing or changing cards. Includes real net-value math.',
    audience: 'Best for households that want rewards without carrying expensive revolving debt.',
    cta: 'Evaluate card options →'
  },
  {
    href: '/learn/loans',
    title: 'Loans Hub',
    description: 'Understand total APR cost, payment stress tests, and payoff acceleration strategies before signing anything.',
    audience: 'Best for borrowers applying in the next 30–120 days.',
    cta: 'Check borrowing cost →'
  },
  {
    href: '/learn/budgeting',
    title: 'Budgeting Hub',
    description: 'Build a spending system that survives a bad month — with real guardrails, automation triggers, and irregular-income adjustments.',
    audience: 'Best for cash-flow resets, irregular income planning, and trimming fixed costs.',
    cta: 'Build a stable budget →'
  },
  {
    href: '/learn/passive-income',
    title: 'Passive Income Hub',
    description: 'Explore savings yield, dividends, and repeatable systems for supplemental cash flow—tracked net of taxes and fees.',
    audience: 'Best for readers separating stable cash reserves from market-risk income goals.',
    cta: 'Explore income options →'
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

const failureSnapshot = {
  scenario: 'You earn $82,000, your rent jumps by $300, and you still try to follow a debt-plus-investing plan built for a lower housing ratio.',
  failure: 'The transfer schedule looks strong in month one, then fails when one irregular bill lands.',
  consequence: 'You stop both debt prepayments and investing, then restart from zero two months later.'
};

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
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Choose a hub for the decision you are facing right now</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Each hub is built for one decision type. Not general reading — specific guidance on what to do first, what commonly fails, which calculator to run, and where to compare options before you commit.
        </p>
        <p className="mt-2 text-sm font-medium italic text-slate-500">Lower payments are not safer if they remove flexibility.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {decisionPath.map((item) => (
            <article key={item.step} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">{item.step}</h2>
              <p className="mt-1 text-sm text-slate-700">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-800">Decision branching: where to start</h2>
          <div className="mt-2 space-y-1 text-sm text-slate-700">
            <p>→ If you have high-interest debt (&gt;15% APR): start with the <Link href="/learn/loans" className="font-semibold text-blue-700 hover:underline">Loans Hub</Link> before investing</p>
            <p>→ If your emergency fund is under 3 months: start with <Link href="/learn/budgeting" className="font-semibold text-blue-700 hover:underline">Budgeting Hub</Link> to stabilize first</p>
            <p>→ If you are building long-term wealth with stable income: go directly to <Link href="/learn/investing" className="font-semibold text-blue-700 hover:underline">Investing Hub</Link></p>
            <p>→ If you want cash flow from savings or dividends: explore <Link href="/learn/passive-income" className="font-semibold text-blue-700 hover:underline">Passive Income Hub</Link></p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
        <h2 className="text-xl font-semibold text-slate-900">When this fails</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          <article className="rounded-xl border border-amber-200 bg-white p-3">
            <p className="font-semibold text-amber-700">Scenario</p>
            <p className="mt-1 text-slate-700">{failureSnapshot.scenario}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-white p-3">
            <p className="font-semibold text-amber-700">Failure</p>
            <p className="mt-1 text-slate-700">{failureSnapshot.failure}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-white p-3">
            <p className="font-semibold text-amber-700">Consequence</p>
            <p className="mt-1 text-slate-700">{failureSnapshot.consequence}</p>
          </article>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hubCards.map((hub) => (
          <article key={hub.href} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">{hub.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{hub.description}</p>
            <p className="mt-2 text-xs text-slate-500">{hub.audience}</p>
            <Link href={hub.href} className="mt-4 inline-flex font-semibold text-blue-700 hover:underline">
              {hub.cta}
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
