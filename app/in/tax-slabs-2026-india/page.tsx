import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'Tax Slabs 2026 India: FY 2025-26 New vs Old Regime Salary Examples',
  description: 'India tax slabs 2026 guide with ₹8 lakh, ₹15 lakh, and ₹25 lakh scenario decisions.',
  pathname: '/in/tax-slabs-2026-india'
});

export default function TaxSlabs2026IndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">Tax slabs 2026 in India: decision guide for FY 2025–26</h1>
        <p className="mt-2 text-sm">Who this is for: salaried taxpayers choosing the regime with highest post-tax take-home.</p>
      </header>
      <section className="rounded-2xl border bg-white p-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b"><th className="px-3 py-2 text-left">Salary</th><th className="px-3 py-2 text-left">Best first check</th><th className="px-3 py-2 text-left">₹ example</th></tr></thead><tbody>
          <tr className="border-b"><td className="px-3 py-2">₹8,00,000</td><td className="px-3 py-2">Compare standard deduction + declared deductions</td><td className="px-3 py-2">₹4,000/month tax difference can fund SIP top-up</td></tr>
          <tr className="border-b"><td className="px-3 py-2">₹15,00,000</td><td className="px-3 py-2">Run old vs new with EPF + HRA + 80C + 80D</td><td className="px-3 py-2">₹8,000/month extra cashflow can reduce EMI stress</td></tr>
          <tr><td className="px-3 py-2">₹25,00,000</td><td className="px-3 py-2">Use deductions only if sustainable yearly</td><td className="px-3 py-2">₹1,20,000/year redirected to wealth bucket</td></tr>
        </tbody></table>
      </section>
      <section className="rounded-2xl border bg-white p-6 text-sm">
        <p><strong>Biggest mistake to avoid:</strong> deciding regime before validating documents and actual contributions.</p>
        <p className="mt-2"><strong>Best choice by scenario:</strong> when deductions are low, new regime typically wins on simplicity and net cashflow.</p>
        <div className="mt-3 india-link-cluster"><Link className="content-link-chip" href="/in/tax">Tax hub</Link><Link className="content-link-chip" href="/in/old-vs-new-tax-regime">Old vs new regime</Link><Link className="content-link-chip" href="/in/80c-deductions">80C guide</Link><Link className="content-link-chip" href="/in/calculators/sip-calculator">SIP calculator</Link><Link className="content-link-chip" href="/in/best-investment-apps-india">Investment apps comparison</Link></div>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
