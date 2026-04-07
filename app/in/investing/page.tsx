import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Investing Hub 2026: SIP Setup, FD vs SIP, Tax-Aware Allocation by Salary Band',
  description: 'Build a practical India investing plan with SIP sizing, FD allocation, tax-aware pathways, and downside-resilient strategy by income stability and goal timeline.',
  pathname: '/in/investing'
});

const scenarios = [
  {
    title: '₹5,000 SIP starter',
    salary: '₹6L–₹9L annual salary',
    guidance: 'Ideal when emergency buffer is still being built and income visibility is moderate. At ₹5K/month for 10 years @12%, corpus ≈ ₹11.6 lakh.',
    beforeStarting: 'Build ₹60,000–₹90,000 emergency buffer first. SIP that gets paused within 6 months builds less than a smaller SIP that runs uninterrupted.',
    warning: 'Do not step up aggressively if one expense spike forces credit-card rollover.',
    allocation: '100% large-cap index fund or single flexi-cap fund. Keep it simple at this stage.',
  },
  {
    title: '₹10,000–₹15,000 SIP core plan',
    salary: '₹10L–₹18L annual salary',
    guidance: 'Works for most ₹12L–₹15L salary bands when fixed costs are stable and insurance is in place. At ₹12K/month for 12 years @12%, corpus ≈ ₹30 lakh.',
    beforeStarting: 'Confirm 3–6 month emergency fund exists separately. Automate on salary-credit day. Separate this SIP from 80C/tax-saving investments.',
    warning: 'If SIP needs pausing more than twice per year, lower contribution and maintain consistency.',
    allocation: '60–70% large-cap index + 30–40% flexi-cap. Add mid-cap only after 2+ years of consistent investing.',
  },
  {
    title: '₹20,000–₹40,000 SIP growth lane',
    salary: '₹20L–₹30L annual salary',
    guidance: 'Suitable for higher-surplus households with clear 7+ year goals and strong liquidity reserves. At ₹30K/month for 15 years @12%, corpus ≈ ₹1.5 crore.',
    beforeStarting: 'Separate tax-saving 80C bucket (EPF + ELSS) from wealth SIP bucket. Both serve different purposes. Enable step-up SIP every April.',
    warning: 'Avoid overconcentration in one sector or market-cap category. Re-balance annually.',
    allocation: '50% large-cap index + 30% flexi-cap + 20% mid-cap. Use debt fund for specific near-term goals.',
  },
];

const investingPrinciples = [
  {
    principle: 'Emergency buffer before SIP',
    detail: 'A SIP started before you have 3 months expenses liquid is a fragile plan. One car repair or medical expense can break it.',
    threshold: 'Min emergency fund: 3 months essential expenses liquid in savings/FD before starting any SIP.',
  },
  {
    principle: 'Tax wrapper matters more than fund selection',
    detail: 'ELSS (80C) vs regular equity fund: identical returns but ELSS saves ₹15,000–₹45,000/year in tax for investors using old regime. Make the tax-efficient choice first.',
    threshold: 'Use ELSS SIP for 80C allocation if horizon is 7+ years and you are in the old tax regime.',
  },
  {
    principle: 'Step-up SIP outperforms flat SIP over 10+ years',
    detail: 'A ₹10,000 SIP stepped up by ₹1,000/year reaches ~₹1.1 crore in 15 years @12% vs ~₹50 lakh for a flat ₹10,000 SIP. The additional monthly commitment is tiny early but compounds dramatically.',
    threshold: 'Set step-up SIP in April after salary increment. Even ₹500/month annual increase transforms long-term wealth.',
  },
  {
    principle: 'Asset allocation beats fund selection',
    detail: 'Splitting ₹20,000 between index fund + flexi-cap + mid-cap is more important than picking the "best" fund in each category. Structure determines outcomes more than selection.',
    threshold: '3–5 funds covers most needs. More than 6 funds usually creates overlap and management complexity without diversification benefit.',
  },
  {
    principle: 'FD and SIP serve different goals — do not replace one with the other',
    detail: 'FD is for goals within 3 years and emergency reserves. SIP is for goals 5+ years out. Running both does not mean being conservative — it means bucketing correctly.',
    threshold: 'Goals under 3 years: FD. Goals 3–5 years: hybrid/debt fund. Goals 5+ years: equity SIP.',
  },
];

const whoShouldChooseWhat = [
  {
    profile: 'New investor, first job, ₹30K–₹50K in-hand',
    choice: 'Start with ₹2,000–₹5,000 SIP in a single large-cap index fund',
    why: 'Simplicity prevents decision fatigue. Build the habit first. Add complexity after 12+ months of consistent investing.',
    avoid: 'Do not start with sectoral funds, small-cap, or 5+ funds simultaneously.',
  },
  {
    profile: 'Mid-career, ₹15L salary, buying home in 3–4 years',
    choice: 'FD for down payment bucket + SIP for retirement/long-term bucket — keep them separate',
    why: 'Equity is risky for 3-year goals. If markets are down when you need the down payment, you sell at a loss or delay the purchase.',
    avoid: 'Do not put down-payment money in equity SIP regardless of expected returns.',
  },
  {
    profile: 'Variable-income professional or freelancer',
    choice: 'Build 9–12 month liquid emergency fund first, then SIP amount must tolerate pause months',
    why: 'Variable income means some months have no surplus. The SIP amount must be affordable in the worst expected month, not just the average.',
    avoid: 'High SIP amounts that require emergency pause create exit-load, TDS, and loss-of-compounding costs.',
  },
  {
    profile: '₹25L+ salaried, maximizing long-term wealth',
    choice: 'Separate 80C tax-saving bucket (ELSS/PPF/NPS) from growth SIP bucket (flexi-cap + mid-cap)',
    why: 'Mixing tax-saving and wealth goals leads to wrong product choices and unclear portfolio management.',
    avoid: 'Counting 80C investments as your "total SIP" understates the growth portfolio and overstates discipline.',
  },
];

export default function IndiaInvestingHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much SIP should I start with in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with an amount that you can sustain even in a bad month — medical expense, reduced salary, or unexpected cost. A ₹5,000 SIP that runs for 10 years beats a ₹15,000 SIP that gets paused four times. Build emergency buffer first, then set SIP to auto-debit on salary credit date.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should FD stop when SIP starts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. FD and SIP serve different purposes. Keep FD for emergency reserves and near-term goals (under 3 years). Use SIP for long-term wealth building (5+ years). Running both is not conservative — it is correct bucketing by goal timeline.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best investment for salaried employees in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For most salaried employees: EPF (automatic retirement savings) + health insurance (80D) + ELSS SIP (80C + equity growth) + liquid emergency FD (3–6 months). Beyond this, add a large-cap index fund SIP for pure wealth building separate from tax-saving.',
        },
      },
    ],
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Investing decision hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India Investing Hub: downside-aware SIP discipline by salary band</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          <strong>Start here:</strong> lock emergency reserve (3–6 months expenses), set SIP at a level you can sustain in bad months, choose tax-efficient wrappers, and step up annually. Then compare execution platforms.
        </p>
      </header>

      <IndiaAuthorityNote />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Salary-band SIP scenarios: allocation, corpus projections, and failure modes</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article key={scenario.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{scenario.title}</h3>
              <p className="mt-1 text-xs font-medium text-blue-700 dark:text-blue-300">{scenario.salary}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{scenario.guidance}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><span className="font-medium text-emerald-700 dark:text-emerald-300">Before starting:</span> {scenario.beforeStarting}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Suggested allocation:</span> {scenario.allocation}</p>
              <p className="mt-2 text-sm text-rose-700 dark:text-rose-300"><span className="font-medium">Failure mode:</span> {scenario.warning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Who should choose what: profile-based investing decisions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {whoShouldChooseWhat.map((profile) => (
            <article key={profile.profile} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.profile}</h3>
              <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200"><span className="font-medium">Best choice:</span> {profile.choice}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Why:</span> {profile.why}</p>
              <p className="mt-1 text-sm text-rose-700 dark:text-rose-300"><span className="font-medium">Avoid:</span> {profile.avoid}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Five investing principles that determine long-term results</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {investingPrinciples.map((item) => (
            <article key={item.principle} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.principle}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.detail}</p>
              <p className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300">{item.threshold}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">India investing journey: calculator to execution</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Use <Link href="/in/calculators/sip-calculator" className="content-link">SIP calculator</Link> to size your SIP → choose <Link href="/in/fixed-deposit-vs-sip-india" className="content-link">FD vs SIP allocation</Link> by goal timeline → finalize tax-aware split with <Link href="/in/blog/ppf-vs-elss" className="content-link">PPF vs ELSS</Link> → compare platforms on <Link href="/in/best-investment-apps-india" className="content-link">investment apps comparison</Link>.
        </p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          If your plan includes a home loan, run an <Link href="/in/calculators/emi-calculator" className="content-link">EMI stress test</Link> before committing to a SIP amount. Many households lock high SIP in April and face EMI pressure 6 months later after a rate reset.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Questions before you start investing</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">How much SIP should I start with in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">Start with an amount you can sustain even in a bad month. A ₹5,000 SIP that runs uninterrupted for 10 years beats a ₹15,000 SIP paused four times. Build emergency buffer first, then automate SIP on salary-credit date.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Should FD stop when SIP starts?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">No. FD and SIP serve different goals. Keep FD for emergency reserves and near-term goals (under 3 years). Use SIP for 5+ year wealth building. Running both is correct bucketing, not over-conservatism.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">What is the best investment for salaried employees in India?</dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-300">EPF (automatic retirement savings) + health insurance (80D protection) + ELSS SIP (80C + equity growth) + liquid emergency FD (3–6 months). Then add a large-cap index fund SIP for pure wealth building separate from tax-saving allocation.</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Explore linked investing decisions</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {[
            ['/in/sip-strategy-india', 'SIP strategy by salary band and step-up rules'],
            ['/in/best-investment-apps-india', 'Best investment apps India comparison'],
            ['/in/fixed-deposit-vs-sip-india', 'Fixed Deposit vs SIP: allocation by goal timeline'],
            ['/in/blog/sip-vs-fd', 'SIP vs FD deep guide'],
            ['/in/blog/ppf-vs-elss', 'PPF vs ELSS deep guide'],
            ['/in/old-vs-new-tax-regime', 'Old vs new tax regime: choose the right one'],
            ['/in/calculators/sip-calculator', 'SIP calculator: model your corpus'],
            ['/in/best-savings-accounts-india', 'Best savings accounts India comparison'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="link-card">{label}</Link>
          ))}
        </div>
      </section>
    </section>
  );
}
