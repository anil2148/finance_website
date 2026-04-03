'use client';

import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/ui/AppLink';

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/comparison', label: 'Comparisons' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools', label: 'Tools' }
];

const discoveryLinks = [
  { href: '/learn/credit-cards', label: 'Credit Cards Hub' },
  { href: '/learn/loans', label: 'Loans Hub' },
  { href: '/best-credit-cards-2026', label: 'Credit Card Framework' },
  { href: '/best-investment-apps', label: 'Investment App Framework' },
  { href: '/best-savings-accounts-usa', label: 'Savings Account Framework' },
  { href: '/compare/mortgage-rate-comparison', label: 'Mortgage Framework' }
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/how-we-make-money', label: 'How We Make Money' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/financial-disclaimer', label: 'Financial Disclaimer' }
];

const supportLinks = [
  { href: '/about', label: 'About FinanceSphere' },
  { href: '/help', label: 'Help Center' },
  { href: '/contact', label: 'Contact Support' }
];


export function Footer() {
  const pathname = usePathname();
  const isIndiaContext = pathname === '/in' || pathname.startsWith('/in/');
  const contextualPrimaryLinks = isIndiaContext
    ? [
        { href: '/in', label: 'India Home' },
        { href: '/in/calculators/emi-calculator', label: 'India EMI Calculator' },
        { href: '/in/calculators/sip-calculator', label: 'India SIP Calculator' },
        { href: '/in/blog', label: 'India Blog' },
        { href: '/in/calculators', label: 'Tools' }
      ]
    : primaryLinks;

  const contextualDiscoveryLinks = isIndiaContext
    ? [
        { href: '/in/blog/sip-vs-fd', label: 'SIP vs FD Guide' },
        { href: '/in/blog/ppf-vs-elss', label: 'PPF vs ELSS Guide' },
        { href: '/in/calculators/emi-calculator', label: 'EMI Planning' },
        { href: '/in/calculators/sip-calculator', label: 'SIP Planning' },
        { href: '/in/tax', label: 'India Tax Hub' },
        { href: '/in/banking', label: 'India Banking Hub' }
      ]
    : discoveryLinks;

  return (
    <footer className="mt-10 border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 dark:text-slate-300 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <section className="space-y-3">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">FinanceSphere</p>
          <p>Educational planning tools and frameworks for better financial decisions.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            We may earn compensation from partners, but pages are built to prioritize user fit, clarity, and downside-risk awareness over conversion pressure.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <AppLink href="/editorial-policy" variant="chip" className="text-xs">Editorial policy</AppLink>
            <AppLink href="/affiliate-disclosure" variant="chip" className="text-xs">Affiliate disclosure</AppLink>
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Start here</p>
          <ul className="space-y-1 text-sm">
            {contextualPrimaryLinks.map((link) => (
              <li key={link.href}>
                <AppLink variant="utility" className="font-medium" href={link.href}>{link.label}</AppLink>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Popular pathways</p>
          <ul className="space-y-1 text-sm">
            {contextualDiscoveryLinks.map((link) => (
              <li key={link.href}>
                <AppLink variant="utility" className="font-medium" href={link.href}>{link.label}</AppLink>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Trust, legal, and support</p>
          <ul className="space-y-1 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <AppLink variant="utility" href={link.href}>{link.label}</AppLink>
              </li>
            ))}
            {supportLinks.map((link) => (
              <li key={link.href}>
                <AppLink variant="utility" className="font-medium" href={link.href}>{link.label}</AppLink>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        © 2026 FinanceSphere. Educational content only; verify current terms directly with providers before acting.
      </div>
    </footer>
  );
}
