'use client';

import Link from 'next/link';
import { useMemo } from 'react';

export type IndiaBlogGuide = {
  title: string;
  slug: string;
  description: string;
  category: 'investing' | 'loans' | 'tax' | 'savings';
  publishedAt: string;
};

export type IndiaBlogHubProps = {
  guides: IndiaBlogGuide[];
  pathways: Array<{
    label: string;
    href: string;
    group: string;
  }>;
};

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  investing: { label: 'SIP & Investing', emoji: '📈' },
  loans: { label: 'Home Loans & EMI', emoji: '🏠' },
  tax: { label: 'Tax Planning', emoji: '💰' },
  savings: { label: 'Savings & FD', emoji: '🏦' }
};

export function IndiaBlogHub({ guides, pathways }: IndiaBlogHubProps) {
  const groupedGuides = useMemo(() => {
    const groups = new Map<string, IndiaBlogGuide[]>();
    guides.forEach((guide) => {
      if (!groups.has(guide.category)) {
        groups.set(guide.category, []);
      }
      groups.get(guide.category)!.push(guide);
    });
    return groups;
  }, [guides]);

  const groupedPathways = useMemo(() => {
    const groups = new Map<string, typeof pathways>();
    pathways.forEach((p) => {
      if (!groups.has(p.group)) {
        groups.set(p.group, []);
      }
      groups.get(p.group)!.push(p);
    });
    return groups;
  }, [pathways]);

  return (
    <section className="article-prose space-y-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India Blog</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India money guides built for real household decisions</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Use these guides with India calculators to choose trade-offs before committing money. The focus here is practical monthly execution:
          what to keep stable, what to grow, and how to avoid costly surprises.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Start with your immediate blocker</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from(groupedPathways.entries()).map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{group}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-card rounded-lg p-3 text-sm no-underline">
                      <span className="text-slate-900 hover:text-blue-600 dark:text-slate-100">{item.label} →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {Array.from(groupedGuides.entries()).map(([category, categoryGuides]) => {
        const { label, emoji } = CATEGORY_LABELS[category] || { label: category, emoji: '📖' };
        return (
          <section key={category}>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {emoji} {label}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Practical guides for Indian financial decisions</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {categoryGuides.map((guide) => (
                <article
                  key={guide.slug}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{guide.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{guide.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(guide.publishedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <Link href={`/in/blog/${guide.slug}`} className="content-link">
                      Read guide →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">📍 Why India guides matter</h3>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
          Financial tools and decisions in India follow specific rules: SIP vs FD, PPF vs ELSS, Section 80C strategies, and EMI affordability
          under GST + inflation. These guides translate global finance concepts into practical ₹-based scenarios for Indian households.
        </p>
      </section>
    </section>
  );
}
