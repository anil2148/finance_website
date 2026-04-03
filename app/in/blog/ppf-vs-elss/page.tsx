import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'PPF vs ELSS: India Tax-Saving Decision Guide for 2026',
  description:
    'Compare PPF and ELSS using lock-in reality, family cashflow needs, and practical ₹ allocation examples for Section 80C planning.',
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
          In many households, the real confusion starts in January: “How do we finish 80C quickly without hurting monthly cashflow?” This page helps you decide based on timeline, risk comfort, and liquidity needs—not just tax-saving urgency.
        </p>
      </header>

      <section id="decision-framework" className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">PPF vs ELSS at a glance</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Factor</th>
                <th className="px-3 py-2">PPF</th>
                <th className="px-3 py-2">ELSS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Lock-in</td><td className="px-3 py-2">15 years (partial withdrawal rules apply)</td><td className="px-3 py-2">3 years</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Return profile</td><td className="px-3 py-2">Government-backed, stable but moderate</td><td className="px-3 py-2">Equity-linked, can outperform over long periods with volatility</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Liquidity fit</td><td className="px-3 py-2">Low for short-term goals</td><td className="px-3 py-2">Moderate after lock-in</td></tr>
              <tr><td className="px-3 py-2">Typical role</td><td className="px-3 py-2">Stability core for conservative savers</td><td className="px-3 py-2">Growth sleeve for long-term tax saving</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">When PPF lock-in is a feature (not a problem)</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>You want disciplined long-term savings that you are less likely to interrupt.</li>
          <li>You already have volatile assets and need one stable tax-saving bucket in the portfolio.</li>
          <li>Family priorities require predictability over maximum possible return.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">When PPF lock-in becomes a friction point</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>You may need flexible access in 3–6 years for education, business, or home down payment.</li>
          <li>You are trying to build long-term inflation-beating growth with higher equity exposure.</li>
          <li>You contribute only in March for tax-saving and skip year-round investing discipline.</li>
        </ul>
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">A practical way to avoid March tax-saving panic</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          If your usual thought is “I want tax-saving but not if money gets locked too tightly,” split the ₹1.5 lakh target into monthly contributions. Keep a stable core in PPF, then direct the growth sleeve to ELSS only if your emergency fund is intact.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Practical ₹1.5 lakh Section 80C allocation examples</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Stability-first household</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">₹1,00,000 in PPF + ₹50,000 in ELSS SIP. Works for families that value peace of mind but still want some growth.</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Growth-first salaried professional</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">₹50,000 in PPF + ₹1,00,000 in ELSS SIP. Better when emergency fund exists and equity volatility is acceptable.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Who should choose what?</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Choose PPF-heavy</strong> if your family values capital safety and long-term discipline over chasing higher returns.</li>
          <li><strong>Choose ELSS-heavy</strong> if you have 7+ year horizon, stable income, and are comfortable with temporary market falls.</li>
          <li><strong>Choose a blend</strong> if you want tax-saving with both emotional comfort and growth potential.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Next India pages to use</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/in/blog/sip-vs-fd" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">SIP vs FD</Link>
          <Link href="/in/calculators/emi-calculator" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">EMI calculator</Link>
          <Link href="/in/calculators/sip-calculator" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">SIP calculator</Link>
          <Link href="/in/blog" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">India blog hub</Link>
        </div>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
