import Link from 'next/link';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { localizePath } from '@/lib/countryRouting';

const title = 'PPF vs ELSS in India: Lock-in, Tax Benefit, Liquidity, and Use Cases';
const description = 'Understand PPF vs ELSS with India-focused comparisons across lock-in period, tax treatment, liquidity, expected return profile, and long-term suitability.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/in/blog/ppf-vs-elss' },
  openGraph: { title, description, url: absoluteUrl('/in/blog/ppf-vs-elss'), type: 'article', locale: 'en_IN' },
  twitter: { card: 'summary_large_image', title, description }
};

const indiaLinks = {
  sipVsFd: localizePath('/blog/sip-vs-fd', 'IN'),
  emi: localizePath('/calculators/emi-calculator', 'IN'),
  home: localizePath('/', 'IN')
};

export default function PpfVsElssIndiaPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">India tax-saving strategy</p>
        <h1 className="mt-2 text-3xl font-bold">PPF vs ELSS: choose by lock-in tolerance, liquidity needs, and growth target</h1>
        <p className="mt-3 text-slate-700 dark:text-slate-300">Both PPF and ELSS can help under Section 80C, but they solve different problems. PPF is for stability and tax-efficient debt-like accumulation; ELSS is for long-term equity growth with shorter lock-in but higher volatility.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Side-by-side practical comparison</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Lock-in:</strong> PPF effectively 15 years (with partial withdrawal rules), ELSS has 3-year lock-in per installment.</li>
          <li><strong>Tax:</strong> PPF is typically EEE (subject to current law); ELSS gives 80C deduction but gains taxation follows equity taxation rules.</li>
          <li><strong>Liquidity:</strong> ELSS is meaningfully more liquid after lock-in; PPF is rigid for near-term cash needs.</li>
          <li><strong>Return profile:</strong> PPF offers government-backed rate stability; ELSS can outperform over long horizons but with drawdown risk.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">₹1,50,000 annual 80C example</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">If you invest the full ₹1.5 lakh each year: a PPF-heavy approach is suitable when capital safety and predictable compounding matter more than upside. An ELSS-heavy approach is suitable if your horizon is 10+ years and you can hold through volatility without stopping SIPs in falling markets.</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">A blended allocation (for example, 60% PPF and 40% ELSS) can work for households balancing retirement corpus building with moderate risk tolerance.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Decision framework</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Need high certainty + capital preservation? Start with larger PPF allocation.</li>
          <li>Need growth + can stay invested for decade-plus? Increase ELSS share.</li>
          <li>Expect a home down payment or business cash need in 3–5 years? Avoid over-allocating to volatile equity.</li>
          <li>Review annually with goal horizon, not by chasing last year returns.</li>
        </ol>
      </section>

      <nav className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700" aria-label="Related India pages">
        <p className="font-semibold text-slate-900 dark:text-slate-100">Continue in India section</p>
        <ul className="mt-2 space-y-1">
          <li><Link href={indiaLinks.sipVsFd} className="text-blue-700 hover:underline dark:text-blue-300">SIP vs FD with rupee scenarios</Link></li>
          <li><Link href={indiaLinks.emi} className="text-blue-700 hover:underline dark:text-blue-300">EMI calculator for loan affordability</Link></li>
          <li><Link href={indiaLinks.home} className="text-blue-700 hover:underline dark:text-blue-300">FinanceSphere India hub</Link></li>
        </ul>
      </nav>
    </article>
  );
}
