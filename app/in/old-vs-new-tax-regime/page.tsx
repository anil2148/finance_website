import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Old vs New Tax Regime India (FY 2025-26): Decision Guide by Salary Band',
  description: 'Compare old and new tax regimes with real salary examples, deduction thresholds, and actionable regime-choice logic for ₹8L to ₹30L earners.',
  pathname: '/in/old-vs-new-tax-regime'
});

const salaryComparisons = [
  {
    salary: '₹8,00,000',
    oldRegimeTax: '~₹46,800',
    newRegimeTax: '~₹20,000',
    verdict: 'New regime wins in most cases',
    why: 'Standard deduction (₹75,000) and no HRA/80C typically mean deductions stay below ₹2L. New rates are lower and the math rarely tilts back.',
    exception: 'If EPF, full ₹1.5L 80C, and ₹25,000 80D are consistently claimed, old regime can save ₹5,000–₹12,000. Calculate before deciding.',
  },
  {
    salary: '₹12,00,000',
    oldRegimeTax: '~₹1,17,000 (without deductions)',
    newRegimeTax: '~₹83,200',
    verdict: 'New regime is default; old only wins with disciplined deductions',
    why: 'Old regime saves if HRA + EPF + full 80C + 80D together cross ₹4L–₹5L in actual, documented deductions. At ₹12L, the break-even deduction threshold is roughly ₹3.75L.',
    exception: 'Mid-year job switch resets some deduction claims and can break the old-regime advantage unless you track declarations across both employers.',
  },
  {
    salary: '₹18,00,000',
    oldRegimeTax: '~₹2,73,000 (without deductions)',
    newRegimeTax: '~₹2,08,000',
    verdict: 'Old regime wins if fully executed — saves ₹30,000–₹65,000',
    why: 'At this band, HRA (city-dependent), EPF, full 80C, and 80D together often push deductions well above the break-even point. Home-loan interest under Section 24 adds another ₹2L deduction for buyers.',
    exception: 'Only works if deductions are systematic and documented from April, not assembled in March.',
  },
  {
    salary: '₹25,00,000+',
    oldRegimeTax: 'Varies; deductions save ₹60,000–₹1,20,000',
    newRegimeTax: '~₹5,20,000',
    verdict: 'Requires deliberate modelling — old regime can still win but complexity rises',
    why: 'At ₹25L+, surcharge and cess layers interact with deduction limits. Old regime advantages persist if home-loan deductions (₹2L interest), HRA, full 80C, 80D, and NPS (Section 80CCD) are all in play.',
    exception: 'New regime is simpler and removes the need for proof management. For high earners who value simplicity over ₹60K–₹1.2L annual saving, new regime is defensible.',
  },
];

const regimeChecklist = {
  oldRegimeGoodFit: [
    'HRA claim is significant and rent receipts are consistently collected from landlord.',
    'EPF contribution fills most of your ₹1.5L 80C limit automatically each month.',
    'Health insurance premium generates ₹25,000–₹50,000 in 80D deduction.',
    'Home-loan interest claim (Section 24) adds ₹1.5L–₹2L more deduction.',
    'Annual income is stable — no mid-year job switch disrupts deduction declarations.',
    'You can automate ₹12,500/month for 80C from April without cashflow pressure.',
  ],
  newRegimeBetterFit: [
    'Deductions below ₹2.5L combined — old regime savings are marginal (under ₹8,000/year).',
    'Freelancer or variable-income earner: HRA not applicable and 80C requires discipline.',
    'You switched jobs mid-year and both employers used different regime assumptions.',
    'Monthly cashflow is stretched — ₹12,500/month for 80C would create pressure.',
    'You value simplicity and want fewer declarations, proofs, and year-end decisions.',
  ],
};

const switchingMistakes = [
  {
    mistake: 'Choosing old regime in April without calculating deductions',
    cost: 'Lock yourself into a regime that saves ₹0 extra because deductions never reached break-even.',
    fix: 'Run a simple calculator: if (HRA + EPF + 80C + 80D + Home-loan interest) < ₹3L at ₹12L salary, new regime almost certainly wins.',
  },
  {
    mistake: 'Switching regimes mid-year via new employer',
    cost: 'Tax calculated twice under different assumptions. Higher TDS deducted in one employer or refund complications at filing.',
    fix: 'Lock your regime with Employer 1 by April and maintain the same choice with Employer 2 in the same financial year.',
  },
  {
    mistake: 'March panic: investing in ELSS or PPF just to justify old regime',
    cost: 'Strains monthly cashflow and allocates money to products that may not match your investment horizon.',
    fix: 'If you cannot invest ₹12,500/month from April, old regime\'s ₹1.5L 80C benefit is funded by cashflow damage — not a real saving.',
  },
  {
    mistake: 'Ignoring surcharge changes in FY 2025-26 for ₹50L+ earners',
    cost: 'Effective tax rate changes due to reduced surcharge cap under new regime.',
    fix: 'At ₹50L–₹5Cr income, the new regime\'s 25% surcharge cap vs old regime\'s 37% creates a material difference. High earners should compute both post-surcharge.',
  },
];

export default function RegimePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'When does old tax regime beat new tax regime in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Old regime beats new regime when your documented deductions (HRA + EPF + 80C + 80D + home-loan interest) exceed the break-even threshold for your salary band — roughly ₹3.75L at ₹12L, ₹4.5L at ₹18L. Calculate before locking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I switch between old and new tax regime every year?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Salaried employees can switch each year. Self-employed and business income taxpayers can switch only once — after opting out of new regime, they cannot return to it for subsequent years.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the new tax regime better for ₹8L salary?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, in most cases. At ₹8L, the new regime saves ₹20,000–₹30,000 in tax unless you have substantial HRA, full 80C, and 80D deductions — which together need to exceed ₹2.5L to make old regime competitive.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the standard deduction under new tax regime for FY 2025-26?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The standard deduction for salaried employees under the new tax regime is ₹75,000 for FY 2025-26, increased from ₹50,000 in FY 2023-24.',
        },
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Tax decision guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Old vs new tax regime India (FY 2025–26): choose with actual deduction math</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this is for: salaried employees and freelancers deciding which regime to lock for FY 2025–26. <strong>Most important rule:</strong> do not choose old regime without calculating whether your actual, documentable deductions exceed the break-even threshold for your salary band.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tax regime comparison by salary band (FY 2025–26)</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Illustrative tax figures assuming standard deduction only for new regime. Old regime calculated with typical documented deductions.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Salary</th>
                <th className="px-3 py-2">Old regime tax</th>
                <th className="px-3 py-2">New regime tax</th>
                <th className="px-3 py-2">Verdict</th>
                <th className="px-3 py-2">Exception / when it flips</th>
              </tr>
            </thead>
            <tbody>
              {salaryComparisons.map((row) => (
                <tr key={row.salary} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.salary}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.oldRegimeTax}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.newRegimeTax}</td>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.verdict}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.exception}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Tax figures are illustrative estimates using FY 2025–26 slabs. Include surcharge, cess, and actual deductions before making a final decision.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Good fit for old regime</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            {regimeChecklist.oldRegimeGoodFit.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-500/30 dark:bg-blue-500/10">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">New regime is the better fit</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-900/90 dark:text-blue-100/90">
            {regimeChecklist.newRegimeBetterFit.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 dark:border-rose-500/30 dark:bg-rose-500/10">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Four mistakes that cost ₹10,000–₹80,000 in unnecessary tax</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {switchingMistakes.map((item) => (
            <article key={item.mistake} className="rounded-xl border border-rose-300 bg-white p-4 dark:border-rose-500/40 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">{item.mistake}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Cost:</strong> {item.cost}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Fix:</strong> {item.fix}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Break-even deduction threshold by salary</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Old regime beats new regime only when your <strong>total declared deductions exceed these approximate thresholds</strong> (FY 2025–26, salaried individuals):
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2 text-left">Annual salary</th>
                <th className="px-3 py-2 text-left">Break-even deductions needed</th>
                <th className="px-3 py-2 text-left">Common deduction sources to check</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹8L</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹2.5L</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">HRA + full 80C + 80D — only viable if all three are consistent</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹12L</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹3.75L</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">HRA + EPF + 80C + 80D — achievable for metro renters with employer EPF</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹18L</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹4.5L</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">HRA + full 80C + 80D + home-loan interest (Section 24) + NPS employer</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">₹25L+</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">~₹5.5L+</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Same as above plus Section 80CCD NPS additional ₹50,000; surcharge cap matters</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">A real scenario: ₹15L salaried employee in Bengaluru</h2>
        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-100/90">
          Priya earns ₹15L and rents in Bengaluru (HRA: ₹1.2L). Her EPF contribution fills ₹65,000 of 80C. She pays health insurance: ₹18,000. No home loan.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900/90 dark:text-amber-100/90">
          <li>Total potential deductions: ₹1.2L (HRA) + ₹65K (EPF) + ₹85K (additional 80C to fill limit) + ₹18K (80D) = ₹3.68L</li>
          <li>Break-even at ₹15L salary: ~₹4.1L</li>
          <li><strong>Verdict:</strong> Priya's deductions (₹3.68L) fall short of the break-even (₹4.1L) by ~₹42,000. New regime saves her ~₹9,000 in this example.</li>
          <li>If she tops up 80C by ₹85,000 more via NPS or ELSS to reach ₹4.1L deductions, old regime becomes marginally equal. Not worth it unless NPS fits her goals.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">When does old tax regime beat new tax regime in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Old regime beats new regime when your documented deductions (HRA + EPF + 80C + 80D + home-loan interest) exceed the break-even threshold for your salary band — roughly ₹3.75L at ₹12L, ₹4.5L at ₹18L. Calculate before locking.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Can I switch between old and new tax regime every year?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Salaried employees can switch each year. Self-employed and business income taxpayers can switch only once — after opting out of new regime, they cannot return for subsequent years.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is the standard deduction under the new tax regime for FY 2025-26?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">₹75,000 for salaried employees under the new tax regime for FY 2025-26, increased from ₹50,000 in prior years.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Next decision path</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Once you have locked your regime, these are the natural next steps:</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">If you chose old regime</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li><Link href="/in/80c-deductions" className="content-link">Build monthly 80C contribution plan</Link> — divide ₹1.5L by 12 and automate from April.</li>
              <li><Link href="/in/tax-saving-strategies" className="content-link">Tax-saving strategies by salary band</Link> — ELSS vs PPF vs NPS allocation logic.</li>
              <li><Link href="/in/calculators/sip-calculator" className="content-link">SIP calculator</Link> — model post-deduction surplus allocation.</li>
            </ul>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">If you chose new regime</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li><Link href="/in/sip-strategy-india" className="content-link">SIP strategy India</Link> — invest the tax savings into a systematic wealth-building plan.</li>
              <li><Link href="/in/best-investment-apps-india" className="content-link">Investment app comparison</Link> — pick the right platform for your SIP allocation.</li>
              <li><Link href="/in/tax" className="content-link">India Tax Hub</Link> — see full monthly cashflow planning framework.</li>
            </ul>
          </article>
        </div>
      </section>
    </article>
  );
}
