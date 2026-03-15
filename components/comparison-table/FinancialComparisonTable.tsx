'use client';

import { useMemo, useState } from 'react';
import { RatingStars } from '@/components/comparison-table/RatingStars';

type FinancialProduct = {
  id: string;
  category: string;
  name: string;
  bank: string;
  rating: number;
  apr_apy: string;
  annual_fee: string;
  pros: string[];
  cons: string[];
  affiliate_url: string;
};

type SortField = 'rating' | 'apr_apy';

const categoryLabels: Record<string, string> = {
  'credit-cards': 'Credit Cards',
  'savings-accounts': 'Savings Accounts',
  'high-yield-savings': 'High Yield Savings',
  'investment-apps': 'Investment Apps',
  mortgages: 'Mortgages'
};

function extractNumericRate(value: string) {
  const match = value.match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

export function FinancialComparisonTable({ data, defaultCategory }: { data: FinancialProduct[]; defaultCategory?: string }) {
  const [category, setCategory] = useState(defaultCategory ?? 'all');
  const [sortBy, setSortBy] = useState<SortField>('rating');

  const categories = useMemo(() => ['all', ...Array.from(new Set(data.map((item) => item.category)))], [data]);

  const rows = useMemo(() => {
    return [...data]
      .filter((item) => category === 'all' || item.category === category)
      .sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : extractNumericRate(b.apr_apy) - extractNumericRate(a.apr_apy)));
  }, [category, data, sortBy]);

  return (
    <section className="space-y-4">
      <div className="comparison-filter-grid">
        <label className="text-sm font-semibold" htmlFor="category-filter">Filter by category</label>
        <select id="category-filter" className="input" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>{item === 'all' ? 'All Categories' : categoryLabels[item] ?? item}</option>
          ))}
        </select>

        <label className="text-sm font-semibold" htmlFor="sort-filter">Sort by</label>
        <select id="sort-filter" className="input" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortField)}>
          <option value="rating">Highest Rating</option>
          <option value="apr_apy">Highest APR/APY</option>
        </select>
      </div>

      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Bank</th>
              <th className="p-3">Rating</th>
              <th className="p-3">APR/APY</th>
              <th className="p-3">Annual Fee</th>
              <th className="p-3">Pros</th>
              <th className="p-3">Cons</th>
              <th className="p-3">Offer</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id} className="border-t border-slate-200 align-top">
                <td className="p-3 font-semibold">{product.name}</td>
                <td className="p-3">{product.bank}</td>
                <td className="p-3"><RatingStars rating={product.rating} /></td>
                <td className="p-3">{product.apr_apy}</td>
                <td className="p-3">{product.annual_fee}</td>
                <td className="p-3"><ul className="comparison-list">{product.pros.map((pro) => <li key={pro}>{pro}</li>)}</ul></td>
                <td className="p-3"><ul className="comparison-list">{product.cons.map((con) => <li key={con}>{con}</li>)}</ul></td>
                <td className="p-3">
                  <a className="btn-primary" href={product.affiliate_url} target="_blank" rel="noreferrer sponsored noopener">View Offer</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
