import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Banking Hub 2026: Savings Accounts, Fixed Deposits, Cards, and Liquidity',
  description: 'India banking decision hub for savings rates, FD choices, cards, and monthly cashflow safety.',
  pathname: '/in/banking'
});

const links = [
  ['/in/best-savings-accounts-india', 'Best Savings Accounts India'],
  ['/in/best-fixed-deposits-india', 'Best Fixed Deposits India'],
  ['/in/best-credit-cards-india', 'Best Credit Cards India'],
  ['/in/fixed-deposit-vs-sip-india', 'FD vs SIP India'],
  ['/in/personal-loan-comparison-india', 'Personal Loan Comparison India'],
  ['/in/home-loan-interest-rates-india', 'Home Loan Interest Rates India'],
  ['/in/calculators/emi-calculator', 'Calculator: EMI Planner'],
  ['/in/calculators/sip-calculator', 'Calculator: SIP Planner']
];

export default function IndiaBankingHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Should I choose highest savings account rate?', acceptedAnswer: { '@type': 'Answer', text: 'Only if minimum balance and fee rules match your usage pattern.' } },
      { '@type': 'Question', name: 'Who should prioritize fixed deposits?', acceptedAnswer: { '@type': 'Answer', text: 'Households with near-term goals and low volatility tolerance.' } }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">India Banking Hub: choose accounts, FDs, and cards that protect your monthly cashflow</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300"><strong>Start here:</strong> secure emergency liquidity first, then optimize returns and rewards.</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200"><strong>Who this is for:</strong> salaried users, families, and self-employed professionals. <strong>Biggest mistake:</strong> rate chasing while ignoring penalties. <strong>Best choice by scenario:</strong> if balance varies monthly, zero-penalty structure usually beats high-rate accounts.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="link-card">{label}</Link>
        ))}
      </div>
      <IndiaAuthorityNote />
    </section>
  );
}
