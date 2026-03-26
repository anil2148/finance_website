import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Personal Loan Comparison Framework | FinanceSphere',
  description: 'Compare personal loan options using all-in repayment cost, payment resilience, flexibility terms, and servicing quality.',
  pathname: '/loans'
});

const framework = [
  {
    criterion: 'All-in cost',
    details: 'APR + origination fee + prepayment or late-fee policy',
    decision: 'Choose the option with lower total repayment cost at your planned payoff pace.'
  },
  {
    criterion: 'Bad-month resilience',
    details: 'Required payment vs your baseline cash buffer',
    decision: 'Avoid terms that would force missed essentials when income drops for one month.'
  },
  {
    criterion: 'Flexibility',
    details: 'Hardship options, due-date changes, and prepayment freedom',
    decision: 'Prefer lenders that let you accelerate payoff without penalties.'
  },
  {
    criterion: 'Operational quality',
    details: 'Funding timeline, servicing reputation, support escalation',
    decision: 'If timing is critical, reliability can matter more than a small rate delta.'
  }
];

export default function LoansPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-3xl font-bold text-slate-900">Personal loan comparison for difficult months</h1>
        <p className="max-w-3xl text-slate-600">
          This page helps you compare borrowing options by survivability, not just marketing APR. For most households, the wrong loan hurts most during an
          irregular-income month—so test resilience before accepting terms.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">Evaluation framework</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[680px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Criterion</th>
                <th className="px-2 py-2">What to compare</th>
                <th className="px-2 py-2">Decision rule</th>
              </tr>
            </thead>
            <tbody>
              {framework.map((row) => (
                <tr key={row.criterion} className="border-b border-slate-100">
                  <td className="px-2 py-2 font-medium text-slate-900">{row.criterion}</td>
                  <td className="px-2 py-2 text-slate-700">{row.details}</td>
                  <td className="px-2 py-2 text-slate-700">{row.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
        <article>
          <h2 className="text-lg font-semibold text-slate-900">Next steps</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <Link href="/calculators/loan-calculator" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Loan calculator</Link>
            <Link href="/blog/personal-loan-comparison-for-bad-month-resilience" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Loan comparison guide</Link>
            <Link href="/compare/mortgage-rate-comparison" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Mortgage comparison framework</Link>
          </div>
        </article>
        <article>
          <h2 className="text-lg font-semibold text-slate-900">Important transparency note</h2>
          <p className="mt-2 text-sm text-slate-700">
            FinanceSphere does not publish fabricated lender tables on this page. Use this framework with current lender disclosures and verify terms directly
            before acting.
          </p>
        </article>
      </section>
    </section>
  );
}
