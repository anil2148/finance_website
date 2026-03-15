'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';


declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type OfferRecord = {
  category: string;
  bank: string;
  name: string;
  rating: number;
  apr_apy: string;
  pros: string[];
  cons: string[];
  affiliate_url: string;
};

const categories = [
  { label: 'Credit Cards', value: 'credit-cards' },
  { label: 'Savings Accounts', value: 'savings-accounts' },
  { label: 'Loans', value: 'loans' },
  { label: 'Investment Apps', value: 'investment-apps' }
] as const;

export function ComparisonPageClient() {
  const searchParams = useSearchParams();

  // Reads category from the URL so nav links can deep-link to specific lists.
  const initialCategory = searchParams.get('category') ?? categories[0].value;

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const seenGuide = window.localStorage.getItem('comparison-guide-seen');
    if (!seenGuide) {
      setShowGuide(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Fetches real-time offer data from the JSON endpoint.
    async function loadOffers() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/offers.json', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to load offers (${response.status})`);
        }

        const payload = (await response.json()) as OfferRecord[];
        if (!cancelled) {
          setOffers(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load offers.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filters selected category and sorts by highest rating first.
  const visibleOffers = useMemo(
    () => offers
      .filter((offer) => offer.category === activeCategory)
      .sort((left, right) => right.rating - left.rating),
    [activeCategory, offers]
  );

  const heading = categories.find((item) => item.value === activeCategory)?.label ?? 'Comparison';
  const topOfferName = visibleOffers[0]?.name;

  const dismissGuide = () => {
    window.localStorage.setItem('comparison-guide-seen', 'true');
    setShowGuide(false);
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Comparison</h1>
        <p className="text-slate-600">Use the category menu to compare top offers by rating, APR/APY, and key trade-offs.</p>
      </div>

      {/* Category menu used to fetch/filter rendered offers by section. */}
      {showGuide && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900" role="status">
          <p className="font-semibold">Quick tip</p>
          <p>Use the Comparison menu or category buttons below to instantly filter offers by product type.</p>
          <button type="button" onClick={dismissGuide} className="mt-2 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800">
            Got it
          </button>
        </div>
      )}

      <nav aria-label="Comparison categories" className="comparison-menu" role="tablist">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            className={`comparison-menu-item ${activeCategory === category.value ? 'comparison-menu-item-active' : ''}`}
            role="tab"
            aria-selected={activeCategory === category.value}
            tabIndex={activeCategory === category.value ? 0 : -1}
            onClick={() => setActiveCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <div className="space-y-4" id="comparison-results">
        <h2 className="text-2xl font-semibold">{heading}</h2>

        {loading && <p className="text-sm text-slate-500" role="status" aria-live="polite">Loading latest offers...</p>}
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

        {!loading && !error && visibleOffers.length === 0 && (
          <p className="text-sm text-slate-500">No offers found in this category right now.</p>
        )}

        {/* Render each offer card with bank, details, pros/cons, and affiliate link. */}
        <div className="grid gap-4">
          {visibleOffers.map((offer) => (
            <Card key={`${offer.bank}-${offer.name}`} className="comparison-offer-card" role="article" aria-label={`${offer.bank} ${offer.name}`}>
              <div className="space-y-2">
                {offer.name === topOfferName && <span className="top-offer-badge">Top Pick</span>}
                <p className="text-sm font-medium text-brand">{offer.bank}</p>
                <h3 className="text-lg font-semibold">{offer.name}</h3>
                <p className="text-sm text-slate-600">APR/APY: {offer.apr_apy} · Rating: {offer.rating.toFixed(1)}</p>
              </div>

              <div>
                <p className="mb-1 text-sm font-semibold text-emerald-700">Pros</p>
                <ul className="comparison-list">
                  {offer.pros.map((pro) => (
                    <li key={pro}>{pro}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-1 text-sm font-semibold text-rose-700">Cons</p>
                <ul className="comparison-list">
                  {offer.cons.map((con) => (
                    <li key={con}>{con}</li>
                  ))}
                </ul>
              </div>

              <a
                href={offer.affiliate_url}
                onClick={() => window.gtag?.('event', 'affiliate_click', { offer_name: offer.name, offer_category: offer.category, placement: 'comparison_page' })}
                className="comparison-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Offer
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
