import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Savings Accounts India (2026): Rates, Fees, and Fit',
  description: 'Compare Indian savings accounts by interest rate, minimum balance, and digital usability for salary and family use.',
  pathname: '/in/best-savings-accounts-india'
});

export default function BestSavingsIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">Best savings accounts in India (2026): choose the account that protects cashflow first</h1>
        <p className="mt-2 text-sm">Who this is for: salary-account users and families parking emergency funds with low friction access.</p>
      </header>

      <section className="rounded-2xl border bg-white p-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b"><th className="px-3 py-2 text-left">Bank</th><th className="px-3 py-2 text-left">Interest p.a.</th><th className="px-3 py-2 text-left">Min balance</th><th className="px-3 py-2 text-left">Fee signal</th><th className="px-3 py-2 text-left">Best for</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="px-3 py-2">Kotak 811</td><td className="px-3 py-2">Up to 7.00%</td><td className="px-3 py-2">₹0</td><td className="px-3 py-2">Debit-card and service charges vary</td><td className="px-3 py-2">Digital-first users</td></tr>
            <tr className="border-b"><td className="px-3 py-2">IDFC FIRST Savings</td><td className="px-3 py-2">Up to 7.25%</td><td className="px-3 py-2">₹10,000 in some variants</td><td className="px-3 py-2">Check non-maintenance rules</td><td className="px-3 py-2">Higher-balance users</td></tr>
            <tr><td className="px-3 py-2">HDFC Regular Savings</td><td className="px-3 py-2">~3.00–3.50%</td><td className="px-3 py-2">City-based</td><td className="px-3 py-2">Higher convenience, lower rate</td><td className="px-3 py-2">Branch-reliant families</td></tr>
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Best for YOU if…</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>Emergency fund is ₹3–6 lakh and conservative risk: choose zero-penalty, zero-minimum variants.</li>
          <li>Monthly float is ₹50,000 to ₹2 lakh: choose high-rate accounts only if balance rules are easy to maintain.</li>
          <li>Income is variable (moderate/high risk): prioritize fee predictability over headline rate.</li>
        </ul>
        <h3 className="mt-4 text-lg font-semibold">Worst choice if…</h3>
        <p className="mt-2">You routinely fall below minimum balance or need frequent cash movement. Penalty drag can erase rate advantage.</p>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">What most people get wrong</h2>
        <p className="mt-2">The highest savings rate does not dominate when the usable balance is small and fee leakage is large.</p>
        <h3 className="mt-4 text-lg font-semibold">When this advice FAILS</h3>
        <ul className="mt-2 list-disc pl-5 space-y-2">
          <li>High-rate strategy fails when promotional slabs are temporary.</li>
          <li>Convenience-first strategy fails if you ignore idle-cash opportunity cost for years.</li>
          <li>Branch-first choice fails when digital transfer limits create friction during emergencies.</li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/in/banking" className="text-blue-700">India banking hub decision path</Link>
          <Link href="/in/best-fixed-deposits-india" className="text-blue-700">compare fixed deposits in India</Link>
          <Link href="/in/best-credit-cards-india" className="text-blue-700">match card strategy to savings behavior</Link>
          <Link href="/in/fixed-deposit-vs-sip-india" className="text-blue-700">decide FD vs SIP after emergency fund</Link>
          <Link href="/in/personal-loan-comparison-india" className="text-blue-700">reduce debt-cost leakage before investing</Link>
          <Link href="/in/calculators/sip-calculator" className="text-blue-700">estimate SIP growth from surplus cash</Link>
          <Link href="/in/calculators/emi-calculator" className="text-blue-700">check EMI safety before locking surplus</Link>
        </div>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
