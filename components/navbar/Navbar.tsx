'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useState } from 'react';
import { Bars3Icon, ChevronDownIcon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePreferences } from '@/components/providers/PreferenceProvider';

type NavLink = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

const links: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Compare',
    children: [
      { label: 'Credit Cards', href: '/best-credit-cards-2026' },
      { label: 'Savings Accounts', href: '/best-savings-accounts-usa' },
      { label: 'Investment Apps', href: '/best-investment-apps' },
      { label: 'Mortgage Rates', href: '/compare/mortgage-rate-comparison' },
      { label: 'Personal Loans', href: '/comparison?category=personal_loan' }
    ]
  },
  {
    label: 'Tools',
    children: [
      { label: 'Net Worth Calculator', href: '/net-worth-calculator' },
      { label: 'Investment Growth Calculator', href: '/investment-growth-calculator' },
      { label: 'Retirement Calculator', href: '/retirement-calculator' },
      { label: 'Loan EMI Calculator', href: '/loan-emi-calculator' }
    ]
  },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
  { label: 'Contact', href: '/contact' }
];

const countries = ['US', 'India', 'UK', 'Canada'] as const;
const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] as const;

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { currency, country, darkMode, setCountry, setCurrency, toggleDarkMode } = usePreferences();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/85">
      <nav className="mx-auto max-w-7xl px-4 py-3" role="navigation" aria-label="Primary">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center" aria-label="FinanceSphere home">
            <Image src="/images/financesphere-logo.svg" alt="FinanceSphere logo" width={190} height={40} loading="lazy" priority={false} className="h-10 w-auto" />
          </Link>

          <button
            className="rounded-xl border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
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
                      className={`rounded-lg px-3 py-2 font-medium transition ${isActive(pathname, item.href) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                      href={item.href}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Fragment>
                      <button className="comparison-nav-trigger inline-flex items-center gap-1 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900" aria-haspopup="true">
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

            <Link href="/tools" className="rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Explore tools
            </Link>

            <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:bg-slate-900" value={country} onChange={(event) => setCountry(event.target.value as (typeof countries)[number])}>
              {countries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:bg-slate-900" value={currency} onChange={(event) => setCurrency(event.target.value as (typeof currencies)[number])}>
              {currencies.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button onClick={toggleDarkMode} className="rounded-lg border border-slate-300 p-1.5" aria-label="Toggle dark mode">
              {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:hidden dark:bg-slate-900">
            <ul className="grid gap-2 text-sm">
              {links.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      className={`block rounded-lg px-3 py-2 ${isActive(pathname, item.href) ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'}`}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-slate-200 p-2">
                      <button
                        className="flex w-full items-center justify-between rounded-lg px-2 py-2 font-medium"
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
                              <Link className="block rounded-lg px-2 py-1.5 hover:bg-slate-100" href={child.href} onClick={() => setOpen(false)}>
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

            <Link href="/tools" className="btn-primary w-full text-sm" onClick={() => setOpen(false)}>
              Explore tools
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
