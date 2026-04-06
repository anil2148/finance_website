import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Rent vs Buy in India 2026: Mumbai, Bengaluru, Pune Scenario Analysis',
  description: 'Rent vs buy decision framework for India with city-level EMI and rent comparisons, total ownership cost modelling, and rules for who should rent vs buy.',
  pathname: '/in/rent-vs-buy-india'
});

const cityComparisons = [
  {
    city: 'Mumbai (2BHK, mid-range area)',
    rentMonthly: '₹45,000–₹60,000',
    propertyValue: '₹1.2Cr–₹1.8Cr',
    emiRange: '₹84,000–₹1,26,000/month (8.75%, 20y)',
    maintenanceMonthly: '₹8,000–₹15,000',
    totalOwnershipCost: '₹92,000–₹1,41,000/month',
    verdict: 'Renting usually wins financially unless 10+ year stay and strong dual income. Buy only when EMI + costs < 50% of combined take-home.',
  },
  {
    city: 'Bengaluru (2BHK, established area)',
    rentMonthly: '₹30,000–₹45,000',
    propertyValue: '₹80L–₹1.2Cr',
    emiRange: '₹56,000–₹84,000/month',
    maintenanceMonthly: '₹5,000–₹10,000',
    totalOwnershipCost: '₹61,000–₹94,000/month',
    verdict: 'Better rent-vs-buy math than Mumbai. Buying makes sense for stable IT professionals with 7+ year city plan and combined take-home above ₹2.2L.',
  },
  {
    city: 'Pune (2BHK, growing suburb)',
    rentMonthly: '₹22,000–₹35,000',
    propertyValue: '₹55L–₹85L',
    emiRange: '₹38,500–₹59,500/month',
    maintenanceMonthly: '₹3,500–₹7,000',
    totalOwnershipCost: '₹42,000–₹66,500/month',
    verdict: 'Most favorable rent-vs-buy math here. At ₹1.2L–₹1.4L take-home with stable job, buying a ₹65–75L flat can be reasonable with adequate reserve.',
  },
];

const decisionRules = [
  {
    rule: 'Stay horizon rule',
    buyWhen: '5+ year location stability likely — career, family, schooling committed to this city',
    rentWhen: 'Job location may change within 3–4 years, or life situation is still evolving',
    mathBehindIt: 'Stamp duty (5–8%) + registration + brokerage = ₹6L–₹12L on a ₹1Cr property. At 3% annual appreciation, you need 3–4 years just to recover transaction costs.',
  },
  {
    rule: 'Liquidity reserve rule',
    buyWhen: '6 months of core expenses survive intact after down payment, stamp duty, registration, AND estimated interiors',
    rentWhen: 'Down payment wipes out emergency fund or leaves under 2 months of expenses as buffer',
    mathBehindIt: 'A ₹1.2Cr flat in Bengaluru: down payment ₹24L + stamp duty ₹6L + registration ₹1.2L + interiors ₹10L = ₹41.2L upfront. If savings are ₹50L, only ₹8.8L remains — under 3 months for most families.',
  },
  {
    rule: 'EMI-to-income rule',
    buyWhen: 'Total housing cost (EMI + maintenance + property tax) stays below 35% of take-home after +1% rate shock',
    rentWhen: 'Post-shock EMI exceeds 40% of take-home, or plan depends on two incomes without a single-income survival test',
    mathBehindIt: '₹80L loan at 8.75%: EMI = ₹71,100. At 9.75% (rate reset): EMI = ₹75,800. Add ₹8K maintenance = ₹83,800 total. For a ₹2.2L take-home household this is 38% — manageable but tight.',
  },
  {
    rule: 'Opportunity cost rule',
    buyWhen: 'Down payment is a genuine committed surplus, not capital you would otherwise compound in equity',
    rentWhen: 'Down payment is your only savings and equity compounding is the better risk-return tradeoff for your age',
    mathBehindIt: '₹25L down payment at 7% FD: ₹1.75L/year pre-tax. Same ₹25L in equity SIP at 12% avg: ~₹3L/year (not guaranteed). On a ₹1Cr property appreciating at 5%: annual gain = ₹5L — higher, but illiquid.',
  },
];

const whenRentingWins = [
  'You might relocate for better career opportunity within 3–4 years.',
  'Down payment exhausts emergency fund — ownership starts from a fragile position.',
  'Rental yield in your target area is under 3% (overvalued market with poor capital efficiency).',
  'Variable income: rent can be managed; EMI cannot be temporarily reduced.',
  'Current rent is less than 40% of the equivalent total ownership cost.',
];

const whenBuyingWins = [
  '5+ year stay certainty with stable career and family situation.',
  'Dual income household where single-income stress test keeps EMI below 50% of one salary.',
  'Rental market is competitive and rent keeps rising faster than income.',
  'Emergency fund remains intact after all upfront costs — no liquidity exposure.',
  'Post-possession ownership cost is within ₹8,000–₹15,000 of current rent.',
];

export default function RentVsBuyIndiaPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is it better to rent or buy a home in India in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends on stay horizon, liquidity, and income stability. If EMI + ownership costs exceed 40% of take-home, down payment wipes out emergency fund, or stay horizon is under 5 years — renting is financially better. If income is stable, stay is 5+ years, and EMI stays below 35% with reserve intact — buying can be the right decision.',
        },
      },
      {
        '@type': 'Question',
        name: 'If EMI equals rent in India, should I buy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No — not automatically. EMI equals rent is not a buy signal. Total ownership cost is usually 30–60% higher than EMI alone when you add maintenance, stamp duty amortization, interiors, and rate reset risk.',
        },
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Real estate decision guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Rent vs buy in India: use horizon and liquidity rules, not emotion or EMI comparisons</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this is for: first-time buyers deciding whether to rent longer or buy now in Mumbai, Bengaluru, or Pune. <strong>Most important rule:</strong> compare total ownership cost — EMI + maintenance + opportunity cost of down payment — against current rent. Not just EMI.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">City-level rent vs total ownership cost (2BHK, 2026)</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Total ownership cost = EMI + monthly maintenance. Does not include interiors, stamp duty amortization, or rate reset impact — add those for full picture.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2">Monthly rent</th>
                <th className="px-3 py-2">Property value</th>
                <th className="px-3 py-2">EMI (20y @ 8.75%)</th>
                <th className="px-3 py-2">Total ownership cost</th>
                <th className="px-3 py-2">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {cityComparisons.map((row) => (
                <tr key={row.city} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.city}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.rentMonthly}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.propertyValue}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.emiRange}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.totalOwnershipCost}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Property values and rents are indicative ranges based on publicly available market data. Verify with current listings before making any decision.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Four decision rules with the math behind each</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {decisionRules.map((item) => (
            <article key={item.rule} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.rule}</h3>
              <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200"><span className="font-medium">Buy when:</span> {item.buyWhen}</p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200"><span className="font-medium">Rent when:</span> {item.rentWhen}</p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400"><span className="font-medium">Math:</span> {item.mathBehindIt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-500/30 dark:bg-blue-500/10">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">When renting wins financially</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-900/90 dark:text-blue-100/90">
            {whenRentingWins.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">When buying makes sense</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            {whenBuyingWins.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Real scenario: ₹1.3L take-home couple in Bengaluru</h2>
        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-100/90">
          Combined take-home: ₹1.3L. Current rent for 2BHK: ₹32,000. Considering a ₹85L flat in Whitefield.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900/90 dark:text-amber-100/90">
          <li>Down payment 20%: ₹17L. Stamp duty (~5.6%): ₹4.76L. Interiors estimate: ₹9L. Total upfront: ₹30.76L.</li>
          <li>Current savings: ₹35L. After all upfront costs: ₹4.24L left (about 1.4 months expenses). <strong>Dangerously thin emergency buffer.</strong></li>
          <li>EMI on ₹68L for 20y @ 8.75%: ₹60,500 + ₹7,000 maintenance = ₹67,500/month (52% of take-home). <strong>Too high.</strong></li>
          <li><strong>Better approach:</strong> Wait 14 months. Save ₹10L more. Down payment becomes ₹27L, loan ₹58L, EMI ₹51,600 (39.7%). Interiors funded. Reserve ₹8L intact.</li>
          <li>Extra rent over 14 months: ₹32K × 14 = ₹4.48L. Avoids a structurally fragile first year of ownership. Well worth waiting.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Is it better to rent or buy in India in 2026?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Depends on stay horizon, liquidity, and income. Rent if EMI + costs exceed 40% of take-home, down payment wipes out emergency fund, or horizon is under 5 years. Buy if income is stable, stay is 5+ years, EMI below 35% with reserve intact, and upfront costs including interiors do not deplete emergency savings.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">If EMI equals rent in India, should I buy?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">No. EMI equals rent is not a buy signal. Add maintenance (₹4K–₹15K/month), stamp duty amortization, interiors, rate reset risk, and opportunity cost of down payment. Total ownership cost is typically 30–60% higher than EMI alone.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Complete the real estate decision</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link className="content-link-chip" href="/in/real-estate">Real-estate hub: full buy workflow</Link>
          <Link className="content-link-chip" href="/in/home-affordability-india">Home affordability checker</Link>
          <Link className="content-link-chip" href="/in/home-loan-interest-rates-india">Home loan rates comparison</Link>
          <Link className="content-link-chip" href="/in/loans">India Loans Hub</Link>
          <Link className="content-link-chip" href="/in/calculators/emi-calculator">EMI stress test (+1% rate shock)</Link>
          <Link className="content-link-chip" href="/in/calculators/sip-calculator">Opportunity cost of down payment</Link>
        </div>
      </section>
    </article>
  );
}
