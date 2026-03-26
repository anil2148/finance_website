import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowTrendingUpIcon,
  BoltIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { NewsletterForm } from '@/components/NewsletterForm';

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
  { label: 'Our product review methodology', href: '/editorial-policy' },
  { label: 'Educational, not personalized advice', href: '/financial-disclaimer' },
  { label: 'Affiliate transparency and editorial independence', href: '/affiliate-disclosure' },
  { label: 'How we make money and protect editorial integrity', href: '/how-we-make-money' }
];

const crawlPriorityLinks = [
  { href: '/best-credit-cards-2026', label: 'Best Credit Cards 2026' },
  { href: '/best-investment-apps', label: 'Best Investment Apps' },
  { href: '/best-savings-accounts-usa', label: 'Best Savings Accounts USA' },
  { href: '/learn/credit-cards', label: 'Credit Cards Hub' },
  { href: '/learn/loans', label: 'Loans Hub' },
  { href: '/learn/investing', label: 'Investing Hub' },
  { href: '/compare/mortgage-rate-comparison', label: 'Mortgage Rate Comparison' }
];

export function HomepageLayout() {
  return (
    <section className="space-y-10">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-[0_30px_80px_-40px_rgba(37,99,235,0.9)]">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.6),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(129,140,248,0.5),transparent_35%),linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:auto,auto,26px_26px,26px_26px]" />
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/60 bg-white/15 px-3 py-1 text-xs font-medium text-cyan-100">
              FinanceSphere • Interactive personal finance platform
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Know your next money move in 10 minutes</h1>
            <p className="max-w-xl text-blue-100/95">
              Make smarter financial decisions with practical calculators, comparison tools, and guides built to help you evaluate real tradeoffs.
            </p>
            <nav aria-label="Homepage quick links" className="max-w-xl rounded-xl border border-white/30 bg-white/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Jump to</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Link href="#what-to-do-first" className="rounded-full border border-white/40 px-2.5 py-1 transition hover:bg-white/10">Workflows</Link>
                <Link href="#popular-calculators" className="rounded-full border border-white/40 px-2.5 py-1 transition hover:bg-white/10">Calculators</Link>
                <Link href="#methodology-highlights" className="rounded-full border border-white/40 px-2.5 py-1 transition hover:bg-white/10">Methodology</Link>
                <Link href="#faq" className="rounded-full border border-white/40 px-2.5 py-1 transition hover:bg-white/10">FAQ</Link>
              </div>
            </nav>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200" href="/calculators">
                Run a calculator
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/comparison">
                Compare products
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/learn/investing">
                Start with a guide
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
            <h2 className="text-xl font-semibold">Workflow snapshot</h2>
            <p className="text-sm text-cyan-100">Choose a goal and follow the same path our readers use: run your numbers, compare options, then read a focused guide.</p>
          </div>
        </div>
      </Card>


      <section aria-labelledby="what-to-do-first" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 id="what-to-do-first" className="text-2xl font-semibold text-slate-900 dark:text-slate-100">What to do first</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Pick a goal and follow one workflow: run your numbers first, compare options second, and read the matching guide before acting.</p>
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

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3 dark:border-slate-700 dark:bg-slate-900">
        {trustSignals.map((signal) => (
          <Link key={signal.label} href={signal.href} className="flex items-start gap-2 rounded-xl border border-slate-100 px-3 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-700 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" />
            <span className="font-medium text-slate-700 dark:text-slate-200">{signal.label}</span>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Popular comparison and learning pages</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {crawlPriorityLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section id="popular-calculators" className="scroll-mt-24">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Popular calculators</h2>
          <Link href="/calculators" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">See all calculators</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {popularCalculators.map((calculator) => (
            <Link key={calculator.href} href={calculator.href} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-xl">
              <Card className="h-full border-slate-200/80 bg-white/85 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.8)] transition group-hover:-translate-y-1 group-hover:shadow-md">
                <ChartBarIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" />
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

      <Card className="border-slate-200/90 bg-white/90 dark:border-slate-700 dark:bg-slate-900/90">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          <ArrowTrendingUpIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" /> Decide with confidence
        </h3>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          FinanceSphere blends calculators, product comparisons, and editorial guides into one decision workflow so you can explain your plan before committing.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Link href="/compare/best-credit-cards-2026" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">
            <CheckBadgeIcon className="mr-2 inline h-4 w-4" /> Best credit cards with transparent trade-offs
          </Link>
          <Link href="/compare/best-investment-apps" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">
            <SparklesIcon className="mr-2 inline h-4 w-4" /> Investment app comparison with fit guidance
          </Link>
        </div>
      </Card>

      <section id="methodology-highlights" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Methodology highlights</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100"><ClipboardDocumentCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-300" /> Criteria-first comparisons</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">We evaluate fit, cost, flexibility, and common failure cases. See the full scoring logic in our <Link href="/editorial-policy" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">editorial policy</Link>.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100"><BoltIcon className="h-4 w-4 text-blue-700 dark:text-blue-300" /> Decision-speed workflows</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Each pathway is designed to help you move from uncertainty to a clear shortlist quickly, with calculator and comparison links embedded throughout.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100"><ShieldCheckIcon className="h-4 w-4 text-blue-700 dark:text-blue-300" /> Transparent disclosures</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">We separate editorial guidance from monetization and publish exactly how the business works on our <Link href="/how-we-make-money" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">revenue disclosure page</Link>.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How FinanceSphere keeps pages decision-first</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">1) Define decision context</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Each major page starts with who it is for, what decision it supports, and which expensive mistake it helps avoid.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">2) Stress-test with numbers</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Guides route to calculators so readers can validate scenarios using their own payment, savings, and timeline assumptions.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">3) Publish limitations clearly</h3>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Where live provider data is unavailable in-repo, we publish comparison frameworks and explicitly label coverage limits.</p>
          </article>
        </div>
      </section>

      <section id="faq" aria-labelledby="homepage-faq" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 id="homepage-faq" className="text-xl font-semibold text-slate-900 dark:text-slate-100">Homepage FAQ</h2>
        <div className="mt-4 space-y-3">
          <details className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <summary className="cursor-pointer font-medium text-slate-900 dark:text-slate-100">What should I do first: compare products or run a calculator?</summary>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Start with a calculator so you know your target payment, timeline, or contribution range. Then compare products that fit those numbers.</p>
          </details>
          <details className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <summary className="cursor-pointer font-medium text-slate-900 dark:text-slate-100">Can I rely on FinanceSphere as my only source before opening an account?</summary>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Use FinanceSphere to narrow decisions, then confirm exact terms, rates, and eligibility on the provider site before you apply.</p>
          </details>
          <details className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <summary className="cursor-pointer font-medium text-slate-900 dark:text-slate-100">Where can I see legal and editorial standards?</summary>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Review our <Link href="/legal" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">Legal Center</Link>, <Link href="/editorial-policy" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">Editorial Policy</Link>, and <Link href="/affiliate-disclosure" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">Affiliate Disclosure</Link>.</p>
          </details>
        </div>
      </section>

      <NewsletterForm source="homepage" className="scroll-mt-24" />
    </section>
  );
}
