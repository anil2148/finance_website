import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createCountryPageMetadata } from '@/lib/seo';

type IndiaCalculatorContent = {
  title: string;
  description: string;
  formula: string;
  intro: string;
};

const indiaCalculators: Record<string, IndiaCalculatorContent> = {
  'emi-calculator': {
    title: 'EMI Calculator (India)',
    description: 'Calculate monthly EMI in INR, total repayment, and total interest for home, car, or personal loans in India.',
    formula: 'EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)',
    intro: 'Use this EMI guide for India loans where rates are typically quoted as annual reducing-balance interest.'
  },
  'sip-calculator': {
    title: 'SIP Calculator (India)',
    description: 'Estimate future value of monthly SIP investments with rupee-denominated examples and assumptions.',
    formula: 'Future Value = SIP × [((1 + r)^n − 1) / r] × (1 + r)',
    intro: 'Use this SIP guide to model long-term investing in mutual funds in India.'
  }
};

export function generateStaticParams() {
  return Object.keys(indiaCalculators).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const calculator = indiaCalculators[params.slug];
  if (!calculator) return {};

  return createCountryPageMetadata({
    title: `${calculator.title} | FinanceSphere India`,
    description: calculator.description,
    pathname: `/calculators/${params.slug}`,
    country: 'IN'
  });
}

export default function IndiaCalculatorPage({ params }: { params: { slug: string } }) {
  const calculator = indiaCalculators[params.slug];
  if (!calculator) notFound();

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-xs uppercase tracking-wide text-blue-700">India Edition</p>
      <h1 className="text-3xl font-bold">{calculator.title}</h1>
      <p className="text-slate-600">{calculator.description}</p>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="font-semibold">How it works</h2>
        <p className="mt-2 text-sm text-slate-700">{calculator.intro}</p>
        <p className="mt-2 font-mono text-sm text-slate-800">{calculator.formula}</p>
      </div>

      <p className="text-sm text-slate-600">
        Need a full interactive tool right now? Use our core calculator experience and set currency to INR:
        <Link href="/calculators/loan-calculator" className="ml-1 font-medium text-blue-700 hover:underline">Loan Calculator</Link>.
      </p>
    </section>
  );
}
