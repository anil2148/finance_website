'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { comparisonProducts } from '@/data/comparisonProducts';

export default function ComparisonPage() {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  const filtered = useMemo(() => {
    const base = category === 'all' ? comparisonProducts : comparisonProducts.filter((item) => item.category === category);
    return [...base].sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : a.name.localeCompare(b.name)));
  }, [category, sortBy]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Comparison Engine</h1>
        <p className="text-slate-600 dark:text-slate-300">Sort, filter, and evaluate top products with ratings, pros/cons, and affiliate actions.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          <option value="credit-cards">Credit cards</option>
          <option value="personal-loans">Personal loans</option>
          <option value="mortgage-lenders">Mortgage lenders</option>
          <option value="savings-accounts">Savings accounts</option>
          <option value="investment-apps">Investment apps</option>
        </select>
        <select
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'rating' | 'name')}
        >
          <option value="rating">Sort by rating</option>
          <option value="name">Sort by name</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filtered.map((product) => (
          <Card
            key={product.id}
            className="grid gap-4 border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-100 md:grid-cols-[1.3fr_1fr_auto] md:items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Rating: {product.rating} · APR/APY: {product.apr}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200"><span className="font-medium">Pros:</span> {product.pros.join(', ')}</p>
              <p className="text-sm text-slate-700 dark:text-slate-200"><span className="font-medium">Cons:</span> {product.cons.join(', ')}</p>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">{product.category.replace('-', ' ')}</div>
            <a href={product.affiliateUrl} className="rounded-lg bg-brand px-4 py-2 text-center font-semibold text-white">View Offer</a>
          </Card>
        ))}
      </div>
    </section>
  );
}
