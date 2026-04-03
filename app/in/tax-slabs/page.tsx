import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'India Tax Slabs FY 2025-26: Salary ₹8L vs ₹15L vs ₹25L', description: 'Use slab math and regime choices for common salary bands with direct links to 80C and tax-saving playbooks.', pathname: '/in/tax-slabs' });

export default function TaxSlabsPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">India tax slabs FY 2025-26: what changes your net salary</h1><p className="mt-2 text-sm">Who this is for: salaried employees comparing take-home for ₹8,00,000, ₹15,00,000, and ₹25,00,000 annual salary levels.</p></header>
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Scenario table</h2>
        <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead><tr className="border-b"><th className="px-3 py-2 text-left">Salary</th><th className="px-3 py-2 text-left">Typical decision</th><th className="px-3 py-2 text-left">Big mistake</th></tr></thead><tbody><tr className="border-b"><td className="px-3 py-2">₹8,00,000</td><td className="px-3 py-2">New regime often simpler unless deductions are meaningful.</td><td className="px-3 py-2">Forcing ELSS only for tax without emergency buffer.</td></tr><tr className="border-b"><td className="px-3 py-2">₹15,00,000</td><td className="px-3 py-2">Run old vs new with EPF, HRA, 80C, 80D inputs.</td><td className="px-3 py-2">Ignoring 80D and home-loan deduction interactions.</td></tr><tr><td className="px-3 py-2">₹25,00,000</td><td className="px-3 py-2">Optimize deductions and long-term tax-efficient investing.</td><td className="px-3 py-2">High-income lifestyle creep reducing annual investable surplus.</td></tr></tbody></table></div>
      </section>
      <section className="rounded-2xl border bg-white p-6 text-sm">
        <p><strong>Best decision based on scenario:</strong> if deductions are below ₹2,00,000, new regime usually wins on simplicity; otherwise compute both with real declarations.</p>
        <div className="mt-3 flex flex-wrap gap-3"><Link href="/in/80c-deductions" className="text-blue-700">80C + 80D deductions</Link><Link href="/in/old-vs-new-tax-regime" className="text-blue-700">Old vs new regime</Link><Link href="/in/tax-saving-strategies" className="text-blue-700">Tax-saving strategies</Link><Link href="/in/calculators/sip-calculator" className="text-blue-700">SIP calculator</Link><Link href="/in/best-investment-apps-india" className="text-blue-700">Investment app comparison</Link></div>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
