import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Banking Decisions: Savings Accounts, Credit Cards, FD vs Liquidity',
  description: 'Compare Indian savings accounts, card fees, and banking choices with rate, fee, and usage-fit filters.',
  pathname: '/in/banking'
});

export default function IndiaBankingHubPage() {
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'Should you chase highest savings rate?', acceptedAnswer: { '@type': 'Answer', text: 'Only if withdrawal limits and service quality match your daily use.' } }] };
  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold">India Banking Hub: choose accounts and cards that reduce annual fee drag</h1>
        <p className="mt-3 text-sm">Who this is for: salary-account users, cashback maximizers, and households parking emergency funds in high-liquidity accounts.</p>
        <p className="mt-2 text-sm"><strong>Biggest mistake to avoid:</strong> ignoring annual fees and reward expiry. <strong>Best decision based on scenario:</strong> low-spend users should prioritize zero-fee products over reward complexity.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/in/best-savings-accounts-india" className="rounded-xl border p-4">Best savings accounts India</Link>
        <Link href="/in/best-credit-cards-india" className="rounded-xl border p-4">Best credit cards India</Link>
        <Link href="/in/fixed-deposit-vs-sip-india" className="rounded-xl border p-4">FD vs SIP in India</Link>
        <Link href="/in/home-loan-interest-rates-india" className="rounded-xl border p-4">Home loan interest rates India</Link>
        <Link href="/in/calculators/emi-calculator" className="rounded-xl border p-4">Calculator: EMI affordability</Link>
      </div>
      <IndiaAuthorityNote />
    </section>
  );
}
