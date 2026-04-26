'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

const suggestedPages = [
  { href: '/', label: 'Homepage' },
  { href: '/comparison', label: 'Comparisons' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/blog', label: 'Blog' },
  { href: '/best-credit-cards-2026', label: 'Best Credit Cards 2026' },
  { href: '/best-savings-accounts-usa', label: 'Best Savings Accounts' }
];

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  const searchTarget = useMemo(() => {
    const value = query.trim();
    return value ? `/blog?q=${encodeURIComponent(value)}` : '/blog';
  }, [query]);

  useEffect(() => {
    trackEvent({
      event: 'not_found_page_view',
      category: 'routing',
      label: pathname,
      metadata: { broken_path: pathname ?? 'unknown' }
    });
  }, [pathname]);

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-14">
      <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">404</p>
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="text-sm text-slate-600">
          We tracked this broken URL and will review it. Use search or jump to a popular page below.
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          router.push(searchTarget);
        }}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <label htmlFor="not-found-search" className="text-sm font-medium text-slate-700">
          Search guides and tools
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="not-found-search"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Try: debt payoff, savings, credit cards"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
            Search
          </button>
        </div>
      </form>

      <div className="grid gap-2 sm:grid-cols-2">
        {suggestedPages.map((page) => (
          <Link key={page.href} href={page.href} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">
            {page.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
