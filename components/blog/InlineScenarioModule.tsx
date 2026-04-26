'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type InlineScenarioModuleProps = {
  calculatorHref: string;
  calculatorLabel: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function InlineScenarioModule({ calculatorHref, calculatorLabel }: InlineScenarioModuleProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(400);
  const [rateDelta, setRateDelta] = useState(1.5);

  const outcome = useMemo(() => {
    const yearlyImpact = monthlyAmount * (rateDelta / 100) * 12;
    const downside = yearlyImpact * 0.6;
    const upside = yearlyImpact * 1.4;

    return {
      yearlyImpact,
      downside,
      upside
    };
  }, [monthlyAmount, rateDelta]);

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-500/40 dark:bg-blue-900/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Mini calculator + scenario simulation</h3>
        <Link href={calculatorHref} className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700">
          Run your scenario
        </Link>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-400/40 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Mini calculator</p>
          <label className="mt-2 block text-sm text-slate-600 dark:text-slate-300">Monthly amount</label>
          <input
            type="number"
            min={0}
            value={monthlyAmount}
            onChange={(event) => setMonthlyAmount(Number(event.target.value) || 0)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <label className="mt-2 block text-sm text-slate-600 dark:text-slate-300">Rate / fee difference (%)</label>
          <input
            type="number"
            step="0.1"
            min={0}
            value={rateDelta}
            onChange={(event) => setRateDelta(Number(event.target.value) || 0)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">Estimated annual impact: {formatCurrency(outcome.yearlyImpact)}</p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-400/40 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Scenario simulation</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">If assumptions miss by 40%, this decision still moves about {formatCurrency(outcome.downside)}/year.</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">If execution is strong, upside reaches roughly {formatCurrency(outcome.upside)}/year.</p>
          <Link href={calculatorHref} className="mt-3 inline-flex rounded-md border border-blue-300 px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-400/50 dark:text-blue-300 dark:hover:bg-blue-900/30">
            Open {calculatorLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
