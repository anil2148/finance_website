import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'PPF vs ELSS: India Tax-Saving Decision Guide for 2026',
  description:
    'Compare PPF and ELSS by lock-in, liquidity, expected returns, and tax treatment with a practical India decision framework.',
  pathname: '/in/blog/ppf-vs-elss',
  type: 'article'
});

export default function PpfVsElssIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">India tax-saving guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">PPF vs ELSS: lock-in, liquidity, and growth trade-offs</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Both can help under Section 80C, but they solve different problems. PPF is stability-first; ELSS is growth-first with market risk.
        </p>
      </header>

      <section id="decision-framework" className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">PPF vs ELSS at a glance</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Factor</th>
                <th className="px-3 py-2">PPF</th>
                <th className="px-3 py-2">ELSS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Lock-in</td><td className="px-3 py-2">15 years (partial withdrawal rules apply)</td><td className="px-3 py-2">3 years</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Return profile</td><td className="px-3 py-2">Government-backed, lower volatility</td><td className="px-3 py-2">Market-linked, higher volatility</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Liquidity need fit</td><td className="px-3 py-2">Poor for short-term liquidity</td><td className="px-3 py-2">Moderate after lock-in</td></tr>
              <tr><td className="px-3 py-2">Best use-case</td><td className="px-3 py-2">Conservative long-term core</td><td className="px-3 py-2">Long-term tax-saving growth allocation</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Scenario examples</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">New salaried investor, ₹1.5 lakh 80C target</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use a split approach: maintain PPF for stability and add ELSS SIP for growth. Rebalance yearly based on risk comfort.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Home purchase in 4 years</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Avoid over-allocating equity for near-term down payment goals. Preserve capital for the known timeline, then run EMI affordability.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Next India pages to use</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/in/blog/sip-vs-fd" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">SIP vs FD</Link>
          <Link href="/in/calculators/emi-calculator" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">EMI calculator</Link>
          <Link href="/in/calculators/sip-calculator" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">SIP calculator</Link>
        </div>
      </section>
    </article>
  );
}
