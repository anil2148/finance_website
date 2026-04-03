import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Home Loan Interest Rates India (2026): Compare Lenders and EMI Impact',
  description: 'Compare major Indian home-loan interest rates with EMI impact and borrower-fit guidance.',
  pathname: '/in/home-loan-interest-rates-india'
});

export default function HomeLoanRatesIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">Home loan interest rates in India: optimize 3-year total cost, not teaser rate</h1>
        <p className="mt-2 text-sm">Who this is for: buyers comparing floating-rate offers, fee stack, and prepayment flexibility.</p>
      </header>

      <section className="rounded-2xl border bg-white p-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b"><th className="px-3 py-2 text-left">Lender</th><th className="px-3 py-2 text-left">Starting rate p.a.</th><th className="px-3 py-2 text-left">Processing fee</th><th className="px-3 py-2 text-left">EMI on ₹50,00,000 / 20y</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="px-3 py-2">SBI</td><td className="px-3 py-2">~8.40%</td><td className="px-3 py-2">Up to 0.35%</td><td className="px-3 py-2">~₹43,200</td></tr>
            <tr className="border-b"><td className="px-3 py-2">HDFC</td><td className="px-3 py-2">~8.50%</td><td className="px-3 py-2">0.50% range</td><td className="px-3 py-2">~₹43,500</td></tr>
            <tr><td className="px-3 py-2">ICICI</td><td className="px-3 py-2">~8.75%</td><td className="px-3 py-2">0.50% range</td><td className="px-3 py-2">~₹44,250</td></tr>
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Best for YOU if…</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>Loan size near ₹25 lakh and conservative profile: take the lender with cleaner reset terms and low foreclosure friction.</li>
          <li>₹50 lakh loan with moderate risk: choose the lowest 3-year all-in cost after fee + insurance + reset assumptions.</li>
          <li>₹75 lakh+ loan and aggressive prepayment plan: choose products that allow frequent part-prepayment without penalty.</li>
        </ul>
        <h3 className="mt-4 text-lg font-semibold">Worst choice if…</h3>
        <p className="mt-2">You pick the lowest headline rate but ignore reset cadence, mandatory cross-sell, and service quality. A cheap start can become expensive by year two.</p>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Counterintuitive insight</h2>
        <p className="mt-2">For many borrowers, adding one extra EMI each year saves more guaranteed money than investing the same amount in uncertain short-term returns.</p>
        <h3 className="mt-4 text-lg font-semibold">When this advice FAILS</h3>
        <ul className="mt-2 list-disc pl-5 space-y-2">
          <li>Prepayment-first strategy fails when emergency reserve falls below 6 months.</li>
          <li>Rate-comparison strategy fails if property legal risk or builder delay is not priced in.</li>
          <li>Fixed-EMI assumptions fail during RBI policy-cycle shocks and floating-rate resets.</li>
        </ul>

        <div className="mt-3 india-link-cluster">
          <Link href="/in/loans" className="content-link">India loans hub for debt strategy</Link>
          <Link href="/in/real-estate" className="content-link">India real-estate decision hub</Link>
          <Link href="/in/rent-vs-buy-india" className="content-link">rent vs buy decision framework in India</Link>
          <Link href="/in/home-affordability-india" className="content-link">test home affordability before approval</Link>
          <Link href="/in/personal-loan-comparison-india" className="content-link">compare personal loans for short-tenure needs</Link>
          <Link href="/in/calculators/emi-calculator" className="content-link">run EMI stress tests at +0.5% and +1.0%</Link>
          <Link href="/in/calculators/sip-calculator" className="content-link">compare prepayment vs SIP opportunity cost</Link>
        </div>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
