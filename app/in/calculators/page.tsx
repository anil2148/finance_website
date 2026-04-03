import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export const metadata: Metadata = createPageMetadata({
  title: 'India Calculators Hub 2026: EMI and SIP Decision Tools with Next Steps',
  description:
    'Use India EMI and SIP calculators as decision engines: test assumptions, read outcomes, and move to the right comparison or guide next.',
  pathname: '/in/calculators'
});

const calculatorCards = [
  {
    title: 'Home Loan EMI Calculator (India)',
    href: '/in/calculators/emi-calculator',
    decision: 'Decide a safe loan size and EMI range before lender talks.',
    assumptions: 'Loan amount, floating rate, tenure, and rate-shock tolerance.',
    nextLinks: [
      { href: '/in/home-loan-interest-rates-india', label: 'Compare home-loan rates and reset clauses' },
      { href: '/in/real-estate', label: 'Open real-estate decision hub' }
    ]
  },
  {
    title: 'SIP Calculator (India)',
    href: '/in/calculators/sip-calculator',
    decision: 'Set a SIP amount that survives weak months and supports long-term goals.',
    assumptions: 'Monthly contribution, expected return, tenure, and salary stability.',
    nextLinks: [
      { href: '/in/fixed-deposit-vs-sip-india', label: 'Choose FD vs SIP by goal timeline' },
      { href: '/in/blog/ppf-vs-elss', label: 'Use PPF vs ELSS for 80C-aware allocation' }
    ]
  }
];

const scenarios = [
  {
    profile: '₹8L salary',
    baseCase: '₹5,000 SIP + no new EMI until emergency reserve reaches 4 months.',
    stressCase: 'If monthly surplus drops below ₹10,000, pause step-up and protect liquidity.'
  },
  {
    profile: '₹12L salary',
    baseCase: '₹10,000 SIP + EMI planned below stress-tested threshold.',
    stressCase: 'If +1% rate hike cuts savings buffer, reduce loan size before booking.'
  },
  {
    profile: '₹18L–₹25L salary',
    baseCase: '₹20,000 SIP + down-payment strategy with 6-month reserve intact.',
    stressCase: 'If investment plan fails in one bad month, contribution is too aggressive.'
  }
];

export default function IndiaCalculatorsHubPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India • Calculator orchestration hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">India Calculators Hub: test the decision before comparing providers</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          These tools are for households deciding EMI commitments and SIP sizing in ₹ terms. Use calculator output as a decision checkpoint, then move to comparison pages and deep guides.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How to read calculator results safely</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          <li><strong>Start with base case:</strong> current salary, costs, and realistic monthly surplus.</li>
          <li><strong>Add stress case:</strong> rate rise, bonus delay, or expense shock.</li>
          <li><strong>Check failure point:</strong> if essentials or insurance break, the plan is too aggressive.</li>
          <li><strong>Then compare:</strong> use only products that fit the tested plan.</li>
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {calculatorCards.map((card) => (
          <article key={card.href} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Decision it helps:</strong> {card.decision}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Assumptions that matter:</strong> {card.assumptions}</p>
            <Link href={card.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
              Open calculator →
            </Link>
            <ul className="mt-3 space-y-1 text-sm">
              {card.nextLinks.map((item) => (
                <li key={item.href}><Link href={item.href} className="content-link">{item.label}</Link></li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Base-case vs stress-case planning by salary band</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article key={scenario.profile} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{scenario.profile}</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Base case:</strong> {scenario.baseCase}</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300"><strong>Stress case:</strong> {scenario.stressCase}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Link href="/in/loans" className="link-card">Next pathway: EMI calculator → loans hub → home-loan comparisons</Link>
        <Link href="/in/investing" className="link-card">Next pathway: SIP calculator → investing hub → FD vs SIP / PPF vs ELSS</Link>
      </section>

      <IndiaAuthorityNote />
    </section>
  );
}
