import Link from 'next/link';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { localizePath } from '@/lib/countryRouting';

const title = 'SIP vs FD in India: ₹10,000/Month Scenarios, Risk, and Decision Rules';
const description = 'Compare SIP and FD with India-specific rupee scenarios, expected outcomes, liquidity needs, and tax context so you can choose the right mix for your goal.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/in/blog/sip-vs-fd' },
  openGraph: { title, description, url: absoluteUrl('/in/blog/sip-vs-fd'), type: 'article', locale: 'en_IN' },
  twitter: { card: 'summary_large_image', title, description }
};

const indiaLinks = {
  emi: localizePath('/calculators/emi-calculator', 'IN'),
  ppfVsElss: localizePath('/blog/ppf-vs-elss', 'IN'),
  home: localizePath('/', 'IN')
};

export default function SipVsFdIndiaPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">India investing decisions</p>
        <h1 className="mt-2 text-3xl font-bold">SIP vs FD in India: practical decision framework with rupee scenarios</h1>
        <p className="mt-3 text-slate-700 dark:text-slate-300">If your monthly surplus is ₹10,000 to ₹30,000, SIP vs FD is usually not an either-or choice. The right answer depends on your timeline, downside tolerance, and whether liquidity is non-negotiable in the next 12–24 months.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Numbers first: ₹10,000/month for 5 years</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>FD at 7% (assumed annual compounding):</strong> contribution ₹6,00,000 can grow to roughly ₹7,15,000 before tax on interest.</li>
          <li><strong>Equity SIP at 12% assumed CAGR (market-linked):</strong> contribution ₹6,00,000 can be around ₹8,20,000, but interim drawdowns of 20%+ are possible.</li>
          <li><strong>Hybrid approach:</strong> ₹6,000 SIP + ₹4,000 FD often balances growth potential and near-term certainty.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">When FD should dominate</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">Choose FD-heavy allocation if your goal is inside 3 years (down payment buffer, tuition due soon, medical reserve) or if principal volatility would force a bad-timing redemption.</p>
        <h2 className="text-xl font-semibold">When SIP should dominate</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">Choose SIP-heavy allocation for 7+ year goals where temporary market declines are acceptable and you can keep investing through corrections.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Decision checklist for Indian households</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Set emergency fund first (typically 6 months expenses) before aggressive SIP allocation.</li>
          <li>If a home loan is likely soon, keep the down-payment corpus in low-volatility instruments (FD/debt), not pure equity SIP.</li>
          <li>Review post-tax return, not just headline FD rate, especially if you are in a higher slab.</li>
          <li>Use SIP for wealth creation and FD for capital protection—not the reverse.</li>
        </ol>
      </section>

      <nav className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700" aria-label="Related India pages">
        <p className="font-semibold text-slate-900 dark:text-slate-100">Continue in India section</p>
        <ul className="mt-2 space-y-1">
          <li><Link href={indiaLinks.ppfVsElss} className="text-blue-700 hover:underline dark:text-blue-300">PPF vs ELSS for tax-saving decisions</Link></li>
          <li><Link href={indiaLinks.emi} className="text-blue-700 hover:underline dark:text-blue-300">EMI Calculator for home/car/personal loans</Link></li>
          <li><Link href={indiaLinks.home} className="text-blue-700 hover:underline dark:text-blue-300">FinanceSphere India hub</Link></li>
        </ul>
      </nav>
    </article>
  );
}
