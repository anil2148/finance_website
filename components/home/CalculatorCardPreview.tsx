'use client';

import { useMemo, useState } from 'react';

type PreviewType = 'mortgage' | 'compound' | 'debt-payoff' | 'debt-snowball';

type CalculatorCardPreviewProps = {
  type: PreviewType;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function CalculatorCardPreview({ type }: CalculatorCardPreviewProps) {
  const [value, setValue] = useState(() => {
    switch (type) {
      case 'mortgage':
        return 450000;
      case 'compound':
        return 400;
      case 'debt-payoff':
        return 200;
      case 'debt-snowball':
        return 4;
      default:
        return 0;
    }
  });

  const preview = useMemo(() => {
    if (type === 'mortgage') {
      const principal = value * 0.8;
      const monthlyRate = 0.0675 / 12;
      const months = 30 * 12;
      const monthlyPayment = principal * (monthlyRate * (1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1);
      return {
        inputLabel: 'Home price',
        outputLabel: 'Estimated monthly P&I',
        outputValue: formatCurrency(monthlyPayment),
        assumption: 'Assumes 20% down, 30-year fixed, 6.75% rate. Taxes/insurance excluded.',
        min: 150000,
        max: 1200000,
        step: 10000
      };
    }

    if (type === 'compound') {
      const monthlyRate = 0.07 / 12;
      const months = 20 * 12;
      const growth = value * ((((1 + monthlyRate) ** months) - 1) / monthlyRate);
      return {
        inputLabel: 'Monthly contribution',
        outputLabel: 'Rough 20-year value',
        outputValue: formatCurrency(growth),
        assumption: 'Assumes 7% annual return with monthly contributions. Illustrative only.',
        min: 50,
        max: 2000,
        step: 25
      };
    }

    if (type === 'debt-payoff') {
      const baselineMonths = 84;
      const monthsSaved = Math.min(48, Math.round(value / 25));
      return {
        inputLabel: 'Extra monthly payment',
        outputLabel: 'Rough payoff acceleration',
        outputValue: `${monthsSaved} months sooner`,
        assumption: `Based on a typical high-APR balance profile (baseline ~${baselineMonths} months).`,
        min: 25,
        max: 500,
        step: 25
      };
    }

    const orderHint = value <= 2 ? 'Simple list and auto-pay highest APR backup.' : value <= 5 ? 'Snowball sequence often improves follow-through.' : 'Group by balance size, then automate the top 3.';
    return {
      inputLabel: 'Number of debts',
      outputLabel: 'Payoff-order hint',
      outputValue: orderHint,
      assumption: 'Behavioral sequencing cue only. Use the full calculator for balances/APRs.',
      min: 2,
      max: 10,
      step: 1
    };
  }, [type, value]);

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
      <label className="text-xs font-medium text-slate-700 dark:text-slate-300" htmlFor={`${type}-preview-input`}>
        {preview.inputLabel}: <span className="font-semibold">{type === 'debt-snowball' ? value : formatCurrency(value)}</span>
      </label>
      <input
        id={`${type}-preview-input`}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded bg-slate-300 accent-blue-600 dark:bg-slate-700"
        type="range"
        min={preview.min}
        max={preview.max}
        step={preview.step}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
      />
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{preview.outputLabel}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{preview.outputValue}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{preview.assumption}</p>
    </div>
  );
}
