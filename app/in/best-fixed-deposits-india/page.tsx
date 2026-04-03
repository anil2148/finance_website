import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Best Fixed Deposits in India 2026: SBI vs HDFC vs ICICI vs Small Finance Banks',
  description: 'Compare best fixed deposits in India with rates, tenure, payout options, and user-type fit.',
  pathname: '/in/best-fixed-deposits-india'
});

export default function BestFixedDepositsIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">Best fixed deposits in India (2026): use FD for stability windows, not for every goal</h1>
        <p className="mt-2 text-sm">Useful for households ring-fencing 1–3 year goals where capital swings can derail plans.</p>
      </header>
      <IndiaAuthorityNote />

      <section className="rounded-2xl border bg-white p-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b"><th className="px-3 py-2 text-left">Bank</th><th className="px-3 py-2 text-left">Indicative 1Y rate</th><th className="px-3 py-2 text-left">Best for</th><th className="px-3 py-2 text-left">Pros / Cons</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="px-3 py-2">SBI</td><td className="px-3 py-2">~6.80%</td><td className="px-3 py-2">Conservative savers</td><td className="px-3 py-2">Pro: trust + branch network / Con: not always highest rates</td></tr>
            <tr className="border-b"><td className="px-3 py-2">HDFC</td><td className="px-3 py-2">~7.00%</td><td className="px-3 py-2">Salary-account users</td><td className="px-3 py-2">Pro: strong digital flow / Con: penalty rules vary</td></tr>
            <tr><td className="px-3 py-2">ICICI</td><td className="px-3 py-2">~7.00%</td><td className="px-3 py-2">Convenience-first users</td><td className="px-3 py-2">Pro: flexible tenures / Con: compare payout options carefully</td></tr>
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">FD fit-check by surplus and timeline</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>₹5,000–₹10,000 monthly surplus with a 3-year goal: FD ladder dominates because principal stability matters more than upside.</li>
          <li>₹25,000 monthly surplus with a 5-year goal: hybrid FD + SIP generally dominates risk-adjusted outcomes.</li>
          <li>₹50,000 monthly surplus with 10-year horizon: FD should be a stability sleeve, not the core wealth engine.</li>
        </ul>
        <h3 className="mt-4 text-lg font-semibold">Avoid this setup when…</h3>
        <p className="mt-2">You lock all long-term money in post-tax low-yield FDs during high inflation. Purchasing power erosion becomes the hidden loss.</p>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Counterintuitive insight</h2>
        <p className="mt-2">Even conservative households can improve outcomes by moving only incremental surplus to SIP while keeping near-term corpus in FD.</p>
        <h3 className="mt-4 text-lg font-semibold">When this advice FAILS</h3>
        <ul className="mt-2 list-disc pl-5 space-y-2">
          <li>FD ladder fails if premature withdrawal penalties are ignored.</li>
          <li>Hybrid strategy fails when SIP amount is stopped during volatility.</li>
          <li>Monthly payout FD fails for retirees if inflation rises above post-tax FD yield.</li>
        </ul>
        <div className="mt-3 india-link-cluster">
          <Link href="/in/banking" className="content-link">banking hub for liquidity and rate decisions</Link>
          <Link href="/in/fixed-deposit-vs-sip-india" className="content-link">deep FD vs SIP timeline comparison</Link>
          <Link href="/in/best-savings-accounts-india" className="content-link">compare savings accounts for emergency money</Link>
          <Link href="/in/investing" className="content-link">build long-term investing allocation</Link>
          <Link href="/in/best-investment-apps-india" className="content-link">select execution apps for SIP discipline</Link>
          <Link href="/in/calculators/sip-calculator" className="content-link">run SIP growth projections in ₹</Link>
          <Link href="/in/calculators/emi-calculator" className="content-link">check EMI burden before locking funds</Link>
        </div>
      </section>

    </article>
  );
}
