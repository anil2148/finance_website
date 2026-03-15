'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePreferences } from '@/components/providers/PreferenceProvider';

type NavLink = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

const links: NavLink[] = [
  { label: 'Calculators', href: '/calculators' },
  { label: 'Tools', href: '/tools' },
  { label: 'Dashboard', href: '/dashboard' },
  {
    // Comparison nav group with direct links for each category.
    label: 'Comparison',
    children: [
      { label: 'Credit Cards', href: '/comparison?category=credit-cards' },
      { label: 'Savings Accounts', href: '/comparison?category=savings-accounts' },
      { label: 'Loans', href: '/comparison?category=loans' },
      { label: 'Investment Apps', href: '/comparison?category=investment-apps' }
    ]
  },
  { label: 'Blog', href: '/blog' }
];

const countries = ['United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Germany'];
const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { currency, country, darkMode, setCountry, setCurrency, toggleDarkMode } = usePreferences();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-950/90">
      <nav className="mx-auto max-w-7xl px-4 py-3" role="navigation" aria-label="Primary">
        <div className="flex items-center justify-between gap-3">
          <Link className="text-lg font-semibold text-brand" href="/">FinanceSphere</Link>

          <button className="rounded-lg border p-2 md:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu">
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <ul className="flex gap-4 text-sm" role="menubar">
              {links.map((item) => (
                <li key={item.label} className="relative group" role="none">
                  {item.href ? (
                    <Link className="hover:text-brand" href={item.href} role="menuitem">{item.label}</Link>
                  ) : (
                    <>
                      <Link className="comparison-nav-trigger" href="/comparison" role="menuitem" aria-haspopup="true">{item.label}</Link>
                      {/* Flyout menu for comparison categories on desktop. */}
                      <ul className="comparison-dropdown" role="menu" aria-label="Comparison categories">
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <Link className="comparison-dropdown-link" href={child.href}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:bg-slate-900" value={country} onChange={(event) => setCountry(event.target.value)}>
              {countries.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:bg-slate-900" value={currency} onChange={(event) => setCurrency(event.target.value as (typeof currencies)[number])}>
              {currencies.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button onClick={toggleDarkMode} className="rounded-lg border border-slate-300 p-1.5" aria-label="Toggle dark mode">
              {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-white p-3 md:hidden dark:bg-slate-900">
            <ul className="grid gap-2 text-sm">
              {links.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link className="block rounded-lg px-2 py-1 hover:bg-slate-100" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
                  ) : (
                    <div className="space-y-2 rounded-lg border border-slate-200 p-2">
                      <Link className="block rounded-lg px-2 py-1 font-medium hover:bg-slate-100" href="/comparison" onClick={() => setOpen(false)}>{item.label}</Link>
                      {/* Nested comparison links for mobile navigation. */}
                      <ul className="grid gap-1 pl-3 text-xs">
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <Link className="block rounded-lg px-2 py-1 hover:bg-slate-100" href={child.href} onClick={() => setOpen(false)}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-2">
              <select className="rounded-lg border border-slate-300 px-2 py-1 text-xs" value={country} onChange={(event) => setCountry(event.target.value)}>
                {countries.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select className="rounded-lg border border-slate-300 px-2 py-1 text-xs" value={currency} onChange={(event) => setCurrency(event.target.value as (typeof currencies)[number])}>
                {currencies.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
