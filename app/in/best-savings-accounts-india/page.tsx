import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'Best Savings Accounts India (2026): Rates, Fees, and Fit', description: 'Compare Indian savings accounts by interest rate, minimum balance, and digital usability for salary and family use.', pathname: '/in/best-savings-accounts-india' });

export default function BestSavingsIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">Best savings accounts in India (2026): compare rates, balance rules, and real usability</h1><p className="mt-2 text-sm">Who this is for: users selecting salary or emergency-fund parking account.</p></header>
      <section className="rounded-2xl border bg-white p-6 overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b"><th className="px-3 py-2 text-left">Bank</th><th className="px-3 py-2 text-left">Interest p.a.</th><th className="px-3 py-2 text-left">Min balance</th><th className="px-3 py-2 text-left">Fee signal</th><th className="px-3 py-2 text-left">Best for</th></tr></thead><tbody><tr className="border-b"><td className="px-3 py-2">Kotak 811</td><td className="px-3 py-2">Up to 7.00%</td><td className="px-3 py-2">₹0</td><td className="px-3 py-2">Debit-card and service charges vary</td><td className="px-3 py-2">Digital-first users</td></tr><tr className="border-b"><td className="px-3 py-2">IDFC FIRST Savings</td><td className="px-3 py-2">Up to 7.25%</td><td className="px-3 py-2">₹10,000 in some variants</td><td className="px-3 py-2">Check non-maintenance rules</td><td className="px-3 py-2">Higher-balance savers</td></tr><tr><td className="px-3 py-2">HDFC Regular Savings</td><td className="px-3 py-2">~3.00–3.50%</td><td className="px-3 py-2">City-based</td><td className="px-3 py-2">Higher convenience, lower rate</td><td className="px-3 py-2">Branch-dependent users</td></tr></tbody></table></section>
      <section className="rounded-2xl border bg-white p-6 text-sm"><p><strong>Biggest mistake to avoid:</strong> choosing top headline rate but missing minimum balance penalties.</p><p className="mt-2"><strong>Best decision based on scenario:</strong> emergency funds should stay in accounts with easy withdrawal and predictable charges.</p><div className="mt-3 flex flex-wrap gap-3"><Link href="/in/banking" className="text-blue-700">Banking hub</Link><Link href="/in/best-credit-cards-india" className="text-blue-700">Credit cards India</Link><Link href="/in/fixed-deposit-vs-sip-india" className="text-blue-700">FD vs SIP</Link><Link href="/in/calculators/sip-calculator" className="text-blue-700">SIP calculator</Link><Link href="/in/best-investment-apps-india" className="text-blue-700">Investment apps comparison</Link></div></section>
      <IndiaAuthorityNote />
    </article>
  );
}
