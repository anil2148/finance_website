import type { Metadata } from 'next';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Investment Growth Projection',
  description:
    'Project your investment growth using compound interest and monthly contributions with an interactive Recharts line chart.'
};

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Compound Interest Calculator</h1>
      <p className="max-w-3xl text-slate-700">
        See how your principal grows over time with compound returns and consistent monthly investing.
      </p>
      <EmiCalculator type="compound" />
    </section>
  );
}
