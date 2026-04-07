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

const defaultFieldMeta: Array<{ key: keyof BaseCalculatorInputs; label: string; tooltip: string; min: number; max: number; step?: number; prefix?: string; suffix?: string }> = [
  { key: 'loanAmount', label: 'Loan Amount / Starting Balance', tooltip: 'Starting principal, debt, or investment amount.', min: 1000, max: 2000000, step: 500, prefix: '$' },
  { key: 'interestRate', label: 'Interest Rate', tooltip: 'APR for loans or liabilities.', min: 0, max: 35, step: 0.1, suffix: '%' },
  { key: 'monthlyContribution', label: 'Monthly Contribution', tooltip: 'Extra monthly payment or investment contribution.', min: 0, max: 25000, step: 25, prefix: '$' },
  { key: 'years', label: 'Years', tooltip: 'Projection horizon in years.', min: 1, max: 50, step: 1, suffix: 'y' },
  { key: 'inflationRate', label: 'Inflation Rate', tooltip: 'Expected annual inflation for purchasing power adjustment.', min: 0, max: 10, step: 0.1, suffix: '%' },
  { key: 'expectedReturn', label: 'Expected Return', tooltip: 'Projected annual investment return.', min: 0, max: 20, step: 0.1, suffix: '%' }
];

const fieldMetaOverridesBySlug: Record<string, Partial<Record<keyof BaseCalculatorInputs, { label: string; tooltip: string }>>> = {
  'mortgage-calculator': {
    loanAmount: { label: 'Mortgage Principal', tooltip: 'Amount financed after down payment and closing-credit adjustments.' },
    interestRate: { label: 'Mortgage APR', tooltip: 'Annual mortgage interest rate used to calculate principal-and-interest payments.' },
    monthlyContribution: { label: 'Extra Monthly Principal', tooltip: 'Additional principal paid each month to reduce payoff time and interest.' },
    years: { label: 'Loan Term', tooltip: 'Length of the mortgage repayment period in years.' }
  },
  'salary-after-tax-calculator': {
    loanAmount: { label: 'Gross Annual Salary', tooltip: 'Your yearly income before taxes and payroll deductions.' },
    interestRate: { label: 'Effective Tax Rate', tooltip: 'Estimated blended tax rate used to calculate annual and monthly take-home pay.' },
    inflationRate: { label: 'Inflation Assumption', tooltip: 'Expected inflation used to estimate the purchasing power of take-home income.' }
  },
  'debt-payoff-calculator': {
    loanAmount: { label: 'Current Debt Balance', tooltip: 'Outstanding debt principal you want to repay.' },
    monthlyContribution: { label: 'Extra Debt Payment', tooltip: 'Additional amount paid each month above minimum requirements.' }
  },
  'savings-goal-calculator': {
    loanAmount: { label: 'Current Savings', tooltip: 'Money already saved toward your target goal.' },
    monthlyContribution: { label: 'Monthly Savings', tooltip: 'Amount you plan to save each month toward your goal.' }
  }
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
  const fieldMeta = useMemo(
    () => defaultFieldMeta.map((field) => ({ ...field, ...(fieldMetaOverridesBySlug[slug]?.[field.key] ?? {}) })),
    [slug]
  );

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
  const insight = getCalculatorInsight(slug, inputs, primaryMetric?.label ?? 'result');

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
                <InputSlider key={field.key} label={field.label} tooltip={field.tooltip} value={inputs[field.key]} min={field.min} max={field.max} step={field.step} prefix={resolveCurrencyPrefix(field.prefix, currencySymbol)} suffix={field.suffix} locale={currencyLocale} onChange={(value) => setInputs((prev) => ({ ...prev, [field.key]: value }))} />
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
