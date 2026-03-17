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
      <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-300">
        <p>© 2026 FinanceSphere. All rights reserved.</p>
        <p>FinanceSphere may earn compensation from partners when you click through to an offer. Ratings and write-ups are based on product terms, features, and user-fit factors—not partner payments.</p>
      </div>
    </footer>
  );
}
