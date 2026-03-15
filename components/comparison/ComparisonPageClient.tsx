import { ComparisonEngine } from '@/components/comparison/ComparisonEngine';

export function ComparisonPageClient() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finance Product Comparison Engine</h1>
        <p className="text-slate-600">Search, filter by category, and sort by rating or APR/APY across credit cards, savings accounts, investment apps, mortgage lenders, and personal loans.</p>
      </div>
      <ComparisonEngine />
    </section>
  );
}
