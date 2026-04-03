import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { calculatorDefinitions } from '@/lib/calculators/registry';
import { createPageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'Financial Calculators | FinanceSphere',
  description: 'Use FinanceSphere calculators to model mortgage payments, debt payoff timelines, retirement income targets, investment growth, and take-home pay scenarios.',
  pathname: '/calculators'
});

const decisionTracks = [
  {
    title: 'Borrowing decisions',
    summary: 'Home purchase, refinance, personal loan, or debt consolidation choices.',
    tools: [
      { href: '/calculators/mortgage-calculator', label: 'Home Loan EMI Calculator (India)' },
      { href: '/calculators/loan-calculator', label: 'Loan Calculator' },
      { href: '/calculators/debt-payoff-calculator', label: 'Debt Payoff Calculator' }
    ],
    compare: { href: '/compare/mortgage-rate-comparison', label: 'Compare mortgage frameworks' }
  },
  {
    title: 'Savings and cash runway',
    summary: 'Emergency fund size, transfer cadence, and monthly contribution planning.',
    tools: [
      { href: '/calculators/savings-goal-calculator', label: 'Savings Goal Calculator' },
      { href: '/calculators/budget-planner', label: 'Budget Planner' },
      { href: '/calculators/net-worth-calculator', label: 'Net Worth Calculator' }
    ],
    compare: { href: '/best-savings-accounts-usa', label: 'Compare savings account frameworks' }
  },
  {
    title: 'Investing and retirement',
    summary: 'Contribution strategy, long-term compounding, and retirement sufficiency tests.',
    tools: [
      { href: '/calculators/investment-growth-calculator', label: 'Investment Growth Calculator' },
      { href: '/calculators/retirement-calculator', label: 'Retirement Calculator' },
      { href: '/calculators/fire-calculator', label: 'FIRE Calculator' }
    ],
    compare: { href: '/best-investment-apps', label: 'Compare investment app frameworks' }
  }
];

export default function CalculatorsPage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-5 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-brand p-6 text-white md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance calculators for major money decisions</h1>
          <p className="max-w-3xl text-blue-100">Model real tradeoffs before you commit: payment resilience, timeline risk, total cost, and opportunity cost.</p>
          <p className="mt-2 max-w-3xl text-sm text-blue-100/90">
            Use one calculator to set your baseline, then validate with a <Link href="/comparison" className="font-semibold underline">comparison framework</Link> and
            a <Link href="/blog" className="font-semibold underline">decision guide</Link> tied to your scenario.
          </p>
        </div>
        <div className="relative h-44 overflow-hidden rounded-2xl border border-white/20 sm:h-52">
          <Image
            src="/images/calculator-tools-illustration.svg"
            alt="Illustration of financial calculators with charts and budgeting controls"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid-cols-3">
        {decisionTracks.map((track) => (
          <article key={track.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-base font-semibold text-slate-900">{track.title}</h2>
            <p className="mt-1 text-sm text-slate-700">{track.summary}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {track.tools.map((tool) => (
                <li key={tool.href}>
                  <Link className="font-medium text-blue-700 hover:underline" href={tool.href}>{tool.label}</Link>
                </li>
              ))}
            </ul>
            <Link href={track.compare.href} className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-blue-700 hover:underline">
              {track.compare.label}
            </Link>
          </article>
        ))}
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calculatorDefinitions.map((tool) => (
          <Link key={tool.slug} href={`/calculators/${tool.slug}`}>
            <Card className="h-full rounded-2xl transition hover:-translate-y-1 hover:shadow-md">
              <h2 className="text-lg font-semibold">{tool.title}</h2>
              <p className="text-sm text-slate-600">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3">
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Use this calculator first</h2>
          <p className="mt-1 text-sm text-slate-700">Start with the tool connected to your next decision deadline, not the most popular one.</p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Interpret results safely</h2>
          <p className="mt-1 text-sm text-slate-700">Run base, conservative, and optimistic scenarios so you can compare downside risk before committing.</p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Next action</h2>
          <p className="mt-1 text-sm text-slate-700"><Link href="/comparison" className="font-medium text-blue-700 hover:underline">Compare options</Link> and review <Link href="/editorial-policy" className="font-medium text-blue-700 hover:underline">methodology</Link> before acting.</p>
        </article>
      </section>
    </section>
  );
}
