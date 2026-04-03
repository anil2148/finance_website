'use client';

import { useMemo, useState } from 'react';
import { FinanceLineChart } from '@/components/charts/FinanceLineChart';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { getCurrencySymbol, getLocaleForCurrency } from '@/lib/utils';

type CalculatorType = 'loan' | 'mortgage' | 'compound' | 'retirement' | 'networth';

type GrowthPoint = {
  year: number;
  value: number;
};

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
  const { currency, formatCurrency } = usePreferences();
  const isIndiaCurrency = currency === 'INR';
  const currencySymbol = getCurrencySymbol(currency, getLocaleForCurrency(currency));

  const [principal, setPrincipal] = useState(
    type === 'mortgage'
      ? (isIndiaCurrency ? 5000000 : 350000)
      : type === 'loan'
        ? (isIndiaCurrency ? 500000 : 10000)
        : 10000
  );
  const [rate, setRate] = useState(type === 'mortgage' ? (isIndiaCurrency ? 8 : 6.8) : 10);
  const [years, setYears] = useState(type === 'mortgage' ? (isIndiaCurrency ? 20 : 30) : 5);
  const [contribution, setContribution] = useState(type === 'retirement' ? 800 : 500);
  const [assets, setAssets] = useState(100000);
  const [liabilities, setLiabilities] = useState(25000);

  const result = useMemo(() => {
    if (type === 'networth') {
      const value = assets - liabilities;
      return {
        value,
        points: [
          { name: 'Assets', value: assets },
          { name: 'Liabilities', value: liabilities },
          { name: 'Net Worth', value }
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
        points: buildLoanProjection(principal, emi, rate, years).map((point) => ({
          name: `Year ${point.year}`,
          value: point.value
        }))
      };
    }

    const points: Array<{ name: string; value: number }> = [];
    let futureValue = principal;

    for (let y = 1; y <= years; y++) {
      futureValue = futureValue * (1 + rate / 100) + contribution * 12;
      points.push({ name: `Year ${y}`, value: Number(futureValue.toFixed(0)) });
    }

    return {
      value: points.at(-1)?.value ?? 0,
      points
    };
  }, [assets, contribution, liabilities, principal, rate, type, years]);

  const title =
    type === 'mortgage'
      ? (isIndiaCurrency ? 'Home Loan EMI Calculator (India)' : 'Home Loan EMI Calculator')
      : type === 'loan'
        ? (isIndiaCurrency ? 'Loan EMI Calculator (India)' : 'Loan EMI Calculator')
        : type === 'compound'
          ? (isIndiaCurrency ? 'SIP Calculator (India)' : 'Compound Interest Calculator')
          : type === 'retirement'
            ? 'Retirement Calculator'
            : 'Net Worth Calculator';

  const description =
    type === 'mortgage'
      ? 'Estimate your monthly EMI based on loan amount, interest rate, and tenure.'
      : type === 'loan'
        ? 'Calculate your monthly EMI with principal, rate, and tenure inputs.'
        : type === 'compound'
          ? (isIndiaCurrency
            ? 'Forecast SIP growth with monthly ₹ contributions and return assumptions.'
            : 'Forecast investment growth with compounding and monthly contributions.')
          : type === 'retirement'
            ? 'Project retirement corpus using expected return and annual timeline.'
            : 'Calculate net worth by subtracting liabilities from assets.';

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {type === 'networth' ? (
            <>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Assets ({currencySymbol})
                <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={assets} onChange={(event) => setAssets(Number(event.target.value))} />
              </label>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Liabilities ({currencySymbol})
                <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={liabilities} onChange={(event) => setLiabilities(Number(event.target.value))} />
              </label>
            </>
          ) : (
            <>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Principal ({currencySymbol})
                <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={principal} onChange={(event) => setPrincipal(Number(event.target.value))} />
              </label>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Annual Rate (%)
                <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
              </label>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Years
                <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={years} onChange={(event) => setYears(Math.max(1, Number(event.target.value)))} />
              </label>
              {(type === 'compound' || type === 'retirement') && (
                <label className="text-sm text-slate-700 dark:text-slate-300">
                  Monthly Contribution ({currencySymbol})
                  <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={contribution} onChange={(event) => setContribution(Number(event.target.value))} />
                </label>
              )}
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Result</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(result.value)}</p>
        <div className="mt-4">
          <FinanceLineChart data={result.points} dataKey="value" />
        </div>
      </div>
    </section>
  );
}

export default EmiCalculator;
