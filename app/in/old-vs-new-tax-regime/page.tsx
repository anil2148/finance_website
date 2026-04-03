import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'Old vs New Tax Regime India (FY 2025-26): Decision Guide', description: 'Compare old and new tax regimes with deductions and salary-level scenario logic.', pathname: '/in/old-vs-new-tax-regime' });

export default function RegimePage() {
  return (
    <article className="space-y-6"><header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">Old vs new tax regime in India: choose using cashflow reality</h1><p className="mt-2 text-sm">Who this is for: professionals deciding between deduction-heavy old regime and lower-rate simpler new regime.</p></header><section className="rounded-2xl border bg-white p-6 text-sm"><p><strong>Biggest mistake to avoid:</strong> choosing old regime without confirming actual deduction proofs.</p><p className="mt-2"><strong>Best decision based on scenario:</strong> if EPF + HRA + 80C + 80D are substantial, old regime can still be better; otherwise new regime usually reduces friction.</p><div className="mt-3 india-link-cluster"><Link href="/in/tax-slabs" className="content-link">Tax slabs</Link><Link href="/in/80c-deductions" className="content-link">80C deductions</Link><Link href="/in/tax-saving-strategies" className="content-link">Strategies</Link><Link href="/in/calculators/sip-calculator" className="content-link">SIP calculator</Link><Link href="/in/best-investment-apps-india" className="content-link">Investment app comparison</Link></div></section><IndiaAuthorityNote /></article>
  );
}
