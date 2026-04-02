import Link from 'next/link';
import Image from 'next/image';
import {
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { NewsletterForm } from '@/components/NewsletterForm';
import AuthorBox from '@/components/common/AuthorBox';

const popularCalculators = [
  {
    title: 'Mortgage Calculator',
    href: '/calculators/mortgage-calculator',
    description: 'Estimate monthly principal-and-interest payments before you choose a home budget or loan term.'
  },
  {
    title: 'Compound Interest Calculator',
    href: '/calculators/compound-interest-calculator',
    description: 'See how recurring contributions and time compound into long-term growth for future goals.'
  },
  {
    title: 'Debt Payoff Calculator',
    href: '/calculators/debt-payoff-calculator',
    description: 'Compare payoff timelines and interest cost when you add extra monthly payments.'
  }
];

const goalCards = [
  {
    title: 'Pay off debt faster',
    description: 'Estimate payoff dates and interest savings, then compare balance transfer cards or consolidation loans that fit your profile.',
    primaryLabel: 'Start with the Debt Payoff Calculator',
    primaryHref: '/calculators/debt-payoff-calculator',
    secondaryLabel: 'Compare consolidation options',
    secondaryHref: '/loans'
  },
  {
    title: 'Compare investing apps',
    description: 'Model how much you can invest each month, then review platforms by fees, account types, and beginner-friendly tools.',
    primaryLabel: 'Run an investment growth projection',
    primaryHref: '/calculators/investment-growth-calculator',
    secondaryLabel: 'See best investment apps',
    secondaryHref: '/best-investment-apps'
  },
  {
    title: 'Estimate mortgage costs',
    description: 'Test home prices, down payments, and rates to see affordable monthly payments before speaking with lenders.',
    primaryLabel: 'Use the Mortgage Calculator',
    primaryHref: '/calculators/mortgage-calculator',
    secondaryLabel: 'Compare mortgage offers',
    secondaryHref: '/compare/mortgage-rate-comparison'
  },
  {
    title: 'Plan for retirement',
    description: 'Estimate how much you may need, where you are today, and account types that can help close the gap.',
    primaryLabel: 'Check your retirement trajectory',
    primaryHref: '/calculators/retirement-calculator',
    secondaryLabel: 'Read retirement planning basics',
    secondaryHref: '/learn/investing'
  }
];

const tools = [
  {
    title: 'Plan major money moves',
    desc: 'Model home-buying, refinancing, debt payoff, and long-term investing before you commit.',
    href: '/tools'
  },
  {
    title: 'Read practical money guides',
    desc: 'Get step-by-step explainers on credit cards, savings rates, loan terms, and tax basics.',
    href: '/blog'
  },
  {
    title: 'Compare real product trade-offs',
    desc: 'Review APR/APY, fees, bonuses, and key pros/cons side-by-side in minutes.',
    href: '/comparison'
  }
];

const trustSignals = [
  { label: 'Educational, not personalized advice', href: '/financial-disclaimer' },
  { label: 'Affiliate transparency and editorial independence', href: '/affiliate-disclosure' },
  { label: 'How FinanceSphere evaluates products', href: '/editorial-policy' }
];

const trustStory = [
  {
    title: 'Who this is for',
    text: 'People making high-impact money choices right now: debt payoff, mortgage terms, savings allocation, and investing contributions.'
  },
  {
    title: 'Why this site exists',
    text: 'Most finance content is generic. We built FinanceSphere to turn every decision into concrete dollars, timelines, and trade-offs.'
  },
  {
    title: 'What makes it different',
    text: 'We quantify every financial decision with scenarios you can pressure-test before you commit.'
  }
];

const crawlPriorityLinks = [
  { href: '/best-credit-cards-2026', label: 'Best Credit Cards 2026' },
  { href: '/best-investment-apps', label: 'Best Investment Apps' },
  { href: '/best-savings-accounts-usa', label: 'Best Savings Accounts USA' },
  { href: '/learn/credit-cards', label: 'Credit Cards Hub' },
  { href: '/learn/loans', label: 'Loans Hub' },
  { href: '/compare/mortgage-rate-comparison', label: 'Mortgage Rate Comparison' },
  { href: '/in', label: 'India Finance Hub' }
];

const homepageFaqs = [
  {
    question: 'Where should I start if I need quick financial clarity?',
    answer:
      'Pick one decision you need to make this month, run the matching calculator first, and then read the linked comparison page before applying or moving money.',
    href: '/calculators',
    label: 'Browse all calculators'
  },
  {
    question: 'How are product recommendations evaluated?',
    answer:
      'Comparison pages prioritize transparent trade-offs: total cost, rates, fees, flexibility, and who each option is likely to fit based on practical usage patterns.',
    href: '/editorial-policy',
    label: 'Read editorial policy'
  },
  {
    question: 'Is FinanceSphere financial advice?',
    answer:
      'No. The site is educational. Use it to build your own decision framework, then verify current terms directly with providers before you commit.',
    href: '/financial-disclaimer',
    label: 'Read full disclaimer'
  }
];

const momentumExamples = [
  {
    label: 'Increase investing from $500 to $550/month',
    outcome: '≈ $39,000 more over 20 years',
    note: 'Assumes 8% annual growth. A $50 monthly increase can materially shift long-run flexibility.'
  },
  {
    label: 'Lower a $400,000 mortgage from 7% to 6%',
    outcome: '≈ $87,000 less total interest over 30 years',
    note: 'Illustrative principal-and-interest comparison before taxes/insurance. Confirm APR and closing-fee trade-offs.'
  },
  {
    label: 'Add $200/month on a $15,000 balance at 22% APR',
    outcome: 'Can cut payoff time by roughly 3+ years',
    note: 'Interest savings can reach five figures depending on balance, APR, and whether you avoid new card spending.'
  }
];

export function HomepageLayout() {
  return (
    <section className="space-y-10" aria-label="FinanceSphere homepage">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-[0_30px_80px_-40px_rgba(37,99,235,0.9)]">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.6),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(129,140,248,0.5),transparent_35%),linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:auto,auto,26px_26px,26px_26px]" />
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/60 bg-white/15 px-3 py-1 text-xs font-medium text-cyan-100">
              FinanceSphere • Interactive personal finance platform
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Make smarter money decisions with real numbers</h1>
            <p className="max-w-xl text-blue-100/95">
              See exactly how much you save, invest, or lose — before you decide.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200" href="/calculators">
                Start with your situation
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/comparison">
                Compare options
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/tools">
                Explore tools
              </Link>
            </div>
            <p className="text-xs text-blue-200">Last homepage review: March 26, 2026 • Educational content only; verify final terms with providers before action.</p>
          </div>
          <div className="relative space-y-3 rounded-xl border border-cyan-100/30 bg-slate-900/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur">
            <div className="relative h-36 overflow-hidden rounded-lg border border-white/20">
              <Image
                src="/images/home-hero-finance-dashboard.svg"
                alt="Finance dashboard illustration showing savings growth, investment trend, and budget goals"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">Decision engine workflow</h2>
            <p className="text-sm text-cyan-100">In under 10 minutes: quantify your scenario, compare trade-offs, and choose the next step with a downside plan.</p>
          </div>
        </div>
      </Card>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-500/40 dark:bg-amber-500/10" aria-labelledby="india-edition-heading">
        <h2 id="india-edition-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Looking for India-specific finance planning?</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Explore FinanceSphere India for ₹-based calculators and guides on SIP, FD, PPF, ELSS, EMI, tax-saving, and home loan decisions.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/in" className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900">Visit FinanceSphere India</Link>
          <Link href="/in/blog/sip-vs-fd" className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-800 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200">Read SIP vs FD</Link>
          <Link href="/in/calculators/emi-calculator" className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-800 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200">Use India EMI Calculator</Link>
        </div>
      </section>

      <section aria-labelledby="what-to-do-first" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 id="what-to-do-first" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What to do first</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Pick a goal, run the numbers, then choose your best next step.</p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="real-number-examples">
        <h2 id="real-number-examples" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Money impact snapshot</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {momentumExamples.map((example) => (
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

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-900" aria-label="Trust and transparency links">
        {trustSignals.map((signal) => (
          <Link key={signal.label} href={signal.href} className="flex items-start gap-2 rounded-xl border border-slate-100 px-3 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-700 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{signal.label}</span>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="priority-pages-heading">
        <h2 id="priority-pages-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Popular comparison and learning pages</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {crawlPriorityLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular calculators</h2>
          <Link href="/calculators" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">See all calculators</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {popularCalculators.map((calculator) => (
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
        {tools.map((tool) => (
          <Card key={tool.title} className="rounded-2xl border-slate-200/90 bg-gradient-to-b from-white to-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{tool.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{tool.desc}</p>
            <Link href={tool.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 dark:text-blue-300">Open section →</Link>
          </Card>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="homepage-faq-heading">
        <h2 id="homepage-faq-heading" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick answers before you start</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {homepageFaqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{faq.answer}</p>
              <Link href={faq.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">{faq.label}</Link>
            </article>
          ))}
        </div>
      </section>

      <AuthorBox className="mt-0" />

      <NewsletterForm source="homepage" className="scroll-mt-24" />
    </section>
  );
}
