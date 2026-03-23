import Image from 'next/image';
import Link from 'next/link';
import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';
import { getFinancialProducts } from '@/lib/financialProducts';

export function ComparisonPageClient() {
  const products = getFinancialProducts();

  return (
    <section className="space-y-6">
      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Compare financial products with context</h1>
          <p className="text-slate-600">Filter by product type, then compare APR/APY, fees, welcome bonuses, and feature trade-offs across cards, savings accounts, investment apps, mortgage lenders, and personal loans.</p>
        </div>
        <div className="relative h-44 overflow-hidden rounded-2xl sm:h-52">
          <Image
            src="/images/comparison-analytics-illustration.svg"
            alt="Side-by-side finance product comparison dashboard with rate cards and performance charts"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 35vw"
            className="object-cover"
          />
        </div>
      </div>
      <ComparisonEngine initialProducts={products} />
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Popular comparison pages</h2>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <li><Link href="/best-credit-cards-2026" className="font-medium text-blue-700 hover:underline">Best Credit Cards 2026</Link></li>
          <li><Link href="/best-investment-apps" className="font-medium text-blue-700 hover:underline">Best Investment Apps</Link></li>
          <li><Link href="/best-savings-accounts-usa" className="font-medium text-blue-700 hover:underline">Best Savings Accounts USA</Link></li>
          <li><Link href="/compare/mortgage-rate-comparison" className="font-medium text-blue-700 hover:underline">Mortgage Rate Comparison</Link></li>
        </ul>
      </section>
    </section>
  );
}
