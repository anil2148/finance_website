'use client';

import { useMemo, useState } from 'react';
import products from '@/data/financial-products.json';
import { Card } from '@/components/ui/card';

type OfferRecord = (typeof products)[number];
type SortMode = 'rating' | 'apr_apy';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Credit Cards', value: 'credit-cards' },
  { label: 'Savings Accounts', value: 'savings-accounts' },
  { label: 'High Yield Savings', value: 'high-yield-savings' },
  { label: 'Investment Apps', value: 'investment-apps' },
  { label: 'Mortgages', value: 'mortgages' }
] as const;

const extractRate = (value: string) => Number(value.match(/[\d.]+/)?.[0] ?? 0);

export function ComparisonPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortMode>('rating');

  const visibleOffers = useMemo(
    () => [...products]
      .filter((offer) => activeCategory === 'all' || offer.category === activeCategory)
      .sort((left, right) => (sortBy === 'rating' ? right.rating - left.rating : extractRate(right.apr_apy) - extractRate(left.apr_apy))),
    [activeCategory, sortBy]
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Comparison</h1>
        <p className="text-slate-600">Filter by category and sort by rating or APR/APY to discover the best offer.</p>
      </div>

      <div className="comparison-filter-grid">
        <label htmlFor="comparison-category" className="text-sm font-semibold">Category</label>
        <select id="comparison-category" className="input" value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>
          {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
        </select>
        <label htmlFor="comparison-sort" className="text-sm font-semibold">Sort By</label>
        <select id="comparison-sort" className="input" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortMode)}>
          <option value="rating">Highest Rating</option>
          <option value="apr_apy">Highest APR/APY</option>
        </select>
      </div>

      <div className="grid gap-4">
        {visibleOffers.map((offer) => (
          <Card key={offer.id} className="comparison-offer-card">
                        <div className="space-y-2">
              <p className="text-sm font-medium text-brand">{offer.bank}</p>
              <h3 className="text-lg font-semibold">{offer.name}</h3>
              <p className="text-sm text-slate-600">APR/APY: {offer.apr_apy} · Rating: {offer.rating.toFixed(1)}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-emerald-700">Pros</p>
              <ul className="comparison-list">{offer.pros.map((pro) => <li key={pro}>{pro}</li>)}</ul>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-rose-700">Cons</p>
              <ul className="comparison-list">{offer.cons.map((con) => <li key={con}>{con}</li>)}</ul>
            </div>
            <a href={offer.affiliate_url} className="comparison-cta" target="_blank" rel="noopener noreferrer sponsored">View Offer</a>
                    </Card>
        ))}
      </div>
    </section>
  );
}
