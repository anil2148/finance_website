import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';
import { HumanJudgmentCallout } from '@/components/common/HumanJudgmentCallout';

export const metadata: Metadata = createPageMetadata({
  description: 'India tax decision hub with old-vs-new regime checks, 80C/80D planning, and monthly cashflow-safe execution examples.',
  pathname: '/in/tax'
});

const salaryScenarios = [
  {
    band: '₹8L annual salary',
    regime: 'New regime usually wins',
    whyItFails: 'Buying ELSS in February without budgeting the ₹5,000–₹8,000/month cashflow impact.',
    saferMove: 'Run take-home comparison first. If new regime gap is under ₹8,000, skip old regime complexity.'
  },
  {
    band: '₹12L annual salary',
    regime: 'Compare both; old wins only with full proofs',
    whyItFails: 'Choosing old regime without consistent HRA, EPF, and 80C documents across the full year.',
    saferMove: 'Calculate monthly contribution needed (₹12,500) and automate it from April, not March.'
  },
  {
    band: '₹18L annual salary',
    regime: 'Old regime can save ₹30,000–₹60,000 if fully executed',
    whyItFails: 'Mixing investment and tax goals in March panic, breaking monthly liquidity.',
    saferMove: 'Lock regime by April, divide ₹1.5L 80C limit into ₹12,500/month systematic contributions.'
  },
  {
    band: '₹25L+ annual salary',
    regime: 'Requires deliberate split: tax vs wealth',
    whyItFails: 'Over-optimizing deductions and crowding out SIP with lumpy year-end tax investments.',
    saferMove: 'Separate deduction lane (80C/80D) from wealth lane (SIP, NPS). Run both monthly, not annually.'
  }
];

const pathwayLinks = {
  calculators: [
    { href: '/in/calculators/sip-calculator', label: 'Model SIP corpus after tax-saving allocation' },
    { href: '/in/calculators/emi-calculator', label: 'Run EMI stress test before locking tax contributions' }
  ],
  comparisons: [
    { href: '/in/old-vs-new-tax-regime', label: 'Old vs new regime comparison decision' },
    { href: '/in/best-investment-apps-india', label: 'Compare investment app options for 80C execution' }
  ],
  deepGuides: [
    { href: '/in/80c-deductions', label: '80C deductions: what counts and how to document' },
    { href: '/in/tax-saving-strategies', label: 'Tax saving strategies by salary band' },
    { href: '/in/sip-strategy-india', label: 'Post-tax SIP strategy for long-term wealth' },
    { href: '/in/tax-slabs-2026-india', label: 'India tax slabs 2026 reference' }
  ]
};

export default function IndiaTaxHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Where should I start if I am confused about tax planning?', acceptedAnswer: { '@type': 'Answer', text: 'Start with old vs new regime check, then build monthly 80C contributions from April instead of doing it all in March.' } },
      { '@type': 'Question', name: 'What is the biggest tax mistake in India?', acceptedAnswer: { '@type': 'Answer', text: 'March panic tax-saving without checking monthly liquidity or whether the old regime actually saves more than the new regime for your specific income and deduction profile.' } },
      { '@type': 'Question', name: 'Can I do tax-saving and wealth building together?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, by separating tax deductions (80C, 80D) from long-term SIP strategy and running both monthly throughout the year rather than lumping everything at year-end.' } },
      { '@type': 'Question', name: 'When does the new tax regime win over old?', acceptedAnswer: { '@type': 'Answer', text: 'New regime usually wins when your declared deductions are below ₹2L–₹3L combined. If you have HRA, EPF, full 80C, and 80D consistently documented, old regime can still save ₹20,000–₹60,000 at ₹12L–₹20L income.' } }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Tax decision hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India Tax Hub (FY 2025–26): plan monthly, not in March panic</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this is for: salaried employees, dual-income households, and self-employed professionals comparing take-home impact before locking tax-saving products.
          <strong> Costly mistake:</strong> buying ELSS or PPF in March without knowing whether the old regime actually beats the new one for your income band.
        </p>
      </header>

      <IndiaAuthorityNote />

      <HumanJudgmentCallout>
        Most tax-saving mistakes in India are not about choosing the wrong product. They are about timing: deciding in February instead of April, and letting deadline pressure override monthly cashflow math. A plan that works in March panic is rarely the plan that works all year.
      </HumanJudgmentCallout>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Decision framework (India tax)</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li><strong>Pick your regime first:</strong> compare old vs new by April, not February. One wrong pick costs ₹20,000–₹60,000 unnecessarily.</li>
          <li><strong>Map monthly contribution:</strong> divide your annual 80C target (₹1.5L) by 12. If ₹12,500/month feels tight, the plan is fragile.</li>
          <li><strong>Separate deduction from wealth:</strong> 80C fills a tax hole. SIP builds wealth. Run both monthly — do not use one to replace the other.</li>
          <li><strong>Pressure test:</strong> if a bonus delay or medical spend in one month forces you to stop contributions, the plan needs a liquidity buffer first.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹ scenarios: tax planning by salary band</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Salary band</th>
                <th className="px-3 py-2">Likely regime</th>
                <th className="px-3 py-2">Where it fails</th>
                <th className="px-3 py-2">Safer move</th>
              </tr>
            </thead>
            <tbody>
              {salaryScenarios.map((row) => (
                <tr key={row.band} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.band}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.regime}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.whyItFails}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.saferMove}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Good fit for old regime</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            <li>HRA claim is significant and landlord receipt documentation is consistent.</li>
            <li>EPF + 80C fills most of the ₹1.5L limit automatically each month.</li>
            <li>80D (health insurance) adds ₹25,000–₹50,000 in additional deductions.</li>
            <li>Salary is stable — no mid-year job switch breaks the regime eligibility.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-500/30 dark:bg-rose-500/10">
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Bad fit for old regime</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/90 dark:text-rose-100/90">
            <li>Deductions are below ₹2L combined and you are adding investments just to claim.</li>
            <li>Proof documents are inconsistent or unavailable at filing time.</li>
            <li>Monthly cashflow is already stretched and ₹12,500/month for 80C creates pressure.</li>
            <li>You switched jobs mid-year and both employers used different regime assumptions.</li>
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">India tax journey: calculator to execution</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          Start with <Link href="/in/old-vs-new-tax-regime" className="content-link">old vs new regime comparison</Link>, then build monthly 80C through{' '}
          <Link href="/in/80c-deductions" className="content-link">80C planning</Link>, and finally separate tax-saving from wealth-building with{' '}
          <Link href="/in/calculators/sip-calculator" className="content-link">SIP sizing</Link>.
        </p>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          If your plan includes a loan commitment, run an <Link href="/in/calculators/emi-calculator" className="content-link">EMI stress test</Link> before locking tax-saving contributions.
          This prevents a common mismatch where deductions are optimized but monthly cashflow becomes fragile.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Calculator pathways</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.calculators.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Comparison pathways</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.comparisons.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Related deep guides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pathwayLinks.deepGuides.map((item) => (
              <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Where should I start if I am confused about tax planning?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Start with the old vs new regime comparison for your salary band, then build monthly 80C contributions from April rather than doing everything in March. This keeps cashflow predictable and removes year-end panic decisions.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is the biggest tax mistake in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">March panic tax-saving: buying ELSS, PPF, or insurance without knowing whether the old regime saves more, whether your cashflow can absorb it, and whether the products fit your actual investment horizon.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Can I do tax-saving and wealth building together?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Yes. Run 80C contributions monthly (ELSS SIP for long horizon, EPF for stability), then add a separate SIP for goals beyond tax-saving. The two lanes serve different purposes — keeping them separate avoids confusion.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">When does the new tax regime win over old?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">New regime usually wins when declared deductions are below ₹2L–₹3L combined. If HRA, EPF, full 80C, and 80D are consistently documented, old regime can still save ₹20,000–₹60,000 at ₹12L–₹20L income levels.</dd>
          </div>
        </dl>
      </section>
    </section>
  );
}
