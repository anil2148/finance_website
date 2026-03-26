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

const scenarios = [
  {
    title: 'Scenario A: lower payment, higher total cost',
    details:
      'A $12,000 loan at 11.9% for 60 months can feel safer monthly than a 36-month option, but often carries materially higher total interest. If your cash buffer is stable, shorter term usually wins on cost.'
  },
  {
    title: 'Scenario B: tighter term, fragile cash flow',
    details:
      'If a shorter term pushes debt payments above 20% of take-home pay, one bad month can trigger late fees or new card balances. In that case, choose resilient payment structure first, then prepay when income normalizes.'
  },
  {
    title: 'Scenario C: no-fee vs low-rate with origination',
    details:
      'A slightly lower APR can still lose after fees. Compare net proceeds, monthly payment, and total repay amount side by side before accepting an offer.'
  }
];

const checklist = [
  'Confirm the payment still works if take-home pay drops by 10% for one month.',
  'Model total repay cost for both scheduled payoff and an accelerated payoff plan.',
  'Verify hardship and due-date-change options before signing.',
  'Do not consolidate debt without a no-new-debt rule and autopay setup.'
];

export default function LoansPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Comparison framework</p>
        <h1 className="text-3xl font-bold text-slate-900">Personal loan comparison for difficult months</h1>
        <p className="max-w-3xl text-slate-600">
          Use this page if you are choosing a personal loan in the next 30-90 days and want to avoid the most expensive mistake: selecting a payment plan
          that fails as soon as one month goes off-script.
        </p>
        <p className="max-w-3xl text-sm text-slate-500">
          Outcome goal: leave with one shortlist rule you can trust, one payment range that survives bad months, and one calculator run before accepting any
          offer.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">Evaluation framework</h2>
        <p className="mt-2 text-sm text-slate-600">Use identical loan amounts and payoff dates when comparing offers so your numbers stay honest.</p>
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

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-900">Illustrative scenarios (not live market quotes)</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article key={scenario.title} className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">{scenario.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{scenario.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-lg font-semibold text-amber-900">Worst mistake to avoid</h2>
        <p className="mt-2 text-sm text-amber-900">
          Accepting a consolidation loan while continuing card spend. That creates layered debt and usually destroys any APR advantage.
        </p>
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <article>
          <h2 className="text-lg font-semibold text-slate-900">Decision checklist before accepting</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2 className="text-lg font-semibold text-slate-900">Next steps</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <Link href="/calculators/loan-calculator" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Loan calculator</Link>
            <Link href="/blog/personal-loan-comparison-for-bad-month-resilience" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Loan comparison guide</Link>
            <Link href="/compare/mortgage-rate-comparison" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Mortgage comparison framework</Link>
            <Link href="/editorial-policy" className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">Methodology</Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Transparency note: FinanceSphere does not publish fabricated lender tables on this page. Use this framework with current lender disclosures and
            verify terms directly before acting.
          </p>
        </article>
      </section>
    </section>
  );
}
