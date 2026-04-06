import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Tax Saving Strategies by Salary Band: ₹8L, ₹15L, ₹25L Playbooks',
  description: 'Actionable India tax-saving framework by salary band: 80C/80D/NPS/EPF trade-offs, monthly contribution plans, and product selection logic for FY 2025-26.',
  pathname: '/in/tax-saving-strategies'
});

const bandStrategies = [
  {
    band: '₹8,00,000 annual salary',
    takeHome: '~₹57,000/month',
    regimeAdvice: 'New regime usually wins unless deductions exceed ₹2.5L',
    strategy: [
      'EPF auto-fills ~₹4,800/month of your 80C limit — do not double-invest.',
      'Add health insurance premium (₹1,500–₹2,000/month) for 80D benefit of ₹18,000–₹25,000.',
      'If choosing old regime: ELSS SIP ₹4,000–₹5,000/month fills remaining 80C gap.',
      'Keep emergency buffer (₹1.5L–₹2L) before maximizing 80C investments.',
      'A flat SIP ₹5,000/month for non-80C wealth building on top.',
    ],
    annualTaxSaving: 'Old regime vs new: ₹3,000–₹12,000 depending on deduction consistency',
    biggestRisk: 'Choosing old regime without actually reaching ₹2.5L deduction threshold — ends up paying more admin cost than tax saved.',
  },
  {
    band: '₹15,00,000 annual salary',
    takeHome: '~₹1,00,000/month',
    regimeAdvice: 'Compare both — old regime wins only with HRA + full 80C + 80D + possible home-loan interest',
    strategy: [
      'EPF auto-fills ~₹9,000/month of 80C — confirm with payroll statement.',
      'Top up remaining 80C (~₹40,000/year) with ELSS SIP ₹3,500/month or PPF if liquidity is not needed for 15 years.',
      'Health insurance for self + family: ₹2,000–₹3,500/month covers ₹25,000–₹35,000 in 80D.',
      'If renting in metro: HRA deduction can add ₹1L–₹1.8L; collect rent receipts monthly.',
      'Consider NPS 80CCD(1B) contribution: ₹4,200/month unlocks extra ₹50,000 deduction — saves ~₹15,600 at 30% bracket.',
    ],
    annualTaxSaving: 'Old regime fully executed: saves ₹25,000–₹50,000 over new regime at this band',
    biggestRisk: 'Over-investing in 80C instruments at the cost of emergency liquidity or medium-term goal funds.',
  },
  {
    band: '₹25,00,000+ annual salary',
    takeHome: '~₹1,60,000/month',
    regimeAdvice: 'Old regime typically wins significantly; needs systematic execution from April',
    strategy: [
      'Separate wealth-building SIP (₹30,000–₹50,000/month) from tax-saving deduction investments — they serve different purposes.',
      'EPF may fill most of 80C limit; allocate any remaining to PPF for guaranteed component.',
      'Maximize NPS 80CCD(1B): ₹50,000 additional deduction saves ~₹15,600 in tax (30% bracket) with long-term retirement compounding.',
      'Employer NPS contribution (Section 80CCD(2)) up to 10% of basic salary is deductible even under new regime — verify with HR.',
      'Health insurance for family including parents (senior citizen): total 80D can reach ₹75,000.',
      'Home-loan interest Section 24: up to ₹2L deductible under old regime for self-occupied property.',
    ],
    annualTaxSaving: 'Old regime vs new: ₹60,000–₹1,20,000+ depending on home loan and full deduction execution',
    biggestRisk: 'Optimizing deductions while pausing SIP. At ₹25L+, compound wealth growth from non-tax-saving SIP is more valuable than marginal extra deductions.',
  },
];

const productDecisionMap = [
  {
    product: 'ELSS SIP',
    chooseWhen: '7+ year horizon, can handle 30–40% interim drawdown, wants 80C + growth',
    avoidWhen: 'Horizon under 5 years, or likely to redeem during correction',
    monthlyAmount: '₹3,000–₹8,000 depending on remaining 80C gap after EPF',
    keyRule: 'Do not use this for goals under 5 years. Lock-in is 3 years but real investment horizon should be 7+.',
  },
  {
    product: 'PPF',
    chooseWhen: 'Stable income, 15+ year horizon, risk-averse, wants guaranteed tax-free return',
    avoidWhen: 'Needed for goals within 10 years or primary emergency fund',
    monthlyAmount: '₹1,000–₹12,500/month (max ₹1.5L/year)',
    keyRule: 'PPF is a lock-box for patient money. Excellent EEE status but terrible if you need flexibility.',
  },
  {
    product: 'NPS Tier 1 (80CCD(1B))',
    chooseWhen: '₹18L+ salary in old regime, secure career, long retirement horizon',
    avoidWhen: 'Likely career break, self-employed, or poor liquidity tolerance',
    monthlyAmount: '₹4,200/month for full ₹50K deduction',
    keyRule: 'Annuity requirement at maturity means 40% is locked in an insurance product. Factor this before committing.',
  },
  {
    product: 'Health insurance (80D)',
    chooseWhen: 'Always — for self + family. Senior-citizen parents add significant extra deduction.',
    avoidWhen: 'N/A — always buy health insurance regardless of tax benefit',
    monthlyAmount: '₹1,500–₹5,000 depending on family coverage and age',
    keyRule: 'Buy health insurance for coverage, not just tax benefit. The tax saving is a bonus, not the reason.',
  },
];

export default function StrategiesPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best tax saving strategy for ₹15 lakh salary in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At ₹15L, compare old vs new regime first. If HRA + EPF + full 80C + 80D exceed ~₹4L in documented deductions, old regime saves ₹25,000–₹50,000. Automate ₹12,500/month 80C (EPF + ELSS SIP), pay health insurance monthly for 80D, and optionally add NPS for extra ₹50,000 deduction.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is it better to invest in PPF or ELSS for tax saving?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PPF offers guaranteed ~7.1% tax-free returns with 15-year lock-in — best for risk-averse or conservative savers. ELSS offers market-linked returns with a 3-year lock-in — better for 7+ year aggressive wealth building. Most salaried investors benefit from a combination based on how much risk they can sustain.',
        },
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Tax planning strategy</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India tax-saving strategies by salary band (FY 2025–26)</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this is for: earners at ₹8L, ₹15L, and ₹25L designing deduction and investment systems. <strong>Critical rule:</strong> use EPF as your base, add PPF or NPS for stability, and use ELSS SIP for growth only when your investment horizon is 7+ years and your monthly cashflow survives the commitment.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Strategy playbook by salary band</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {bandStrategies.map((plan) => (
            <article key={plan.band} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{plan.band}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Take-home: {plan.takeHome}</p>
              <p className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300">{plan.regimeAdvice}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700 dark:text-slate-300">
                {plan.strategy.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-300"><span className="font-semibold">Potential saving:</span> {plan.annualTaxSaving}</p>
              <p className="mt-2 text-xs text-rose-700 dark:text-rose-300"><span className="font-semibold">Biggest risk:</span> {plan.biggestRisk}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Product decision map: when to use each instrument</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Choose when</th>
                <th className="px-3 py-2">Avoid when</th>
                <th className="px-3 py-2">Monthly amount</th>
                <th className="px-3 py-2">Key rule</th>
              </tr>
            </thead>
            <tbody>
              {productDecisionMap.map((row) => (
                <tr key={row.product} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.product}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.chooseWhen}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.avoidWhen}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.monthlyAmount}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.keyRule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Real scenario: ₹15L salaried employee optimizing tax and wealth together</h2>
        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-100/90">
          Rahul earns ₹15L and rents in Hyderabad. EPF: ₹9,000/month auto-filled. Old regime decision: with HRA ~₹1.1L + EPF ₹1.08L + ELSS SIP ₹42,000/year + health insurance ₹25,000 = ₹3.65L total deductions. Break-even at ₹15L: ~₹4.1L.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900/90 dark:text-amber-100/90">
          <li><strong>Verdict:</strong> New regime saves ~₹8,000 at this deduction level. Old regime only wins if Rahul adds NPS (₹50K extra deduction via 80CCD(1B)).</li>
          <li>Adding NPS: ₹4,200/month → extra deduction pushes total to ₹4.15L → old regime now saves ~₹7,200 more → NPS pays for itself in tax saving alone.</li>
          <li>But: NPS money is locked until age 60. Rahul should only choose NPS if retirement saving is a genuine priority and cashflow is comfortable at ₹4,200/month.</li>
          <li><strong>Separate from this:</strong> Rahul runs a ₹12,000/month SIP (flexi-cap + mid-cap) as pure wealth building, not connected to tax optimization.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is the best tax saving strategy for ₹15 lakh salary in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Compare old vs new regime. If HRA + EPF + full 80C + 80D together exceed ~₹4L, old regime saves ₹25,000–₹50,000. Automate EPF + ELSS SIP for 80C, pay health insurance for 80D, and optionally add NPS for extra ₹50K deduction.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Is it better to invest in PPF or ELSS for tax saving?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">PPF: ~7.1% guaranteed, tax-free, 15-year lock-in — best for risk-averse savers. ELSS: market-linked returns, 3-year lock-in — best for 7+ year aggressive wealth building. Most salaried investors benefit from combining both based on their goal timeline.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Continue with linked decisions</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/in/old-vs-new-tax-regime" className="content-link-chip">Old vs new regime choice</Link>
          <Link href="/in/80c-deductions" className="content-link-chip">80C and 80D deduction guide</Link>
          <Link href="/in/tax" className="content-link-chip">India Tax Hub</Link>
          <Link href="/in/tax-slabs" className="content-link-chip">India tax slabs FY 2025–26</Link>
          <Link href="/in/calculators/sip-calculator" className="content-link-chip">SIP calculator</Link>
          <Link href="/in/sip-strategy-india" className="content-link-chip">SIP strategy guide</Link>
          <Link href="/in/fixed-deposit-vs-sip-india" className="content-link-chip">FD vs SIP comparison</Link>
        </div>
      </section>
    </article>
  );
}
