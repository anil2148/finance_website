import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const goalCards = [
  {
    title: 'Build long-term wealth with SIPs',
    description: 'Use a monthly SIP projection first, then compare FD fallback options if your timeline is under 5 years.',
    primaryLabel: 'Open SIP calculator',
    primaryHref: '/in/calculators/sip-calculator',
    secondaryLabel: 'Read SIP vs FD decision guide',
    secondaryHref: '/in/blog/sip-vs-fd'
  },
  {
    title: 'Choose tax-saving investments',
    description: 'Compare lock-in period, liquidity, and return expectations before choosing PPF, ELSS, or a split approach.',
    primaryLabel: 'Read PPF vs ELSS',
    primaryHref: '/in/blog/ppf-vs-elss',
    secondaryLabel: 'See India blog hub',
    secondaryHref: '/in/blog'
  },
  {
    title: 'Plan home loan affordability',
    description: 'Estimate EMI at multiple interest rates and pressure-test affordability against salary and emergency-fund needs.',
    primaryLabel: 'Use EMI calculator',
    primaryHref: '/in/calculators/emi-calculator',
    secondaryLabel: 'Review home-loan planning tips',
    secondaryHref: '/in/blog/sip-vs-fd#emi-transition'
  },
  {
    title: 'Build tax-efficient yearly workflow',
    description: 'Map Section 80C choices, liquidity needs, and contribution cadence so tax-saving does not hurt cashflow.',
    primaryLabel: 'PPF vs ELSS framework',
    primaryHref: '/in/blog/ppf-vs-elss#decision-framework',
    secondaryLabel: 'Start from India homepage',
    secondaryHref: '/in'
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
    description: 'Project corpus growth from monthly SIP contributions using annual return assumptions.'
  }
];

const decisionLinks = [
  { label: 'SIP vs FD: ₹10,000/month scenario', href: '/in/blog/sip-vs-fd' },
  { label: 'PPF vs ELSS: tax-saving trade-offs', href: '/in/blog/ppf-vs-elss' },
  { label: 'India blog hub', href: '/in/blog' },
  { label: 'India EMI planning', href: '/in/calculators/emi-calculator' }
];

const trustSignals = [
  { label: 'Educational content; not investment advice', href: '/financial-disclaimer' },
  { label: 'Editorial standards and review process', href: '/editorial-policy' },
  { label: 'Affiliate and revenue disclosure', href: '/affiliate-disclosure' }
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
              Plan SIPs, compare FD vs SIP, evaluate PPF vs ELSS, and test home-loan EMI affordability before you commit.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200" href="/in/calculators/emi-calculator">
                Start with EMI planning
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/in/blog/sip-vs-fd">
                Compare SIP vs FD
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/in/blog">
                Explore India guides
              </Link>
            </div>
            <p className="text-xs text-blue-200">Last India hub review: April 2, 2026 • Educational content only; verify rates, tax rules, and provider terms before action.</p>
          </div>
          <div className="relative space-y-3 rounded-xl border border-cyan-100/30 bg-slate-900/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur">
            <h2 className="text-xl font-semibold">India decision workflow</h2>
            <ul className="space-y-2 text-sm text-cyan-100">
              <li>1) Run calculator (SIP or EMI)</li>
              <li>2) Compare trade-offs (FD vs SIP, PPF vs ELSS)</li>
              <li>3) Pick a contribution and review cadence</li>
              <li>4) Re-check after salary/rate changes</li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Start with your India goal</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Follow the same calculator → compare → learn model, localized for India.</p>
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

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-900" aria-label="Trust and transparency links for India">
        {trustSignals.map((signal) => (
          <Link key={signal.label} href={signal.href} className="flex items-start gap-2 rounded-xl border border-slate-100 px-3 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-700 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{signal.label}</span>
          </Link>
        ))}
      </section>
    </section>
  );
}
