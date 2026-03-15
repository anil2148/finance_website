import type { Metadata } from 'next';
import { MortgageCalculator } from '@/components/calculator/mortgage-calculator';

export const metadata: Metadata = {
  title: 'Mortgage Calculator | Monthly Home Loan Payment Estimator',
  description:
    'Estimate monthly mortgage payments with principal, interest rate, and tenure inputs. Visualize remaining balance year by year.'
};

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Mortgage Payment Calculator</h1>
      <p className="max-w-3xl text-slate-600">
        Model your mortgage in real time with interactive sliders, animated summaries, and payment breakdown charts.
      </p>
      <MortgageCalculator />
    </section>
  );
}
