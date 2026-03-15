import type { Metadata } from 'next';
import { LoanCalculator } from '@/components/calculator/loan-calculator';

export const metadata: Metadata = {
  title: 'Loan EMI Calculator | Monthly Payment & Amortization',
  description:
    'Calculate monthly loan EMI instantly. Adjust principal, interest rate, and tenure to estimate repayment with an interactive chart.'
};

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Loan EMI Calculator</h1>
      <p className="max-w-3xl text-slate-600">
        Adjust amount, rate, and term to instantly see your EMI, repayment mix, and amortization trend.
      </p>
      <LoanCalculator />
    </section>
  );
}
