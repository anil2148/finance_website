import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({ title: 'Rent vs Buy in India 2026: Mumbai, Bengaluru, Pune Scenario Analysis', description: 'Rent vs buy decision framework for India with EMI, maintenance, and opportunity-cost examples.', pathname: '/in/rent-vs-buy-india' });

export default function RentVsBuyIndiaPage() {
  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-6"><h1 className="text-3xl font-semibold">Rent vs buy in India: full-cost decision framework</h1><p className="mt-2 text-sm">Who this is for: first-time buyers comparing rent outflow versus total ownership cost.</p></header>
      <section className="rounded-2xl border bg-white p-6 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Mumbai example: rent ₹55,000 vs EMI ₹82,000 + ₹12,000 maintenance.</li><li>Bengaluru example: rent ₹38,000 vs EMI ₹61,000 + ₹8,000 society + upkeep.</li><li>Pune example: rent ₹27,000 vs EMI ₹48,000 + furnishings amortization.</li><li>Down payment opportunity cost: ₹25 lakh at 7% FD ≈ ₹1.75 lakh/year.</li></ul><p className="mt-3"><strong>Biggest mistake:</strong> comparing only rent and EMI. <strong>Best choice by scenario:</strong> buy when stay horizon is 5+ years and EMI stress-tested with +1% rate.</p></section>
      <section className="rounded-2xl border bg-white p-6"><div className="flex flex-wrap gap-3 text-sm"><Link href="/in/real-estate">Real-estate hub</Link><Link href="/in/home-affordability-india">Home affordability</Link><Link href="/in/home-loan-interest-rates-india">Home loan comparison</Link><Link href="/in/calculators/emi-calculator">EMI calculator</Link><Link href="/in/fixed-deposit-vs-sip-india">FD vs SIP comparison</Link></div></section>

      <section className="rounded-2xl border bg-white p-6 text-sm">
        <h2 className="text-xl font-semibold">Best for YOU if…</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>₹1–2 lakh annual discretionary spend: pick low-fee, low-maintenance products with easy exit.</li>
          <li>₹5–10 lakh annual spend or surplus: choose higher-reward options only when usage is consistent.</li>
          <li>High variability in monthly income: prioritize flexibility and penalty-light structures over headline return.</li>
        </ul>
        <h3 className="mt-4 text-lg font-semibold">Worst choice if…</h3>
        <p className="mt-2">You cannot meet annual usage thresholds or you may need early liquidity, because fee drag and penalty clauses can erase the apparent benefit.</p>
      </section>
      <IndiaAuthorityNote />
    </article>
  );
}
