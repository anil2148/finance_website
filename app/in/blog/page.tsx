import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

const indiaGuides = [
  {
    title: 'SIP vs FD in India: Which fits your 3, 5, and 10-year goals?',
    href: '/in/blog/sip-vs-fd',
    description: 'Compare certainty vs growth, liquidity, and tax treatment using practical ₹ scenarios.'
  },
  {
    title: 'PPF vs ELSS: Tax-saving decision framework for Indian investors',
    href: '/in/blog/ppf-vs-elss',
    description: 'Understand lock-in, volatility, flexibility, and Section 80C strategy by life stage.'
  }
];

const pathways = [
  { label: 'Run EMI stress test (+0.5%, +1.0%)', href: '/in/calculators/emi-calculator' },
  { label: 'Model SIP at ₹5,000 / ₹10,000 / ₹25,000', href: '/in/calculators/sip-calculator' },
  { label: 'Choose SIP vs FD by timeline', href: '/in/blog/sip-vs-fd' },
  { label: 'Build 80C allocation plan', href: '/in/blog/ppf-vs-elss' }
];

export const metadata: Metadata = createPageMetadata({
  title: 'FinanceSphere India Blog | SIP, PPF, ELSS, and Home Loan Guides',
  description: 'Explore India-first personal finance guides on SIP, FD, PPF, ELSS, EMI planning, and tax-saving decisions.',
  pathname: '/in/blog'
});

export default function IndiaBlogHubPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India Blog</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India money guides built for real household decisions</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Use these guides with India calculators to choose trade-offs before committing money. The focus here is practical monthly execution: what to keep stable, what to grow, and how to avoid cashflow stress.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Start with your immediate blocker</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {pathways.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {indiaGuides.map((guide) => (
          <article key={guide.href} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{guide.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{guide.description}</p>
            <Link href={guide.href} className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">Read guide →</Link>
          </article>
        ))}
      </section>
    </section>
  );
}
