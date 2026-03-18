import Link from 'next/link';
import { ComparisonTable } from '@/components/comparison-table/ComparisonTable';
import { savingsAccounts } from '@/data/savingsAccounts';

export const revalidate = 3600;

const featuredGuides = [
  { href: '/blog/seo-emergency-fund-3-to-6-months', label: 'Emergency Fund Guide (2026)' },
  { href: '/blog/seo-high-yield-savings-basics', label: 'High-Yield Savings Accounts in 2026' }
];

export default function SavingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Compare Savings Accounts</h1>
        <p className="text-slate-600">Compare APY and account features, then use the guides below to build your emergency savings strategy.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Related savings guides</h2>
        <div className="flex flex-wrap gap-2">
          {featuredGuides.map((guide) => (
            <Link key={guide.href} href={guide.href} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800">
              {guide.label}
            </Link>
          ))}
        </div>
      </div>

      <ComparisonTable data={savingsAccounts} />
    </div>
  );
}
