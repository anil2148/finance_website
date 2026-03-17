import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';

export function ComparisonPageClient() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compare financial products with context</h1>
        <p className="text-slate-600">Filter by product type, then compare APR/APY, fees, welcome bonuses, and feature trade-offs across cards, savings accounts, investment apps, mortgage lenders, and personal loans.</p>
      </div>
      <ComparisonEngine />
    </section>
  );
}
