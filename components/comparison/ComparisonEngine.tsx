'use client';

import { useEffect, useMemo, useState } from 'react';
import { OfferCard } from '@/components/comparison-table/OfferCard';
import type { FinancialCategory, FinancialProduct } from '@/lib/financialProducts';

type ComparisonEngineProps = {
  defaultCategory?: FinancialCategory | 'all';
  initialProducts?: FinancialProduct[];
};

const LOADING_TIMEOUT_MS = 4000;

function extractRate(value: string) {
  return Number(value.match(/[\d.]+/)?.[0] ?? 0);
}

function parseAnnualFee(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function hasCompleteFinancialData(item: FinancialProduct) {
  return Boolean(item.apr_apy?.trim()) && Boolean(item.annual_fee?.trim()) && item.rating > 0;
}

export function ComparisonEngine({ defaultCategory = 'all', initialProducts = [] }: ComparisonEngineProps) {
  const [products, setProducts] = useState<FinancialProduct[]>(initialProducts.filter(hasCompleteFinancialData));
  const [category, setCategory] = useState<FinancialCategory | 'all'>(defaultCategory);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'apr_apy' | 'annual_fee'>('rating');
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [noAnnualFeeOnly, setNoAnnualFeeOnly] = useState(false);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [sourceWarning, setSourceWarning] = useState<string | null>(null);

  useEffect(() => {
    if (initialProducts.length > 0) return;

    const timeout = setTimeout(() => {
      setLoading(false);
      setSourceWarning('We are showing a fallback view because live comparison data took too long to load.');
    }, LOADING_TIMEOUT_MS);

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const loadedProducts = (Array.isArray(data) ? data : []).filter(hasCompleteFinancialData);
        setProducts(loadedProducts);
        if (loadedProducts.length === 0) {
          setSourceWarning('Some providers are temporarily unavailable. We only show offers with complete, verified data.');
        }
      })
      .catch(() => {
        setProducts([]);
        setSourceWarning('Some providers are temporarily unavailable. We only show offers with complete, verified data.');
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, [initialProducts.length]);

  const canFilter = products.length > 0;

  const filtered = useMemo(() => {
    if (!canFilter) {
      return [];
    }

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
  }, [canFilter, category, products, recommendedOnly, noAnnualFeeOnly, search, sortBy]);

  const hasActiveFilters = Boolean(search.trim()) || recommendedOnly || noAnnualFeeOnly;

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

      {sourceWarning ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{sourceWarning}</div>
      ) : null}

      {!loading && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> offers. Always review full terms before you apply.
        </div>
      )}

      {loading ? <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading comparison data…</p> : null}

      {!loading && filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
          <p className="font-medium">No offers match these filters.</p>
          <p className="mt-1 text-slate-600">
            {hasActiveFilters
              ? 'Reset filters to view our default selection, or continue with editor top picks below.'
              : 'Showing editor top picks while provider data is refreshed.'}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setRecommendedOnly(false);
                setNoAnnualFeeOnly(false);
              }}
              className="mt-3 rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((product) => <OfferCard key={product.id} product={product} />)}
        </div>
      ) : null}
    </section>
  );
}
