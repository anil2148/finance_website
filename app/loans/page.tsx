import Link from 'next/link';
import { ComparisonTable } from '@/components/comparison-table/ComparisonTable';
import { loans } from '@/data/loans';

export const revalidate = 3600;

const featuredGuides = [
  { href: '/blog/debt-to-income-ratio-90-day-plan', label: 'Debt-to-Income Ratio Guide' },
  { href: '/blog/how-to-compare-personal-loan-apr', label: 'How to Compare Personal Loan APR' },
  { href: '/blog/mortgage-preapproval-checklist', label: 'Mortgage Preapproval Checklist' },
  { href: '/learn/loans', label: 'Loans hub: compare fixed vs variable and prepayment tradeoffs' }
];

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Compare Personal Loans</h1>
        <p className="text-slate-600">Compare current loan offers, then use the guides below to evaluate approval odds, APR, and payoff flexibility.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Related loan guides</h2>
        <div className="flex flex-wrap gap-2">
          {featuredGuides.map((guide) => (
            <Link key={guide.href} href={guide.href} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800">
              {guide.label}
            </Link>
          ))}
        </div>
      </div>

      <ComparisonTable data={loans} />
    </div>
  );
}
