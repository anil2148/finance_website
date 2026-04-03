import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';
import { DecisionSupportPanel } from '@/components/common/DecisionSupportPanel';

export const metadata: Metadata = createPageMetadata({
  title: 'SIP vs FD in India: A Scenario-Based Decision Guide (2026)',
  description:
    'Compare SIP and FD in India with ₹5,000/₹10,000/₹25,000 examples, volatility reality, and practical decision rules based on timeline and cashflow.',
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
          Most families are not choosing between “safe” and “smart” investing. They are balancing school fees, emergency reserves, and long-term wealth in the same monthly budget. That is why SIP vs FD should be decided by goal timeline, not by headlines.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Real monthly example: ₹5,000 vs ₹10,000 vs ₹25,000 for 10 years</h2>
        <div className="table-shell mt-4">
          <table className="comparison-table min-w-[720px]">
            <thead>
              <tr>
                <th>Monthly amount</th>
                <th>If SIP averages 11%</th>
                <th>If FD averages 6.8%</th>
                <th>Gap after 10 years</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>₹5,000</td><td>~₹10.3 lakh</td><td>~₹8.4 lakh</td><td>~₹1.9 lakh more via SIP</td></tr>
              <tr><td>₹10,000</td><td>~₹20.6 lakh</td><td>~₹16.8 lakh</td><td>~₹3.8 lakh more via SIP</td></tr>
              <tr><td>₹25,000</td><td>~₹51.4 lakh</td><td>~₹42.0 lakh</td><td>~₹9.4 lakh more via SIP</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Timeline decision depth (5y, 10y, 20y)</h2>
        <div className="table-shell mt-4">
          <table className="comparison-table min-w-[720px]">
            <thead><tr><th>Horizon</th><th>₹10,000/month SIP @11%</th><th>₹10,000/month FD @6.8%</th><th>Break-even interpretation</th></tr></thead>
            <tbody>
              <tr><td>5 years</td><td>~₹8.3 lakh</td><td>~₹7.1 lakh</td><td>Gap is modest; volatility risk may dominate comfort.</td></tr>
              <tr><td>10 years</td><td>~₹20.6 lakh</td><td>~₹16.8 lakh</td><td>Gap becomes meaningful for long goals.</td></tr>
              <tr><td>20 years</td><td>~₹75.9 lakh</td><td>~₹50.0 lakh</td><td>Long compounding strongly favors SIP if you stay invested.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Break-even mindset: if your goal is under ~3 years, certainty usually matters more than return spread. Beyond ~7 years, consistency and behavioral discipline become the main driver.</p>
      </section>

      <DecisionSupportPanel
        title="What happens if you choose wrong"
        tone="amber"
        points={[
          { label: 'Choosing SIP for near-term goal', text: 'A 20% market drawdown in year 2 can delay a fixed down-payment goal by 12–24 months.' },
          { label: 'Choosing FD for very long-term goal', text: 'Lower growth can reduce retirement corpus by double-digit lakhs over 15–20 years.' },
          { label: 'Choosing either without emergency fund', text: 'You may break investments early, losing return compounding and confidence together.' }
        ]}
      />

      <section id="emi-transition" className="cta-block">
        <h2 className="cta-block-title">Before home buying, separate down-payment money from wealth-building money</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">If you are targeting a home purchase in 2–4 years, keep down-payment funds in safety-first buckets. Then pressure-test EMI at current rate, +0.5%, and +1% so your monthly budget stays realistic.</p>
        <div className="cta-block-actions">
          <Link href="/in/calculators/emi-calculator" className="content-link-chip">Run the India EMI calculator</Link>
          <Link href="/in/home-affordability-india" className="content-link-chip">Check home affordability path</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Next decision path</h2>
        <div className="decision-path-grid mt-4 text-sm">
          <article className="decision-path-card"><h3 className="font-semibold">Investing cluster</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Choose SIP allocation and automation rules.</p><div className="mt-3 inline-link-row"><Link href="/in/investing" className="content-link-chip">India investing hub</Link><Link href="/in/calculators/sip-calculator" className="content-link-chip">SIP calculator</Link></div></article>
          <article className="decision-path-card"><h3 className="font-semibold">Savings cluster</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Use safety buckets for near-term goals.</p><div className="mt-3 inline-link-row"><Link href="/in/banking" className="content-link-chip">Banking hub</Link><Link href="/in/best-fixed-deposits-india" className="content-link-chip">FD comparison page</Link></div></article>
          <article className="decision-path-card"><h3 className="font-semibold">Tax cluster</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Don’t mix tax panic with allocation decisions.</p><div className="mt-3 inline-link-row"><Link href="/in/tax" className="content-link-chip">India tax hub</Link><Link href="/in/blog/ppf-vs-elss" className="content-link-chip">PPF vs ELSS scenario</Link></div></article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">References</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li><Link href="https://www.rbi.org.in/" target="_blank" rel="noreferrer" className="link-card rounded-lg p-3 text-sm no-underline">Reserve Bank of India (RBI)</Link></li>
          <li><Link href="https://www.sebi.gov.in/" target="_blank" rel="noreferrer" className="link-card rounded-lg p-3 text-sm no-underline">Securities and Exchange Board of India (SEBI)</Link></li>
        </ul>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
