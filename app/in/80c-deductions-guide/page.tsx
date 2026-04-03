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
      <section className="rounded-2xl border bg-white p-6"><div className="india-link-cluster text-sm"><Link href="/in/tax">Tax hub</Link><Link href="/in/tax-slabs-2026-india">Tax slabs 2026</Link><Link href="/in/old-vs-new-tax-regime">Old vs new regime</Link><Link href="/in/blog/ppf-vs-elss">PPF vs ELSS</Link><Link href="/in/calculators/sip-calculator">SIP calculator</Link><Link href="/in/best-investment-apps-india">Investment apps comparison</Link></div></section>
      <IndiaAuthorityNote />
    </article>
  );
}
