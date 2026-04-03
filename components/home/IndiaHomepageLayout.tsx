import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
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
    text: 'Indian households making high-impact decisions on tax regime, SIP level, savings buffers, and EMI commitments.'
  },
  {
    title: 'Why this India hub exists',
    text: 'Most advice is generic or product-pushy. This hub keeps decisions anchored to cashflow resilience and timeline realism.'
  },
  {
    title: 'What makes it useful',
    text: 'Every pathway connects calculator outputs to a practical next action plan for Indian salary and expense patterns.'
  }
];

const moneyImpactExamples = [
  {
    label: 'Increase SIP from ₹10,000 to ₹12,000/month',
    outcome: '≈ ₹20 lakh+ additional corpus over 20 years',
    note: 'Illustrative long-run projection; real outcomes vary by returns, tenure, and fund behavior.'
  },
  {
    label: 'Lower a ₹60 lakh loan from 9.0% to 8.25%',
    outcome: 'Can materially reduce lifetime interest burden',
    note: 'Always compare processing fees, reset clauses, and tenure before switching.'
  },
  {
    label: 'Avoid ₹2,500/month bank+card fee leakage',
    outcome: '≈ ₹3 lakh preserved over 10 years',
    note: 'Small recurring leaks can rival the benefit of chasing marginal headline rate differences.'
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

const indiaTools = [
  {
    title: 'Model India money moves',
    desc: 'Run SIP, EMI, and tax-regime scenarios before committing to fixed monthly plans.',
    href: '/in/calculators'
  },
  {
    title: 'Read decision-first guides',
    desc: 'Use practical frameworks for FD vs SIP, PPF vs ELSS, and salary-band planning.',
    href: '/in/blog'
  },
  {
    title: 'Compare product trade-offs',
    desc: 'Review rates, fees, penalties, and suitability side-by-side with Indian context.',
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
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Make better money decisions in India with real ₹ scenarios</h1>
            <p className="max-w-xl text-blue-100/95">
              Plan SIPs, compare FD vs SIP honestly, evaluate PPF vs ELSS by timeline, and stress-test EMI before committing to a home loan.
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
            <div className="relative h-36 overflow-hidden rounded-lg border border-white/20">
              <Image
                src="/images/home-hero-finance-dashboard.svg"
                alt="Finance dashboard illustration for India workflows with SIP growth, EMI planning, and tax checks"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">India decision workflow</h2>
            <p className="text-sm text-cyan-100">In under 10 minutes: quantify your scenario, compare trade-offs, and choose a resilient monthly plan.</p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="india-real-number-examples">
        <h2 id="india-real-number-examples" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Money impact snapshot (India)</h2>
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
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Trust and purpose</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {trustStory.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.text}</p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="india-popular-links-heading">
        <h2 id="india-popular-links-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Popular India pathways</h2>
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

      <AuthorBox className="mt-0" />
      <NewsletterForm source="india-homepage" className="scroll-mt-24" />
    </section>
  );
}
