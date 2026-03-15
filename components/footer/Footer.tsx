import Link from 'next/link';

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/financial-disclaimer', label: 'Financial Disclaimer' },
  { href: '/contact', label: 'Contact' }
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 dark:text-slate-300">
        <p>© {new Date().getFullYear()} FinanceSphere. Educational content only.</p>
        <nav aria-label="Legal pages" className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium text-slate-600 transition hover:text-brand dark:text-slate-300">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
