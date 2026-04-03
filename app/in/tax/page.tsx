import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Tax Planning Hub: Slabs, 80C, 80D, Old vs New Regime (FY 2025-26)',
  description: 'Decision-first India tax hub with old vs new regime comparisons, Section 80C and 80D planning, and salary-based action checklists.',
  pathname: '/in/tax'
});

const links = [
  { href: '/in/tax-slabs', label: 'India tax slabs FY 2025-26' },
  { href: '/in/old-vs-new-tax-regime', label: 'Old vs new regime decision guide' },
  { href: '/in/80c-deductions', label: 'Section 80C and 80D deductions' },
  { href: '/in/tax-saving-strategies', label: 'Tax saving strategies by salary band' },
  { href: '/in/calculators/sip-calculator', label: 'Calculator: SIP planning after-tax cashflow' },
  { href: '/in/best-investment-apps-india', label: 'Comparison: best investment apps in India' }
];

export default function IndiaTaxHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who should use the new tax regime in India?',
        acceptedAnswer: { '@type': 'Answer', text: 'Usually salaried taxpayers with limited deductions and simpler filing preference.' }
      },
      {
        '@type': 'Question',
        name: 'Biggest tax mistake to avoid?',
        acceptedAnswer: { '@type': 'Answer', text: 'March-end panic investing that locks cash without matching your long-term plan.' }
      }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">India Tax Planning Hub (FY 2025-26): choose the right regime before you invest</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Who this is for: salaried employees deciding old vs new regime, families optimizing 80C and 80D, and professionals avoiding cashflow stress during tax season.</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200"><strong>Biggest mistake to avoid:</strong> investing only for deduction and ignoring liquidity. <strong>Best decision by scenario:</strong> if your deductions are low, test the new regime first and invest separately for goals.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl border border-slate-200 bg-white p-4 font-medium text-blue-700 hover:underline dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300">{item.label}</Link>
        ))}
      </div>
      <IndiaAuthorityNote />
    </section>
  );
}
