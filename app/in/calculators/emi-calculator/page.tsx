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
          Check monthly EMI and run rate-change stress tests before finalizing your loan amount. A 0.5% rate increase can materially affect long-tenure affordability.
        </p>
      </header>

      <EmiCalculator type="mortgage" />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How to use this for real home-loan decisions</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Run EMI at your expected offer rate, then test +0.5% and +1% to evaluate downside affordability.</li>
          <li>Keep EMI and fixed obligations within a comfortable share of take-home salary, not just eligibility limits.</li>
          <li>Review whether a larger down payment reduces long-term interest enough to justify delayed purchase.</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/in/blog/sip-vs-fd" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">Read SIP vs FD</Link>
          <Link href="/in/blog/ppf-vs-elss" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">Read PPF vs ELSS</Link>
        </div>
      </section>
    </section>
  );
}
