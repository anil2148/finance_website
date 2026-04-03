import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'India Calculators Hub: EMI and SIP tools with INR formatting', description: 'Use India calculators with INR output and lakh/crore formatting for EMI and SIP planning decisions.', pathname: '/in/calculators' });

export default function IndiaCalculatorsHubPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">India Calculators Hub: model your next money move in ₹</h1>
        <p className="mt-2 text-sm">Best for households that need one practical answer: safe EMI range or realistic SIP amount in Indian number format (1,00,000).</p>
      </header>
      <IndiaAuthorityNote />
      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/in/calculators/emi-calculator" className="link-card">Home Loan EMI Calculator (India)</Link>
        <Link href="/in/calculators/sip-calculator" className="link-card">SIP Calculator (India)</Link>
        <Link href="/in/home-loan-interest-rates-india" className="link-card">Compare lender rates</Link>
        <Link href="/in/fixed-deposit-vs-sip-india" className="link-card">FD vs SIP comparison</Link>
      </div>
    </section>
  );
}
