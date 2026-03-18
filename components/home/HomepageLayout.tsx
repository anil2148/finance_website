'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CheckBadgeIcon,
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

const quickStartSteps = [
  {
    title: '1) Run a calculator first',
    description: 'Start with your immediate decision (mortgage, debt, savings, retirement) to get a realistic range.'
  },
  {
    title: '2) Compare products with your numbers',
    description: 'Filter offers by APR/APY, annual fees, and product fit so recommendations match your constraints.'
  },
  {
    title: '3) Use a guide to pressure-test your plan',
    description: 'Read tactical explainers and checklists before taking action to reduce expensive mistakes.'
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
  { label: 'How to get help and report issues', href: '/help' }
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
              Start with a calculator, compare real offers using your numbers, and follow practical guides to avoid costly mistakes across debt, savings, home financing, and investing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200" href="/calculators">
                Explore calculators
              </Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/comparison">
                Compare products
              </Link>
            </div>
            <p className="text-xs text-blue-200">Last content review: March 18, 2026 • Coverage includes U.S., UK, Canada, and India contexts.</p>
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
            <h2 className="text-xl font-semibold">What to do first</h2>
            <p className="text-sm text-cyan-100">Choose your goal below and move through the same workflow our readers use to make faster decisions.</p>
            <ul className="space-y-2 text-sm text-cyan-50">
              {quickStartSteps.map((step) => (
                <li key={step.title} className="rounded-lg border border-white/15 bg-white/5 p-2">
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-cyan-100">{step.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">
        {trustSignals.map((signal) => (
          <Link key={signal.label} href={signal.href} className="flex items-start gap-2 rounded-xl border border-slate-100 px-3 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/40">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
            <span className="font-medium text-slate-700">{signal.label}</span>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Popular calculators</h2>
          <Link href="/calculators" className="text-sm font-semibold text-blue-700 hover:underline">See all calculators</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {popularCalculators.map((calculator) => (
            <motion.div key={calculator.href} whileHover={{ y: -4 }}>
              <Link href={calculator.href}>
                <Card className="h-full border-slate-200/80 bg-white/85 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.8)]">
                  <ChartBarIcon className="h-6 w-6 text-blue-700" />
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{calculator.title}</h3>
                  <p className="text-sm leading-6 text-slate-700">{calculator.description}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="rounded-2xl border-slate-200/90 bg-gradient-to-b from-white to-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900">{tool.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{tool.desc}</p>
            <Link href={tool.href} className="mt-3 inline-block text-sm font-semibold text-blue-700">Open section →</Link>
          </Card>
        ))}
      </section>

      <Card className="border-slate-200/90 bg-white/90">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <ArrowTrendingUpIcon className="h-5 w-5 text-blue-700" /> Decide with confidence
        </h3>
        <p className="text-sm leading-6 text-slate-700">
          FinanceSphere blends calculators, product comparisons, and editorial guides into one decision workflow so you can explain your plan before committing.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Link href="/compare/best-credit-cards-2026" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
            <CheckBadgeIcon className="mr-2 inline h-4 w-4" /> Best credit cards with transparent trade-offs
          </Link>
          <Link href="/compare/best-investment-apps" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
            <SparklesIcon className="mr-2 inline h-4 w-4" /> Investment app comparison with fit guidance
          </Link>
        </div>
      </Card>

      <NewsletterForm source="homepage" className="scroll-mt-24" />
    </section>
  );
}
