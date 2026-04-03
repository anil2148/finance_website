import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'Personal Loan Comparison India 2026: HDFC vs SBI vs ICICI vs Fintech Lenders', description: 'Compare personal loans in India by rates, processing fees, disbursal speed, and borrower profile fit.', pathname: '/in/personal-loan-comparison-india' });

export default function PersonalLoanComparisonIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">Personal loan comparison India: total cost first, speed second</h1><p className="mt-2 text-sm">Who this is for: borrowers handling medical, relocation, or debt-consolidation needs.</p></header>
      <section className="rounded-2xl border bg-white p-6 overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b"><th className="px-3 py-2 text-left">Lender type</th><th className="px-3 py-2 text-left">Typical rate range</th><th className="px-3 py-2 text-left">Best for</th><th className="px-3 py-2 text-left">Pros / Cons</th></tr></thead><tbody><tr className="border-b"><td className="px-3 py-2">Large banks</td><td className="px-3 py-2">~10.5%–16%</td><td className="px-3 py-2">Strong-credit salaried borrowers</td><td className="px-3 py-2">Pro: predictability / Con: slower approval</td></tr><tr className="border-b"><td className="px-3 py-2">Private banks</td><td className="px-3 py-2">~11%–19%</td><td className="px-3 py-2">Existing account holders</td><td className="px-3 py-2">Pro: faster processing / Con: fee stack varies</td></tr><tr><td className="px-3 py-2">Fintech lenders</td><td className="px-3 py-2">~12%–24%</td><td className="px-3 py-2">Urgent disbursal users</td><td className="px-3 py-2">Pro: quick disbursal / Con: higher all-in cost risk</td></tr></tbody></table></section>
      <section className="rounded-2xl border bg-white p-6 text-sm"><h2 className="text-xl font-semibold">Best for by scenario</h2><ul className="mt-3 list-disc pl-5 space-y-2"><li>₹3,00,000 emergency loan: prioritize lower processing fee + no foreclosure penalty.</li><li>₹7,00,000 consolidation loan: compare effective annualized total, not EMI alone.</li><li>₹10,00,000 planned expense: borrow only if repayment under 20% of monthly take-home.</li></ul><p className="mt-3"><strong>Biggest mistake:</strong> taking longest tenure to minimize EMI while paying excess interest.</p><div className="mt-3 flex flex-wrap gap-3"><Link href="/in/loans">Loans hub</Link><Link href="/in/home-loan-interest-rates-india">Home loan comparison</Link><Link href="/in/best-credit-cards-india">Credit cards comparison</Link><Link href="/in/calculators/emi-calculator">EMI calculator</Link><Link href="/in/best-savings-accounts-india">Savings comparison</Link></div></section>
      <IndiaAuthorityNote />
    </article>
  );
}
