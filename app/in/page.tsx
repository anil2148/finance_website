import type { Metadata } from 'next';
import Link from 'next/link';
import { createCountryMetadata } from '@/lib/country/seo';

export const metadata: Metadata = createCountryMetadata({
  country: 'in',
  pathname: '/',
  title: 'FinanceSphere India | Money Guides and Calculators for India',
  description: 'FinanceSphere India helps you compare SIP, FD, PPF and home-loan decisions using India-specific examples, terminology, and calculators.',
  equivalentPaths: { us: '/', in: '/' }
});

export default function IndiaHomePage() {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-3xl font-bold text-slate-900">FinanceSphere India</h1>
      <p className="text-slate-600">India-first personal finance content built for ₹ planning, tax-saving decisions, and household goals in lakh/crore terms.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Link className="rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50" href="/in/blog">
          <h2 className="font-semibold">India Blog Hub</h2>
          <p className="text-sm text-slate-600">Read India-specific comparisons like SIP vs FD and PPF vs ELSS.</p>
        </Link>
        <Link className="rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50" href="/in/calculators/emi-calculator">
          <h2 className="font-semibold">India Calculators</h2>
          <p className="text-sm text-slate-600">Start with EMI and SIP calculators tailored to India use cases.</p>
        </Link>
      </div>
    </section>
  );
}
