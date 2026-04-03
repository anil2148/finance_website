import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: '80C Deductions Guide India 2026: PPF, ELSS, EPF, NPS Allocation Examples', description: 'Section 80C deductions guide for India with monthly allocation frameworks and scenario-based recommendations.', pathname: '/in/80c-deductions-guide' });

export default function DeductionsGuideIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">80C deductions guide India: build ₹1,50,000 systematically</h1><p className="mt-2 text-sm">Who this is for: taxpayers who want deductions without year-end liquidity pressure.</p></header>
      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Monthly allocation examples</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>Conservative plan: ₹8,000 PPF + ₹4,500 ELSS each month = ₹1,50,000/year.</li>
          <li>Growth plan: ₹3,000 PPF + ₹9,500 ELSS each month = ₹1,50,000/year.</li>
          <li>Balanced plan: ₹6,250 EPF (effective) + ₹6,250 ELSS each month.</li>
          <li>Cashflow rescue: cut discretionary spend by ₹8,000/month to fully fund 80C target.</li>
        </ul>
        <p className="mt-3"><strong>Biggest mistake to avoid:</strong> locking funds beyond comfort level. <strong>Best choice by scenario:</strong> keep PPF-heavy mix when near-term commitments are high.</p>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">How to choose PPF, ELSS, EPF, and NPS mix</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="px-3 py-2 font-semibold">Instrument</th>
                <th className="px-3 py-2 font-semibold">Best use case</th>
                <th className="px-3 py-2 font-semibold">Liquidity profile</th>
                <th className="px-3 py-2 font-semibold">Execution caution</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">PPF</td>
                <td className="px-3 py-2">Long-term stable debt allocation</td>
                <td className="px-3 py-2">Low liquidity due to long lock-in</td>
                <td className="px-3 py-2">Do not over-allocate if goals are within 5 years</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ELSS</td>
                <td className="px-3 py-2">Equity-linked growth with tax benefit</td>
                <td className="px-3 py-2">3-year lock-in, market-linked value</td>
                <td className="px-3 py-2">Avoid lump-sum timing panic in March</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">EPF</td>
                <td className="px-3 py-2">Automatic salary-based contribution</td>
                <td className="px-3 py-2">Restricted, retirement-oriented</td>
                <td className="px-3 py-2">Track how much of 80C is already covered</td>
              </tr>
              <tr>
                <td className="px-3 py-2">NPS (80CCD(1B) extra)</td>
                <td className="px-3 py-2">Additional retirement deduction</td>
                <td className="px-3 py-2">Very low liquidity</td>
                <td className="px-3 py-2">Use only if retirement lock-in fits your plan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">90-day filing season checklist</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li><strong>January:</strong> estimate remaining 80C gap after EPF and existing contributions.</li>
          <li><strong>February:</strong> fill the gap monthly or bi-weekly instead of one large deduction-month transaction.</li>
          <li><strong>March:</strong> verify proof documents, nomination details, and investment receipts before payroll cutoff.</li>
          <li><strong>Post filing:</strong> keep the same monthly plan active for the next financial year to avoid restart friction.</li>
        </ol>
      </section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Common failure modes and fixes</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li><strong>Failure:</strong> Waiting until March to fund full ₹1,50,000 target. <strong>Fix:</strong> automate monthly debit from salary account.</li>
          <li><strong>Failure:</strong> Choosing products only for tax benefit. <strong>Fix:</strong> match each 80C bucket to a goal horizon first.</li>
          <li><strong>Failure:</strong> No buffer for EMI or school-fee spikes. <strong>Fix:</strong> keep 80C contribution flexible and stress test via EMI calculator.</li>
          <li><strong>Failure:</strong> Duplicate investments across spouse/family without tracking. <strong>Fix:</strong> maintain one shared deduction tracker.</li>
        </ul>
      </section>
      <section className="rounded-2xl border bg-white p-6"><div className="india-link-cluster text-sm"><Link className="content-link-chip" href="/in/tax">Tax hub</Link><Link className="content-link-chip" href="/in/tax-slabs-2026-india">Tax slabs 2026</Link><Link className="content-link-chip" href="/in/old-vs-new-tax-regime">Old vs new regime</Link><Link className="content-link-chip" href="/in/blog/ppf-vs-elss">PPF vs ELSS</Link><Link className="content-link-chip" href="/in/calculators/sip-calculator">SIP calculator</Link><Link className="content-link-chip" href="/in/best-investment-apps-india">Investment apps comparison</Link></div></section>
      <IndiaAuthorityNote />
    </article>
  );
}
