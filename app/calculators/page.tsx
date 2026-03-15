import Link from 'next/link';
import { calculatorDefinitions } from '@/lib/calculators/registry';

export default function CalculatorsPage() {
  return (
    <section className="space-y-8">
      <header className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-900 to-cyan-800 p-8 text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Financial Calculators Hub</h1>
        <p className="mt-3 max-w-3xl text-slate-200">
          A reusable calculator engine for mortgages, debt payoff, retirement, and investment planning with real-time charts.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculatorDefinitions.map((calculator) => (
          <Link
            key={calculator.slug}
            href={`/calculators/${calculator.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">{calculator.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{calculator.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
