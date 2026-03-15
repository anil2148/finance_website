import type { Metadata } from 'next';
import { CompoundInterestCalculator } from '@/components/calculator/compound-interest-calculator';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Investment Growth Projection',
  description:
    'Project your investment growth using compound interest and monthly contributions with an interactive Recharts line chart.'
};

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Compound Interest Calculator</h1>
      <p className="max-w-3xl text-slate-600">
        Visualize investment growth with live charts, animated totals, and adjustable assumptions.
      </p>
      <CompoundInterestCalculator />
    </section>
  );
}
