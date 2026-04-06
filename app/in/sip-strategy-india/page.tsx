import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'SIP Strategy India 2026: Salary-Based Allocation, Step-Up Rules, and Mistake Map',
  description: 'India SIP strategy with salary-band allocation examples, step-up guidance, fund category selection, and common mistakes that destroy long-term wealth.',
  pathname: '/in/sip-strategy-india'
});

const sipByBand = [
  {
    band: '₹8L salary (in-hand ~₹57,000/month)',
    startingSIP: '₹5,000–₹7,000/month',
    rationale: 'Emergency buffer should be at least ₹80,000–₹1L before starting SIP. At this salary, a ₹5K SIP is 8–9% of take-home — sustainable without creating cashflow pressure.',
    stepUp: 'Add ₹500–₹1,000 at each salary increment or annual bonus month.',
    projections: '₹5,000/month for 15 years @12% ≈ ₹25 lakh; @10% ≈ ₹20 lakh',
    failureMode: 'Starting too high (₹12K+) and pausing during a single high-expense month creates return erosion and behavioural disengagement from investing.',
  },
  {
    band: '₹15L salary (in-hand ~₹1,00,000/month)',
    startingSIP: '₹15,000–₹20,000/month',
    rationale: 'At ₹1L in-hand, a ₹15–20K SIP is 15–20% of take-home. This is a healthy allocation once insurance, EMI (if any), and 3–6 month emergency buffer are secured.',
    stepUp: 'Step up ₹2,000–₹3,000 per year; link step-up to April salary increment for automation.',
    projections: '₹20,000/month for 12 years @12% ≈ ₹50 lakh; for 15 years ≈ ₹1 crore',
    failureMode: 'Mixing tax-saving 80C investments with SIP goals — makes mid-year review unclear and leads to under-investing in actual wealth growth.',
  },
  {
    band: '₹25L salary (in-hand ~₹1,60,000/month)',
    startingSIP: '₹35,000–₹50,000/month',
    rationale: 'At ₹1.6L take-home with stable EMI and expenses, ₹35–50K SIP (22–31% of income) is achievable. Separate this bucket clearly from tax-saving and emergency reserves.',
    stepUp: 'Increase by ₹5,000/year minimum; redirect annual bonus surplus into lump-sum STP (systematic transfer plan) rather than one-time lump sum.',
    projections: '₹40,000/month for 15 years @12% ≈ ₹1.99 crore; for 20 years ≈ ₹3.99 crore',
    failureMode: 'Over-concentrating in one fund type (only mid-cap or only sectoral). Portfolio re-balancing gap is the biggest wealth-drag at this income level.',
  },
];

const fundCategories = [
  {
    category: 'Large-cap index fund (Nifty 50 / Sensex)',
    riskLevel: 'Moderate',
    horizon: '5+ years',
    bestFor: 'Core stable allocation for any investor. Low expense ratio (~0.1–0.2% for index funds). Benchmark-matching returns without fund manager risk.',
    avoid: 'Not ideal as 100% allocation — can underperform in strong mid/small-cap cycles.',
  },
  {
    category: 'Flexi-cap / multi-cap fund',
    riskLevel: 'Moderate to high',
    horizon: '7+ years',
    bestFor: 'Fund manager-driven allocation across market caps. Good for core SIP if you trust the fund house and manager history.',
    avoid: 'Overlapping with large-cap index can lead to same underlying stocks. Check portfolio before adding both.',
  },
  {
    category: 'Mid-cap fund',
    riskLevel: 'High',
    horizon: '8–10+ years',
    bestFor: 'Satellite allocation for aggressive wealth building at ₹15L+ income. Historically higher return potential over 10+ years.',
    avoid: 'Do not use as emergency or near-term goal bucket. 30–40% drawdowns in corrections are common.',
  },
  {
    category: 'ELSS (Equity Linked Saving Scheme)',
    riskLevel: 'High',
    horizon: '7+ years (3-year lock-in per instalment)',
    bestFor: 'Tax saving under 80C + market-linked growth. Best for investors who need to fill 80C and have a 7+ year horizon.',
    avoid: 'Not suitable if you need liquidity within 3 years or will panic-exit during market corrections.',
  },
  {
    category: 'Debt fund / short-duration fund',
    riskLevel: 'Low to moderate',
    horizon: '1–3 years',
    bestFor: 'Goal buckets with 1–3 year horizon (car, vacation, emergency top-up). Better post-tax returns than FD for investors in higher tax brackets.',
    avoid: 'Not for long-term wealth building. Inflation-adjusted returns may be negative in some interest-rate environments.',
  },
];

const topMistakes = [
  {
    mistake: 'Pausing SIP during market correction',
    why: 'The best SIP returns come from continuing (or stepping up) during corrections. Pausing means missing the recovery.',
    example: 'A ₹10,000/month Nifty 50 SIP paused for 6 months during COVID crash (2020) lost approximately ₹1.2 lakh in additional corpus vs someone who continued.',
    fix: 'Automate SIP for the date right after salary credit. Treat it as a fixed expense, not a variable one.',
  },
  {
    mistake: 'Chasing past performance by switching funds annually',
    why: 'Last year\'s top performer is rarely next year\'s leader. Frequent switches trigger exit loads and short-term capital gains tax.',
    example: 'A ₹50,000 fund switch triggers 1% exit load (₹500) + 20% STCG tax on gains. Over 3–4 switches, this erodes thousands in avoidable costs.',
    fix: 'Review fund allocation every 2–3 years. Only switch for structural underperformance over 3+ rolling years, not short-term ranking.',
  },
  {
    mistake: 'No step-up discipline — same SIP amount for 5+ years',
    why: 'Inflation erodes real investment value. A ₹10,000 SIP in 2018 is roughly equivalent to ₹7,800 in 2024 real terms.',
    example: 'A ₹10,000 SIP stepped up by ₹1,000/year reaches ₹1.1 crore over 15 years vs ₹58 lakh for a flat ₹10,000 SIP (at 12% CAGR).',
    fix: 'Enable step-up SIP feature in your app or set a calendar reminder every April to increase by ₹1,000–₹2,000.',
  },
  {
    mistake: 'Too many funds — 8–12 overlapping SIPs',
    why: 'More funds ≠ more diversification. Overlapping large-cap stocks across 6 different funds creates pseudo-diversification with high tracking complexity.',
    example: 'A ₹20,000 SIP split across 8 funds often has 40–60% overlap in top holdings (Reliance, HDFC Bank, TCS appear in most).',
    fix: 'Three funds cover most scenarios: one large-cap index + one flexi-cap + one mid-cap for aggressive allocation. Add debt fund for goal-specific buckets.',
  },
];

export default function SipStrategyIndiaPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much SIP should I do at ₹10 lakh salary in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At ₹10L annual salary (in-hand ~₹70,000/month), starting a ₹7,000–₹10,000/month SIP is reasonable after securing 3 months emergency buffer and basic insurance. Increase by ₹1,000/year as income grows.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I continue SIP during market crash?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — market corrections are exactly when SIP works best. You buy more units at lower prices. Pausing SIP during a crash means missing the recovery, which provides the best long-term returns. The worst action is stopping during a crash and resuming at peaks.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many funds should I have in my SIP portfolio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Three to five funds is optimal for most investors. One large-cap index fund (core), one flexi-cap or multi-cap fund, and one mid-cap fund for aggressive allocation covers most wealth-building needs without overlapping holdings.',
        },
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Investing strategy guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">SIP strategy India: allocate by salary band, step up annually, ignore the noise</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Who this is for: salaried investors building consistent SIP contributions without disrupting household cashflow. <strong>Core rule:</strong> automate SIP on salary-credit day, separate it from tax-saving investments, and step up by ₹1,000–₹2,000 every April.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">SIP allocation by salary band: starting points and projections</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {sipByBand.map((band) => (
            <article key={band.band} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{band.band}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><span className="font-medium text-blue-700 dark:text-blue-300">Starting SIP:</span> {band.startingSIP}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{band.rationale}</p>
              <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200"><span className="font-medium">Projections:</span> {band.projections}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><span className="font-medium">Step-up:</span> {band.stepUp}</p>
              <p className="mt-2 text-xs text-rose-700 dark:text-rose-300"><span className="font-medium">Failure mode:</span> {band.failureMode}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Which funds to use: risk, horizon, and allocation fit</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Fund category</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Horizon</th>
                <th className="px-3 py-2">Best for</th>
                <th className="px-3 py-2">When to avoid</th>
              </tr>
            </thead>
            <tbody>
              {fundCategories.map((row) => (
                <tr key={row.category} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.category}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.riskLevel}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.horizon}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.bestFor}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-xs">{row.avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 dark:border-rose-500/30 dark:bg-rose-500/10">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Four mistakes that permanently reduce SIP corpus</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {topMistakes.map((item) => (
            <article key={item.mistake} className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-500/40 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">{item.mistake}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Why it hurts:</strong> {item.why}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Example:</strong> {item.example}</p>
              <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200"><strong>Fix:</strong> {item.fix}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Step-up SIP math: why annual increases dominate flat SIPs</h2>
        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-100/90">
          A ₹10,000/month flat SIP for 15 years at 12% CAGR builds <strong>~₹50 lakh</strong>. The same SIP stepped up by ₹1,000/year builds <strong>~₹1.1 crore</strong> — more than double. The step-up costs very little in any single year but compounds dramatically over time.
        </p>
        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-100/90">
          Most investment apps offer step-up SIP as a feature. Activate it in April when your salary increments are usually applied.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How much SIP should I do at ₹10 lakh salary in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">At ₹10L annual salary (in-hand ~₹70,000/month), ₹7,000–₹10,000/month is a healthy starting SIP after securing 3 months emergency buffer. Increase by ₹1,000 every April as income grows.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Should I continue SIP during a market crash?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Yes. Market corrections are exactly when SIP works best — you buy more units at lower prices. Pausing during a crash means missing the recovery, which provides the best long-term returns. Automate SIP so emotions do not interfere.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How many funds should I have in my SIP portfolio?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Three to five funds covers most wealth-building needs: one large-cap index fund (core stability), one flexi-cap/multi-cap (active allocation), one mid-cap fund (growth). Add a debt fund only for specific near-term goals.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Related investing decisions</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/in/investing" className="content-link-chip">India Investing Hub</Link>
          <Link href="/in/fixed-deposit-vs-sip-india" className="content-link-chip">FD vs SIP comparison</Link>
          <Link href="/in/best-investment-apps-india" className="content-link-chip">Investment apps comparison</Link>
          <Link href="/in/calculators/sip-calculator" className="content-link-chip">SIP calculator</Link>
          <Link href="/in/tax" className="content-link-chip">Tax Hub (80C + SIP interaction)</Link>
          <Link href="/in/blog/ppf-vs-elss" className="content-link-chip">PPF vs ELSS deep guide</Link>
          <Link href="/in/blog/sip-for-beginners" className="content-link-chip">SIP for beginners guide</Link>
        </div>
      </section>
    </article>
  );
}
