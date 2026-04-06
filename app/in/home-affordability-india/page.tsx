import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Home Affordability India 2026: Salary to Budget Rules, EMI Limits, and Reserve Thresholds',
  description: 'Practical home affordability guide for India with salary-band EMI ceilings, total ownership cost modelling, stress-test examples, and who should wait before buying.',
  pathname: '/in/home-affordability-india'
});

const affordabilityTable = [
  {
    takeHome: '₹70,000/month',
    safeEMICeiling: '₹21,000–₹24,500/month (30–35%)',
    illustrativeLoan: '~₹25–₹30 lakh',
    minReserveNeeded: '₹2.5L–₹3.5L (6 months expenses ~₹42K)',
    note: 'At this take-home, a ₹30L loan at 8.75% for 20 years = EMI ~₹26,600 (38%). Too tight without other adjustments.',
  },
  {
    takeHome: '₹1,00,000/month',
    safeEMICeiling: '₹28,000–₹35,000/month (28–35%)',
    illustrativeLoan: '~₹33–₹41 lakh',
    minReserveNeeded: '₹3.6L–₹4.5L (6 months expenses ~₹60K)',
    note: 'At ₹1L take-home, a ₹38L loan for 20 years @ 8.75% = EMI ~₹33,700 (33.7%). Workable if fixed costs are controlled.',
  },
  {
    takeHome: '₹1,50,000/month',
    safeEMICeiling: '₹45,000–₹52,500/month (30–35%)',
    illustrativeLoan: '~₹53–₹62 lakh',
    minReserveNeeded: '₹5.4L–₹6.5L (6 months expenses ~₹90K)',
    note: 'A ₹60L loan for 20 years @ 8.75% = EMI ~₹53,300 (35.5%). At the edge of the safe range. Dual income strongly preferred.',
  },
  {
    takeHome: '₹2,00,000/month',
    safeEMICeiling: '₹60,000–₹70,000/month (30–35%)',
    illustrativeLoan: '~₹70–₹83 lakh',
    minReserveNeeded: '₹7.2L–₹9L (6 months expenses ~₹1.2L)',
    note: 'Allows more flexibility but post-possession cost stack (maintenance + interiors + kids) must be modelled before committing.',
  },
];

const totalCostItems = [
  {
    item: 'Down payment',
    typical: '10–20% of property value',
    example: '₹7L–₹14L on a ₹70L property',
    trap: 'Maximizing down payment and leaving zero emergency buffer. Keep 6 months expenses intact after this payment.',
  },
  {
    item: 'Stamp duty + registration',
    typical: '5–8% of property value (state-dependent)',
    example: '₹3.5L–₹5.6L on a ₹70L property in most metros',
    trap: 'Often not modelled in property website EMI calculators. Add this before calculating remaining buffer.',
  },
  {
    item: 'Interiors and furnishing',
    typical: '₹5L–₹20L for a new flat (bare shell vs semi-furnished)',
    example: '₹8L–₹12L for a 2BHK — kitchen + wardrobes + flooring minimum',
    trap: 'Most buyers underestimate by 30–50%. Ask for a genuine quote before possession, not an average.',
  },
  {
    item: 'Monthly maintenance',
    typical: '₹2,000–₹10,000/month depending on project',
    example: '₹4,000–₹8,000/month for a gated community with amenities',
    trap: 'Add this to EMI before comparing with rent. ₹50,000 EMI + ₹8,000 maintenance = ₹58,000 total monthly ownership cost.',
  },
  {
    item: 'Rate reset exposure (floating rate)',
    typical: '+0.5% to +1.5% rate rise scenario',
    example: 'A ₹60L loan at 8.75% = EMI ₹53,300. At 9.75%, EMI = ₹56,900 (+₹3,600/month).',
    trap: 'Most buyers model only current EMI. Model EMI at +1% before deciding if the loan is affordable.',
  },
];

const waitOrBuyScenarios = [
  {
    situation: 'Emergency fund wiped out after down payment',
    signal: 'After down payment + stamp duty + registration, savings fall below 3 months expenses',
    verdict: 'Wait',
    reason: 'Any medical, car, or job expense in year one creates a crisis. Home ownership becomes a stressor, not security. Build reserve first.',
    timeline: 'Wait 12–18 months to rebuild buffer before booking.',
  },
  {
    situation: 'EMI + ownership costs exceed 40% of take-home',
    signal: 'EMI + maintenance + property tax exceeds 40% of monthly in-hand income',
    verdict: 'Downsize or wait',
    reason: 'At 40%+, a single bad month (medical, delayed salary, bonus miss) forces card rollover or missed EMI. Rate reset pushes it further.',
    timeline: 'Buy a smaller property, increase down payment, or wait for income to grow 15–20%.',
  },
  {
    situation: 'Stay horizon is under 4 years',
    signal: 'Job location is uncertain, relocation likely within 3–5 years, or life situation unclear',
    verdict: 'Rent',
    reason: 'Stamp duty + registration alone is 5–8%. Add brokerage and STCG tax if selling early. A ₹70L home needs ₹5.5L appreciation just to break even on transaction costs.',
    timeline: 'Rent until 5+ year location confidence is established.',
  },
  {
    situation: 'Dual income, stable career, 5+ year city plan',
    signal: 'EMI stays below 30–35% on combined income, reserve intact, interiors budgeted',
    verdict: 'Good time to buy',
    reason: 'Dual income cushions rate resets and one-income months. Long stay horizon means appreciation works in your favour.',
    timeline: 'Proceed, but run single-income EMI stress test before signing.',
  },
];

export default function HomeAffordabilityIndiaPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much home loan can I afford on ₹1 lakh monthly salary in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'With ₹1 lakh monthly take-home, a safe EMI ceiling is ₹28,000–₹35,000 (28–35%). At 8.75% for 20 years, this corresponds to a loan of approximately ₹33L–₹41L. Above this, one-income months or rate resets become financially dangerous.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the total cost of buying a home in India beyond EMI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Beyond EMI, total ownership costs include: stamp duty and registration (5–8% of property value), interiors (₹5L–₹20L for a 2BHK), monthly maintenance (₹2,000–₹10,000), property tax, and rate reset risk on floating-rate loans. Model all these before comparing buying vs renting.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I maximize down payment or keep emergency reserves?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Keep emergency reserves. A larger down payment reduces EMI but leaves you exposed if a medical expense, car repair, or income gap hits in year one. The rule: 6 months of core household expenses must survive intact after paying all booking costs including stamp duty and registration.',
        },
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Real estate decision guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Home affordability India: set your budget before visiting any property</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this is for: buyers converting monthly income and savings into a realistic purchase budget. <strong>Core rule:</strong> total monthly housing cost (EMI + maintenance + property tax) should stay below 35% of take-home, and 6 months of core expenses must survive intact after all booking costs.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">EMI ceiling and loan size by take-home salary</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Illustrative at 8.75% floating rate, 20-year tenure. Actual EMI depends on rate type, tenure, and down payment.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Monthly take-home</th>
                <th className="px-3 py-2">Safe EMI ceiling</th>
                <th className="px-3 py-2">Illustrative loan size</th>
                <th className="px-3 py-2">Min emergency reserve after booking</th>
                <th className="px-3 py-2">Reality note</th>
              </tr>
            </thead>
            <tbody>
              {affordabilityTable.map((row) => (
                <tr key={row.takeHome} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.takeHome}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.safeEMICeiling}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.illustrativeLoan}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.minReserveNeeded}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">EMI figures are indicative. Verify using the <Link href="/in/calculators/emi-calculator" className="content-link">EMI calculator</Link> with your actual rate, tenure, and loan amount.</p>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 dark:border-rose-500/30 dark:bg-rose-500/10">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Total ownership cost: what most budgets miss</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {totalCostItems.map((item) => (
            <article key={item.item} className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-500/40 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.item}</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Typical:</span> {item.typical}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Example:</span> {item.example}</p>
              <p className="mt-2 text-xs text-rose-800 dark:text-rose-200"><span className="font-semibold">Common trap:</span> {item.trap}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Buy now or wait? Decision framework by situation</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {waitOrBuyScenarios.map((scenario) => (
            <article key={scenario.situation} className={`rounded-xl border p-4 ${scenario.verdict === 'Wait' || scenario.verdict === 'Downsize or wait' || scenario.verdict === 'Rent' ? 'border-amber-200 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/10' : 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'}`}>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${scenario.verdict === 'Good time to buy' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>{scenario.verdict}</span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{scenario.situation}</h3>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400"><span className="font-medium">Signal:</span> {scenario.signal}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{scenario.reason}</p>
              <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">{scenario.timeline}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">₹1.5L salary family: affordability worked example</h2>
        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-100/90">
          The Sharma family has a combined take-home of ₹1.5L. They are looking at a ₹75L property in Pune, putting ₹15L down and taking a ₹60L loan.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900/90 dark:text-amber-100/90">
          <li>EMI at 8.75% for 20 years: ₹53,300/month (35.5% of take-home — at the ceiling)</li>
          <li>Stamp duty (5%): ₹3.75L + Registration: ₹0.9L = ₹4.65L additional upfront costs</li>
          <li>Interiors estimate for semi-furnished 2BHK: ₹9L over 6 months post-possession</li>
          <li>Monthly maintenance: ₹6,000/month → total housing cost = ₹59,300/month (39.5%)</li>
          <li>Emergency reserve after all payments: ₹1.85L — less than 2 months expenses. <strong>Too thin.</strong></li>
          <li><strong>Better scenario:</strong> wait 10 months, save ₹7L more → down payment becomes ₹22L → loan reduces to ₹53L → EMI ₹47,300 (31.5%). Interiors funded without personal loan risk.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How much home loan can I afford on ₹1 lakh monthly salary in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">With ₹1L monthly take-home, a safe EMI ceiling is ₹28,000–₹35,000 (28–35% of income). At 8.75% for 20 years, this corresponds to a loan of ₹33L–₹41L. Beyond this, rate resets and one-income months become dangerous.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Should I maximize down payment or keep emergency reserves?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Always keep emergency reserves. The rule: 6 months of core household expenses must survive intact after paying down payment, stamp duty, registration, and estimated interiors. A lower down payment with intact emergency fund is safer than maximized down payment with empty savings.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is the total cost of buying a home in India beyond EMI?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Total ownership costs include stamp duty and registration (5–8% of property value), interiors (₹5L–₹20L for 2BHK), monthly maintenance (₹2K–₹10K), property tax, and rate reset risk. Model all these before comparing buying vs renting.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Related real estate decisions</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/in/real-estate" className="content-link-chip">India Real Estate Hub</Link>
          <Link href="/in/rent-vs-buy-india" className="content-link-chip">Rent vs buy comparison</Link>
          <Link href="/in/home-loan-interest-rates-india" className="content-link-chip">Home loan rates comparison</Link>
          <Link href="/in/loans" className="content-link-chip">India Loans Hub</Link>
          <Link href="/in/calculators/emi-calculator" className="content-link-chip">EMI calculator with rate shock</Link>
          <Link href="/in/personal-loan-comparison-india" className="content-link-chip">Personal loan comparison</Link>
        </div>
      </section>
    </article>
  );
}
