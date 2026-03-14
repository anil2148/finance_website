import type { Metadata } from 'next';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';

export const metadata: Metadata = {
  title: 'Mortgage Calculator | Monthly Home Loan Payment Estimator',
  description:
    'Estimate monthly mortgage payments with principal, interest rate, and tenure inputs. Visualize remaining balance year by year.'
};

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Mortgage Payment Calculator</h1>
      <p className="max-w-3xl text-slate-700">
        Plan your home purchase with a clear monthly payment estimate and yearly loan balance trend.
      </p>
      <EmiCalculator type="mortgage" />
    </section>
  );
}
