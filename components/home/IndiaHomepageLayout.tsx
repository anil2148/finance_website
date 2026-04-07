import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { NewsletterForm } from '@/components/NewsletterForm';
import AuthorBox from '@/components/common/AuthorBox';

const goalCards = [
  {
    title: 'Grow wealth through SIP',
    description: 'Run scenarios at ₹5,000, ₹10,000, and ₹20,000/month to see what your SIP actually becomes in 10 and 20 years — before you pick the amount.',
    primaryLabel: 'Project SIP corpus in ₹',
    primaryHref: '/in/calculators/sip-calculator',
    secondaryLabel: 'FD vs SIP: which fits your goal timeline?',
    secondaryHref: '/in/blog/sip-vs-fd'
  },
  {
    title: 'Save taxes without March panic',
    description: 'Compare old vs new regime with your deductions, and build 80C through the year instead of scrambling in February.',
    primaryLabel: 'Compare tax regimes for your salary',
    primaryHref: '/in/old-vs-new-tax-regime',
    secondaryLabel: 'India tax planning hub',
    secondaryHref: '/in/tax'
  },
  {
    title: 'Buy a home without overcommitting',
    description: "Before you book, stress-test your EMI at today's rate, +0.5%, and +1.0%. Many buyers who cleared eligibility still felt squeezed after possession.",
    primaryLabel: 'Check live India home-loan rate ranges',
    primaryHref: '/in/home-loan-interest-rates-india',
    secondaryLabel: 'Run EMI stress test now',
    secondaryHref: '/in/calculators/emi-calculator'
  },
  {
    title: 'Pay down debt strategically',
    description: 'If ₹10,000/month is leaking to card interest and fees, that is ₹1.2 lakh/year that could be building a corpus instead.',
    primaryLabel: 'India loans decision hub',
    primaryHref: '/in/loans',
    secondaryLabel: 'Compare credit card options for your spend type',
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
  },
  {
    title: 'PPF vs ELSS Decision Framework',
    href: '/in/blog/ppf-vs-elss',
    description: 'Use timeline, risk, and deduction goals together instead of making a one-factor tax choice.'
  }
];

const heroActions = [
  { href: '/in/calculators', label: 'Start with your India scenario', tone: 'primary' as const },
  { href: '/in/banking', label: 'Compare India options', tone: 'secondary' as const },
  { href: '/in/blog', label: 'Explore India guides', tone: 'secondary' as const }
];

const trustSignals = [
  { label: 'Educational content; not investment advice', href: '/financial-disclaimer' },
  { label: 'Editorial standards and review process', href: '/editorial-policy' },
  { label: 'Affiliate and revenue disclosure', href: '/affiliate-disclosure' }
];

const trustStory = [
  {
    title: 'Who this is for',
    text: 'Indian households making decisions they cannot easily undo: tax regime, SIP level, home loan size, or monthly EMI commitment.'
  },
  {
    title: 'Why this India hub exists',
    text: 'Generic advice fits nobody. This hub keeps decisions grounded in real ₹ salary bands, cashflow pressure, and India-specific tax rules — not global benchmarks that do not apply here.'
  },
  {
    title: 'What makes it useful',
    text: 'Every calculator output connects to a practical next step. Run the number, understand what it means for your household, then decide.'
  }
];

const indiaMistake = {
  mistake: 'Deciding on tax regime, SIP level, or EMI size in January–February under deadline pressure instead of planning from April.',
  whyItBackfires: 'March pressure leads to lump-sum investments at whatever market price happens to be, over-allocation to 80C without checking monthly cashflow impact, and EMI commitments that look affordable until school fees and rate resets arrive.',
  betterAlternative: 'Lock decisions in April. Automate contributions monthly. Stress-test EMI at +1% before booking. The earlier you start the process, the less you pay for the delay.'
};

const moneyImpactExamples = [
  {
    label: 'Step up SIP from ₹10,000 to ₹12,000/month',
    outcome: '≈ ₹20 lakh additional corpus over 20 years at 11% avg return',
    note: 'Illustrative projection. Even a modest SIP step-up early has outsized compounding effect over long horizons.'
  },
  {
    label: 'Reduce home loan from 9.0% to 8.25% on ₹60 lakh',
    outcome: 'Can save ₹5–8 lakh in lifetime interest depending on tenure',
    note: 'Always compare processing fees, reset clauses, and prepayment terms — not just headline rate.'
  },
  {
    label: 'Plug ₹2,500/month in fee and penalty leakage',
    outcome: '≈ ₹3 lakh preserved over 10 years',
    note: 'Common sources: zero-MAB fees on inactive accounts, credit card interest on partial payments, auto-renewal charges.'
  }
];

const decisionLinks = [
  { href: '/in/tax', label: 'Tax planning hub' },
  { href: '/in/banking', label: 'Banking hub' },
  { href: '/in/investing', label: 'Investing hub' },
  { href: '/in/loans', label: 'Loans hub' },
  { href: '/in/real-estate', label: 'Real-estate hub' },
  { href: '/in/calculators', label: 'All India calculators' }
];

const indiaFaq = [
  {
    q: 'Should I keep some money in FD and some in SIP?',
    a: 'For most households, yes — especially if you have goals within 3 years and goals beyond 7. Near-term money benefits from FD stability; long-term money can take SIP volatility for compounding advantage.',
    href: '/in/blog/sip-vs-fd'
  },
  {
    q: 'How do I choose 80C without getting it wrong in March?',
    a: 'Split 80C allocation across the year — do not leave it for February. Choose PPF for locked-in stability, ELSS only if you can hold through a 20–30% market drawdown without panic-exiting.',
    href: '/in/blog/ppf-vs-elss'
  },
  {
    q: 'What is the simplest EMI stress test before booking a flat?',
    a: 'Run your EMI at the offered rate, then at +0.5% and +1.0%. If the highest scenario leaves no room for school fees, maintenance, and an emergency top-up — the loan is too large.',
    href: '/in/calculators/emi-calculator'
  }
];

const indiaTools = [
  {
    title: 'Run India money scenarios',
    desc: 'SIP growth, EMI stress tests, and tax-regime comparisons — all built around India salary and expense patterns.',
    href: '/in/calculators'
  },
  {
    title: 'Read decision-first guides',
    desc: 'SIP vs FD by goal timeline, PPF vs ELSS by risk appetite, EMI affordability by income band. Start with the guide that matches your next decision.',
    href: '/in/blog'
  },
  {
    title: 'Compare India product options',
    desc: 'FD rates, home loan offers, SIP platforms, and credit cards — reviewed for real Indian household conditions, not just headline numbers.',
    href: '/in/banking'
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
              FinanceSphere India • Interactive personal finance platform
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Plan SIPs, stress-test EMIs, and make tax decisions with real ₹ numbers</h1>
            <p className="max-w-xl text-blue-100/95">
              India-specific scenarios for every major money decision: SIP vs FD, PPF vs ELSS, home loan affordability, and tax regime choice — grounded in real salary bands and cashflow realities.
            </p>
            <div className="flex flex-wrap gap-3" aria-label="India hero actions">
              {heroActions.map((action) => (
                <Link
                  key={action.href}
                  className={
                    action.tone === 'primary'
                      ? 'rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200'
                      : 'rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15'
                  }
                  href={action.href}
                >
                  {action.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-blue-200">Last India hub review: April 2, 2026 • Educational content only; verify rates, tax rules, and provider terms before action.</p>
          </div>
          <div className="relative space-y-3 rounded-xl border border-cyan-100/30 bg-slate-900/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur">
            <div className="relative h-56 overflow-hidden rounded-lg border border-white/20">
              <Image
                src="/images/home-hero-finance-dashboard.svg"
                alt="Finance dashboard illustration for India workflows with SIP growth, EMI planning, and tax checks"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">Run your scenario in 10 minutes</h2>
            <p className="text-sm text-cyan-100">Pick a goal, run a calculator, understand what the number means for your monthly budget — then decide.</p>
          </div>
        </div>
      </Card>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What are you deciding right now?</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Pick your most urgent goal. Run a number first, then compare options — not the other way around.</p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="india-real-number-examples">
        <h2 id="india-real-number-examples" className="text-xl font-semibold text-slate-900 dark:text-slate-100">What small changes actually do to the numbers</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {moneyImpactExamples.map((example) => (
            <article key={example.label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Illustrative scenario</p>
              <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{example.label}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{example.outcome}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{example.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How this India hub works</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          India financial decisions are specific: SIP vs FD timelines, old vs new tax regime deduction thresholds, EMI-to-income ratios, 80C automation from April. Generic financial tools do not account for these. This hub keeps every decision grounded in real ₹ salary bands and India-specific rules.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          {trustStory.map((item) => (
            <div key={item.title}>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/10">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">The most common India financial planning mistake</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
            <p className="font-semibold text-amber-700 dark:text-amber-400">Common pattern</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{indiaMistake.mistake}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
            <p className="font-semibold text-amber-700 dark:text-amber-400">Why it costs more</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{indiaMistake.whyItBackfires}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800/40 dark:bg-slate-900">
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">What to do instead</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{indiaMistake.betterAlternative}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-label="Trust and transparency links for India">
        {trustSignals.map((signal) => (
          <Link key={signal.label} href={signal.href} className="flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-700 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10">
            <ShieldCheckIcon className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{signal.label}</span>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="india-popular-links-heading">
        <h2 id="india-popular-links-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Explore by topic</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {decisionLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular India calculators</h2>
          <Link href="/in/calculators" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">See all India calculators</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
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

      <section className="grid gap-4 lg:grid-cols-3">
        {indiaTools.map((tool) => (
          <Card key={tool.title} className="rounded-2xl border-slate-200/90 bg-gradient-to-b from-white to-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{tool.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{tool.desc}</p>
            <Link href={tool.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 dark:text-blue-300">Open section →</Link>
          </Card>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Real questions Indian households are asking</h2>
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

      <AuthorBox className="mt-0" />
      <NewsletterForm source="india-homepage" className="scroll-mt-24" />
    </section>
  );
}
