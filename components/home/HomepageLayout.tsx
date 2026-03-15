'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

const stats = [
  { label: 'Monthly users', value: '120K+' },
  { label: 'Calculators used', value: '2.4M' },
  { label: 'Avg. savings found', value: '$430/yr' }
];

const calculators = [
  { title: 'Mortgage', href: '/mortgage-calculator', desc: 'Estimate monthly payment and interest split.' },
  { title: 'Loan EMI', href: '/loan-emi-calculator', desc: 'Calculate EMI and amortization path instantly.' },
  { title: 'Compound Growth', href: '/compound-interest-calculator', desc: 'Project wealth with regular investing.' }
];

const products = [
  { title: 'Top cashback cards', href: '/best-credit-cards' },
  { title: 'Best savings rates', href: '/best-savings-accounts' },
  { title: 'Best investing apps', href: '/best-investment-apps' }
];

const articles = [
  { title: 'How to save $500/month', href: '/blog/how-to-save-500-month-95' },
  { title: 'Mortgage tips for first-time buyers', href: '/blog/mortgage-tips-98' },
  { title: 'Tax saving strategies to keep more income', href: '/blog/tax-saving-strategies-99' }
];

export function HomepageLayout() {
  return (
    <section className="space-y-8">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-brand via-blue-700 to-slate-900 text-white">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs"><SparklesIcon className="h-4 w-4" /> Modern finance dashboard</p>
            <h1 className="text-4xl font-bold leading-tight">Plan smarter with interactive calculators and product comparisons</h1>
            <p className="max-w-xl text-blue-100">Track your future payments, investment growth, and product choices in one fintech-style experience.</p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-xl bg-white px-4 py-2 font-semibold text-slate-900 transition hover:scale-[1.02]" href="/calculators">Explore Calculators</Link>
              <Link className="rounded-xl border border-white/40 px-4 py-2 font-semibold transition hover:bg-white/10" href="/credit-cards">Compare Products</Link>
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
        {calculators.map((c) => (
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><ArrowTrendingUpIcon className="h-5 w-5 text-brand" /> Top financial products</h3>
          <ul className="space-y-2">
            {products.map((p) => (
              <li key={p.href}><Link className="flex items-center justify-between rounded-lg p-2 transition hover:bg-slate-100" href={p.href}><span>{p.title}</span><span className="text-brand">View</span></Link></li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-3 text-lg font-semibold">Latest articles</h3>
          <ul className="space-y-2">
            {articles.map((a) => (
              <li key={a.href}><Link className="block rounded-lg p-2 transition hover:bg-slate-100" href={a.href}>{a.title}</Link></li>
            ))}
          </ul>
        </Card>
      </div>

      <NewsletterSignup />
    </section>
  );
}
