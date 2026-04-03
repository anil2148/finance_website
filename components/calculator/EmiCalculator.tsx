'use client';

import { useMemo, useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { ChartComponent } from './ChartComponent';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { getCurrencySymbol, getLocaleForCurrency } from '@/lib/utils';

type CalculatorType = 'loan' | 'mortgage' | 'compound' | 'retirement' | 'networth';

type GrowthPoint = { year: number; value: number };

function buildLoanProjection(principal: number, monthlyPayment: number, annualRate: number, years: number): GrowthPoint[] {
  const monthlyRate = annualRate / 12 / 100;
  let remaining = principal;

  return Array.from({ length: years }, (_, index) => {
    for (let i = 0; i < 12; i++) {
      const interest = remaining * monthlyRate;
      remaining = Math.max(0, remaining + interest - monthlyPayment);
    }

    return {
      year: index + 1,
      value: Number(remaining.toFixed(0))
    };
  });
}

export function EmiCalculator({ type = 'loan' }: { type?: CalculatorType }) {
  const [principal, setPrincipal] = useState(type === 'mortgage' ? 350000 : 10000);
  const { currency, formatCurrency } = usePreferences();
  const isIndiaCurrency = currency === 'INR';
  const currencySymbol = getCurrencySymbol(currency, getLocaleForCurrency(currency));
  const [rate, setRate] = useState(type === 'mortgage' ? 6.8 : 10);
  const [years, setYears] = useState(type === 'mortgage' ? 30 : 5);
  const [contribution, setContribution] = useState(type === 'retirement' ? 800 : 500);
  const [assets, setAssets] = useState(100000);
  const [liabilities, setLiabilities] = useState(25000);

  const result = useMemo(() => {
    if (type === 'networth') {
      return {
        value: assets - liabilities,
        chartData: [
          { year: 1, value: assets },
          { year: 2, value: liabilities },
          { year: 3, value: assets - liabilities }
        ]
      };
    }

    const months = Math.max(1, years * 12);
    const monthlyRate = rate / 12 / 100;

    if (type === 'loan' || type === 'mortgage') {
      const emi =
        monthlyRate === 0
          ? principal / months
          : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);

      return {
        value: emi,
        chartData: buildLoanProjection(principal, emi, rate, years)
      };
    }

    const growthData: GrowthPoint[] = [];
    let futureValue = principal;

    for (let y = 1; y <= years; y++) {
      futureValue = futureValue * (1 + rate / 100) + contribution * 12;
      growthData.push({ year: y, value: Number(futureValue.toFixed(0)) });
    }

    return {
      value: growthData.at(-1)?.value ?? 0,
      chartData: growthData
    };
  }, [assets, contribution, liabilities, principal, rate, type, years]);

  const title =
    type === 'mortgage'
      ? isIndiaCurrency
        ? 'Home Loan EMI Calculator (India)'
        : 'Mortgage Calculator'
      : type === 'loan'
        ? 'Loan EMI Calculator'
        : type === 'compound'
          ? isIndiaCurrency
            ? 'SIP Calculator (India)'
            : 'Compound Interest Calculator'
          : type === 'retirement'
            ? 'Retirement Calculator'
            : 'Net Worth Calculator';

  const description =
    type === 'mortgage'
      ? isIndiaCurrency
        ? 'Estimate EMI, total interest, and affordability for common India home-loan ranges (₹5L to ₹5Cr).'
        : 'Estimate monthly mortgage payments and visualize loan balance reduction over time.'
      : type === 'loan'
        ? 'Calculate your monthly EMI with principal, rate, and tenure inputs.'
        : type === 'compound'
          ? isIndiaCurrency
            ? 'Forecast SIP growth with monthly ₹ contributions and return assumptions.'
            : 'Forecast investment growth with compounding and monthly contributions.'
          : type === 'retirement'
            ? 'Project retirement corpus using expected return and annual timeline.'
            : 'Calculate net worth by subtracting liabilities from assets.';

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        {type !== 'networth' && <CalculatorInput label={`Principal (${currencySymbol})`} value={principal} onChange={setPrincipal} />}
        {type !== 'networth' && <CalculatorInput label="Annual Rate (%)" value={rate} onChange={setRate} />}
        {type !== 'networth' && <CalculatorInput label="Years" value={years} onChange={setYears} />}
        {(type === 'compound' || type === 'retirement') && (
          <CalculatorInput label={`Monthly Contribution (${currencySymbol})`} value={contribution} onChange={setContribution} />
        )}

        {type === 'networth' && (
          <>
            <CalculatorInput label={`Total Assets (${currencySymbol})`} value={assets} onChange={setAssets} />
            <CalculatorInput label={`Total Liabilities (${currencySymbol})`} value={liabilities} onChange={setLiabilities} />
          </>
        )}

        <p className="rounded-md bg-slate-100 px-3 py-2 text-lg font-semibold">
          Result: <span className="text-brand">{formatCurrency(result.value)}</span>
          {(type === 'loan' || type === 'mortgage') && <span className="text-sm font-normal text-slate-600"> / month</span>}
        </p>
      </div>

      <div className="card">
        <ChartComponent data={result.chartData} xKey="year" yKey="value" />
      </div>
    </div>
  );
}
