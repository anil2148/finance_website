import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'India Real Estate Decisions: rent vs buy, down payment, EMI strategy', description: 'India-specific rent vs buy decisions for Bangalore and Mumbai with EMI stress ranges and opportunity cost framing.', pathname: '/in/real-estate' });

export default function IndiaRealEstateHubPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">India Real Estate Hub: rent vs buy with Bangalore and Mumbai numbers</h1>
        <p className="mt-2 text-sm">Who this is for: first-time buyers comparing rent, EMI, maintenance, and down-payment opportunity cost.</p>
        <p className="mt-2 text-sm"><strong>Biggest mistake to avoid:</strong> using only EMI and ignoring maintenance plus furnishing costs. <strong>Best decision based on scenario:</strong> buy only when 5+ year stay probability and emergency reserves are both strong.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/in/home-loan-interest-rates-india" className="rounded-xl border p-4">Home loan rates and lender comparison</Link>
        <Link href="/in/calculators/emi-calculator" className="rounded-xl border p-4">Calculator: EMI stress test</Link>
        <Link href="/in/fixed-deposit-vs-sip-india" className="rounded-xl border p-4">Down payment parking: FD vs SIP</Link>
        <Link href="/in/loans" className="rounded-xl border p-4">India loans hub</Link>
      </div>
      <IndiaAuthorityNote />
    </section>
  );
}
