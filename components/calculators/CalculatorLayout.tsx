'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LazyVisible } from '@/components/common/LazyVisible';
import { CalculatorHeader } from '@/components/calculators/CalculatorHeader';
import { InputSlider } from '@/components/calculators/InputSlider';
import { ResultCard } from '@/components/calculators/ResultCard';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { DownloadPdfButton } from '@/components/pdf/DownloadPdfButton';
import { ExportCsvButton } from '@/components/calculators/ExportCsvButton';
import { calculatorDefinitions, calculatorMap } from '@/lib/calculators/registry';
import { SocialShareButtons } from '@/components/ui/SocialShareButtons';
import { BaseCalculatorInputs } from '@/lib/calculators/types';
import { getCurrencySymbol, getLocaleForCurrency, resolveCurrencyPrefix } from '@/lib/utils';
import { absoluteUrl } from '@/lib/seo';
import { DecisionSupportPanel } from '@/components/common/DecisionSupportPanel';
import { getCalculatorInsight } from '@/lib/calculators/insights';
import { AdUnit } from '@/components/ui/AdUnit';
import { AD_SLOTS } from '@/lib/adSlots';
import { AskAIButton } from '@/components/money-copilot/AskAIButton';
import { useSyncAiPageContext } from '@/components/money-copilot/useAiPageContext';
import type { AiPageContext } from '@/lib/money-copilot/types';

const ProjectionChart = dynamic(() => import('@/components/calculators/ProjectionChart').then((module) => module.ProjectionChart), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
});


const guideMessageBySlug: Record<string, { title: string; body: string }> = {
  'mortgage-calculator': {
    title: 'Mortgage planning walkthrough',
    body: 'Set loan amount, APR, and term, then compare monthly payment and total interest. Also run the scenario at +0.75% — a payment that looks fine today can tighten quickly when a rate reset and a school fee increase arrive in the same year.'
  },
  'loan-calculator': {
    title: 'Loan monthly payment walkthrough',
    body: 'Enter borrowing details and compare monthly payment amounts across terms so you can pick a repayment plan you can sustain.'
  },
  'compound-interest-calculator': {
    title: 'Compounding walkthrough',
    body: 'Start with your current balance, add monthly contributions, and test different return assumptions to map long-term growth.'
  },
  'retirement-calculator': {
    title: 'Retirement readiness walkthrough',
    body: 'Model contributions, expected return, and timeline to estimate whether your current savings pace supports retirement goals.'
  },
  'fire-calculator': {
    title: 'FIRE planning walkthrough',
    body: 'Adjust savings rate and investment return assumptions to estimate your financial independence target and timeline.'
  },
  'net-worth-calculator': {
    title: 'Net worth tracking walkthrough',
    body: 'Use assets, liabilities, and contribution assumptions to monitor overall financial health and direction over time.'
  },
  'investment-growth-calculator': {
    title: 'Investment growth walkthrough',
    body: 'Compare contribution levels and return assumptions to see how portfolio value may grow across long horizons.'
  },
  'savings-goal-calculator': {
    title: 'Savings goal walkthrough',
    body: 'Set your target timeline and monthly amount to check whether your plan can fund major goals on schedule.'
  },
  'debt-payoff-calculator': {
    title: 'Debt payoff walkthrough',
    body: 'Increase extra monthly payments to compare payoff speed and interest reduction before choosing a debt strategy.'
  }
};

type FieldMeta = {
  key: keyof BaseCalculatorInputs;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
};

const CALCULATOR_SCHEMAS: Record<string, FieldMeta[]> = {
  'mortgage-calculator': [
    { key: 'homePrice', label: 'Home Price', tooltip: 'Purchase price of the home you are evaluating.', min: 50000, max: 4000000, step: 1000, prefix: '$' },
    { key: 'downPayment', label: 'Down Payment', tooltip: 'Cash paid upfront to reduce the mortgage principal.', min: 0, max: 1000000, step: 1000, prefix: '$' },
    { key: 'loanAmount', label: 'Mortgage Principal', tooltip: 'Amount financed after down payment and closing-credit adjustments.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Mortgage APR', tooltip: 'Annual mortgage interest rate used to calculate principal-and-interest payments.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Loan Term', tooltip: 'Length of the mortgage repayment period in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'propertyTax', label: 'Property Tax (Annual)', tooltip: 'Estimated annual property taxes for this home.', min: 0, max: 30000, step: 50, prefix: '$' },
    { key: 'insurance', label: 'Home Insurance (Annual)', tooltip: 'Estimated annual homeowners-insurance premium.', min: 0, max: 20000, step: 50, prefix: '$' },
    { key: 'pmi', label: 'PMI (Monthly)', tooltip: 'Private mortgage insurance paid monthly until equity requirements are met.', min: 0, max: 2000, step: 10, prefix: '$' },
    { key: 'monthlyContribution', label: 'Extra Monthly Principal', tooltip: 'Additional principal paid each month to reduce payoff time and interest.', min: 0, max: 25000, step: 25, prefix: '$' }
  ],
  'loan-calculator': [
    { key: 'loanAmount', label: 'Loan Principal', tooltip: 'Amount borrowed before any payments are made.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Loan APR', tooltip: 'Annual percentage rate used to calculate your payment schedule.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Loan Term', tooltip: 'Length of time to repay the loan.', min: 1, max: 50, step: 1, suffix: 'y' }
  ],
  'auto-loan-calculator': [
    { key: 'loanAmount', label: 'Auto Loan Principal', tooltip: 'Amount financed for the vehicle after down payment and trade-in credits.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Auto Loan APR', tooltip: 'Annual percentage rate offered for your car loan.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Loan Term', tooltip: 'Length of the auto-loan repayment period in years.', min: 1, max: 50, step: 1, suffix: 'y' }
  ],
  'student-loan-calculator': [
    { key: 'loanAmount', label: 'Student Loan Balance', tooltip: 'Current student-loan principal to be repaid.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Loan APR', tooltip: 'Average annual percentage rate across your student loans.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Repayment Term', tooltip: 'Planned repayment period in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Additional amount paid each month above the required student-loan payment.', min: 0, max: 25000, step: 25, prefix: '$' }
  ],
  'debt-payoff-calculator': [
    { key: 'loanAmount', label: 'Current Debt Balance', tooltip: 'Outstanding debt principal you want to repay.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Interest Rate', tooltip: 'APR for loans or liabilities.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'minimumPayment', label: 'Minimum Payment', tooltip: 'Required minimum monthly payment before extra payoff amount.', min: 0, max: 20000, step: 25, prefix: '$' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Additional amount paid each month above your minimum payment.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Payoff Target', tooltip: 'Optional target timeline to compare your current payment strategy.', min: 1, max: 50, step: 1, suffix: 'y' }
  ],
  'debt-snowball-calculator': [
    { key: 'loanAmount', label: 'Combined Debt Balances', tooltip: 'Total outstanding balance across debts included in your snowball plan.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Average APR', tooltip: 'Weighted average APR across debts while you target the smallest balance first.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'minimumPayment', label: 'Combined Minimum Payment', tooltip: 'Total minimum payment due each month across all included debts.', min: 0, max: 20000, step: 25, prefix: '$' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Additional payment rolled into the next debt after each balance is cleared.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Payoff Target', tooltip: 'Optional payoff horizon to test whether your payment pace is realistic.', min: 1, max: 50, step: 1, suffix: 'y' }
  ],
  'debt-avalanche-calculator': [
    { key: 'loanAmount', label: 'Total Debt Balance', tooltip: 'Combined remaining balance across all debts in your payoff plan.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Blended APR', tooltip: 'Average APR across debts while prioritizing highest-rate balances first.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Payoff Target', tooltip: 'Optional payoff horizon to test whether your current strategy is on track.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Extra payment amount focused on your highest-rate debt each month.', min: 0, max: 25000, step: 25, prefix: '$' }
  ],
  'credit-card-payoff-calculator': [
    { key: 'loanAmount', label: 'Current Card Balance', tooltip: 'Total revolving credit-card debt included in this payoff plan.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Card APR', tooltip: 'Average annual percentage rate applied to your card balances.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'years', label: 'Payoff Target', tooltip: 'Optional timeline for comparing monthly payment scenarios.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'monthlyContribution', label: 'Extra Monthly Payment', tooltip: 'Additional amount paid each month above your card minimum payment.', min: 0, max: 25000, step: 25, prefix: '$' }
  ],
  'salary-after-tax-calculator': [
    { key: 'loanAmount', label: 'Gross Annual Salary', tooltip: 'Your yearly income before taxes and payroll deductions.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'interestRate', label: 'Effective Tax Rate', tooltip: 'Estimated blended tax rate used to calculate annual and monthly take-home pay.', min: 0, max: 35, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Assumption', tooltip: 'Expected inflation used to estimate the purchasing power of take-home income.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'compound-interest-calculator': [
    { key: 'loanAmount', label: 'Starting Balance', tooltip: 'Amount already invested before new monthly contributions.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount you plan to invest every month.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Estimated annual return used for long-term projection.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation used to estimate real purchasing power.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'investment-growth-calculator': [
    { key: 'loanAmount', label: 'Starting Balance', tooltip: 'Amount already invested before monthly additions.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount added to your portfolio each month.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'retirement-calculator': [
    { key: 'loanAmount', label: 'Current Savings', tooltip: 'Current value of retirement accounts and long-term investment balances.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount you plan to add each month until retirement.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years to Retirement', tooltip: 'Years remaining until your planned retirement date.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'fire-calculator': [
    { key: 'loanAmount', label: 'Current Savings', tooltip: 'Current investable assets available for your FIRE plan.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount you plan to add each month until FI.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years to FI Target', tooltip: 'Years you plan to continue saving before financial independence.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'savings-goal-calculator': [
    { key: 'loanAmount', label: 'Current Savings', tooltip: 'Money already saved toward your target goal.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Amount you plan to add each month toward your target.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'net-worth-calculator': [
    { key: 'loanAmount', label: 'Current Net Worth', tooltip: 'Net assets minus liabilities right now.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Improvement', tooltip: 'Expected net monthly contribution to net worth.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual growth of assets.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ],
  'budget-planner': [
    { key: 'loanAmount', label: 'Starting Cash Buffer', tooltip: 'Current cash or reserve available.', min: 1000, max: 2000000, step: 500, prefix: '$' },
    { key: 'monthlyContribution', label: 'Monthly Savings Capacity', tooltip: 'Amount available each month after core spending.', min: 0, max: 25000, step: 25, prefix: '$' },
    { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
    { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual growth on saved funds.', min: 0, max: 20, step: 0.1, suffix: '%' },
    { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' }
  ]
};

export function CalculatorLayout({ slug }: { slug: string }) {
  const definition = calculatorMap[slug];
  const [inputs, setInputs] = useState(definition.defaultInputs);
  const { currency, formatCurrency } = usePreferences();

  const [showGuide, setShowGuide] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const exportRef = useRef<HTMLElement>(null);
  const currencyLocale = getLocaleForCurrency(currency);
  const currencySymbol = getCurrencySymbol(currency, currencyLocale);

  useEffect(() => {
    setInputs(definition.defaultInputs);
  }, [definition]);

  const result = useMemo(() => definition.compute(inputs), [definition, inputs]);
  const relatedCalculators = calculatorDefinitions.filter((item) => item.slug !== slug).slice(0, 3);
  const guideMessage = guideMessageBySlug[slug] ?? {
    title: 'First-time walkthrough',
    body: 'Adjust sliders on the left, review summary cards, and then save or export your result below.'
  };
  const fieldMeta = useMemo(() => CALCULATOR_SCHEMAS[slug] ?? [], [slug]);

  useEffect(() => {
    const hasSeenGuide = window.localStorage.getItem(`calculator-guide-${slug}`);
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, [slug]);

  const dismissGuide = () => {
    window.localStorage.setItem(`calculator-guide-${slug}`, 'true');
    setShowGuide(false);
  };

  const handleSaveResult = () => {
    const storageKey = `calculator-result-${slug}`;
    const payload = {
      savedAt: new Date().toISOString(),
      summary: result.summary,
      breakdown: result.breakdown
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setSavedMessage('Results saved to this browser.');
    window.setTimeout(() => setSavedMessage(''), 2500);
  };

  const csvRows = result.summary.map((item) => ({
    label: item.label,
    value: item.currency ? formatCurrency(item.value) : `${item.value.toFixed(2)}${item.suffix ?? ''}`
  }));
  const calculatorPathways: Record<string, { guide: { href: string; label: string }; compare: { href: string; label: string }; mistakes: string[] }> = {
    'mortgage-calculator': {
      guide: { href: '/blog/mortgage-preapproval-checklist-underwriting', label: 'Read the lender-readiness checklist' },
      compare: { href: '/compare/mortgage-rate-comparison', label: 'Compare mortgage offers' },
      mistakes: ['Forgetting taxes/insurance when checking affordability.', 'Choosing the lowest payment without reviewing total interest cost.', 'Skipping a bad-month affordability stress test.']
    },
    'debt-payoff-calculator': {
      guide: { href: '/blog/debt-to-income-ratio-90-day-plan', label: 'Use the debt reduction playbook' },
      compare: { href: '/best-credit-cards-2026', label: 'Compare balance-transfer-friendly cards' },
      mistakes: ['Setting an extra payment amount you cannot sustain.', 'Comparing offers only by monthly payment.', 'Ignoring origination and transfer fees.']
    },
    'investment-growth-calculator': {
      guide: { href: '/blog/beginner-investing-roadmap-year-one-milestones', label: 'Follow the beginner investing roadmap' },
      compare: { href: '/best-investment-apps', label: 'Compare investment apps' },
      mistakes: ['Using one return assumption only.', 'Skipping inflation-aware scenario checks.', 'Overestimating contribution consistency.']
    },
    'salary-after-tax-calculator': {
      guide: { href: '/blog/2026-federal-tax-brackets-marginal-rate-decisions', label: 'Review current tax bracket strategy' },
      compare: { href: '/best-savings-accounts-usa', label: 'Compare high-yield savings options' },
      mistakes: ['Assuming this replaces tax filing advice.', 'Forgetting payroll deductions beyond taxes.', 'Ignoring location-specific withholding differences.']
    }
  };
  const pathway = calculatorPathways[slug] ?? {
    guide: { href: definition.blogLinks[0]?.href ?? '/blog', label: 'Read the matching guide' },
    compare: { href: '/comparison', label: 'Compare options by fee and fit' },
    mistakes: ['Using unrealistic input assumptions.', 'Relying on one scenario only.', 'Skipping eligibility and product-term checks.']
  };
  const primaryMetric = result.summary[0];
  const baselineValue = primaryMetric?.value ?? 0;

  const formattedBreakdown = result.breakdown.map((row) => {
    if (!row.currency || typeof row.amount !== 'number') return row;
    return { ...row, value: formatCurrency(row.amount) };
  });

  // Per-calculator specific insight layer
  const insight = getCalculatorInsight(slug, inputs as BaseCalculatorInputs, primaryMetric?.label ?? 'result');
  const aiContext = {
    pageType: 'calculator',
    region: currency === 'INR' ? 'IN' : 'US',
    currency: currency === 'INR' ? 'INR' : 'USD',
    intent: 'calculator-result-explainer',
    groundingMessage: 'I’m using the live values already visible on this page, including calculator inputs and outputs.',
    calculatorState: {
      slug,
      inputs,
      outputs: {
        summary: result.summary,
        breakdown: formattedBreakdown,
        projection: result.projection
      }
    },
    structuredValues: {
      pageType: 'calculator',
      calculatorTitle: definition.title,
      headlineMetric: primaryMetric?.label ?? 'headline figure',
      headlineValue: primaryMetric?.currency ? formatCurrency(baselineValue) : `${baselineValue.toFixed(2)}${primaryMetric?.suffix ?? ''}`,
      breakdown: formattedBreakdown,
    },
    suggestedPrompts: [
      'Explain this result',
      'Stress-test this scenario',
      'Show safer target values',
    ],
  } satisfies Partial<AiPageContext>;

  useSyncAiPageContext(aiContext);

  return (
    <section className="space-y-8 pb-16" ref={exportRef}>
      <CalculatorHeader title={definition.title} description={definition.description} />
      <div className="sticky top-16 z-20 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-100">
        You quantify every financial decision here. Current headline impact: {primaryMetric?.currency ? formatCurrency(baselineValue) : `${baselineValue.toFixed(2)}${primaryMetric?.suffix ?? ''}`}.
      </div>
      {/* Sharing: encourage backlinks and distribution for calculator/tool pages. */}
      <SocialShareButtons title={definition.title} url={absoluteUrl(`/calculators/${slug}`)} />

      {showGuide && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100" role="status">
          <p className="font-semibold">{guideMessage.title}</p>
          <p>{guideMessage.body}</p>
          <button type="button" onClick={dismissGuide} className="mt-2 rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Calculator Directory</h2>
          <div className="grid gap-1 text-sm">
            {calculatorDefinitions.map((item) => (
              <Link key={item.slug} href={`/calculators/${item.slug}`} className={`rounded-lg px-2 py-1 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 ${item.slug === slug ? 'bg-slate-100 font-semibold text-brand dark:bg-slate-800 dark:text-blue-300' : ''}`}>
                {item.title}
              </Link>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-4 rounded-3xl bg-slate-950 p-4 sm:p-6">
              {fieldMeta.map((field) => (
                <InputSlider key={field.key} label={field.label} tooltip={field.tooltip} value={inputs[field.key] ?? 0} min={field.min} max={field.max} step={field.step} prefix={resolveCurrencyPrefix(field.prefix, currencySymbol)} suffix={field.suffix} locale={currencyLocale} onChange={(value) => setInputs((prev) => ({ ...prev, [field.key]: value }))} />
              ))}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.summary.map((item) => (
                  <ResultCard key={item.label} label={item.label} helpText={item.helpText} value={item.currency ? formatCurrency(item.value) : `${item.value.toFixed(2)}${item.suffix ?? ''}`} />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveResult}
                  className="btn-primary text-sm"
                  aria-label="Save calculator result"
                >
                  Save Result
                </button>
                <DownloadPdfButton targetRef={exportRef} calculatorTitle={definition.title} />
                <ExportCsvButton rows={csvRows} calculatorTitle={definition.title} />
                <AskAIButton
                  label="Ask AI about this result"
                  prefillQuestion={`Help me understand my ${definition.title} result: ${primaryMetric?.label ?? 'headline figure'} is ${primaryMetric?.currency ? formatCurrency(baselineValue) : `${baselineValue.toFixed(2)}${primaryMetric?.suffix ?? ''}`}`}
                  aiContext={aiContext}
                  variant="secondary"
                />
                {savedMessage && <p className="text-xs text-emerald-700 dark:text-emerald-300" role="status">{savedMessage}</p>}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {result.chartKinds.map((chartKind, index) => (
                  <LazyVisible key={`${chartKind}-${index}`}>
                    <ProjectionChart chartKind={chartKind} projection={result.projection} />
                  </LazyVisible>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Breakdown Table</h2>
            <table className="w-full text-sm">
              <tbody>
                {formattedBreakdown.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-2 font-medium text-slate-700 dark:text-slate-200">{row.label}</td>
                    <td className="py-2 text-right text-slate-900 dark:text-white">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Per-calculator specific insight layer */}
          <section className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-500/40 dark:bg-blue-950/30">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">What this result means</h2>
            <p className="text-sm leading-6 text-blue-900 dark:text-blue-200">{insight.whatItMeans}</p>
          </section>

          <section className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-500/40 dark:bg-indigo-950/30">
            <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Real-world impact</h2>
            <ul className="space-y-2 text-sm text-indigo-900 dark:text-indigo-200">
              {insight.realWorldImpact.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-indigo-500">▸</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
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
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Learn More</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {definition.blogLinks.map((link) => (
              <li key={link.href}>
                <Link className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200" href={link.href}>{link.title}</Link>
              </li>
            ))}
            <li>
              {/* Internal linking: guide users from calculator results to comparison intent pages. */}
              <Link className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200" href="/comparison">Compare financial products</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Recommendations panel */}
      <DecisionSupportPanel
        title="Recommendations based on your result"
        tone="emerald"
        intro="Apply these guidelines to the specific numbers above before taking action."
        checklist={insight.recommendations}
        links={[
          { href: pathway.guide.href, label: pathway.guide.label },
          { href: pathway.compare.href, label: pathway.compare.label }
        ]}
      />

      {/* Risks and common mistakes */}
      <DecisionSupportPanel
        title="Risks and common mistakes"
        tone="amber"
        intro="These are the most frequent errors for this type of calculation. Review each before acting on your result."
        checklist={insight.topRisks}
        links={[
          { href: '/editorial-policy', label: 'How FinanceSphere evaluates options' },
          { href: '/financial-disclaimer', label: 'Educational-use disclaimer' },
          { href: '/how-we-make-money', label: 'Affiliate transparency' }
        ]}
      />

      {/* Next steps */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Next steps</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Take these actions now while the numbers are in front of you.</p>
        <ol className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {insight.nextSteps.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white dark:bg-blue-500">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href={pathway.guide.href} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-semibold text-slate-900 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            {pathway.guide.label}
          </Link>
          <Link href={pathway.compare.href} className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-semibold text-slate-900 hover:border-blue-300 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            {pathway.compare.label}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/50">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How we calculate</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Outputs are generated from your slider inputs using transparent formulas in our calculator engine. Results are educational estimates and should be validated with provider terms before taking action.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Related calculators</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {relatedCalculators.map((item) => (
            <li key={item.slug}>
              <Link className="text-indigo-600 hover:text-indigo-800" href={`/calculators/${item.slug}`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdUnit slot={AD_SLOTS.CALCULATOR} format="auto" className="my-2" />

    </section>
  );
}
