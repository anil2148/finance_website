import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'Section 80C and 80D Deductions India: PPF, ELSS, EPF, NPS', description: 'Plan Section 80C and 80D with monthly contribution structure and liquidity-aware guidance.', pathname: '/in/80c-deductions' });

export default function DeductionsPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">Section 80C and 80D deductions in India: build a monthly plan, not a March scramble</h1><p className="mt-2 text-sm">Who this is for: taxpayers structuring EPF, PPF, ELSS, NPS and medical insurance deductions.</p></header>
      <section className="rounded-2xl border bg-white p-6 text-sm"><p><strong>Biggest mistake to avoid:</strong> one-time year-end lump sum that strains cashflow.</p><p className="mt-2"><strong>Best decision based on scenario:</strong> divide ₹1,50,000 80C target into ₹12,500/month and align stable vs growth buckets.</p></section>
      <section className="rounded-2xl border bg-white p-6"><div className="mt-3 india-link-cluster text-sm"><Link href="/in/tax-slabs" className="content-link">Tax slabs</Link><Link href="/in/old-vs-new-tax-regime" className="content-link">Old vs new regime</Link><Link href="/in/tax-saving-strategies" className="content-link">Tax-saving strategies</Link><Link href="/in/calculators/sip-calculator" className="content-link">SIP calculator</Link><Link href="/in/fixed-deposit-vs-sip-india" className="content-link">FD vs SIP comparison</Link></div></section>
      <IndiaAuthorityNote />
    </article>
  );
}
