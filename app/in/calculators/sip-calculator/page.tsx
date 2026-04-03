import type { Metadata } from 'next';
import Link from 'next/link';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India SIP Calculator (₹) | Monthly Investment Projection',
  description: 'Estimate long-term SIP corpus with monthly ₹ contributions and annual return assumptions for India-focused planning.',
  pathname: '/in/calculators/sip-calculator'
});

export default function IndiaSipCalculatorPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India calculator</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">SIP Calculator (India)</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Estimate your potential corpus from monthly SIP contributions and compare outcome ranges before committing to a fixed monthly amount.
        </p>
      </header>
      <IndiaAuthorityNote />

      <EmiCalculator type="compound" />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What this means for you</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Affordability guidance:</strong> Pick a SIP amount you can continue through weak markets and high-expense months.</li>
          <li><strong>Risk warning:</strong> Short horizons and frequent SIP pauses can break expected compounding outcomes.</li>
          <li><strong>Next step:</strong> Pair this output with FD vs SIP and tax planning pages before final monthly allocation.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Use realistic SIP checkpoints</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Run the same goal at ₹5,000, ₹10,000, and ₹25,000 monthly to find a contribution you can sustain in bad months.</li>
          <li>Test 10-year and 15-year horizons separately; short horizons can feel emotionally difficult during drawdowns.</li>
          <li>If salary is variable, base SIP on your lower in-hand month and step-up only after 3 stable salary cycles.</li>
          <li>Pair SIP with emergency cash in savings/FD so market volatility does not force premature withdrawals.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Use with these India decisions</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link href="/in/blog/sip-vs-fd" className="content-link">SIP vs FD comparison</Link>
          <Link href="/in/blog/ppf-vs-elss" className="content-link">PPF vs ELSS comparison</Link>
          <Link href="/in/calculators/emi-calculator" className="content-link">Home-loan EMI planning</Link>
        </div>
      </section>
    </section>
  );
}
