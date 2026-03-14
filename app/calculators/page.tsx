import Link from 'next/link';
import { EmiCalculator } from '@/components/calculator/EmiCalculator';

export default function CalculatorsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Financial Calculators</h1>
      <p className="max-w-3xl text-slate-700">
        Explore our high-intent calculator tools for mortgages, loans, investing, and retirement planning.
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link className="btn-primary" href="/mortgage-calculator">
          Mortgage
        </Link>
        <Link className="btn-primary" href="/loan-emi-calculator">
          Loan EMI
        </Link>
        <Link className="btn-primary" href="/compound-interest-calculator">
          Compound Interest
        </Link>
        <Link className="btn-primary" href="/retirement-calculator">
          Retirement
        </Link>
        <Link className="btn-primary" href="/net-worth-calculator">
          Net Worth
        </Link>
      </div>
      <EmiCalculator type="loan" />
    </section>
  );
}
