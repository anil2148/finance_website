'use client';

import { useMemo, useState } from 'react';
import { RatingStars } from '@/components/comparison-table/RatingStars';
import { CATEGORY_LABELS, type FinancialProduct } from '@/lib/financialProducts';
import { trackEvent } from '@/lib/analytics';

type SortField = 'rating' | 'apr_apy';

function extractNumericRate(value: string) {
  const match = value.match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function bestForSegment(product: FinancialProduct) {
  if (product.annual_fee.includes('$0')) return 'No annual fee seekers';
  if (product.bonus_offer.toLowerCase().includes('cash') || product.bonus_offer.toLowerCase().includes('back')) return 'Cashback maximizers';
  if (product.category === 'investment_app') return 'Beginner investors';
  if (product.category === 'savings_account') return 'Emergency fund builders';
  return 'Rate-conscious shoppers';
}

export function FinancialComparisonTable({ data, defaultCategory, hideControls = false }: { data: FinancialProduct[]; defaultCategory?: string; hideControls?: boolean }) {
  const [category, setCategory] = useState(defaultCategory ?? 'all');
  const [sortBy, setSortBy] = useState<SortField>('rating');

  const categories = useMemo(() => ['all', ...Array.from(new Set(data.map((item) => item.category)))], [data]);

  const rows = useMemo(() => {
    return [...data]
      .filter((item) => category === 'all' || item.category === category)
      .sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : extractNumericRate(b.apr_apy) - extractNumericRate(a.apr_apy)));
  }, [category, data, sortBy]);

  const topPick = rows[0];

  return (
    <section className="space-y-4 pb-16 md:pb-0">
      {topPick ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/40 dark:bg-emerald-500/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Top Pick</p>
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">{topPick.name}</h3>
          <p className="text-sm text-emerald-900 dark:text-emerald-100">Best for: {bestForSegment(topPick)} • {topPick.bonus_offer}</p>
        </div>
      ) : null}

      {!hideControls && <div className="comparison-filter-grid">
        <label className="text-sm font-semibold" htmlFor="category-filter">Filter by category</label>
        <select id="category-filter" className="input" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>{item === 'all' ? 'All Categories' : CATEGORY_LABELS[item as keyof typeof CATEGORY_LABELS] ?? item}</option>
          ))}
        </select>

        <label className="text-sm font-semibold" htmlFor="sort-filter">Sort by</label>
        <select id="sort-filter" className="input" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortField)}>
          <option value="rating">Highest Rating</option>
          <option value="apr_apy">Highest APR/APY</option>
        </select>
      </div>}

      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left dark:bg-slate-800 dark:text-slate-100">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Bank</th><th className="p-3">Best For</th><th className="p-3">Rating</th><th className="p-3">APR/APY</th><th className="p-3">Annual Fee</th><th className="p-3">Pros</th><th className="p-3">Cons</th><th className="p-3">Offer</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id} className="border-t border-slate-200 align-top dark:border-slate-700 dark:text-slate-100">
                <td className="p-3 font-semibold">{product.name} {product.recommended_flag && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">Recommended</span>}</td>
                <td className="p-3">{product.bank}</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">{bestForSegment(product)}</td>
                <td className="p-3"><RatingStars rating={product.rating} /></td>
                <td className="p-3">{product.apr_apy}</td>
                <td className="p-3">{product.annual_fee}</td>
                <td className="p-3"><ul className="comparison-list">{product.pros.map((pro) => <li key={pro}>{pro}</li>)}</ul></td>
                <td className="p-3"><ul className="comparison-list">{product.cons.map((con) => <li key={con}>{con}</li>)}</ul></td>
                <td className="p-3"><a className="btn-primary" href={`/go/${product.id}`} onClick={() => trackEvent({ event: 'affiliate_click', category: 'comparison_table', label: product.id })} target="_blank" rel="noreferrer sponsored noopener">View Offer</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {topPick ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden dark:border-slate-700 dark:bg-slate-900/95">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <p className="text-xs text-slate-700 dark:text-slate-200"><span className="font-semibold">Top pick:</span> {topPick.name}</p>
            <a className="btn-primary !px-3 !py-1.5 text-xs" href={`/go/${topPick.id}`} onClick={() => trackEvent({ event: 'sticky_cta_click', category: 'comparison', label: topPick.id })}>Claim Offer</a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
