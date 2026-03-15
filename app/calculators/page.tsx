import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { calculatorDefinitions } from '@/lib/calculators/registry';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Financial Calculators',
  description: 'Explore interactive financial calculators with live slider inputs, result cards, and Recharts projections.'
};

export default function CalculatorsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-brand p-6 text-white">
        <h1 className="text-3xl font-bold tracking-tight">Financial Calculator Platform</h1>
        <p className="max-w-3xl text-blue-100">Interactive mobile-first calculators with live updates, slider controls, currency-aware formatting, and dynamic chart visualizations.</p>
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
