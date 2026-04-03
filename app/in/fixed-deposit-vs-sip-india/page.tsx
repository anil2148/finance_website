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
        <h2 className="text-xl font-semibold">Best choice based on your situation</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li><strong>Timeline decision:</strong> goal &lt;5 years → FD-heavy wins; goal &gt;7 years → SIP-heavy dominates; uncertain goal → 60/40 hybrid.</li>
          <li><strong>Risk decision:</strong> conservative users cap SIP at 20–30%; moderate users run 40–60%; aggressive users can go 70%+ SIP after emergency fund.</li>
          <li><strong>Income decision:</strong> variable income households should prioritize FD ladder before increasing SIP commitments.</li>
        </ul>
        <h3 className="mt-4 text-lg font-semibold">When this advice FAILS</h3>
        <ul className="mt-2 list-disc pl-5 space-y-2">
          <li>SIP strategy fails when equity money is required during a 12–36 month drawdown.</li>
          <li>FD strategy fails when inflation remains above post-tax yield for prolonged periods.</li>
          <li>Hybrid strategy fails when allocations are not reviewed annually.</li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">What most people get wrong</h2>
        <p className="mt-2">“FD is safe” and “SIP is always better” are both incomplete. The winner changes by horizon, risk tolerance, and job stability.</p>
        <p className="mt-2"><strong>Counterintuitive insight:</strong> in rate-cut cycles, locking medium-term FD ladders while continuing SIP can reduce behavioral panic and improve total outcomes.</p>
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
