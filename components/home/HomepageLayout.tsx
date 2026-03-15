'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

const stats = [
  { label: 'Monthly users', value: '120K+' },
  { label: 'Calculators run', value: '2.4M' },
  { label: 'Avg. session', value: '5m 12s' }
];

const popularCalculators = [
  ['Mortgage Calculator', '/calculators/mortgage-calculator'],
  ['Compound Interest Calculator', '/calculators/compound-interest-calculator'],
  ['Debt Payoff Calculator', '/calculators/debt-payoff-calculator']
];

const tools = [
  { title: 'Financial tools', desc: 'Budget planning, tax estimation, and retirement scenarios.', href: '/tools' },
  { title: 'Latest articles', desc: 'SEO-rich financial education guides and actionable tips.', href: '/blog' },
  { title: 'Comparison tools', desc: 'Compare cards, loans, and savings accounts in one place.', href: '/comparison' }
];

export function HomepageLayout() {
  return (
    <section className="space-y-8">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-brand via-blue-700 to-slate-900 text-white">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs"><SparklesIcon className="h-4 w-4" /> Modern fintech planning hub</p>
            <h1 className="text-4xl font-bold leading-tight">Plan money smarter with interactive finance tools</h1>
            <p className="max-w-xl text-blue-100">Live calculators, dynamic charts, and data-rich comparisons designed for fast planning on desktop and mobile.</p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-white px-4 py-2 font-semibold text-slate-900 transition hover:scale-[1.02]" href="/calculators">Explore calculators</Link>
              <Link className="rounded-xl border border-white/40 px-4 py-2 font-semibold transition hover:bg-white/10" href="/comparison">Compare products</Link>
            </div>
          </div>
          <div className="grid gap-3">
            {stats.map((item, idx) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-blue-100">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Popular calculators</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {popularCalculators.map(([title, href]) => (
            <motion.div key={href} whileHover={{ y: -4 }}>
              <Link href={href}>
                <Card className="h-full">
                  <ChartBarIcon className="h-6 w-6 text-brand" />
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-slate-600">Instant updates with slider controls, visual breakdowns, and mobile-friendly UX.</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-lg font-semibold">{tool.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{tool.desc}</p>
            <Link href={tool.href} className="mt-3 inline-block text-sm font-medium text-brand">Open section →</Link>
          </Card>
        ))}
      </section>

      <Card>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><ArrowTrendingUpIcon className="h-5 w-5 text-brand" /> Better decisions, faster</h3>
        <p className="text-sm text-slate-600">Use projection charts and scenario sliders to compare outcomes before you commit to a mortgage, investment, or payoff strategy.</p>
      </Card>

      <NewsletterSignup />
    </section>
  );
}
