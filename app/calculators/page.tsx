import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { calculatorDefinitions } from '@/lib/calculators/registry';
import { createPageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'Financial Calculators | FinanceSphere',
  description: 'Use FinanceSphere calculators to model mortgage payments, debt payoff timelines, retirement income targets, investment growth, and take-home pay scenarios.',
  pathname: '/calculators'
});

export default function CalculatorsPage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-5 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-800 to-brand p-6 text-white md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance calculators for major money decisions</h1>
          <p className="max-w-3xl text-blue-100">Explore calculators for mortgage payments, loan EMI, compound interest, retirement planning, net worth, savings goals, debt payoff, and investment growth.</p>
          <p className="mt-2 max-w-3xl text-sm text-blue-100/90">Run your scenario, then review <Link href="/comparison" className="font-semibold underline">comparison pages</Link> and <Link href="/blog" className="font-semibold underline">practical guides</Link> before making a final decision.</p>
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

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3">
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Use this calculator first</h2>
          <p className="mt-1 text-sm text-slate-700">Start with the tool connected to your next decision deadline, not the most popular one.</p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Interpret results safely</h2>
          <p className="mt-1 text-sm text-slate-700">Run base, conservative, and optimistic scenarios so you can compare risk before committing.</p>
        </article>
        <article>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Next action</h2>
          <p className="mt-1 text-sm text-slate-700"><Link href="/comparison" className="font-medium text-blue-700 hover:underline">Compare products</Link> and review <Link href="/editorial-policy" className="font-medium text-blue-700 hover:underline">methodology</Link> before you act.</p>
        </article>
      </section>
    </section>
  );
}
