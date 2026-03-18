import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';
import Image from 'next/image';

export function ComparisonPageClient() {
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
      <ComparisonEngine />
    </section>
  );
}
