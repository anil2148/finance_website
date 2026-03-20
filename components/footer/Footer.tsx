import Link from 'next/link';

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/comparison', label: 'Comparisons' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools', label: 'Tools' }
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/how-we-make-money', label: 'How We Make Money' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/financial-disclaimer', label: 'Financial Disclaimer' },
  { href: '/help', label: 'Help Center' },
  { href: '/contact', label: 'Contact' }
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-300">
        <p>© 2026 FinanceSphere. All rights reserved.</p>
        <p>FinanceSphere may earn compensation from partners when you click through to an offer. Ratings and write-ups are based on product terms, features, and user-fit factors—not partner payments.</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs">
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <Link className="font-medium hover:text-slate-700 dark:hover:text-slate-100" href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link className="hover:text-slate-700 dark:hover:text-slate-100" href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
