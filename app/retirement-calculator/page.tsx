import type { Metadata } from 'next';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';

export const metadata: Metadata = {
  title: 'Retirement Calculator | Future Corpus Forecast',
  description:
    'Estimate your retirement corpus by adjusting current savings, expected annual return, and monthly contribution.'
};

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Retirement Savings Calculator</h1>
      <p className="max-w-3xl text-slate-700">
        Forecast your long-term retirement savings and test contribution scenarios with a year-by-year chart.
      </p>
      <EmiCalculator type="retirement" />
    </section>
  );
}
