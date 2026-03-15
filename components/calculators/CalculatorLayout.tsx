'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CalculatorHeader } from '@/components/calculators/CalculatorHeader';
import { InputSlider } from '@/components/calculators/InputSlider';
import { ResultCard } from '@/components/calculators/ResultCard';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { calculatorDefinitions, calculatorMap } from '@/lib/calculators/registry';
import { BaseCalculatorInputs } from '@/lib/calculators/types';

const ProjectionChart = dynamic(() => import('@/components/calculators/ProjectionChart').then((module) => module.ProjectionChart), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
});

const fieldMeta: Array<{ key: keyof BaseCalculatorInputs; label: string; tooltip: string; min: number; max: number; step?: number; prefix?: string; suffix?: string }> = [
  { key: 'loanAmount', label: 'Loan Amount / Starting Balance', tooltip: 'Starting principal, debt, or investment amount.', min: 1000, max: 2000000, step: 500, prefix: '$' },
  { key: 'interestRate', label: 'Interest Rate', tooltip: 'APR for loans or liabilities.', min: 0, max: 35, step: 0.1, suffix: '%' },
  { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Extra monthly payment or investment contribution.', min: 0, max: 25000, step: 25, prefix: '$' },
  { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
  { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' },
  { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' }
];

export function CalculatorLayout({ slug }: { slug: string }) {
  const definition = calculatorMap[slug];
  const [inputs, setInputs] = useState(definition.defaultInputs);
  const { formatCurrency } = usePreferences();

  const result = useMemo(() => definition.compute(inputs), [definition, inputs]);

  return (
    <section className="space-y-8 pb-16">
      <CalculatorHeader title={definition.title} description={definition.description} />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Calculator Directory</h2>
          <div className="grid gap-1 text-sm">
            {calculatorDefinitions.map((item) => (
              <Link key={item.slug} href={`/calculators/${item.slug}`} className={`rounded-lg px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${item.slug === slug ? 'bg-slate-100 font-semibold text-brand dark:bg-slate-800' : ''}`}>
                {item.title}
              </Link>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-4 rounded-3xl bg-slate-950 p-4 sm:p-6">
              {fieldMeta.map((field) => (
                <InputSlider key={field.key} label={field.label} tooltip={field.tooltip} value={inputs[field.key]} min={field.min} max={field.max} step={field.step} prefix={field.prefix} suffix={field.suffix} onChange={(value) => setInputs((prev) => ({ ...prev, [field.key]: value }))} />
              ))}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.summary.map((item) => (
                  <ResultCard key={item.label} label={item.label} helpText={item.helpText} value={item.currency ? formatCurrency(item.value) : `${item.value.toFixed(2)}${item.suffix ?? ''}`} />
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {result.chartKinds.map((chartKind, index) => (
                  <ProjectionChart key={`${chartKind}-${index}`} chartKind={chartKind} projection={result.projection} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-3 text-lg font-semibold">Breakdown Table</h2>
            <table className="w-full text-sm">
              <tbody>
                {result.breakdown.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-2 font-medium text-slate-700 dark:text-slate-200">{row.label}</td>
                    <td className="py-2 text-right text-slate-900 dark:text-white">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {definition.faq.map((item) => (
              <li key={item.question}>
                <p className="font-medium text-slate-900 dark:text-white">{item.question}</p>
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Learn More</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {definition.blogLinks.map((link) => (
              <li key={link.href}>
                <Link className="text-indigo-600 hover:text-indigo-800" href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
