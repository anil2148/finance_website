import type { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbSchema, createPageMetadata, webpageSchema } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';
import { DecisionSupportPanel } from '@/components/common/DecisionSupportPanel';

export const metadata: Metadata = createPageMetadata({
  title: 'PPF vs ELSS: India Tax-Saving Decision Guide for 2026',
  description:
    'Compare PPF and ELSS using lock-in reality, family cashflow needs, and practical ₹ allocation examples for Section 80C planning.',
  pathname: '/in/blog/ppf-vs-elss',
  type: 'article'
});

export default function PpfVsElssIndiaPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      webpageSchema({
        pathname: '/in/blog/ppf-vs-elss',
        name: 'PPF vs ELSS: India Tax-Saving Decision Guide for 2026',
        description:
          'Compare PPF and ELSS using lock-in reality, family cashflow needs, and practical ₹ allocation examples for Section 80C planning.'
      }),
      breadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'India', item: '/in' },
        { name: 'Blog', item: '/in/blog' },
        { name: 'PPF vs ELSS', item: '/in/blog/ppf-vs-elss' }
      ])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <article className="article-prose space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">India tax-saving guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">PPF vs ELSS: lock-in, liquidity, and growth trade-offs</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          In many households, the real confusion starts in January: “How do we finish 80C quickly without hurting monthly cashflow?” This page helps you decide based on timeline, risk comfort, and liquidity needs—not just tax-saving urgency.
        </p>
      </header>

      <section id="decision-framework" className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">PPF vs ELSS at a glance</h2>
        <div className="table-shell mt-4">
          <table className="comparison-table">
            <thead><tr><th>Factor</th><th>PPF</th><th>ELSS</th></tr></thead>
            <tbody>
              <tr><td>Lock-in</td><td>15 years (partial withdrawal rules apply)</td><td>3 years</td></tr>
              <tr><td>Return profile</td><td>Government-backed, stable but moderate</td><td>Equity-linked, can outperform over long periods with volatility</td></tr>
              <tr><td>Liquidity fit</td><td>Low for short-term goals</td><td>Moderate after lock-in</td></tr>
              <tr><td>Typical role</td><td>Stability core for conservative savers</td><td>Growth sleeve for long-term tax saving</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Timeline and break-even outcome (₹1.5 lakh/year)</h2>
        <div className="table-shell mt-4">
          <table className="comparison-table min-w-[720px]">
            <thead><tr><th>Horizon</th><th>PPF at 7.1%</th><th>ELSS at 11% (illustrative)</th><th>Gap</th></tr></thead>
            <tbody>
              <tr><td>5 years</td><td>~₹8.8 lakh</td><td>~₹10.2 lakh</td><td>~₹1.4 lakh</td></tr>
              <tr><td>10 years</td><td>~₹22.0 lakh</td><td>~₹30.5 lakh</td><td>~₹8.5 lakh</td></tr>
              <tr><td>20 years</td><td>~₹65.4 lakh</td><td>~₹1.24 crore</td><td>~₹58.6 lakh</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Break-even insight: if you need liquidity before year 5, high ELSS allocation can create timing risk. If your goal is 15+ years and you can tolerate volatility, growth differential becomes very large.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Practical ₹1.5 lakh Section 80C allocation examples</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><h3 className="font-semibold text-slate-900 dark:text-slate-100">Stability-first household</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">₹1,00,000 in PPF + ₹50,000 in ELSS SIP. Suitable when income is stable but liquidity comfort is low.</p></article>
          <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><h3 className="font-semibold text-slate-900 dark:text-slate-100">Growth-first salaried professional</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">₹50,000 in PPF + ₹1,00,000 in ELSS SIP. Suitable when emergency fund is strong and volatility tolerance is high.</p></article>
        </div>
      </section>

      <DecisionSupportPanel
        title="What happens if you choose wrong"
        tone="amber"
        points={[
          { label: 'Too much PPF for a growth goal', text: 'You can lose long-term purchasing power; inflation-adjusted wealth may lag by tens of lakhs over 20 years.' },
          { label: 'Too much ELSS for a near-term need', text: 'A market decline near withdrawal can force exits at poor values exactly when you need cash.' },
          { label: 'March-only tax investing habit', text: 'Lump-sum panic decisions often create mismatch between risk profile and real household timeline.' }
        ]}
      />

      <section className="cta-block">
        <h2 className="cta-block-title">Build a tax plan that survives real life cashflow</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Set a monthly 80C contribution, then stress-test how much volatility you can tolerate without stopping contributions in bad market months.</p>
        <div className="cta-block-actions">
          <Link href="/in/tax" className="content-link-chip">Open India tax hub</Link>
          <Link href="/in/old-vs-new-tax-regime" className="content-link-chip">Compare old vs new regime</Link>
          <Link href="/in/calculators/sip-calculator" className="content-link-chip">Run SIP scenario</Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Next decision path</h2>
        <div className="decision-path-grid mt-4 text-sm">
          <article className="decision-path-card"><h3 className="font-semibold">Tax cluster</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Finalize 80C + regime + contribution timing.</p><div className="mt-3 inline-link-row"><Link href="/in/tax" className="content-link-chip">Tax hub</Link><Link href="/in/80c-deductions-guide" className="content-link-chip">80C guide</Link></div></article>
          <article className="decision-path-card"><h3 className="font-semibold">Investing cluster</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Use ELSS as long-term growth sleeve only when fit.</p><div className="mt-3 inline-link-row"><Link href="/in/investing" className="content-link-chip">Investing hub</Link><Link href="/in/blog/sip-vs-fd" className="content-link-chip">SIP vs FD</Link></div></article>
          <article className="decision-path-card"><h3 className="font-semibold">Savings cluster</h3><p className="mt-2 text-slate-600 dark:text-slate-300">Keep near-term goals separate from tax buckets.</p><div className="mt-3 inline-link-row"><Link href="/in/banking" className="content-link-chip">Banking hub</Link><Link href="/in/best-savings-accounts-india" className="content-link-chip">Savings options</Link></div></article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">References</h2>
        <ul className="reference-list mt-3 sm:grid-cols-2">
          <li className="reference-item"><Link href="https://www.rbi.org.in/" target="_blank" rel="noreferrer" className="content-link">Reserve Bank of India (RBI)</Link></li>
          <li className="reference-item"><Link href="https://www.incometax.gov.in/" target="_blank" rel="noreferrer" className="content-link">Income Tax Department (India)</Link></li>
        </ul>
      </section>
        <IndiaAuthorityNote />
      </article>
    </>
  );
}
