'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRecentAnalyses, type RecentAnalyzedStock } from '@/lib/stock-local-storage';

function currency(value: number) {
  if (!Number.isFinite(value)) return 'Price unavailable';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Saved locally';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function RecentStockAnalyses() {
  const [items, setItems] = useState<RecentAnalyzedStock[]>([]);

  useEffect(() => {
    setItems(getRecentAnalyses());
  }, []);

  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="recent-stock-analyses">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">Recently analyzed</p>
          <h2 id="recent-stock-analyses" className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Pick up your stock research where you left off.</h2>
        </div>
        <Link href="/stock-analyzer" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">Open Stock Analyzer</Link>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.symbol}
            href={`/stock-analyzer?symbol=${encodeURIComponent(item.symbol)}`}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/70 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-emerald-400/60 dark:hover:bg-emerald-400/10"
          >
            <span className="block text-lg font-black text-slate-950 dark:text-white">{item.symbol}</span>
            <span className="mt-1 block truncate text-sm text-slate-600 dark:text-slate-300">{item.companyName}</span>
            <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">
              {currency(item.lastPrice)}{item.verdict ? ` · ${item.verdict}` : ''} · {formatDate(item.analyzedAt)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
