import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'SIP vs FD in India: A Scenario-Based Decision Guide (2026)',
  description:
    'Compare SIP and FD in India with ₹10,000 monthly examples, tax and liquidity trade-offs, and a timeline-based decision framework.',
  pathname: '/in/blog/sip-vs-fd',
  type: 'article'
});

export default function SipVsFdIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">India investing decision guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">SIP vs FD in India: which one should you choose?</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          For most goals, this is not an either-or question. Use FD for near-term certainty and SIP for long-term growth potential.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹10,000 per month over 10 years: quick comparison</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                <th className="px-3 py-2">Decision lens</th>
                <th className="px-3 py-2">SIP (equity mutual fund)</th>
                <th className="px-3 py-2">FD (bank fixed deposit)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Expected outcome</td><td className="px-3 py-2">Market-linked; can be higher or lower</td><td className="px-3 py-2">Known return at booking time</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Volatility</td><td className="px-3 py-2">High in short periods</td><td className="px-3 py-2">Low</td></tr>
              <tr className="border-b border-slate-100 dark:border-slate-800"><td className="px-3 py-2">Liquidity</td><td className="px-3 py-2">Usually T+2 redemption (except lock-in funds)</td><td className="px-3 py-2">Penalty if broken early</td></tr>
              <tr><td className="px-3 py-2">Tax treatment</td><td className="px-3 py-2">Depends on equity/debt fund and holding period</td><td className="px-3 py-2">Interest taxed per slab</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Example framing: if your 10-year SIP averages 11% annualized return, corpus may materially exceed an FD compounding at 6.8%, but the SIP path will include drawdowns.
        </p>
      </section>

      <section id="emi-transition" className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How this connects to EMI and home-loan planning</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          If you may need down-payment funds in under 3 years, avoid taking equity risk with that portion. Keep near-term money in lower-volatility buckets and run EMI stress tests separately.
        </p>
        <Link href="/in/calculators/emi-calculator" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">Run the India EMI calculator →</Link>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Simple decision framework</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Goal horizon &lt; 3 years: prioritize capital safety and liquidity; FD is often safer than equity SIP.</li>
          <li>Goal horizon 5+ years: SIP is often stronger for growth potential if you can tolerate volatility.</li>
          <li>Hybrid approach: split contributions (for example, 70% SIP and 30% FD) for medium-horizon goals.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Continue your India planning path</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/in/blog/ppf-vs-elss" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">PPF vs ELSS guide</Link>
          <Link href="/in/calculators/sip-calculator" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">SIP calculator</Link>
          <Link href="/in/blog" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">India blog hub</Link>
        </div>
      </section>
    </article>
  );
}
