import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Credit Card Decision Framework | FinanceSphere',
  description: 'Use a practical framework to evaluate credit cards by annual value, APR downside risk, fees, and approval fit before applying.',
  pathname: '/credit-cards'
});

const evaluationRows = [
  {
    factor: 'Net annual value after fees',
    why: 'A high rewards rate can underperform if annual fees or redemption friction erase real value.',
    threshold: 'Estimate value using your last 3 months of spending, not category averages.'
  },
  {
    factor: 'APR downside risk',
    why: 'One carried balance month can wipe out most rewards from the year.',
    threshold: 'If you might carry a balance, prioritize low APR and fee protections over premium perks.'
  },
  {
    factor: 'Approval fit and credit profile',
    why: 'Hard inquiries and denials create drag without improving your setup.',
    threshold: 'Apply when your utilization, payment history, and income documentation are stable.'
  },
  {
    factor: 'Benefit usability',
    why: 'Credits and perks only count if your normal habits actually use them.',
    threshold: 'Discount any benefit that requires behavior you do not already maintain.'
  }
];

const scenarios = [
  {
    title: 'Scenario 1: Rewards excitement, hidden downside',
    emotion: 'You feel motivated by points and welcome bonuses.',
    numbers: 'Expected rewards: ~$720/year. Annual fee: $395. One $3,000 carried balance at 24% APR for 6 months: ~$360 interest.',
    decision: 'If you may carry balances, APR downside can erase most reward upside.'
  },
  {
    title: 'Scenario 2: Fear of missing out on premium cards',
    emotion: 'You worry you are behind if you do not hold premium cards.',
    numbers: 'Current annual spend in bonus categories: $6,000. Incremental value vs no-fee card: ~$110/year.',
    decision: 'Pick the card that wins with your real spending, not influencer redemption assumptions.'
  },
  {
    title: 'Scenario 3: Recovery after a rough month',
    emotion: 'You want a plan that survives irregular cash flow without shame spirals.',
    numbers: 'Take-home pay dip: -12% for one month. Card utilization rises from 18% to 41%. Score risk increases quickly.',
    decision: 'Set autopay minimum + manual mid-cycle payment to keep utilization controlled.'
  }
];

export default function CreditCardsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-3xl font-bold text-slate-900">Credit card comparison, without fake rankings</h1>
        <p className="max-w-3xl text-slate-600">
          This page is for people choosing a card in the next 30–90 days. Use it to avoid the expensive mistake of comparing only rewards while ignoring
          APR risk, fee triggers, and approval fit.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/best-credit-cards-2026" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Open full comparison framework</Link>
          <Link href="/calculators/credit-card-payoff-calculator" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Run payoff calculator</Link>
          <Link href="/blog/credit-card-apr-2026-what-your-rate-costs" className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">APR cost guide</Link>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">How to evaluate cards in 4 checks</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[680px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Factor</th>
                <th className="px-2 py-2">Why it matters</th>
                <th className="px-2 py-2">Decision rule</th>
              </tr>
            </thead>
            <tbody>
              {evaluationRows.map((row) => (
                <tr key={row.factor} className="border-b border-slate-100">
                  <td className="px-2 py-2 font-medium text-slate-900">{row.factor}</td>
                  <td className="px-2 py-2 text-slate-700">{row.why}</td>
                  <td className="px-2 py-2 text-slate-700">{row.threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Best if…</h3>
          <p className="mt-2 text-sm text-slate-700">You pay in full monthly and can use rewards categories consistently without overspending.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Avoid if…</h3>
          <p className="mt-2 text-sm text-slate-700">Your emergency fund is below one month of expenses and card usage regularly bridges cash shortfalls.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Do this first</h3>
          <p className="mt-2 text-sm text-slate-700">Model one bad-month scenario in the payoff calculator before submitting an application.</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">Emotional + numeric scenarios before you apply</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article key={scenario.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-semibold text-slate-900">{scenario.title}</h3>
              <p className="mt-2 text-sm text-slate-700"><strong>Emotional signal:</strong> {scenario.emotion}</p>
              <p className="mt-2 text-sm text-slate-700"><strong>Numeric snapshot:</strong> {scenario.numbers}</p>
              <p className="mt-2 text-sm text-slate-700"><strong>Decision rule:</strong> {scenario.decision}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
