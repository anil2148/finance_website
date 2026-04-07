'use client';

import Link from 'next/link';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

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
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const latestGuides = useMemo(
    () => [...guides].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 4),
    [guides]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    guides.forEach((guide) => {
      counts[guide.category] = (counts[guide.category] || 0) + 1;
    });
    return counts;
  }, [guides]);

  const filteredGuides = useMemo(() => {
    let result = guides;

    if (activeCategory) {
      result = result.filter((guide) => guide.category === activeCategory);
    }

    if (!query.trim()) {
      return result;
    }

    const fuse = new Fuse(result, {
      keys: ['title', 'description', 'category'],
      threshold: 0.35,
      ignoreLocation: true
    });

    return fuse.search(query).map((result) => result.item);
  }, [guides, query, activeCategory]);

  const groupedGuides = useMemo(() => {
    const groups = new Map<string, IndiaBlogGuide[]>();
    filteredGuides.forEach((guide) => {
      if (!groups.has(guide.category)) {
        groups.set(guide.category, []);
      }
      groups.get(guide.category)!.push(guide);
    });
    return groups;
  }, [filteredGuides]);

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
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India money guides for real household decisions</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          These guides are built around the decisions Indian families actually face: how much SIP is enough, whether FD still makes sense for medium-term goals, how to pick a tax regime without guessing, and whether the EMI you can afford today will still feel comfortable in three years. Use them alongside the calculators — not instead of them.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Start here based on your situation</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Not sure where to begin? Match your most urgent decision to the right guide.</p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Search India guides</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Search by topic, goal, or product — SIP, home loan EMI, PPF, ELSS, tax regime, emergency fund.</p>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 ${activeCategory === null ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'}`}
          >
            All
          </button>
          {Object.entries(CATEGORY_LABELS).map(([category, meta]) => (
            <button
              key={category}
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 ${activeCategory === category ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'}`}
              aria-pressed={activeCategory === category}
            >
              {meta.emoji} {meta.label}
            </button>
          ))}
        </div>
        <input
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950"
          placeholder="Search guides by topic: SIP, PPF, ELSS, loans, tax, savings..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search India blog guides"
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Showing {filteredGuides.length} guide{filteredGuides.length === 1 ? '' : 's'}.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What this hub covers</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(CATEGORY_LABELS).map(([category, meta]) => (
            <article key={category} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{meta.emoji} {meta.label}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{categoryCounts[category] || 0} guides published</p>
            </article>
          ))}
        </div>
        <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">Recently added</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {latestGuides.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/in/blog/${guide.slug}`} className="content-link">
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {Array.from(groupedGuides.entries()).map(([category, categoryGuides]) => {
        const { label, emoji } = CATEGORY_LABELS[category] || { label: category, emoji: '📖' };
        return (
          <section key={category}>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {emoji} {label}
              </h2>
              {category === 'investing' && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">How to build wealth through SIPs, when FD is the better choice, and how to stay invested through market corrections.</p>}
              {category === 'loans' && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">EMI affordability, rate reset risk, and how to avoid home loan decisions that look fine at signing but squeeze the budget in year 3.</p>}
              {category === 'tax' && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Tax regime comparison, 80C strategy without the March rush, and capital gains planning before you rebalance.</p>}
              {category === 'savings' && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Emergency fund targets, FD ladder strategy, and how to avoid rate-chasing that reduces real yield after penalties.</p>}
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

      {filteredGuides.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          No matching guides yet. Try searching for a broader term like <span className="font-semibold">tax</span>, <span className="font-semibold">SIP</span>, or <span className="font-semibold">loan</span>.
        </section>
      ) : null}

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">📍 Why these guides are India-specific</h3>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
          Financial decisions in India follow specific rules that global tools do not account for: SIP taxation under LTCG, Section 80C deduction limits and eligibility, PPF lock-in structures, floating rate EMI resets, and the GST layer on insurance and financial services. These guides translate the real numbers into practical decisions for Indian salary ranges and household expense patterns.
        </p>
      </section>
    </section>
  );
}
