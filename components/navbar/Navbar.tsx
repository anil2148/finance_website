'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePreferences } from '@/components/providers/PreferenceProvider';

const links = [
  ['Calculators', '/calculators'],
  ['Tools', '/tools'],
  ['Dashboard', '/dashboard'],
  ['Comparison', '/comparison'],
  ['Blog', '/blog']
] as const;

const countries = ['United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Germany'];
const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { currency, country, darkMode, setCountry, setCurrency, toggleDarkMode } = usePreferences();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-950/90">
      <nav className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link className="text-lg font-semibold text-brand" href="/">FinanceSphere</Link>

          <button className="rounded-lg border p-2 md:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle menu">
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <ul className="flex gap-4 text-sm">
              {links.map(([label, href]) => (
                <li key={href}><Link className="hover:text-brand" href={href}>{label}</Link></li>
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
              {links.map(([label, href]) => (
                <li key={href}><Link className="block rounded-lg px-2 py-1 hover:bg-slate-100" href={href} onClick={() => setOpen(false)}>{label}</Link></li>
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
