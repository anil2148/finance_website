import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'Tax Saving Strategies India: Salary Bands ₹8L, ₹15L, ₹25L', description: 'Actionable India tax-saving framework by salary band using 80C/80D/EPF/NPS trade-offs.', pathname: '/in/tax-saving-strategies' });

export default function StrategiesPage() {
  return (
    <article className="space-y-6"><header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">India tax-saving strategies by salary band</h1><p className="mt-2 text-sm">Who this is for: earners at ₹8L, ₹15L, and ₹25L designing deduction + investment systems.</p></header><section className="rounded-2xl border bg-white p-6 text-sm"><p><strong>Biggest mistake to avoid:</strong> investing for tax benefit in products you will discontinue.</p><p className="mt-2"><strong>Best decision based on scenario:</strong> use EPF as base, then add PPF/NPS for stability and ELSS SIP for growth only if 7+ year horizon is clear.</p><div className="mt-3 flex flex-wrap gap-3"><Link href="/in/tax-slabs" className="text-blue-700">Tax slabs</Link><Link href="/in/80c-deductions" className="text-blue-700">80C + 80D</Link><Link href="/in/old-vs-new-tax-regime" className="text-blue-700">Old vs new regime</Link><Link href="/in/calculators/sip-calculator" className="text-blue-700">SIP calculator</Link><Link href="/in/fixed-deposit-vs-sip-india" className="text-blue-700">FD vs SIP comparison</Link></div></section><IndiaAuthorityNote /></article>
  );
}
