import type { Metadata } from 'next';
import Link from 'next/link';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Home Loan EMI Calculator (₹) | FinanceSphere India',
  description:
    'Estimate monthly EMI, total payable amount, and affordability scenarios for Indian home loans with practical salary and rate-change framing.',
  pathname: '/in/calculators/emi-calculator'
});

export default function IndiaEmiCalculatorPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India calculator</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Home Loan EMI Calculator (India)</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Use this before you finalise a loan amount. Many buyers can handle EMI on paper, but monthly budget pressure appears after possession costs, maintenance, school fees, and rate resets. Stress-test now, not later.
        </p>
      </header>
      <IndiaAuthorityNote />

      <EmiCalculator type="mortgage" />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What this means for you</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Affordability guidance:</strong> For most households, keep EMI stress-tested and comfortable at today&apos;s rate plus +1.0%.</li>
          <li><strong>Risk warning:</strong> A loan that fits at booking can fail later if maintenance, school fees, and floating resets are ignored.</li>
          <li><strong>Next step:</strong> Compare lenders, then rerun this with your final sanctioned amount before signing.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How to use this calculator like a real home buyer</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Run EMI at your expected rate, then test +0.5% and +1% to check bad-case affordability.</li>
          <li>Keep EMI + fixed obligations at a comfortable share of in-hand salary, not just bank eligibility.</li>
          <li>Check whether increasing down payment today improves long-term peace of mind more than stretching tenure.</li>
          <li>Do one “single-income month” test if your household relies on two salaries.</li>
        </ul>
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Affordability reality check by in-hand salary</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">In-hand income</th>
                <th className="px-3 py-2">Comfort EMI zone</th>
                <th className="px-3 py-2">Stress signal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">₹70,000</td><td className="px-3 py-2">₹18,000–₹23,000</td><td className="px-3 py-2">EMI above ₹26,000 with no emergency reserve refill.</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">₹85,000</td><td className="px-3 py-2">₹22,000–₹28,000</td><td className="px-3 py-2">EMI above ₹32,000 if school fees/rent also rising.</td></tr>
              <tr><td className="px-3 py-2">₹1,20,000</td><td className="px-3 py-2">₹32,000–₹40,000</td><td className="px-3 py-2">If one income gap month breaks the budget.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick example: ₹85,000 in-hand household income</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Suppose target EMI is around ₹28,000 today. If rates move up and EMI reaches ₹31,000–₹32,000, you should still have room for essentials, insurance, and an emergency top-up. If that feels tight, reduce loan size or delay purchase rather than hoping income will catch up.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/in/home-loan-interest-rates-india" className="content-link">Compare live home-loan rate ranges</Link>
          <Link href="/in/home-affordability-india" className="content-link">Check home affordability before booking</Link>
          <Link href="/in/personal-loan-comparison-india" className="content-link">Compare personal-loan fallback options</Link>
        </div>
      </section>
    </section>
  );
}
