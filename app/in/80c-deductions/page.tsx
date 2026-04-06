import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Section 80C and 80D Deductions India (FY 2025-26): PPF, ELSS, EPF, NPS Planning',
  description: 'Plan Section 80C and 80D with monthly contribution structure, instrument-by-instrument tradeoffs, and liquidity-aware guidance for ₹8L–₹25L earners.',
  pathname: '/in/80c-deductions'
});

const instruments80C = [
  {
    name: 'EPF (Employee Provident Fund)',
    limit: 'No fixed cap per instrument; counts toward ₹1.5L 80C limit',
    returns: '~8.15% (FY 2024–25)',
    liquidity: 'Low — partial withdrawal only after 5 years for housing/education/medical',
    bestFor: 'Salaried employees — automatic; requires zero additional action',
    taxAtMaturity: 'Tax-free if continuous service ≥ 5 years',
    warning: 'Many employees do not realize EPF already fills a large share of their ₹1.5L limit.',
  },
  {
    name: 'PPF (Public Provident Fund)',
    limit: '₹500 minimum / ₹1.5L maximum per year',
    returns: '~7.1% (current; government-declared quarterly)',
    liquidity: 'Low — 15-year lock-in; partial withdrawal from year 7',
    bestFor: 'Risk-averse investors and anyone who wants guaranteed, long-term, tax-free compounding',
    taxAtMaturity: 'Fully tax-free (EEE status: exempt at investment, interest, and maturity)',
    warning: 'Do not use PPF as an emergency fund — the lock-in will force alternatives during a crisis.',
  },
  {
    name: 'ELSS Mutual Fund (SIP)',
    limit: 'No investment cap; ₹1.5L for 80C benefit',
    returns: 'Market-linked; ~12%–15% historically over 10+ years (not guaranteed)',
    liquidity: 'Moderate — 3-year lock-in per SIP instalment (shortest in 80C category)',
    bestFor: 'Investors with 7+ year horizon who can tolerate market volatility',
    taxAtMaturity: 'LTCG at 12.5% on gains above ₹1.25L/year (post-2024 budget rates)',
    warning: 'Redeeming ELSS during a market drawdown can permanently crystallize losses. Treat as 7-year minimum.',
  },
  {
    name: 'NPS (National Pension System)',
    limit: '₹1.5L under 80C + additional ₹50,000 under 80CCD(1B)',
    returns: 'Market-linked; varies by scheme (equity, corporate, government)',
    liquidity: 'Very low — locked until age 60; partial withdrawal only for specific goals',
    bestFor: 'Higher-income earners (₹18L+) who want additional ₹50,000 deduction beyond 80C limit',
    taxAtMaturity: '60% tax-free at withdrawal; 40% must be annuitized (annuity is taxable)',
    warning: 'NPS is a retirement product, not a medium-term investment. Do not count it as accessible wealth.',
  },
  {
    name: 'Life Insurance Premium (Term + ULIP)',
    limit: 'Counts toward ₹1.5L 80C (term premium only for term insurance)',
    returns: 'Term: no maturity value; ULIP: market-linked with high internal charges',
    liquidity: 'ULIP: 5-year lock-in; Term: no maturity proceeds',
    bestFor: 'Term insurance premiums for pure life cover — not as an investment vehicle',
    taxAtMaturity: 'Term: no return; ULIP: tax-free if annual premium ≤ ₹2.5L',
    warning: 'Do not buy life insurance for tax saving. Buy for life cover first, then check 80C benefit as a side effect.',
  },
];

const monthlyPlanByBand = [
  {
    band: '₹8L salary (in-hand ~₹57,000/month)',
    epfAutoFill: '~₹4,800/month (auto via payroll)',
    additionalNeeded: '~₹7,700/month to fill remaining 80C (₹92,400/year)',
    recommendation: 'ELSS SIP ₹5,000/month + health insurance premium ₹1,700–₹2,000/month. EPF + ELSS fills ₹1.5L. 80D via health insurance adds ₹18,000–₹25,000 more.',
    cashflowRisk: 'At ₹57K take-home, ₹7,700/month for 80C investments is ~13.5% — manageable if fixed costs are stable.',
  },
  {
    band: '₹15L salary (in-hand ~₹1,03,000/month)',
    epfAutoFill: '~₹9,000/month (employer + employee EPF combined)',
    additionalNeeded: '~₹3,500/month to top up to full 80C',
    recommendation: 'EPF fills most of 80C. Add ELSS SIP ₹3,500/month for remainder. Separate health insurance (₹1,800–₹2,500/month) for 80D. NPS optional ₹4,000/month for extra ₹50K deduction.',
    cashflowRisk: 'Very manageable. Main decision is whether NPS ₹50K additional deduction justifies the illiquidity.',
  },
  {
    band: '₹25L salary (in-hand ~₹1,60,000/month)',
    epfAutoFill: '~₹15,000/month (capped based on contribution rules)',
    additionalNeeded: 'EPF alone may fill most of ₹1.5L 80C limit; add NPS for extra ₹50K deduction',
    recommendation: 'EPF fills 80C. Maximize NPS 80CCD(1B) at ₹4,200/month for ₹50K additional deduction. Comprehensive health insurance for family (₹3,000–₹5,000/month for full ₹50,000 80D benefit). Separate wealth-building SIP beyond tax-saving bucket.',
    cashflowRisk: 'Low. Risk is over-optimizing deductions at the expense of liquidity — keep ₹1.2L–₹1.5L monthly investable surplus in non-locked instruments.',
  },
];

const deductionMistakes = [
  {
    mistake: 'March lump sum instead of monthly SIP',
    impact: 'Investing ₹1.5L in February/March puts ₹75,000+ of after-tax money at risk in one market entry. Cash crunch for 1–2 months.',
    fix: 'Start ELSS SIP in April at ₹6,000–₹12,500/month depending on salary band. Each SIP instalment has its own 3-year lock-in.',
  },
  {
    mistake: 'Buying ELSS when horizon is under 5 years',
    impact: 'ELSS has a 3-year lock-in but equity correction risk is real within 3–5 years. Redeeming during a dip locks in losses.',
    fix: 'Use PPF or FD for goals within 5 years. ELSS only for 7+ year goals (retirement, child education).',
  },
  {
    mistake: 'Paying for traditional endowment policies as 80C',
    impact: 'High agent commissions (25–35% of first year premium), poor returns (~4–5%), and lock-in periods destroy wealth while appearing to save tax.',
    fix: 'Separate insurance from investment. Buy pure term insurance for life cover. Use PPF/ELSS/EPF for actual 80C benefit.',
  },
  {
    mistake: 'Not claiming 80D health insurance premium',
    impact: 'Missing ₹25,000 (individual) or ₹50,000 (family including parents 60+) deduction means paying tax on income that could have been sheltered.',
    fix: 'Self + family health insurance premium up to ₹25,000 deductible; parents (60+) adds another ₹50,000. Total 80D can reach ₹75,000 if parents are senior citizens.',
  },
];

export default function DeductionsPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the 80C deduction limit for FY 2025-26?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Section 80C deduction limit is ₹1,50,000 per financial year. This is the aggregate limit across all eligible instruments: EPF, PPF, ELSS, NPS (80C portion), life insurance premium, NSC, and tuition fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which is better for 80C: PPF or ELSS?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PPF is better for conservative investors with guaranteed ~7.1% tax-free returns and 15-year lock-in. ELSS is better for aggressive investors with 7+ year horizon seeking market-linked growth (~12–15% historical). For most salaried employees, a combination works: PPF for stability, ELSS for growth.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I claim both 80C and 80D deductions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. 80C (up to ₹1.5L) and 80D (up to ₹25,000–₹75,000 depending on age and family composition) are separate deduction categories. You can claim both simultaneously under the old tax regime.',
        },
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Tax planning guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Section 80C and 80D deductions: build a monthly plan, not a March scramble</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this is for: salaried taxpayers structuring EPF, PPF, ELSS, NPS, and health insurance deductions. <strong>Core rule:</strong> divide your ₹1.5L 80C target by 12, automate from April, and treat insurance and investment as separate decisions.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">80C instrument comparison: returns, liquidity, and best-for scenarios</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Instrument</th>
                <th className="px-3 py-2">Returns</th>
                <th className="px-3 py-2">Liquidity</th>
                <th className="px-3 py-2">Best for</th>
                <th className="px-3 py-2">Tax at maturity</th>
              </tr>
            </thead>
            <tbody>
              {instruments80C.map((row) => (
                <tr key={row.name} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.name}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.returns}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.liquidity}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.bestFor}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.taxAtMaturity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Returns are indicative. ELSS returns are market-linked and not guaranteed. PPF/EPF rates are government-declared periodically.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Monthly contribution plan by salary band</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">How to divide your 80C target across instruments based on your salary, EPF situation, and risk tolerance.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {monthlyPlanByBand.map((plan) => (
            <article key={plan.band} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{plan.band}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">EPF auto-fill:</span> {plan.epfAutoFill}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Additional needed:</span> {plan.additionalNeeded}</p>
              <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200"><span className="font-medium">Recommended mix:</span> {plan.recommendation}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400"><span className="font-medium">Cashflow note:</span> {plan.cashflowRisk}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 dark:border-rose-500/30 dark:bg-rose-500/10">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Four mistakes that reduce or reverse your tax-saving benefit</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {deductionMistakes.map((item) => (
            <article key={item.mistake} className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-500/40 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">{item.mistake}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Impact:</strong> {item.impact}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Fix:</strong> {item.fix}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">80D deduction — often missed</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-emerald-900/90 dark:text-emerald-100/90">
            <li>Self + spouse + children health insurance: up to ₹25,000 deductible</li>
            <li>Parents (below 60): additional ₹25,000 deductible</li>
            <li>Parents (senior citizens, 60+): ₹50,000 deductible</li>
            <li>Total 80D benefit can reach ₹75,000 if you cover parents above 60</li>
            <li>Health checkup cost: up to ₹5,000 deductible (within the 80D limit)</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
          <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">NPS Section 80CCD(1B) — extra ₹50,000</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-900/90 dark:text-amber-100/90">
            <li>NPS Tier 1 contributions: up to ₹50,000 additional deduction beyond ₹1.5L 80C limit</li>
            <li>At ₹30% tax bracket, this saves ~₹15,600 in tax per year</li>
            <li>Trade-off: money locked until age 60; only 60% tax-free at withdrawal</li>
            <li>Best for: earners at ₹18L+ in old regime with long retirement horizon</li>
            <li>Employer NPS contribution (Section 80CCD(2)) up to 10% of basic is separately deductible and allowed even in new regime</li>
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is the 80C deduction limit for FY 2025-26?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">₹1,50,000 aggregate across all eligible instruments: EPF, PPF, ELSS, NPS (80C portion), life insurance premium, NSC, and tuition fees.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Which is better for 80C: PPF or ELSS?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">PPF for risk-averse investors: ~7.1% guaranteed, tax-free, 15-year lock-in. ELSS for 7+ year horizon: market-linked (~12–15% historical), 3-year lock-in. Most salaried employees benefit from a combination based on their goal timeline.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Can I claim both 80C and 80D?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Yes — 80C and 80D are separate categories. You can claim both simultaneously under the old tax regime. 80C maximum ₹1.5L, 80D maximum ₹25,000–₹75,000 depending on age and family composition.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Continue planning</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/in/old-vs-new-tax-regime" className="content-link-chip">Old vs new regime decision</Link>
          <Link href="/in/tax-saving-strategies" className="content-link-chip">Tax-saving strategies by salary band</Link>
          <Link href="/in/tax" className="content-link-chip">India Tax Hub</Link>
          <Link href="/in/calculators/sip-calculator" className="content-link-chip">SIP calculator</Link>
          <Link href="/in/fixed-deposit-vs-sip-india" className="content-link-chip">FD vs SIP comparison</Link>
          <Link href="/in/tax-slabs" className="content-link-chip">India tax slabs FY 2025–26</Link>
        </div>
      </section>
    </article>
  );
}
