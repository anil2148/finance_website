import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'India Investing Hub: SIP, PPF, NPS, EPF, and app comparisons', description: 'India-first investing decisions with SIP scenarios, retirement structures, and platform comparisons.', pathname: '/in/investing' });

export default function IndiaInvestingHubPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-semibold">India Investing Hub: build wealth with SIP + EPF/PPF/NPS coordination</h1>
        <p className="mt-2 text-sm">Who this is for: salaried professionals at ₹8L, ₹15L, and ₹25L annual income planning long-term wealth.</p>
        <p className="mt-2 text-sm"><strong>Biggest mistake to avoid:</strong> treating EPF as enough for retirement. <strong>Best decision based on scenario:</strong> keep EPF base, then add SIP and NPS based on risk and tax bracket.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/in/best-investment-apps-india" className="rounded-xl border p-4">Best investment apps India</Link>
        <Link href="/in/fixed-deposit-vs-sip-india" className="rounded-xl border p-4">FD vs SIP India</Link>
        <Link href="/in/blog/ppf-vs-elss" className="rounded-xl border p-4">PPF vs ELSS guide</Link>
        <Link href="/in/blog/sip-vs-fd" className="rounded-xl border p-4">SIP vs FD guide</Link>
        <Link href="/in/calculators/sip-calculator" className="rounded-xl border p-4">Calculator: SIP corpus</Link>
      </div>
      <IndiaAuthorityNote />
    </section>
  );
}
