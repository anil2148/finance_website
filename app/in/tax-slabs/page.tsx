import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Tax Slabs FY 2025-26: New and Old Regime Rates, Take-Home Examples',
  description: 'India tax slabs for FY 2025-26 with new and old regime rates, real take-home salary examples at ₹8L, ₹15L, and ₹25L, and actionable planning links.',
  pathname: '/in/tax-slabs'
});

const newRegimeSlabs = [
  { range: 'Up to ₹3,00,000', rate: 'Nil', note: 'Fully exempt' },
  { range: '₹3,00,001 – ₹7,00,000', rate: '5%', note: 'Rebate u/s 87A: no tax if total income ≤ ₹7L' },
  { range: '₹7,00,001 – ₹10,00,000', rate: '10%', note: '' },
  { range: '₹10,00,001 – ₹12,00,000', rate: '15%', note: '' },
  { range: '₹12,00,001 – ₹15,00,000', rate: '20%', note: '' },
  { range: 'Above ₹15,00,000', rate: '30%', note: '+4% health and education cess on total tax' },
];

const oldRegimeSlabs = [
  { range: 'Up to ₹2,50,000', rate: 'Nil', note: '' },
  { range: '₹2,50,001 – ₹5,00,000', rate: '5%', note: 'Rebate u/s 87A: no tax if total income ≤ ₹5L' },
  { range: '₹5,00,001 – ₹10,00,000', rate: '20%', note: '' },
  { range: 'Above ₹10,00,000', rate: '30%', note: '+4% health and education cess on total tax' },
];

const takeHomeExamples = [
  {
    salary: '₹8,00,000',
    newRegimeTax: '~₹20,000–₹25,000',
    oldRegimeTaxFull: '~₹46,800 (without deductions)',
    oldRegimeWithDeductions: '~₹25,000–₹35,000 (with HRA + EPF + 80C + 80D)',
    recommendedRegime: 'New regime for most employees at this band',
    monthlyTakeHome: '~₹55,000–₹60,000',
    planningNote: 'Focus on emergency fund before maximizing 80C. New regime lowers TDS and improves monthly cashflow.',
  },
  {
    salary: '₹12,00,000',
    newRegimeTax: '~₹83,200',
    oldRegimeTaxFull: '~₹1,17,000 (without deductions)',
    oldRegimeWithDeductions: '~₹60,000–₹80,000 (with HRA + EPF + full 80C + 80D)',
    recommendedRegime: 'Compare — old regime can save ₹20,000–₹30,000 with consistent documentation',
    monthlyTakeHome: '~₹83,000–₹93,000',
    planningNote: 'The break-even deduction threshold at ₹12L is ~₹3.75L. Calculate before locking regime.',
  },
  {
    salary: '₹18,00,000',
    newRegimeTax: '~₹2,08,000',
    oldRegimeTaxFull: '~₹2,73,000 (without deductions)',
    oldRegimeWithDeductions: '~₹1,48,000–₹1,80,000 (with home loan, HRA, full 80C, 80D)',
    recommendedRegime: 'Old regime typically wins — saves ₹30,000–₹60,000 if fully executed from April',
    monthlyTakeHome: '~₹1,30,000–₹1,45,000',
    planningNote: 'Home-loan interest Section 24 (₹2L) is the most impactful deduction at this band. Add NPS for extra ₹50K.',
  },
  {
    salary: '₹25,00,000',
    newRegimeTax: '~₹5,20,000',
    oldRegimeTaxFull: '~₹5,85,000 (without deductions)',
    oldRegimeWithDeductions: '~₹4,35,000–₹4,75,000 (with all deductions, home loan, NPS)',
    recommendedRegime: 'Old regime wins with full deductions — saves ₹60,000–₹1,20,000',
    monthlyTakeHome: '~₹1,55,000–₹1,70,000',
    planningNote: 'Surcharge cap at 25% under new regime benefits incomes above ₹50L. Below ₹50L, old regime with deductions usually wins.',
  },
];

const keyChanges2026 = [
  {
    change: 'Standard deduction raised to ₹75,000',
    impact: 'Salaried employees under new regime automatically get ₹75K off taxable income (up from ₹50K).',
    who: 'All salaried employees under new regime',
  },
  {
    change: 'Rebate u/s 87A raised to ₹7L under new regime',
    impact: 'If total taxable income ≤ ₹7L under new regime, tax liability = ₹0. Effective zero-tax income up to ₹7.75L with standard deduction.',
    who: 'Lower-income salaried employees and students with income under ₹7L',
  },
  {
    change: 'New regime becomes the default',
    impact: 'If you do not explicitly opt for old regime with your employer by the declared deadline, TDS is calculated under new regime.',
    who: 'All salaried employees — critical to submit Form 10-IEA if you want old regime',
  },
  {
    change: 'LTCG exemption threshold raised to ₹1.25L',
    impact: 'Long-term capital gains from equity up to ₹1.25L/year are now exempt (up from ₹1L). Gains beyond taxed at 12.5%.',
    who: 'Mutual fund and equity investors with ELSS/SIP redemptions',
  },
];

export default function TaxSlabsPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the new tax regime slabs for FY 2025-26 in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'New tax regime slabs for FY 2025-26: Nil up to ₹3L, 5% for ₹3L–₹7L (with 87A rebate making income up to ₹7L tax-free), 10% for ₹7L–₹10L, 15% for ₹10L–₹12L, 20% for ₹12L–₹15L, and 30% above ₹15L. Plus 4% cess on total tax. Standard deduction of ₹75,000 applies for salaried employees.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the zero tax income limit in India for FY 2025-26?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Under the new tax regime: income up to ₹7L is fully exempt via Section 87A rebate. With the ₹75,000 standard deduction for salaried employees, effective zero-tax gross salary is up to ₹7,75,000. Under old regime: rebate up to ₹5L total income.',
        },
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Tax reference guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India tax slabs FY 2025–26: new regime vs old regime with real salary examples</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Salaried employees comparing take-home impact at ₹8L, ₹12L, ₹18L, and ₹25L — with key FY 2025–26 changes including the raised standard deduction and ₹7L zero-tax threshold under new regime.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">New tax regime slabs (FY 2025–26) — default regime</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Income range</th>
                <th className="px-3 py-2">Tax rate</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {newRegimeSlabs.map((row) => (
                <tr key={row.range} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.range}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.rate}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Standard deduction: ₹75,000 for salaried employees under new regime. Effective zero-tax for gross salary up to ₹7,75,000.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Old tax regime slabs (FY 2025–26)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Income range</th>
                <th className="px-3 py-2">Tax rate</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {oldRegimeSlabs.map((row) => (
                <tr key={row.range} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.range}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.rate}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Old regime allows deductions under 80C (₹1.5L), 80D, HRA, home-loan interest (Section 24), NPS, and more. Higher rates but deductions can significantly reduce taxable income.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Take-home salary examples at common income levels</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Annual salary</th>
                <th className="px-3 py-2">New regime tax</th>
                <th className="px-3 py-2">Old regime (no deductions)</th>
                <th className="px-3 py-2">Old regime (with deductions)</th>
                <th className="px-3 py-2">Recommended regime</th>
                <th className="px-3 py-2">Planning note</th>
              </tr>
            </thead>
            <tbody>
              {takeHomeExamples.map((row) => (
                <tr key={row.salary} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.salary}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.newRegimeTax}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.oldRegimeTaxFull}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.oldRegimeWithDeductions}</td>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100 text-xs">{row.recommendedRegime}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.planningNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Tax figures are illustrative. Include surcharge (if applicable) and compute exactly with actual deduction proofs before submitting employer declaration.</p>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-500/30 dark:bg-blue-500/10">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Key FY 2025–26 changes that affect your tax</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {keyChanges2026.map((change) => (
            <article key={change.change} className="rounded-xl border border-blue-200 bg-white p-4 dark:border-blue-500/30 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">{change.change}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{change.impact}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400"><span className="font-medium">Affects:</span> {change.who}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What are the new tax regime slabs for FY 2025-26 in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">New regime: Nil up to ₹3L → 5% for ₹3L–₹7L (rebate u/s 87A makes income up to ₹7L effectively tax-free) → 10% for ₹7L–₹10L → 15% for ₹10L–₹12L → 20% for ₹12L–₹15L → 30% above ₹15L. Plus 4% cess. Standard deduction ₹75,000 for salaried employees.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is the zero-tax income limit in India for FY 2025-26?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">New regime: gross salary up to ₹7,75,000 is effectively zero-tax (₹75K standard deduction + ₹7L rebate threshold). Old regime: ₹5L total income or less after deductions.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Plan your taxes</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/in/old-vs-new-tax-regime" className="content-link-chip">Old vs new regime decision guide</Link>
          <Link href="/in/80c-deductions" className="content-link-chip">80C and 80D deduction guide</Link>
          <Link href="/in/tax-saving-strategies" className="content-link-chip">Tax-saving strategies by salary band</Link>
          <Link href="/in/tax" className="content-link-chip">India Tax Hub</Link>
          <Link href="/in/calculators/sip-calculator" className="content-link-chip">SIP calculator</Link>
          <Link href="/in/best-investment-apps-india" className="content-link-chip">Investment app comparison</Link>
        </div>
      </section>
    </article>
  );
}
