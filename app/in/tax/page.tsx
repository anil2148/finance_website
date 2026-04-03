import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Tax Hub 2026: Tax Slabs, Old vs New Regime, 80C Deductions (FY 2025-26)',
  description: 'Start here tax decision engine for India with regime choice, deduction planning, and salary-based examples.',
  pathname: '/in/tax'
});

const links = [
  { href: '/in/tax-slabs-2026-india', label: 'Tax Slabs 2026 India' },
  { href: '/in/old-vs-new-tax-regime', label: 'Old vs New Tax Regime Decision' },
  { href: '/in/80c-deductions-guide', label: '80C Deductions Guide' },
  { href: '/in/tax-saving-strategies', label: 'Tax Saving Strategies by Salary Band' },
  { href: '/in/sip-strategy-india', label: 'Post-tax SIP Strategy India' },
  { href: '/in/best-investment-apps-india', label: 'Comparison: Best Investment Apps India' },
  { href: '/in/calculators/sip-calculator', label: 'Calculator: SIP Growth in ₹' },
  { href: '/in/investing', label: 'Investing Hub' }
];

export default function IndiaTaxHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Where should I start if I am confused about tax planning?', acceptedAnswer: { '@type': 'Answer', text: 'Start with old vs new regime check, then build monthly 80C contributions.' } },
      { '@type': 'Question', name: 'What is the biggest tax mistake in India?', acceptedAnswer: { '@type': 'Answer', text: 'March panic tax-saving without checking liquidity and long-term fit.' } },
      { '@type': 'Question', name: 'Can I do tax-saving and wealth building together?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, by separating tax deductions from long-term SIP strategy and using both monthly.' } }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">India Tax Hub (FY 2025–26): start here to reduce tax without cashflow mistakes</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300"><strong>Start here:</strong> (1) Pick regime, (2) map deductions, (3) convert yearly tax targets into monthly contributions.</p>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200"><strong>Who should use this first:</strong> salaried households comparing take-home impact before locking tax-saving products. <strong>Common miss:</strong> buying ELSS/PPF in March without checking monthly liquidity. <strong>Practical call:</strong> if declared deductions stay modest, new regime often keeps execution cleaner.</p>
      </header>
      <IndiaAuthorityNote />
      <div className="grid gap-3 md:grid-cols-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl border border-slate-200 bg-white p-4 font-medium text-blue-700 hover:underline dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300">{item.label}</Link>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Regime trigger map by salary band</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li><strong>₹8–12 lakh salary:</strong> new regime usually wins when HRA and 80C proofs are limited; verify with one quick comparison before investing extra.</li>
          <li><strong>₹15–20 lakh salary:</strong> old regime can still outperform only when EPF + HRA + 80C + 80D are fully documented and consistent through the year.</li>
          <li><strong>₹25 lakh+ salary:</strong> avoid mixing tax and investing decisions; first lock the regime, then build a separate monthly wealth allocation plan.</li>
        </ul>

        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Where tax plans break during filing season</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li>You estimate deductions but do not have proof-ready documents by filing time.</li>
          <li>Your monthly cashflow is tight and tax-saving contributions stop mid-year.</li>
          <li>Job switch or bonus structure changes, but you continue with last year&apos;s plan.</li>
        </ul>
      </section>
    </section>
  );
}
