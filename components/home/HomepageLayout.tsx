'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ChartBarIcon } from '@heroicons/react/24/outline';
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

const tools = [
  { title: 'Plan major money moves', desc: 'Model home-buying, refinancing, debt payoff, and long-term investing before you commit.', href: '/tools' },
  { title: 'Read practical money guides', desc: 'Get step-by-step explainers on credit cards, savings rates, loan terms, and tax basics.', href: '/blog' },
  { title: 'Compare real product trade-offs', desc: 'Review APR/APY, fees, bonuses, and key pros/cons side-by-side in minutes.', href: '/comparison' }
];

export function HomepageLayout() {
  return (
    <section className="space-y-10">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white shadow-[0_30px_80px_-40px_rgba(37,99,235,0.9)]">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.6),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(129,140,248,0.5),transparent_35%),linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:auto,auto,26px_26px,26px_26px]" />
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/60 bg-white/15 px-3 py-1 text-xs font-medium text-cyan-100">FinanceSphere</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Finance tools for home, debt, savings, and investing decisions</h1>
            <p className="max-w-xl text-blue-100/95">FinanceSphere helps households, first-time buyers, and long-term savers compare trade-offs before committing to a mortgage, debt plan, or investing strategy.</p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200" href="/calculators">Explore calculators</Link>
              <Link className="rounded-xl border border-white/50 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/15" href="/blog">Read money guides</Link>
            </div>
          </div>
          <div className="relative rounded-xl border border-cyan-100/30 bg-slate-900/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur">
            <h2 className="text-xl font-semibold">What you can do today</h2>
            <p className="mt-2 text-sm text-cyan-100">Use focused calculators to estimate payments, compare timelines, and test how one change today affects your long-term plan.</p>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Popular calculators</h2>
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
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900"><ArrowTrendingUpIcon className="h-5 w-5 text-blue-700" /> Decide with confidence</h3>
        <p className="text-sm leading-6 text-slate-700">FinanceSphere brings your key numbers into one workflow so you can compare options, spot trade-offs early, and move forward with a plan you can explain.</p>
      </Card>

      <NewsletterForm source="homepage" />
    </section>
  );
}
