import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { HumanJudgmentCallout } from '@/components/common/HumanJudgmentCallout';
import { CommonMistakeModule } from '@/components/common/CommonMistakeModule';
import { WhoShouldChoosePanel } from '@/components/common/WhoShouldChoosePanel';

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

const emotionalSignals = [
  {
    signal: 'Urgency pressure',
    risk: 'Rushed acceptance of first offer without comparing total cost.',
    numericGuardrail: 'Collect at least 3 offers with the same loan amount and term within 48 hours.'
  },
  {
    signal: 'Relief bias',
    risk: 'Choosing the lowest monthly payment while ignoring total repayment drag.',
    numericGuardrail: 'Reject structures where total repay cost is >15% higher just to lower monthly payment slightly.'
  },
  {
    signal: 'Shame spiral after debt mistakes',
    risk: 'Overcorrecting into an unsustainably aggressive term that fails in bad months.',
    numericGuardrail: 'Keep required debt payments below ~20% of take-home pay in your stress-case month.'
  }
];

const whoShouldChooseRows = [
  {
    profile: 'Stable income, strong credit (720+)',
    choice: 'Shorter term, lower total cost',
    why: 'The higher monthly payment is manageable and you capture the full interest savings. Prepayment penalty terms matter less when income is reliable.',
    avoid: 'Do not optimize solely for lowest APR if origination fees are high. Compare total repay cost, not rate alone.'
  },
  {
    profile: 'Variable or commission income',
    choice: 'Longer term with prepayment freedom',
    why: 'The lower required payment protects you in slow income months. You can prepay aggressively in good months and slow down when cash is tight. This is not a compromise — it is the correct structure for variable income.',
    avoid: 'Do not lock into a short term where missing one payment triggers fees or default risk.'
  },
  {
    profile: 'Consolidating credit card debt',
    choice: 'Fixed-rate personal loan with a no-new-spend rule',
    why: 'The rate improvement is real but only works if card balances do not rebuild. Cut or freeze the cards before or at closing — not "after the loan settles."',
    avoid: 'Do not consolidate without a concrete plan for the freed card capacity. Leaving cards open with no spending control is the number one reason consolidation fails.'
  },
  {
    profile: 'One-time urgent expense, otherwise debt-free',
    choice: 'Short term at best available rate — get in and out fast',
    why: 'If you have no existing debt and steady income, a 24–36 month loan minimizes total cost. Drag this debt out and you pay more for no reason.',
    avoid: 'Do not let urgency push you to the first offer. Collect three quotes within 48 hours — rate shopping for a personal loan within a short window typically counts as one inquiry.'
  }
];

export default function LoansPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Comparison framework</p>
        <h1 className="text-3xl font-bold text-slate-900">Personal loan comparison for difficult months</h1>
        <p className="max-w-3xl text-slate-600">
          Most people choose a loan by comparing the monthly payment. The monthly payment is the wrong variable. What matters is whether that payment survives a bad month — a delayed paycheck, a medical bill, a car repair — without triggering late fees or new card debt on top.
        </p>
        <p className="max-w-3xl text-sm text-slate-500">
          Outcome goal: leave with one shortlist rule you can trust, one payment range that survives bad months, and one calculator run before accepting any offer.
        </p>
      </header>

      <HumanJudgmentCallout>
        A lower monthly payment that extends your debt by 18 months is not a savings strategy. It is a cost decision. The choice that wins is the one with the lowest total repayment cost at a payment you can sustain in your worst month.
      </HumanJudgmentCallout>

      <WhoShouldChoosePanel
        heading="Who should choose which loan structure"
        intro="Loan structure is not one-size-fits-all. The right term depends on your income stability, existing debt, and what happens to your cashflow in a genuinely difficult month."
        rows={whoShouldChooseRows}
      />

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

      <CommonMistakeModule
        mistake="Accepting a consolidation loan while continuing to use the cards you just paid off — without a no-new-spend rule in place."
        whyItBackfires="The loan pays down the cards, but spending habits do not change. Within 12–18 months, card balances rebuild on top of the loan payment. Total monthly obligations are now higher than before consolidation, not lower. This is the most common way consolidation fails — and it happens quickly."
        betterAlternative="Cut or freeze the consolidated cards before closing. Not after. Set a hard rule that the freed card capacity is not available for new charges. Then track both the loan paydown and card balance together every month until the loan is fully paid."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">Emotional + numeric risk controls</h2>
        <p className="mt-2 text-sm text-slate-600">When a loan decision feels emotional, use guardrails so urgency does not override math.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Emotional signal</th>
                <th className="px-2 py-2">Common mistake</th>
                <th className="px-2 py-2">Numeric guardrail</th>
              </tr>
            </thead>
            <tbody>
              {emotionalSignals.map((item) => (
                <tr key={item.signal} className="border-b border-slate-100">
                  <td className="px-2 py-2 font-medium text-slate-900">{item.signal}</td>
                  <td className="px-2 py-2 text-slate-700">{item.risk}</td>
                  <td className="px-2 py-2 text-slate-700">{item.numericGuardrail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
