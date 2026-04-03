import type { Metadata } from 'next';
import Link from 'next/link';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';
import { createPageMetadata } from '@/lib/seo';

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
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Home loan EMI calculator for India</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Use this before you finalise a loan amount. Many buyers can handle EMI on paper, but monthly budget pressure appears after possession costs, maintenance, school fees, and rate resets. Stress-test now, not later.
        </p>
      </header>

      <EmiCalculator type="mortgage" />

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
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Quick example: ₹85,000 in-hand household income</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Suppose target EMI is around ₹28,000 today. If rates move up and EMI reaches ₹31,000–₹32,000, you should still have room for essentials, insurance, and an emergency top-up. If that feels tight, reduce loan size or delay purchase rather than hoping income will catch up.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/in/blog/sip-vs-fd" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">Read SIP vs FD</Link>
          <Link href="/in/blog/ppf-vs-elss" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">Read PPF vs ELSS</Link>
          <Link href="/in/calculators/sip-calculator" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">Try SIP calculator</Link>
        </div>
      </section>
    </section>
  );
}
