'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRegion } from '@/components/providers/RegionProvider';
import { getTerm } from '@/lib/finance-terminology';
import { withRegionPrefix } from '@/lib/region-config';

const LazyCalculatorCardPreview = dynamic(
  () => import('@/components/home/CalculatorCardPreview').then((mod) => mod.CalculatorCardPreview),
  {
    ssr: false,
    loading: () => <div className="mt-3 h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
  }
);

export function HomeCalculatorsSection() {
  const { region } = useRegion();

  const calculators = [
    {
      title: `${getTerm('mortgage', region)} Calculator`,
      previewType: 'mortgage' as const,
      href: withRegionPrefix('/calculators/mortgage-calculator', region),
      description: 'Stress-test payment affordability before making an offer.'
    },
    {
      title: 'Debt Payoff Calculator',
      previewType: 'debt-payoff' as const,
      href: withRegionPrefix('/calculators/debt-payoff-calculator', region),
      description: 'Model timeline and total interest reduction scenarios.'
    }
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-label="Calculator cards">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Calculators</h2>
        <Link href={withRegionPrefix('/calculators', region)} className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">View all</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {calculators.map((item) => (
          <article key={item.href} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            <LazyCalculatorCardPreview type={item.previewType} />
            <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
              Open calculator →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
