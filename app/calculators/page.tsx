import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { calculatorDefinitions } from '@/lib/calculators/registry';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Financial Calculators | FinanceSphere',
  description: 'Use FinanceSphere calculators to model mortgage payments, debt payoff timelines, retirement income targets, investment growth, and take-home pay scenarios.',
  alternates: { canonical: '/calculators' }
};

export default function CalculatorsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-brand p-6 text-white">
        <h1 className="text-3xl font-bold tracking-tight">Finance calculators for major money decisions</h1>
        <p className="max-w-3xl text-blue-100">Use these calculators to plan monthly payments, compare borrowing paths, and model savings or investment outcomes before you commit real money.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calculatorDefinitions.map((tool) => (
          <Link key={tool.slug} href={`/calculators/${tool.slug}`}>
            <Card className="h-full rounded-2xl transition hover:-translate-y-1 hover:shadow-md">
              <h2 className="text-lg font-semibold">{tool.title}</h2>
              <p className="text-sm text-slate-600">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
