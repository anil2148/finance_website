import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Real Estate Hub 2026: Rent vs Buy, Home Affordability, and EMI Planning',
  description: 'India real-estate decision hub for rent vs buy, affordability checks, and home-loan strategy.',
  pathname: '/in/real-estate'
});

const links = [
  ['/in/rent-vs-buy-india', 'Rent vs Buy India'],
  ['/in/home-affordability-india', 'Home Affordability India'],
  ['/in/home-loan-interest-rates-india', 'Home Loan Interest Rates India'],
  ['/in/personal-loan-comparison-india', 'Personal Loan Comparison India'],
  ['/in/loans', 'Loans Hub'],
  ['/in/best-savings-accounts-india', 'Savings Accounts for Down-payment Parking'],
  ['/in/calculators/emi-calculator', 'Calculator: EMI Planner'],
  ['/in/fixed-deposit-vs-sip-india', 'Comparison: FD vs SIP for Down-payment Funds']
];

export default function IndiaRealEstateHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Should I buy if EMI equals rent?', acceptedAnswer: { '@type': 'Answer', text: 'Not always; include maintenance, furnishing, and opportunity cost of down-payment.' } },
      { '@type': 'Question', name: 'How long should I plan to stay before buying?', acceptedAnswer: { '@type': 'Answer', text: 'A 5+ year stay horizon often improves buy-case stability.' } }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">India Real Estate Hub: buy homes with full-cost clarity, not just EMI comfort</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300"><strong>Start here:</strong> run affordability, compare rent vs buy math, then evaluate lender offers.</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200"><strong>Who this is for:</strong> first-time home buyers. <strong>Biggest mistake:</strong> ignoring interior/maintenance costs. <strong>Best choice by scenario:</strong> buy when stay horizon is 5+ years and emergency reserve remains intact after down payment.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">{label}</Link>
        ))}
      </div>
      <IndiaAuthorityNote />
    </section>
  );
}
