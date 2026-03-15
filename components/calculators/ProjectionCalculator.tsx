'use client';

import { useMemo, useState } from 'react';
import { FinanceLineChart } from '@/components/charts/FinanceLineChart';
import { usePreferences } from '@/components/providers/PreferenceProvider';


export function ProjectionCalculator({
  title,
  description,
  initialPrincipal = 10000,
  initialContribution = 500,
  initialRate = 7,
  years = 20
}: {
  title: string;
  description: string;
  initialPrincipal?: number;
  initialContribution?: number;
  initialRate?: number;
  years?: number;
}) {
  const [principal, setPrincipal] = useState(initialPrincipal);
  const { formatCurrency } = usePreferences();
  const [contribution, setContribution] = useState(initialContribution);
  const [rate, setRate] = useState(initialRate);

  const data = useMemo(() => {
    let total = principal;
    return Array.from({ length: years }, (_, i) => {
      total = total * (1 + rate / 100) + contribution * 12;
      return { name: `Year ${i + 1}`, value: Math.round(total) };
    });
  }, [principal, contribution, rate, years]);

  return (
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-soft">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-slate-600">{description}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm">Starting balance
          <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        </label>
        <label className="text-sm">Monthly contribution
          <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={contribution} onChange={(e) => setContribution(Number(e.target.value))} />
        </label>
        <label className="text-sm">Annual return (%)
          <input className="mt-1 w-full rounded-lg border px-3 py-2" type="range" min={1} max={15} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          <span>{rate}%</span>
        </label>
      </div>

      <p className="text-lg font-semibold">Projected balance: {formatCurrency(data[data.length - 1]?.value ?? 0)}</p>
      <FinanceLineChart data={data} dataKey="value" />
    </section>
  );
}
