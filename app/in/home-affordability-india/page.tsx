import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'Home Affordability India 2026: Salary to Budget Rules + EMI Stress Test', description: 'Home affordability guide for India with salary multipliers, EMI limits, and reserve thresholds.', pathname: '/in/home-affordability-india' });

export default function HomeAffordabilityIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">Home affordability in India: decide budget before shortlisting projects</h1><p className="mt-2 text-sm">Who this is for: buyers turning salary and savings into a realistic purchase budget.</p></header>
      <section className="rounded-2xl border bg-white p-6 overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b"><th className="px-3 py-2 text-left">Monthly take-home</th><th className="px-3 py-2 text-left">Suggested EMI ceiling</th><th className="px-3 py-2 text-left">Illustrative loan size*</th></tr></thead><tbody><tr className="border-b"><td className="px-3 py-2">₹1,00,000</td><td className="px-3 py-2">₹30,000</td><td className="px-3 py-2">~₹35–38 lakh</td></tr><tr className="border-b"><td className="px-3 py-2">₹1,80,000</td><td className="px-3 py-2">₹55,000</td><td className="px-3 py-2">~₹65–70 lakh</td></tr><tr><td className="px-3 py-2">₹2,50,000</td><td className="px-3 py-2">₹75,000</td><td className="px-3 py-2">~₹90 lakh–₹1 crore</td></tr></tbody></table><p className="mt-2 text-xs">*Indicative at 20-year tenure and common floating rates.</p></section>
      <section className="rounded-2xl border bg-white p-6 text-sm"><p><strong>Biggest mistake to avoid:</strong> exhausting emergency corpus for down payment.</p><p className="mt-2"><strong>Best choice by scenario:</strong> keep 6–9 months expenses after down payment and registration costs.</p><div className="mt-3 india-link-cluster"><Link className="content-link-chip" href="/in/real-estate">Real-estate hub</Link><Link className="content-link-chip" href="/in/rent-vs-buy-india">Rent vs buy comparison</Link><Link className="content-link-chip" href="/in/home-loan-interest-rates-india">Home loan comparison</Link><Link className="content-link-chip" href="/in/calculators/emi-calculator">EMI calculator</Link><Link className="content-link-chip" href="/in/personal-loan-comparison-india">Personal loan comparison</Link></div></section>
      <IndiaAuthorityNote />
    </article>
  );
}
