import Link from 'next/link';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { localizePath } from '@/lib/countryRouting';

const title = 'EMI Calculator India: Home Loan, Car Loan, and Personal Loan EMI Planning';
const description = 'Use this India EMI calculator guide to estimate monthly EMI, total interest, and affordability for home, vehicle, and personal loan decisions in ₹.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/in/calculators/emi-calculator',
    languages: {
      'en-IN': absoluteUrl('/in/calculators/emi-calculator'),
      'en-US': absoluteUrl('/calculators/loan-calculator'),
      'x-default': absoluteUrl('/calculators/loan-calculator')
    }
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/in/calculators/emi-calculator'),
    type: 'website',
    locale: 'en_IN'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description
  }
};

const indiaLinks = {
  sipVsFd: localizePath('/blog/sip-vs-fd', 'IN'),
  ppfVsElss: localizePath('/blog/ppf-vs-elss', 'IN'),
  home: localizePath('/', 'IN'),
  usEquivalent: localizePath('/calculators/loan-calculator', 'US')
};

export default function IndiaEmiCalculatorPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">India loan planning</p>
        <h1 className="mt-2 text-3xl font-bold">EMI calculator guide for India: make the loan fit your monthly cash flow</h1>
        <p className="mt-3 text-slate-700 dark:text-slate-300">Before taking a home loan, vehicle loan, or personal loan, model EMI against your monthly fixed obligations. A loan that looks affordable in a good month can become stressful when variable expenses rise.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">How to use this calculator effectively</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Enter principal, annual rate, and tenure in years.</li>
          <li>Compare EMI at two rates (current quote and +1%) to test rate sensitivity.</li>
          <li>Compare two tenures (for example, 20 vs 25 years on home loan) and track total interest gap.</li>
          <li>Keep a stress-case buffer for insurance, school fees, or medical shocks before finalizing.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Rupee scenarios</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Home loan:</strong> ₹60 lakh at 8.5% for 20 years gives a materially different EMI and lifetime interest than the same loan over 25 years. Lower EMI can improve monthly flexibility, but increases total outflow.</p>
        <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Car loan:</strong> ₹10 lakh at 9.5% for 5 years vs 7 years shows how tenure reduction often saves interest if monthly budget allows.</p>
        <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Personal loan:</strong> ₹5 lakh at 14% should be checked against existing EMIs so total debt obligations do not crowd out emergency savings and SIP continuity.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Use alongside other India planning pages</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Loan affordability is connected to investing and tax-saving decisions. If EMI rises, your SIP amount and tax-saving allocation might need adjustment.</p>
        <ul className="mt-3 space-y-1 text-sm">
          <li><Link href={indiaLinks.sipVsFd} className="text-blue-700 hover:underline dark:text-blue-300">SIP vs FD decision guide</Link></li>
          <li><Link href={indiaLinks.ppfVsElss} className="text-blue-700 hover:underline dark:text-blue-300">PPF vs ELSS tax-saving framework</Link></li>
          <li><Link href={indiaLinks.home} className="text-blue-700 hover:underline dark:text-blue-300">FinanceSphere India hub</Link></li>
          <li><Link href={indiaLinks.usEquivalent} className="text-blue-700 hover:underline dark:text-blue-300">US/default loan calculator equivalent</Link></li>
        </ul>
      </section>
    </article>
  );
}
