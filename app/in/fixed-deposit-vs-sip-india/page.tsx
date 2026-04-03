import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Fixed Deposit vs SIP India (2026): Returns, Risk, and Goal Fit',
  description: 'Compare FD and SIP for Indian investors with real monthly investment scenarios and trade-off tables.',
  pathname: '/in/fixed-deposit-vs-sip-india'
});

export default function FdVsSipIndiaMoneyPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">Fixed Deposit vs SIP in India: choose by timeline first, return second</h1>
        <p className="mt-2 text-sm">Who this is for: savers deciding where monthly surplus belongs across 3, 5, and 10-year goals.</p>
      </header>

      <section className="rounded-2xl border bg-white p-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b"><th className="px-3 py-2 text-left">Monthly invest</th><th className="px-3 py-2 text-left">FD @ 7.0% (10y)</th><th className="px-3 py-2 text-left">SIP @ 12.0% (10y)</th><th className="px-3 py-2 text-left">Decision note</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="px-3 py-2">₹5,000</td><td className="px-3 py-2">~₹8,60,000</td><td className="px-3 py-2">~₹11,60,000</td><td className="px-3 py-2">SIP only if 5+ year volatility is acceptable.</td></tr>
            <tr className="border-b"><td className="px-3 py-2">₹10,000</td><td className="px-3 py-2">~₹17,20,000</td><td className="px-3 py-2">~₹23,20,000</td><td className="px-3 py-2">Hybrid split works well for uncertain goals.</td></tr>
            <tr className="border-b"><td className="px-3 py-2">₹25,000</td><td className="px-3 py-2">~₹43,00,000</td><td className="px-3 py-2">~₹58,00,000</td><td className="px-3 py-2">Goal bucket segregation is mandatory.</td></tr>
            <tr><td className="px-3 py-2">₹50,000</td><td className="px-3 py-2">~₹86,00,000</td><td className="px-3 py-2">~₹1,16,00,000</td><td className="px-3 py-2">Use rebalancing and risk-cap rules.</td></tr>
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Choose allocation by goal window, not headline return</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li><strong>0–3 year goal (fees, car, wedding):</strong> keep most money in FD or high-liquidity buckets to avoid market-timing exits.</li>
          <li><strong>5+ year goal:</strong> SIP can take larger allocation, but keep one year of expected withdrawals in stable assets.</li>
          <li><strong>Variable monthly income:</strong> build FD ladder first; increase SIP only after cashflow stabilizes for 2–3 quarters.</li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Failure checkpoints before you finalize split</h2>
        <ul className="mt-2 list-disc pl-5 space-y-2">
          <li>SIP-heavy plan fails when equity money is needed in a 12–24 month drawdown.</li>
          <li>FD-only plan fails if post-tax return trails inflation for several years.</li>
          <li>Hybrid plan fails when you never rebalance after salary or goal-timeline changes.</li>
        </ul>
        <p className="mt-3">“FD is safe” and “SIP is always better” are both incomplete. The winner changes by timeline certainty and withdrawal risk.</p>
        <p className="mt-2"><strong>Practical insight:</strong> many households do better with a rule-based split like ₹12,000 SIP + ₹8,000 FD than with all-in switches every market cycle.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/in/investing" className="text-blue-700">India investing hub for allocation rules</Link>
          <Link href="/in/banking" className="text-blue-700">India banking hub for liquidity setup</Link>
          <Link href="/in/best-fixed-deposits-india" className="text-blue-700">compare fixed deposits in India</Link>
          <Link href="/in/best-investment-apps-india" className="text-blue-700">compare investment apps for SIP execution</Link>
          <Link href="/in/blog/sip-vs-fd" className="text-blue-700">read SIP vs FD strategy guide</Link>
          <Link href="/in/calculators/sip-calculator" className="text-blue-700">run SIP return scenarios in ₹</Link>
          <Link href="/in/calculators/emi-calculator" className="text-blue-700">protect EMI commitments before taking risk</Link>
        </div>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
