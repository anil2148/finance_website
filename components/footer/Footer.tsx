'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/ui/AppLink';

const footerColumns = {
  global: [
    {
      heading: 'Tools',
      links: [
        { href: '/money-copilot', label: 'AI Copilot' },
        { href: '/calculators', label: 'Calculators' },
        { href: '/compare', label: 'Comparisons' },
        { href: '/credit-cards', label: 'Credit Cards' }
      ]
    },
    {
      heading: 'Learn',
      links: [
        { href: '/blog', label: 'Financial Guides' },
        { href: '/learn/strategy-playbooks', label: 'Strategy Playbooks' },
        { href: '/best-credit-cards-2026', label: 'Best Credit Cards 2026' },
        { href: '/best-investment-apps', label: 'Best Investment Apps' }
      ]
    },
    {
      heading: 'Popular',
      links: [
        { href: '/best-savings-accounts-usa', label: 'Best Savings Accounts' },
        { href: '/compare/mortgage-rate-comparison', label: 'Mortgage Rate Comparison' },
        { href: '/calculators/debt-payoff-calculator', label: 'Debt Payoff Calculator' },
        { href: '/calculators/retirement-calculator', label: 'Retirement Calculator' }
      ]
    },
    {
      heading: 'Company',
      links: [
        { href: '/about', label: 'About' },
        { href: '/editorial-policy', label: 'Editorial Policy' },
        { href: '/how-we-make-money', label: 'How We Make Money' },
        { href: '/help', label: 'Help Center' },
        { href: '/contact', label: 'Contact' }
      ]
    }
  ],
  india: [
    {
      heading: 'Tools',
      links: [
        { href: '/money-copilot', label: 'AI Copilot' },
        { href: '/in/calculators', label: 'Calculators' },
        { href: '/compare', label: 'Comparisons' },
        { href: '/in/best-credit-cards-india', label: 'Credit Cards' }
      ]
    },
    {
      heading: 'Learn',
      links: [
        { href: '/in/blog', label: 'Financial Guides' },
        { href: '/in/strategy-playbooks', label: 'Strategy Playbooks' },
        { href: '/best-credit-cards-2026', label: 'Best Credit Cards 2026' },
        { href: '/best-investment-apps', label: 'Best Investment Apps' }
      ]
    },
    {
      heading: 'Popular',
      links: [
        { href: '/best-savings-accounts-usa', label: 'Best Savings Accounts' },
        { href: '/compare/mortgage-rate-comparison', label: 'Mortgage Rate Comparison' },
        { href: '/in/calculators/debt-payoff-calculator', label: 'Debt Payoff Calculator' },
        { href: '/in/calculators/retirement-calculator', label: 'Retirement Calculator' }
      ]
    },
    {
      heading: 'Company',
      links: [
        { href: '/about', label: 'About' },
        { href: '/editorial-policy', label: 'Editorial Policy' },
        { href: '/how-we-make-money', label: 'How We Make Money' },
        { href: '/help', label: 'Help Center' },
        { href: '/contact', label: 'Contact' }
      ]
    }
  ]
};

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/financial-disclaimer', label: 'Financial Disclaimer' }
];

export function Footer() {
  const pathname = usePathname();
  const isIndiaContext = pathname === '/in' || pathname.startsWith('/in/');
  const columns = isIndiaContext ? footerColumns.india : footerColumns.global;

  return (
    <footer className="mt-10 border-t border-[0.5px] border-[var(--color-border-tertiary)] bg-white dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5">
        <AppLink href={isIndiaContext ? '/in' : '/'} className="inline-flex items-center" aria-label="FinanceSphere home">
          <Image src="/images/financesphere-logo.svg" alt="FinanceSphere logo" width={160} height={40} className="h-10 w-auto" />
        </AppLink>
        <p className="hidden text-center text-sm text-slate-600 dark:text-slate-300 md:block">
          Educational planning tools for better financial decisions.
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://x.com"
            aria-label="FinanceSphere on X"
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.5 22H3.4l7.3-8.3L1 2h6.3l4.3 5.8L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com"
            aria-label="FinanceSphere on LinkedIn"
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.4v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.42v6.32ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.11 20.45H3.56V9h3.55v11.45Z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="border-t border-[0.5px] border-[var(--color-border-tertiary)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-6 px-4 py-6 md:grid-cols-4">
          {columns.map((column) => (
            <section key={column.heading}>
              <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{column.heading}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href} className="leading-7">
                    <AppLink href={link.href} variant="utility" className="text-[13px] leading-7">
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="border-t border-[0.5px] border-[var(--color-border-tertiary)] px-4 py-3 text-center text-[12px] text-slate-500 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>© 2026 FinanceSphere</span>
          {legalLinks.map((link) => (
            <span key={link.href} className="inline-flex items-center gap-2">
              <span aria-hidden="true">·</span>
              <AppLink href={link.href} variant="utility" className="text-[12px]">
                {link.label}
              </AppLink>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
