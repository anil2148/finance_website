'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

type CalculatorDirectoryItem = {
  slug: string;
  title: string;
  description: string;
  category: CalculatorCategory;
};

type CalculatorCategory =
  | 'borrowing'
  | 'savings'
  | 'investing-retirement'
  | 'debt-payoff'
  | 'tax-income';

const CATEGORY_PILLS: Array<{ label: string; value: 'all' | CalculatorCategory }> = [
  { label: 'All', value: 'all' },
  { label: 'Borrowing', value: 'borrowing' },
  { label: 'Savings', value: 'savings' },
  { label: 'Investing & Retirement', value: 'investing-retirement' },
  { label: 'Debt payoff', value: 'debt-payoff' },
  { label: 'Tax & Income', value: 'tax-income' }
];

export function CalculatorDirectory({ calculators }: { calculators: CalculatorDirectoryItem[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | CalculatorCategory>('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextQuery = params.get('q')?.trim() ?? '';
    const nextCategory = params.get('cat');

    setQuery(nextQuery);

    if (nextCategory && CATEGORY_PILLS.some((pill) => pill.value === nextCategory)) {
      setCategory(nextCategory as 'all' | CalculatorCategory);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }

    if (category !== 'all') {
      params.set('cat', category);
    } else {
      params.delete('cat');
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState({}, '', nextUrl);
  }, [query, category]);

  const filteredCalculators = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return calculators.filter((tool) => {
      const matchesCategory = category === 'all' || tool.category === category;
      const matchesSearch = !normalizedQuery
        || tool.title.toLowerCase().includes(normalizedQuery)
        || tool.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [calculators, category, query]);

  return (
    <section className="space-y-4" aria-label="Calculator search and filter">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label htmlFor="calculator-search" className="sr-only">Search calculators</label>
        <input
          id="calculator-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search calculators…"
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none ring-blue-500 transition focus:border-blue-500 focus:ring-2"
        />
        <div className="mt-3 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            {CATEGORY_PILLS.map((pill) => {
              const selected = category === pill.value;
              return (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => setCategory(pill.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${selected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700'
                  }`}
                  aria-pressed={selected}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredCalculators.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCalculators.map((tool) => (
            <Link key={tool.slug} href={`/calculators/${tool.slug}`} data-category={tool.category}>
              <Card className="h-full rounded-2xl transition hover:-translate-y-1 hover:shadow-md" data-category={tool.category}>
                <h2 className="text-lg font-semibold">{tool.title}</h2>
                <p className="text-sm text-slate-600">{tool.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-700">
          No calculators match — try &apos;mortgage&apos; or &apos;retirement&apos;
        </div>
      )}
    </section>
  );
}
