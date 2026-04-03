import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Loans Hub 2026: Home Loan, Personal Loan, EMI, and Debt Decisions',
  description: 'India loans decision hub with home loan and personal loan comparison plus EMI stress testing.',
  pathname: '/in/loans'
});

const links = [
  ['/in/home-loan-interest-rates-india', 'Home Loan Interest Rates India'],
  ['/in/personal-loan-comparison-india', 'Personal Loan Comparison India'],
  ['/in/home-affordability-india', 'Home Affordability India'],
  ['/in/rent-vs-buy-india', 'Rent vs Buy India'],
  ['/in/real-estate', 'Real Estate Hub'],
  ['/in/best-credit-cards-india', 'Credit Card Alternatives'],
  ['/in/calculators/emi-calculator', 'Calculator: EMI Stress Test'],
  ['/in/best-savings-accounts-india', 'Comparison: Savings Accounts India']
];

export default function IndiaLoansHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What EMI is considered safe in India?', acceptedAnswer: { '@type': 'Answer', text: 'Many households keep total EMI near 25-35% of take-home income with emergency reserves.' } },
      { '@type': 'Question', name: 'What is the biggest borrowing mistake?', acceptedAnswer: { '@type': 'Answer', text: 'Using maximum lender eligibility as affordability.' } }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">India Loans Hub: borrow with EMI resilience, not maximum eligibility</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300"><strong>Start here:</strong> test EMI at current rate, +0.5%, and +1.0% before selecting lender.</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200"><strong>Who this is for:</strong> home buyers and personal-loan seekers. <strong>Biggest mistake:</strong> ignoring fee stack and reset clauses. <strong>Best choice by scenario:</strong> choose slightly smaller loan if rate shocks strain essentials.</p>
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
