import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Investing Hub 2026: SIP Setup, FD vs SIP, and Salary-Band Allocation Frameworks',
  description: 'Build a practical India investing plan with SIP sizing, FD allocation, and risk-aware pathways by income stability and goal timeline.',
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

const scenarios = [
  {
    title: '₹5,000 SIP starter',
    guidance: 'Ideal when emergency buffer is still being built and income visibility is moderate.',
    warning: 'Do not step up aggressively if one expense spike forces credit-card rollover.'
  },
  {
    title: '₹10,000 SIP core plan',
    guidance: 'Works for many ₹12L salary bands when fixed costs are stable and insurance is already in place.',
    warning: 'If SIP needs to be paused frequently, lower contribution and focus on consistency.'
  },
  {
    title: '₹20,000 SIP growth lane',
    guidance: 'Suitable for higher-surplus households with clear 7+ year goals and strong liquidity reserves.',
    warning: 'Avoid overconcentration in equity if near-term goals still depend on this money.'
  }
];

export default function IndiaInvestingHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much SIP should I start with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with an amount that can survive low-income or high-expense months for at least 24 months without interruption.'
        }
      },
      {
        '@type': 'Question',
        name: 'Should FD stop when SIP starts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Usually no. Keep FD or other stable buckets for near-term goals, and use SIP for long-term growth goals.'
        }
      }
    ]
  };

  return (
    <section className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">India Investing Hub: build wealth with downside-aware SIP discipline</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300"><strong>Start here:</strong> lock emergency reserve, set SIP level you can sustain, then compare execution platforms and tax wrappers.</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Salary-band SIP scenarios</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article key={scenario.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{scenario.title}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{scenario.guidance}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Failure mode:</strong> {scenario.warning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Journey pathway</h2>
        <p className="text-slate-700 dark:text-slate-300">
          Use <Link href="/in/calculators/sip-calculator" className="content-link">SIP calculator</Link> → choose <Link href="/in/fixed-deposit-vs-sip-india" className="content-link">FD vs SIP allocation</Link> → finalize tax-aware split with <Link href="/in/blog/ppf-vs-elss" className="content-link">PPF vs ELSS</Link>.
        </p>
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
