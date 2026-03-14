'use client';
import { useMemo, useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { ChartComponent } from './ChartComponent';

export function EmiCalculator({ type = 'loan' }: { type?: 'loan' | 'mortgage' | 'compound' | 'retirement' | 'networth' }) {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);
  const [contribution, setContribution] = useState(500);
  const [assets, setAssets] = useState(100000);
  const [liabilities, setLiabilities] = useState(25000);

  const result = useMemo(() => {
    if (type === 'networth') return assets - liabilities;
    const months = years * 12;
    const r = rate / 12 / 100;
    if (type === 'loan' || type === 'mortgage') {
      return (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
    }
    if (type === 'compound' || type === 'retirement') {
      let future = principal;
      const arr = [];
      for (let y = 1; y <= years; y++) {
        future = future * (1 + rate / 100) + contribution * 12;
        arr.push({ year: y, value: Number(future.toFixed(0)) });
      }
      return arr;
    }
    return 0;
  }, [assets, contribution, liabilities, principal, rate, type, years]);

  const chartData = Array.isArray(result) ? result : Array.from({ length: years }, (_, i) => ({ year: i + 1, value: Number(((result as number) * (i + 1)).toFixed(0)) }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-3">
        {type !== 'networth' && <CalculatorInput label="Principal ($)" value={principal} onChange={setPrincipal} />}
        {type !== 'networth' && <CalculatorInput label="Annual Rate (%)" value={rate} onChange={setRate} />}
        {type !== 'networth' && <CalculatorInput label="Years" value={years} onChange={setYears} />}
        {(type === 'compound' || type === 'retirement') && <CalculatorInput label="Monthly Contribution ($)" value={contribution} onChange={setContribution} />}
        {type === 'networth' && (
          <>
            <CalculatorInput label="Total Assets ($)" value={assets} onChange={setAssets} />
            <CalculatorInput label="Total Liabilities ($)" value={liabilities} onChange={setLiabilities} />
          </>
        )}
        <p className="text-lg font-semibold">Result: {Array.isArray(result) ? `$${result.at(-1)?.value ?? 0}` : `$${Number(result).toFixed(2)}`}</p>
      </div>
      <div className="card"><ChartComponent data={chartData} xKey="year" yKey="value" /></div>
    </div>
  );
}
