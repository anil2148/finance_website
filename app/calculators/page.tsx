import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
      <div className="grid gap-5 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-brand p-6 text-white md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance calculators for major money decisions</h1>
          <p className="max-w-3xl text-blue-100">Use these calculators to plan monthly payments, compare borrowing paths, and model savings or investment outcomes before you commit real money.</p>
        </div>
        <div className="relative h-44 overflow-hidden rounded-2xl border border-white/20 sm:h-52">
          <Image
            src="/images/calculator-tools-illustration.svg"
            alt="Illustration of financial calculators with charts and budgeting controls"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
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
