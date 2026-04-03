'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Bars3Icon, ChevronDownIcon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { getCountryForPath, getCountrySwitchPath } from '@/lib/preferences';
import { setPreferredRegionCookie } from '@/lib/region-preference';

type NavLink = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

const globalLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Learn',
    children: [
      { label: 'Investing Hub', href: '/learn/investing' },
      { label: 'Credit Cards Hub', href: '/learn/credit-cards' },
      { label: 'Loans Hub', href: '/learn/loans' },
      { label: 'Budgeting Hub', href: '/learn/budgeting' },
      { label: 'Passive Income Hub', href: '/learn/passive-income' }
    ]
  },
  {
    label: 'Compare',
    children: [
      { label: 'Credit Cards', href: '/best-credit-cards-2026' },
      { label: 'Savings Accounts', href: '/best-savings-accounts-usa' },
      { label: 'Investment Apps', href: '/best-investment-apps' },
      { label: 'Mortgage Rates', href: '/compare/mortgage-rate-comparison' },
      { label: 'Personal Loans', href: '/loans' }
    ]
  },
  {
    label: 'Tools',
    children: [
      { label: 'Net Worth Calculator', href: '/calculators/net-worth-calculator' },
      { label: 'Investment Growth Calculator', href: '/calculators/investment-growth-calculator' },
      { label: 'Retirement Calculator', href: '/calculators/retirement-calculator' },
      { label: 'Loan Calculator', href: '/calculators/loan-calculator' }
    ]
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Help', href: '/help' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

const indiaLinks: NavLink[] = [
  { label: 'Home', href: '/in' },
  { label: 'Tax', href: '/in/tax' },
  { label: 'Banking', href: '/in/banking' },
  { label: 'Investing', href: '/in/investing' },
  { label: 'Loans', href: '/in/loans' },
  { label: 'Real Estate', href: '/in/real-estate' },
  { label: 'Calculators', href: '/in/calculators' }
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { country, darkMode, setCountry, toggleDarkMode } = usePreferences();

  useEffect(() => {
    const pathCountry = getCountryForPath(pathname);
    if (pathCountry !== country) setCountry(pathCountry);
  }, [country, pathname, setCountry]);
  const isIndiaContext = pathname === '/in' || pathname.startsWith('/in/');
  const links = isIndiaContext ? indiaLinks : globalLinks;
  const currentRegionLabel = isIndiaContext ? 'India' : 'United States';
  const currentCurrencyLabel = isIndiaContext ? 'INR' : 'USD';
  const switchRegion = async (nextRegion: 'India' | 'US') => {
    const nextPath = getCountrySwitchPath(pathname, nextRegion);
    const regionCookieValue = nextRegion === 'India' ? 'in' : 'us';

    setPreferredRegionCookie(regionCookieValue);

    try {
      await fetch('/api/region', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: regionCookieValue })
      });
    } catch {
      // Fall back to client-side cookie write above.
    }

    setCountry(nextRegion);
    if (nextPath !== pathname) router.push(nextPath);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/85">
      <nav className="mx-auto max-w-7xl px-4 py-3" role="navigation" aria-label="Primary">
        <div className="flex items-center justify-between gap-3">
          <Link href={isIndiaContext ? '/in' : '/'} className="inline-flex items-center" aria-label="FinanceSphere home">
            <Image src="/images/financesphere-logo.svg" alt="FinanceSphere logo" width={190} height={40} loading="lazy" priority={false} className="h-10 w-auto" />
          </Link>

            <button
            className="rounded-xl border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <ul className="flex items-center gap-1 text-sm" role="menubar">
              {links.map((item) => (
                <li key={item.label} className="group relative" role="none">
                  {item.href ? (
                    <Link
                      className={`rounded-lg px-3 py-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 ${isActive(pathname, item.href) ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-blue-500/20 dark:text-blue-200 dark:ring-blue-500/40' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                      href={item.href}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Fragment>
                      <button className="comparison-nav-trigger inline-flex items-center gap-1 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white" aria-haspopup="true">
                        {item.label}
                        <ChevronDownIcon className="h-4 w-4" />
                      </button>
                      <ul className="comparison-dropdown" role="menu" aria-label={`${item.label} menu`}>
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <Link className="comparison-dropdown-link" href={child.href}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Fragment>
                  )}
                </li>
              ))}
            </ul>

            <Link href={isIndiaContext ? '/in/calculators/emi-calculator' : '/tools'} className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Start planning
            </Link>

            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Region</span>
              <select
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                aria-label="Region"
                value={isIndiaContext ? 'India' : 'US'}
                onChange={(event) => switchRegion(event.target.value as 'India' | 'US')}
              >
                <option value="India">India</option>
                <option value="US">United States</option>
              </select>
            </label>
            <span className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              {currentRegionLabel} ({currentCurrencyLabel})
            </span>
            <button onClick={toggleDarkMode} className="rounded-lg border border-slate-300 p-1.5 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800" aria-label="Toggle dark mode">
              {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:hidden dark:border-slate-700 dark:bg-slate-900">
            <ul className="grid gap-2 text-sm">
              {links.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      className={`block rounded-lg px-3 py-2 text-slate-700 transition dark:text-slate-200 ${isActive(pathname, item.href) ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                      <button
                        className="flex w-full items-center justify-between rounded-lg px-2 py-2 font-medium text-slate-800 dark:text-slate-100"
                        onClick={() => setExpandedGroup((prev) => (prev === item.label ? null : item.label))}
                        aria-expanded={expandedGroup === item.label}
                      >
                        {item.label}
                        <ChevronDownIcon className={`h-4 w-4 transition ${expandedGroup === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedGroup === item.label && (
                        <ul className="grid gap-1 pl-3 pt-1 text-xs">
                          {item.children?.map((child) => (
                            <li key={child.href}>
                              <Link className="block rounded-lg px-2 py-1.5 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" href={child.href} onClick={() => setOpen(false)}>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <Link href={isIndiaContext ? '/in/calculators/emi-calculator' : '/tools'} className="btn-primary w-full text-sm" onClick={() => setOpen(false)}>
              Start planning
            </Link>

            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">Region</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                aria-label="Region"
                value={isIndiaContext ? 'India' : 'US'}
                onChange={(event) => {
                  switchRegion(event.target.value as 'India' | 'US');
                  setOpen(false);
                }}
              >
                <option value="India">India</option>
                <option value="US">United States</option>
              </select>
              <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Current: {currentRegionLabel} ({currentCurrencyLabel})
              </p>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
