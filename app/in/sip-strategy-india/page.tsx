import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'SIP Strategy India 2026: Monthly Allocation by Salary, Risk, and Goals', description: 'India SIP strategy guide with monthly allocation examples, mistakes to avoid, and scenario recommendations.', pathname: '/in/sip-strategy-india' });

export default function SipStrategyIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">SIP strategy India: from ₹10,000/month to long-term wealth</h1><p className="mt-2 text-sm">Who this is for: salaried investors building consistent SIP contributions without disrupting household cashflow.</p></header>
      <section className="rounded-2xl border bg-white p-6 text-sm"><h2 className="text-xl font-semibold">₹-based strategy examples</h2><ul className="mt-3 list-disc pl-5 space-y-2"><li>₹10,000/month SIP for 10 years @12% ≈ ₹23 lakh.</li><li>₹20,000/month SIP for 12 years @12% ≈ ₹50 lakh.</li><li>₹30,000/month SIP for 15 years @11% ≈ ₹1.2 crore.</li><li>Top-up by ₹2,000 yearly to counter inflation and salary growth.</li></ul><p className="mt-3"><strong>Biggest mistake to avoid:</strong> pausing SIP during market corrections. <strong>Best choice by scenario:</strong> automate SIP date right after salary credit.</p></section>
      <section className="rounded-2xl border bg-white p-6"><div className="india-link-cluster text-sm"><Link href="/in/investing">Investing hub</Link><Link href="/in/fixed-deposit-vs-sip-india">FD vs SIP comparison</Link><Link href="/in/best-investment-apps-india">Investment apps comparison</Link><Link href="/in/calculators/sip-calculator">SIP calculator</Link><Link href="/in/tax">Tax hub</Link></div></section>
      <IndiaAuthorityNote />
    </article>
  );
}
