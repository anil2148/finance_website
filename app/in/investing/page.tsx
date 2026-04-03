import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Investing Hub 2026: SIP, Apps, FD vs SIP, and Tax-efficient Wealth Planning',
  description: 'India investing hub with SIP strategy, comparison pages, and risk-based decision paths.',
  pathname: '/in/investing'
});

const links = [
  ['/in/sip-strategy-india', 'SIP Strategy India'],
  ['/in/best-investment-apps-india', 'Best Investment Apps India'],
  ['/in/fixed-deposit-vs-sip-india', 'Fixed Deposit vs SIP India'],
  ['/in/blog/sip-vs-fd', 'SIP vs FD Deep Guide'],
  ['/in/blog/ppf-vs-elss', 'PPF vs ELSS Deep Guide'],
  ['/in/old-vs-new-tax-regime', 'Old vs New Tax Regime'],
  ['/in/calculators/sip-calculator', 'Calculator: SIP Planner'],
  ['/in/best-savings-accounts-india', 'Comparison: Savings Accounts India']
];

export default function IndiaInvestingHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'How much SIP should I start with?', acceptedAnswer: { '@type': 'Answer', text: 'Start with an amount you can continue for at least 24 months even in weak markets.' } },
      { '@type': 'Question', name: 'Should I stop FD when starting SIP?', acceptedAnswer: { '@type': 'Answer', text: 'Not necessarily; keep FD for short-term goals and SIP for long-term growth.' } }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">India Investing Hub: build wealth with SIP strategy, tax awareness, and downside discipline</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300"><strong>Start here:</strong> lock emergency reserve, set monthly SIP amount, then choose platform and fund mix.</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200"><strong>Who this is for:</strong> first-time and intermediate investors. <strong>Biggest mistake:</strong> setting SIP amounts that fail in one bad salary month. <strong>Practical call:</strong> fund 0–3 year goals in stable buckets, then use SIP for 7+ year goals.</p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How to set SIP amount without guesswork</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li>Use your lower in-hand month as baseline, then test ₹5,000, ₹10,000, and ₹25,000 SIP options.</li>
          <li>If any option forces card rollover in a high-expense month, step down SIP and protect consistency first.</li>
          <li>Review every quarter; increase SIP only after at least 3 stable salary cycles.</li>
        </ul>
      </section>
      <div className="grid gap-3 md:grid-cols-2">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="link-card">{label}</Link>
        ))}
      </div>
      <IndiaAuthorityNote />
    </section>
  );
}
