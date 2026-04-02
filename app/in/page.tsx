import Link from 'next/link';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';

const title = 'FinanceSphere India: ₹-Based Calculators, SIP/FD Guides, and Tax-Saving Decisions';
const description = 'FinanceSphere India helps you make practical money decisions in rupees with guides on SIP vs FD, PPF vs ELSS, EMI planning, home loans, and tax-saving strategies.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/in',
    languages: {
      'en-IN': absoluteUrl('/in'),
      'en-US': absoluteUrl('/'),
      'x-default': absoluteUrl('/')
    }
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/in'),
    type: 'website',
    locale: 'en_IN'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description
  }
};

const indiaCards = [
  {
    title: 'SIP vs FD in India',
    href: '/in/blog/sip-vs-fd',
    description: 'Rupee-based scenarios to decide between market-linked SIP investing and fixed-return FDs.'
  },
  {
    title: 'PPF vs ELSS',
    href: '/in/blog/ppf-vs-elss',
    description: 'Compare lock-in periods, tax treatment, liquidity, and where each product fits your plan.'
  },
  {
    title: 'EMI Calculator (India)',
    href: '/in/calculators/emi-calculator',
    description: 'Estimate EMI, total interest, and affordability for home loan, car loan, and personal loan decisions.'
  }
];

export default function IndiaHomePage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">FinanceSphere India</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Practical personal finance for India, in ₹ and real-life decisions</h1>
        <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300">
          This India section is built for decisions Indian households make every month: SIP vs FD for surplus cash, PPF/ELSS for tax-saving under 80C, and EMI planning before taking a home loan, vehicle loan, or personal loan.
          We use rupee examples, decision frameworks, and links across related India pages so you can move from learning to action without jumping between unrelated content.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-label="India starter pages">
        {indiaCards.map((card) => (
          <article key={card.href} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
            <Link href={card.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
              Open page →
            </Link>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">What you can plan here</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>₹25,000 monthly surplus: how much to allocate to SIP vs FD vs emergency fund liquidity.</li>
          <li>₹60 lakh home loan planning: EMI comfort range before committing to tenure and lender quote.</li>
          <li>80C tax-saving: when PPF stability is better vs when ELSS growth/liquidity is worth the volatility.</li>
        </ul>
      </section>
    </section>
  );
}
