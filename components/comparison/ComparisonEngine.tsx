'use client';

import { useEffect, useMemo, useState } from 'react';
import { OfferCard } from '@/components/comparison-table/OfferCard';
import type { FinancialCategory, FinancialProduct } from '@/lib/financialProducts';

function extractRate(value: string) {
  return Number(value.match(/[\d.]+/)?.[0] ?? 0);
}

export function ComparisonEngine({ defaultCategory = 'all' }: { defaultCategory?: FinancialCategory | 'all' }) {
  const [products, setProducts] = useState<FinancialProduct[]>([]);
  const [category, setCategory] = useState<FinancialCategory | 'all'>(defaultCategory);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'apr_apy'>('rating');

  useEffect(() => {
    fetch('/api/products').then((res) => res.json()).then(setProducts).catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...products]
      .filter((item) => category === 'all' || item.category === category)
      .filter((item) => {
        if (!query) return true;
        return [item.name, item.bank, item.category, item.pros.join(' '), item.cons.join(' ')].join(' ').toLowerCase().includes(query);
      })
      .sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : extractRate(b.apr_apy) - extractRate(a.apr_apy)));
  }, [category, products, search, sortBy]);

  return (
    <section className="space-y-5">
      <div className="comparison-filter-grid">
        <input className="input" placeholder="Search products or banks" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select className="input" value={category} onChange={(event) => setCategory(event.target.value as FinancialCategory | 'all')}>
          <option value="all">All Categories</option>
          <option value="credit_card">Credit Cards</option>
          <option value="savings_account">Savings Accounts</option>
          <option value="investment_app">Investment Apps</option>
          <option value="mortgage_lender">Mortgage Lenders</option>
          <option value="personal_loan">Personal Loans</option>
        </select>
        <select className="input" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'rating' | 'apr_apy')}>
          <option value="rating">Sort by Rating</option>
          <option value="apr_apy">Sort by APR/APY</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((product) => <OfferCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
