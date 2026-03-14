import type { Metadata } from 'next';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';

export const metadata: Metadata = {
  title: 'Loan EMI Calculator | Monthly Payment & Amortization',
  description:
    'Calculate monthly loan EMI instantly. Adjust principal, interest rate, and tenure to estimate repayment with an interactive chart.'
};

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Loan EMI Calculator</h1>
      <p className="max-w-3xl text-slate-700">
        Use this free loan EMI calculator to estimate monthly payments for personal loans, auto loans, and other fixed-rate
        borrowing.
      </p>
      <EmiCalculator type="loan" />
    </section>
  );
}
