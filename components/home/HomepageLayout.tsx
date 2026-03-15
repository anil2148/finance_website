'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

const stats = [
  { label: 'Monthly users', value: '120K+' },
  { label: 'Calculators used', value: '2.4M' },
  { label: 'SEO articles', value: '1000' }
];

const modules = [
  { title: 'Calculators', href: '/calculators', desc: 'Mortgage, loan EMI, FIRE, retirement, debt payoff and more.' },
  { title: 'Dashboard', href: '/dashboard', desc: 'Net worth, assets vs liabilities, and savings progress charts.' },
  { title: 'Comparison Engine', href: '/comparison', desc: 'Filter and sort financial products with affiliate CTAs.' }
];

export function HomepageLayout() {
  return (
    <section className="space-y-8">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-brand via-blue-700 to-slate-900 text-white">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs"><SparklesIcon className="h-4 w-4" /> Modern fintech SaaS experience</p>
            <h1 className="text-4xl font-bold leading-tight">One platform for financial planning, product comparisons, and SEO insights</h1>
            <p className="max-w-xl text-blue-100">A JAMstack personal finance app with content engine, calculators, dashboard analytics, and conversion-focused affiliate journeys.</p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-white px-4 py-2 font-semibold text-slate-900 transition hover:scale-[1.02]" href="/dashboard">Open Dashboard</Link>
              <Link className="rounded-xl border border-white/40 px-4 py-2 font-semibold transition hover:bg-white/10" href="/blog">Read SEO Guides</Link>
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

      <div className="grid gap-4 lg:grid-cols-3">
        {modules.map((c) => (
          <motion.div key={c.href} whileHover={{ y: -4 }}>
            <Link href={c.href}>
              <Card className="h-full">
                <ChartBarIcon className="h-6 w-6 text-brand" />
                <h2 className="mt-2 text-lg font-semibold">{c.title}</h2>
                <p className="text-sm text-slate-600">{c.desc}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <Card>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><ArrowTrendingUpIcon className="h-5 w-5 text-brand" /> Internal growth loops</h3>
        <p className="text-sm text-slate-600">Content drives search traffic to calculators, calculators drive tool adoption, and comparison pages monetize with affiliate partnerships.</p>
      </Card>

      <NewsletterSignup />
    </section>
  );
}
