import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Personal Loan Comparison India 2026: HDFC vs SBI vs ICICI vs Fintech Lenders',
  description: 'Compare personal loans in India by rates, processing fees, disbursal speed, and borrower profile fit.',
  pathname: '/in/personal-loan-comparison-india'
});

export default function PersonalLoanComparisonIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">Personal loan comparison India: pick the loan that minimizes total damage to future cashflow</h1>
        <p className="mt-2 text-sm">Who this is for: borrowers funding medical, relocation, or consolidation needs with clear repayment limits.</p>
      </header>

      <section className="rounded-2xl border bg-white p-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b"><th className="px-3 py-2 text-left">Lender type</th><th className="px-3 py-2 text-left">Typical rate range</th><th className="px-3 py-2 text-left">Best for</th><th className="px-3 py-2 text-left">Pros / Cons</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="px-3 py-2">Large banks</td><td className="px-3 py-2">~10.5%–16%</td><td className="px-3 py-2">Strong-credit salaried borrowers</td><td className="px-3 py-2">Pro: predictability / Con: slower approval</td></tr>
            <tr className="border-b"><td className="px-3 py-2">Private banks</td><td className="px-3 py-2">~11%–19%</td><td className="px-3 py-2">Existing account holders</td><td className="px-3 py-2">Pro: faster processing / Con: fee stack varies</td></tr>
            <tr><td className="px-3 py-2">Fintech lenders</td><td className="px-3 py-2">~12%–24%</td><td className="px-3 py-2">Urgent disbursal users</td><td className="px-3 py-2">Pro: quick disbursal / Con: higher all-in cost risk</td></tr>
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Best choice based on your situation</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li><strong>₹3,00,000 urgent need + conservative profile:</strong> large banks usually win on fee predictability.</li>
          <li><strong>₹7,00,000 debt consolidation:</strong> choose the smallest 24-month total payout, not the smallest EMI.</li>
          <li><strong>₹10,00,000 planned expense:</strong> pick lenders with clear foreclosure terms if you can prepay early.</li>
          <li><strong>₹45,000 monthly EMI capacity:</strong> keep a backup plan for +1% rate or fee shock before signing.</li>
        </ul>
        <h3 className="mt-4 text-lg font-semibold">When this advice fails</h3>
        <ul className="mt-2 list-disc pl-5 space-y-2">
          <li>You choose the longest tenure only to make EMI look smaller.</li>
          <li>You ignore processing, insurance, and foreclosure costs while comparing offers.</li>
          <li>Your spending stays unchanged after debt consolidation, recreating the same problem.</li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">What most people get wrong</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>Fast disbursal does not mean cheap borrowing once fees and insurance add-ons are included.</li>
          <li>Pre-approved offer messages are not proof of best rates.</li>
          <li>Debt consolidation fails when spending behavior is unchanged after loan sanction.</li>
        </ul>
        <p className="mt-3"><strong>Counterintuitive insight:</strong> in many cases, temporary spending cuts + partial prepayment beat refinancing into a longer personal loan.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/in/loans">loans hub for debt decision flow</Link>
          <Link href="/in/home-loan-interest-rates-india">compare home loan rates before top-up loans</Link>
          <Link href="/in/best-credit-cards-india">use card strategy to avoid revolving debt</Link>
          <Link href="/in/best-savings-accounts-india">rebuild liquidity buffer in savings accounts</Link>
          <Link href="/in/fixed-deposit-vs-sip-india">allocate surplus after debt stabilization</Link>
          <Link href="/in/calculators/emi-calculator">run EMI affordability stress tests</Link>
          <Link href="/in/calculators/sip-calculator">model post-debt investing restart in ₹</Link>
        </div>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
