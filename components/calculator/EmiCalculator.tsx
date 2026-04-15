'use client';

import { useMemo, useState } from 'react';
import { FinanceLineChart } from '@/components/charts/FinanceLineChart';
import { AskAIButton } from '@/components/money-copilot/AskAIButton';
import { useSyncAiPageContext } from '@/components/money-copilot/useAiPageContext';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import type { AiPageContext } from '@/lib/money-copilot/types';
import { getCurrencySymbol, getLocaleForCurrency } from '@/lib/utils';

type CalculatorType = 'loan' | 'mortgage' | 'compound' | 'retirement' | 'networth';
type DecisionRegion = 'IN' | 'US';

type GrowthPoint = {
  year: number;
  value: number;
};

function toSafeNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

const scenarioLabels = {
  mortgage: [
    { label: 'Conservative', principal: 3500000, rate: 8.2, years: 20 },
    { label: 'Balanced', principal: 5000000, rate: 8.75, years: 25 },
    { label: 'Stretch', principal: 7000000, rate: 9.25, years: 30 }
  ],
  loan: [
    { label: 'Small', principal: 300000, rate: 10.5, years: 3 },
    { label: 'Medium', principal: 700000, rate: 11.5, years: 5 },
    { label: 'Large', principal: 1200000, rate: 13.5, years: 7 }
  ],
  compound: [
    { label: 'Starter SIP', principal: 100000, contribution: 5000, rate: 11, years: 10 },
    { label: 'Growth SIP', principal: 200000, contribution: 15000, rate: 12, years: 15 },
    { label: 'Aggressive', principal: 500000, contribution: 25000, rate: 13, years: 20 }
  ]
} as const;

const CALCULATOR_PAGE_TYPE: Record<CalculatorType, AiPageContext['pageType']> = {
  mortgage: 'home-affordability',
  loan: 'calculator',
  compound: 'sip-calculator',
  retirement: 'calculator',
  networth: 'calculator'
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
  const safeNumber = (value: number, fallback = 0) => (Number.isFinite(value) ? value : fallback);
  const { currency, formatCurrency } = usePreferences();
  const isIndiaCurrency = currency === 'INR';
  const currencySymbol = getCurrencySymbol(currency, getLocaleForCurrency(currency));
  const decisionRegion: DecisionRegion = isIndiaCurrency ? 'IN' : 'US';

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
    const safePrincipal = Math.max(0, toSafeNumber(principal, 0));
    const safeRate = Math.max(0, toSafeNumber(rate, 0));
    const safeYears = Math.max(1, toSafeNumber(years, 1));
    const safeContribution = Math.max(0, toSafeNumber(contribution, 0));
    const safeAssets = Math.max(0, toSafeNumber(assets, 0));
    const safeLiabilities = Math.max(0, toSafeNumber(liabilities, 0));

    if (type === 'networth') {
      const value = safeNumber(assets) - safeNumber(liabilities);
      return {
        value,
        totalPaid: 0,
        totalInterest: 0,
        totalInvested: 0,
        points: [
          { name: 'Assets', value: safeAssets },
          { name: 'Liabilities', value: safeLiabilities },
          { name: 'Net Worth', value }
        ]
      };
    }

    const safePrincipal = Math.max(0, safeNumber(principal));
    const safeRate = Math.max(0, safeNumber(rate));
    const safeYears = Math.max(1, safeNumber(years, 1));
    const safeContribution = Math.max(0, safeNumber(contribution));
    const months = Math.max(1, safeYears * 12);
    const monthlyRate = safeRate / 12 / 100;

    if (type === 'loan' || type === 'mortgage') {
      const emi =
        monthlyRate === 0
          ? safePrincipal / months
          : (safePrincipal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);

      return {
        value: emi,
        totalPaid: emi * months,
        totalInterest: Math.max(0, emi * months - safePrincipal),
        totalInvested: safePrincipal,
        points: buildLoanProjection(safePrincipal, emi, safeRate, safeYears).map((point) => ({
          name: `Year ${point.year}`,
          value: point.value
        }))
      };
    }

    const points: Array<{ name: string; value: number }> = [];
    let futureValue = safePrincipal;

    for (let y = 1; y <= safeYears; y++) {
      futureValue = futureValue * (1 + safeRate / 100) + safeContribution * 12;
      points.push({ name: `Year ${y}`, value: Number(futureValue.toFixed(0)) });
    }

    return {
      value: points.at(-1)?.value ?? 0,
      totalPaid: 0,
      totalInterest: 0,
      totalInvested: safePrincipal + safeContribution * months,
      points
    };
  }, [assets, contribution, liabilities, principal, rate, type, years]);

  const title =
    type === 'mortgage'
      ? (isIndiaCurrency ? 'Home Loan EMI Calculator (India)' : 'Home Loan Calculator')
      : type === 'loan'
        ? (isIndiaCurrency ? 'Loan EMI Calculator (India)' : 'Loan Calculator')
        : type === 'compound'
          ? (isIndiaCurrency ? 'SIP Calculator (India)' : 'Compound Interest Calculator')
          : type === 'retirement'
            ? 'Retirement Calculator'
            : 'Net Worth Calculator';

  const description =
    type === 'mortgage'
      ? (isIndiaCurrency
        ? 'Estimate your monthly EMI based on loan amount, interest rate, and tenure.'
        : 'Estimate your monthly payment based on loan amount, interest rate, and term.')
      : type === 'loan'
        ? (isIndiaCurrency
          ? 'Calculate your monthly EMI with principal, rate, and tenure inputs.'
          : 'Calculate your monthly payment with principal, rate, and term inputs.')
        : type === 'compound'
          ? (isIndiaCurrency
            ? 'Forecast SIP growth with monthly ₹ contributions and return assumptions.'
            : 'Forecast investment growth with compounding and monthly contributions.')
          : type === 'retirement'
            ? 'Project retirement corpus using expected return and annual timeline.'
            : 'Calculate net worth by subtracting liabilities from assets.';

  const isLoanType = type === 'loan' || type === 'mortgage';
  const isCompoundType = type === 'compound' || type === 'retirement';
  const principalLabel =
    type === 'mortgage'
      ? `Loan Principal (${currencySymbol})`
      : type === 'loan'
        ? `Current Balance (${currencySymbol})`
        : `Starting Balance (${currencySymbol})`;
  const rateLabel = type === 'compound' || type === 'retirement' ? 'Expected Return (%)' : 'APR (%)';
  const contributionLabel = type === 'retirement' ? `Monthly Retirement Contribution (${currencySymbol})` : `Monthly Contribution (${currencySymbol})`;

  const applyScenario = (label: string) => {
    if (type === 'mortgage' || type === 'loan') {
      const selected = scenarioLabels[type].find((scenario) => scenario.label === label);
      if (!selected) return;
      setPrincipal(selected.principal);
      setRate(selected.rate);
      setYears(selected.years);
      return;
    }

    if (type === 'compound') {
      const selected = scenarioLabels.compound.find((scenario) => scenario.label === label);
      if (!selected) return;
      setPrincipal(selected.principal);
      setContribution(selected.contribution);
      setRate(selected.rate);
      setYears(selected.years);
    }
  };

  const resetDefaults = () => {
    setPrincipal(
      type === 'mortgage'
        ? (isIndiaCurrency ? 5000000 : 350000)
        : type === 'loan'
          ? (isIndiaCurrency ? 500000 : 10000)
          : 10000
    );
    setRate(type === 'mortgage' ? (isIndiaCurrency ? 8 : 6.8) : 10);
    setYears(type === 'mortgage' ? (isIndiaCurrency ? 20 : 30) : 5);
    setContribution(type === 'retirement' ? 800 : 500);
    setAssets(100000);
    setLiabilities(25000);
  };

  const aiContext = {
    pageType: CALCULATOR_PAGE_TYPE[type],
    region: decisionRegion,
    currency: isIndiaCurrency ? 'INR' : 'USD',
    intent:
      type === 'mortgage'
        ? 'home-affordability-decision'
        : type === 'compound'
          ? 'compounding-result-explainer'
          : 'calculator-result-explainer',
    groundingMessage: `I’m using your current ${title.toLowerCase()} inputs and outputs from this page.`,
    calculatorState: {
      calculatorType: type,
      inputs: {
        ...(type === 'networth'
          ? {
              assets,
              liabilities
            }
          : {
              principal,
              rate,
              years,
              ...(isCompoundType ? { contribution } : {})
            }),
      },
      outputs: {
        headlineValue: result.value,
        totalPaid: result.totalPaid,
        totalInterest: result.totalInterest,
        totalInvested: result.totalInvested,
        estimatedGains: result.value - result.totalInvested,
      },
    },
    structuredValues: {
      pageRegion: decisionRegion,
      pageCurrency: isIndiaCurrency ? 'INR' : 'USD',
      calculatorTitle: title,
      calculatorDescription: description,
      currentResultLabel: isLoanType ? 'Monthly payment / EMI' : isCompoundType ? 'Projected corpus' : 'Net worth',
      currentResultValue: formatCurrency(result.value),
    },
    suggestedPrompts:
      type === 'mortgage'
        ? [
            'Ask AI about this result (use my numbers)',
            'What changes if interest rate increases by 1%?',
            'How much should I reduce principal for a safer payment?',
          ]
        : type === 'compound'
          ? [
              'Explain this result (use my numbers)',
              `What if I increase monthly contribution by ${currencySymbol}${isIndiaCurrency ? '2,000' : '100'}?`,
              'Stress-test this scenario',
            ]
          : [
              'Explain this result using my current numbers',
              'Stress-test this scenario using my current numbers',
              'What is a safer target value for this plan?',
            ],
  } satisfies Partial<AiPageContext>;

  useSyncAiPageContext(aiContext);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
          </div>
          <button type="button" onClick={resetDefaults} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
            Reset inputs
          </button>
        </div>

        {(type === 'mortgage' || type === 'loan' || type === 'compound') && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Quick scenarios</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {scenarioLabels[type].map((scenario) => (
                <button
                  key={scenario.label}
                  type="button"
                  onClick={() => applyScenario(scenario.label)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
                >
                  {scenario.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
              <label className="text-sm text-slate-700 dark:text-slate-300 sm:col-span-2">
                {principalLabel}
                <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={principal} onChange={(event) => setPrincipal(Number(event.target.value))} />
                <input className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600" type="range" min={0} max={isIndiaCurrency ? 20000000 : 1000000} step={isIndiaCurrency ? 50000 : 1000} value={principal} onChange={(event) => setPrincipal(Number(event.target.value))} />
              </label>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                {rateLabel}
                <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
                <input className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600" type="range" min={0} max={20} step={0.05} value={rate} onChange={(event) => setRate(Number(event.target.value))} />
              </label>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                Years
                <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={years} onChange={(event) => setYears(Math.max(1, Number(event.target.value)))} />
                <input className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600" type="range" min={1} max={35} step={1} value={years} onChange={(event) => setYears(Math.max(1, Number(event.target.value)))} />
              </label>
              {(type === 'compound' || type === 'retirement') && (
                <label className="text-sm text-slate-700 dark:text-slate-300 sm:col-span-2">
                  {contributionLabel}
                  <input className="mt-1 w-full rounded-lg border px-3 py-2" type="number" value={contribution} onChange={(event) => setContribution(Number(event.target.value))} />
                  <input className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600" type="range" min={0} max={isIndiaCurrency ? 300000 : 10000} step={isIndiaCurrency ? 500 : 50} value={contribution} onChange={(event) => setContribution(Number(event.target.value))} />
                </label>
              )}
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Result</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(toSafeNumber(result.value, 0))}</p>
        {isLoanType && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="text-slate-500 dark:text-slate-400">Total payable</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(toSafeNumber(result.totalPaid, 0))}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="text-slate-500 dark:text-slate-400">Interest cost</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(toSafeNumber(result.totalInterest, 0))}</p>
            </div>
          </div>
        )}
        {isCompoundType && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="text-slate-500 dark:text-slate-400">Total invested</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(toSafeNumber(result.totalInvested, 0))}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="text-slate-500 dark:text-slate-400">Estimated gains</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(toSafeNumber(result.value - result.totalInvested, 0))}</p>
            </div>
          </div>
        )}
        <div className="mt-4">
          <FinanceLineChart data={result.points} dataKey="value" />
        </div>
        <div className="mt-4">
          <AskAIButton
            label="Ask AI about this result (use my numbers)"
            prefillQuestion={`Explain my current ${title} result using the values on this page.`}
            aiContext={aiContext}
            variant="secondary"
          />
        </div>
        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-500/40 dark:bg-blue-950/30 dark:text-blue-100">
          {isLoanType
            ? 'Assumption: monthly payment reflects principal and interest only; taxes, insurance, and fees are separate unless explicitly modeled.'
            : isCompoundType
              ? 'Assumption: projection uses a constant annual return and monthly contribution; real-world returns will vary.'
              : 'Assumption: net worth equals assets minus liabilities using your current values.'}
        </div>
      </div>
    </section>
  );
}

export default EmiCalculator;
