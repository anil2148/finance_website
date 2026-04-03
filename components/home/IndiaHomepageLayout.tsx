import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ChartBarIcon, HomeModernIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { NewsletterForm } from '@/components/NewsletterForm';
import AuthorBox from '@/components/common/AuthorBox';

const goalCards = [
  {
    title: 'Grow wealth',
    description: 'Run SIP at ₹5,000, ₹10,000, and ₹20,000/month and decide your SIP-vs-stability split.',
    primaryLabel: 'Calculate SIP growth in ₹',
    primaryHref: '/in/calculators/sip-calculator',
    secondaryLabel: 'Compare FD vs SIP',
    secondaryHref: '/in/fixed-deposit-vs-sip-india'
  },
  {
    title: 'Save taxes',
    description: 'Choose old vs new regime and structure 80C + 80D without March panic investing.',
    primaryLabel: 'Calculate your tax under new regime',
    primaryHref: '/in/old-vs-new-tax-regime',
    secondaryLabel: 'Open India tax hub',
    secondaryHref: '/in/tax'
  },
  {
    title: 'Buy home',
    description: 'Stress test EMI with +0.5% and +1.0% shocks before booking in Mumbai or Bangalore.',
    primaryLabel: 'Compare India home-loan rates',
    primaryHref: '/in/home-loan-interest-rates-india',
    secondaryLabel: 'Use EMI calculator',
    secondaryHref: '/in/calculators/emi-calculator'
  },
  {
    title: 'Reduce debt',
    description: 'Cut ₹10,000 monthly avoidable expense and redirect ₹1,20,000/year to debt prepayment or investing.',
    primaryLabel: 'Open loans decision hub',
    primaryHref: '/in/loans',
    secondaryLabel: 'Pick best credit card for your spend type',
    secondaryHref: '/in/best-credit-cards-india'
  }
];

const indiaCalculators = [
  {
    title: 'Home Loan EMI Calculator (India)',
    href: '/in/calculators/emi-calculator',
    description: 'Estimate monthly EMI, total interest, and affordability buffer with ₹-based examples.'
  },
  {
    title: 'SIP Calculator (India)',
    href: '/in/calculators/sip-calculator',
    description: 'Project corpus growth from monthly SIP contributions across conservative and growth assumptions.'
  }
];

const decisionLinks = [
  { label: 'Tax hub', href: '/in/tax' },
  { label: 'Banking hub', href: '/in/banking' },
  { label: 'Investing hub', href: '/in/investing' },
  { label: 'Loans hub', href: '/in/loans' },
  { label: 'Real-estate hub', href: '/in/real-estate' },
  { label: 'India calculators hub', href: '/in/calculators' }
];

const trustSignals = [
  { label: 'Educational content; not investment advice', href: '/financial-disclaimer' },
  { label: 'Editorial standards and review process', href: '/editorial-policy' },
  { label: 'Affiliate and revenue disclosure', href: '/affiliate-disclosure' }
];

const indiaFaq = [
  {
    q: 'Should I keep part in FD and part in SIP?',
    a: 'For many households, yes. Keep near-term money in stable buckets and use SIP for goals that are 7+ years away.',
    href: '/in/blog/sip-vs-fd'
  },
  {
    q: 'How should I think about 80C when cashflow is tight?',
    a: 'Avoid last-minute March decisions. Split 80C through the year, then balance PPF stability with ELSS growth only if volatility fits your comfort.',
    href: '/in/blog/ppf-vs-elss'
  },
  {
    q: 'What is the easiest EMI stress test?',
    a: 'Run your current rate, then +0.5% and +1.0%. If household essentials become tight, reduce loan size before booking.',
    href: '/in/calculators/emi-calculator'
  }
];

export function IndiaHomepageLayout() {
  return (
    <section className="space-y-10" aria-label="FinanceSphere India homepage">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-[0_30px_80px_-40px_rgba(37,99,235,0.9)]">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.6),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(129,140,248,0.5),transparent_35%),linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:auto,auto,26px_26px,26px_26px]" />
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/60 bg-white/15 px-3 py-1 text-xs font-medium text-cyan-100">
              FinanceSphere India • Calculator-first planning for Indian households
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Make better money decisions in India with real ₹ scenarios</h1>
            <p className="max-w-xl text-blue-100/95">
              Plan SIPs, compare FD vs SIP honestly, evaluate PPF vs ELSS by timeline, and stress-test EMI before committing to a home loan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200" href="/in/calculators/emi-calculator">
                Start with EMI planning
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/in/old-vs-new-tax-regime">
                Calculate your tax under new regime
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/in/best-savings-accounts-india">
                Compare top Indian savings accounts
              </Link>
            </div>
            <p className="text-xs text-blue-200">Last India hub review: April 2, 2026 • Educational content only; verify rates, tax rules, and provider terms before action.</p>
          </div>
          <div className="relative space-y-3 rounded-xl border border-cyan-100/30 bg-slate-900/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur">
            <h2 className="text-xl font-semibold">India decision workflow</h2>
            <ul className="space-y-2 text-sm text-cyan-100">
              <li>1) Run calculator (SIP or EMI)</li>
              <li>2) Compare trade-offs (FD vs SIP, PPF vs ELSS)</li>
              <li>3) Pick a monthly plan you can continue in bad months</li>
              <li>4) Re-check after salary/rate changes</li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Start with your India goal</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Pick the decision that feels urgent and move from calculator → compare → action plan.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {goalCards.map((goal) => (
            <article key={goal.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Calculator → Compare → Learn</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{goal.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{goal.description}</p>
              <div className="mt-3 space-y-1 text-sm">
                <Link href={goal.primaryHref} className="block font-semibold text-blue-700 hover:underline dark:text-blue-300">{goal.primaryLabel}</Link>
                <Link href={goal.secondaryHref} className="block font-medium text-slate-700 hover:text-blue-700 hover:underline dark:text-slate-200 dark:hover:text-blue-300">{goal.secondaryLabel}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular India calculators</h2>
          <Link href="/in/calculators/emi-calculator" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">Open EMI calculator</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {indiaCalculators.map((calculator) => (
            <Link key={calculator.href} href={calculator.href} className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <Card className="h-full border-slate-200/80 bg-white/85 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.8)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{calculator.title}</h3>
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{calculator.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300"><HomeModernIcon className="h-5 w-5" /> <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Home-loan / EMI planning</h2></div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">If one month has school fees, medical costs, and travel together, can your EMI still feel manageable? Use affordability with a safety buffer, not just lender eligibility.</p>
          <Link href="/in/calculators/emi-calculator" className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">Run EMI scenarios →</Link>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tax-saving without cashflow mistakes</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Avoid March panic investments. Set monthly 80C contributions and choose a PPF/ELSS mix aligned to both liquidity and risk comfort.</p>
          <Link href="/in/blog/ppf-vs-elss" className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">Use the 80C framework →</Link>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Popular India money decisions</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {decisionLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick answers for India households</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {indiaFaq.map((item) => (
            <article key={item.q} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.q}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.a}</p>
              <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">Open related guide</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-900" aria-label="Trust and transparency links for India">
        {trustSignals.map((signal) => (
          <Link key={signal.label} href={signal.href} className="flex items-start gap-2 rounded-xl border border-slate-100 px-3 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-700 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{signal.label}</span>
          </Link>
        ))}
      </section>

      <AuthorBox className="mt-0" />
      <NewsletterForm source="india-homepage" className="scroll-mt-24" />
    </section>
  );
}
