'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sharedLinks = {
  calculators: [
    { href: '/in/calculators/emi-calculator', label: 'Home Loan EMI Calculator (India)' },
    { href: '/in/calculators/sip-calculator', label: 'SIP Calculator (India)' }
  ],
  comparisons: [
    { href: '/in/fixed-deposit-vs-sip-india', label: 'FD vs SIP India' },
    { href: '/in/personal-loan-comparison-india', label: 'Personal Loan Comparison India' }
  ],
  related: [
    { href: '/in/tax', label: 'India Tax hub' },
    { href: '/in/banking', label: 'India Banking hub' },
    { href: '/in/investing', label: 'India Investing hub' },
    { href: '/in/loans', label: 'India Loans hub' },
    { href: '/in/real-estate', label: 'India Real Estate hub' }
  ]
};

const weakestPages = new Set([
  '/in/tax',
  '/in/calculators',
  '/in/80c-deductions',
  '/in/tax-saving-strategies'
]);

export function IndiaPageEssentials() {
  const pathname = usePathname();
  const isWeakestPage = weakestPages.has(pathname);

  return (
    <section className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Who this is for</h2>
      <p className="text-sm text-slate-700 dark:text-slate-300">
        Indian households making practical monthly decisions with ₹5,000 to ₹2,00,000 monthly surplus and loan sizes from ₹5L to ₹5Cr.
      </p>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Biggest mistake to avoid</h3>
      <p className="text-sm text-slate-700 dark:text-slate-300">
        Copying someone else&apos;s plan without testing bad months, rate shocks, and liquidity needs in your own cashflow.
      </p>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Best decision by scenario</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-3 py-2">Scenario</th>
              <th className="px-3 py-2">Best decision</th>
              <th className="px-3 py-2">₹ example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-3 py-2">Loan planning first</td>
              <td className="px-3 py-2">Keep EMI resilient at +1% rate shock</td>
              <td className="px-3 py-2">₹40,000 EMI target on ₹1,20,000 take-home</td>
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-3 py-2">Tax + wealth planning</td>
              <td className="px-3 py-2">Use deduction plan you can sustain monthly</td>
              <td className="px-3 py-2">₹12,500/month toward 80C goal</td>
            </tr>
            <tr>
              <td className="px-3 py-2">Short vs long goals</td>
              <td className="px-3 py-2">Split stable and growth buckets by timeline</td>
              <td className="px-3 py-2">₹8,000 FD + ₹10,000 SIP monthly</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">When this advice fails</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
        <li>Income is highly volatile and emergency runway is below 6 months.</li>
        <li>Tenure/location assumptions change within 12–18 months.</li>
        <li>Product fees, reset clauses, or tax documentation are not validated.</li>
      </ul>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Internal links for next step</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Calculators</p>
          <ul className="mt-2 space-y-1 text-sm">
            {sharedLinks.calculators.map((item) => (
              <li key={item.href}><Link className="content-link" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Comparisons</p>
          <ul className="mt-2 space-y-1 text-sm">
            {sharedLinks.comparisons.map((item) => (
              <li key={item.href}><Link className="content-link" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Related content</p>
          <ul className="mt-2 space-y-1 text-sm">
            {sharedLinks.related.map((item) => (
              <li key={item.href}><Link className="content-link" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      {isWeakestPage && (
        <p className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-100">
          Depth equalization applied: this page now follows the same decision framework depth used by stronger India guides.
        </p>
      )}
    </section>
  );
}
