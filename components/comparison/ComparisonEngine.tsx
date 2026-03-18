'use client';

import { useEffect, useMemo, useState } from 'react';
import { OfferCard } from '@/components/comparison-table/OfferCard';
import type { FinancialCategory, FinancialProduct } from '@/lib/financialProducts';

function extractRate(value: string) {
  return Number(value.match(/[\d.]+/)?.[0] ?? 0);
}

function parseAnnualFee(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function ComparisonEngine({ defaultCategory = 'all' }: { defaultCategory?: FinancialCategory | 'all' }) {
  const [products, setProducts] = useState<FinancialProduct[]>([]);
  const [category, setCategory] = useState<FinancialCategory | 'all'>(defaultCategory);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'apr_apy' | 'annual_fee'>('rating');
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [noAnnualFeeOnly, setNoAnnualFeeOnly] = useState(false);

  useEffect(() => {
    fetch('/api/products').then((res) => res.json()).then(setProducts).catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...products]
      .filter((item) => category === 'all' || item.category === category)
      .filter((item) => !recommendedOnly || item.recommended_flag)
      .filter((item) => !noAnnualFeeOnly || parseAnnualFee(item.annual_fee) === 0)
      .filter((item) => {
        if (!query) return true;
        return [item.name, item.bank, item.category, item.pros.join(' '), item.cons.join(' ')].join(' ').toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'annual_fee') return parseAnnualFee(a.annual_fee) - parseAnnualFee(b.annual_fee);
        return extractRate(b.apr_apy) - extractRate(a.apr_apy);
      });
  }, [category, products, recommendedOnly, noAnnualFeeOnly, search, sortBy]);

  return (
    <section className="space-y-5">
      <div className="comparison-filter-grid">
        <input className="input" placeholder="Search products, banks, or features" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select className="input" value={category} onChange={(event) => setCategory(event.target.value as FinancialCategory | 'all')}>
          <option value="all">All Categories</option>
          <option value="credit_card">Credit Cards</option>
          <option value="savings_account">Savings Accounts</option>
          <option value="investment_app">Investment Apps</option>
          <option value="mortgage_lender">Mortgage Lenders</option>
          <option value="personal_loan">Personal Loans</option>
        </select>
        <select className="input" value={sortBy} onChange={(event) => setSortBy(event.target.value as 'rating' | 'apr_apy' | 'annual_fee')}>
          <option value="rating">Sort by Rating</option>
          <option value="apr_apy">Sort by APR/APY</option>
          <option value="annual_fee">Sort by Annual Fee</option>
        </select>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700">
            <input type="checkbox" checked={recommendedOnly} onChange={(event) => setRecommendedOnly(event.target.checked)} />
            Recommended only
          </label>
          <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700">
            <input type="checkbox" checked={noAnnualFeeOnly} onChange={(event) => setNoAnnualFeeOnly(event.target.checked)} />
            No annual fee
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> offers. Always review full terms before you apply.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((product) => <OfferCard key={product.id} product={product} />)}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          No matching products found. Try removing one filter or searching by a broader term.
        </p>
      ) : null}
    </section>
  );
}
