import type { Metadata } from 'next';
import Link from 'next/link';
import { createCountryPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createCountryPageMetadata({
  title: 'FinanceSphere India | Personal Finance Guides & Calculators',
  description: 'India-focused finance content from FinanceSphere: SIP, FD, EMI, taxation basics, and practical planning tools in INR.',
  pathname: '/',
  country: 'IN'
});

export default function IndiaHomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">India Edition</p>
        <h1 className="mt-2 text-3xl font-bold">FinanceSphere India</h1>
        <p className="mt-2 text-slate-600">Explore India-specific money guides and calculators with INR examples and local terminology.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/in/blog" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
          <h2 className="text-xl font-semibold">India Blog</h2>
          <p className="mt-2 text-sm text-slate-600">Read localized explainers on SIP vs FD, PPF vs ELSS, and home-loan decisions in India.</p>
        </Link>
        <Link href="/in/calculators/emi-calculator" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
          <h2 className="text-xl font-semibold">EMI Calculator</h2>
          <p className="mt-2 text-sm text-slate-600">Calculate monthly EMI, total repayment, and total interest in INR.</p>
        </Link>
      </div>
    </section>
  );
}
