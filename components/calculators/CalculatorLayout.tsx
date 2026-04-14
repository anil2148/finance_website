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
import { CALCULATOR_INPUT_SCHEMAS } from '@/lib/calculators/input-schemas';
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

const specializedCalculatorConfigs: Record<string, {
  eyebrow: string;
  introTitle: string;
  introBody: string;
  audience: string;
  decision: string;
  aiLabel: string;
  aiPrompts: string[];
  aiGroundingMessage: string;
}> = {
  'mortgage-calculator': {
    eyebrow: 'Mortgage Decision Page',
    introTitle: 'Decide a safe payment range before lender preapproval',
    introBody: 'Model principal, total monthly housing cost, and lifetime interest together so your home budget is based on cashflow durability — not just approval limits.',
    audience: 'Home buyers and refinancers comparing payment safety, not just qualification.',
    decision: 'Choose home budget, term, and rate scenario that remain manageable after taxes, insurance, and PMI.',
    aiLabel: 'Use my current mortgage numbers',
    aiPrompts: ['Explain this payment using my current numbers', 'What changes if rates increase by 1%?', 'What is a safer target monthly housing cost?'],
    aiGroundingMessage: 'I’m using your current mortgage inputs and outputs from this page.'
  },
  'debt-snowball-calculator': {
    eyebrow: 'Debt Payoff Strategy Page',
    introTitle: 'Build a snowball plan that survives real life months',
    introBody: 'Use this payoff view to set a smallest-balance-first sequence, then test whether your monthly payment level is realistic when income or expenses fluctuate.',
    audience: 'Borrowers managing multiple balances who need a consistent payoff sequence.',
    decision: 'Choose the payoff order and monthly payment level you can sustain through inconsistent months.',
    aiLabel: 'Use my debt snowball numbers',
    aiPrompts: ['Which balance should I focus on first from this result?', 'How much faster if I add $100 more each month?', 'How should I recover after one missed payment month?'],
    aiGroundingMessage: 'I’m using your current debt snowball inputs and payoff outputs from this page.'
  },
  'debt-payoff-calculator': {
    eyebrow: 'Debt Payoff Decision Page',
    introTitle: 'Choose a payoff pace you can actually sustain',
    introBody: 'Use your current balance, APR, and payment capacity to pick a plan that shortens payoff time without breaking your month-to-month cashflow.',
    audience: 'Borrowers balancing debt reduction speed with real monthly budget limits.',
    decision: 'Set a monthly payment target that reduces interest while staying durable through variable months.',
    aiLabel: 'Use my current debt payoff numbers',
    aiPrompts: ['Explain this payoff timeline using my current numbers', 'What if I add $150 extra each month?', 'How much interest can I cut without overcommitting?'],
    aiGroundingMessage: 'I’m using your current debt payoff inputs and outputs from this page.'
  }
};

const INSIGHT_BASELINE_INPUTS: BaseCalculatorInputs = {
  loanAmount: 0,
  homePrice: 0,
  downPayment: 0,
  interestRate: 0,
  minimumPayment: 0,
  monthlyContribution: 0,
  years: 0,
  propertyTax: 0,
  insurance: 0,
  pmi: 0,
  inflationRate: 0,
  expectedReturn: 0,
};

function buildStrictCalculatorInputs(defaultInputs: BaseCalculatorInputs, slug: string): BaseCalculatorInputs {
  const schema = CALCULATOR_INPUT_SCHEMAS[slug] ?? [];
  if (schema.length === 0) return defaultInputs;
  return schema.reduce((acc, field) => {
    acc[field.key] = defaultInputs[field.key] ?? 0;
    return acc;
  }, {} as BaseCalculatorInputs);
}

export function CalculatorLayout({ slug }: { slug: string }) {
  const definition = calculatorMap[slug];
  const [inputs, setInputs] = useState(() => buildStrictCalculatorInputs(definition.defaultInputs as BaseCalculatorInputs, slug));
  const { currency, formatCurrency } = usePreferences();

  const [showGuide, setShowGuide] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const exportRef = useRef<HTMLElement>(null);
  const currencyLocale = getLocaleForCurrency(currency);
  const currencySymbol = getCurrencySymbol(currency, currencyLocale);

  useEffect(() => {
    setInputs(buildStrictCalculatorInputs(definition.defaultInputs as BaseCalculatorInputs, slug));
  }, [definition, slug]);

  const result = useMemo(() => definition.compute(inputs), [definition, inputs]);
  const relatedCalculators = calculatorDefinitions.filter((item) => item.slug !== slug).slice(0, 3);
  const guideMessage = guideMessageBySlug[slug] ?? {
    title: 'First-time walkthrough',
    body: 'Adjust sliders on the left, review summary cards, and then save or export your result below.'
  };
  const fieldMeta = useMemo(() => CALCULATOR_INPUT_SCHEMAS[slug] ?? [], [slug]);
  const specializedConfig = specializedCalculatorConfigs[slug];

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
  const summaryByLabel = useMemo(
    () => new Map(result.summary.map((item) => [item.label, item])),
    [result.summary]
  );
  const isValidNumber = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value);
  const formatSummaryValue = (value: number, currencyMetric?: boolean, suffix?: string) =>
    currencyMetric ? formatCurrency(value) : `${value.toFixed(2)}${suffix ?? ''}`;

  const formattedBreakdown = result.breakdown.map((row) => {
    if (!row.currency || typeof row.amount !== 'number') return row;
    return { ...row, value: formatCurrency(row.amount) };
  });

  // Per-calculator specific insight layer
  const insightInputs = { ...INSIGHT_BASELINE_INPUTS, ...inputs } as BaseCalculatorInputs;
  const insight = getCalculatorInsight(slug, insightInputs, primaryMetric?.label ?? 'result');
  const mortgageNarrative = useMemo(() => {
    if (slug !== 'mortgage-calculator') return null;

    const summaryMetrics = {
      principalAndInterest: summaryByLabel.get('Monthly P&I Payment')?.value,
      totalMonthlyCost: summaryByLabel.get('Estimated Total Monthly Cost')?.value,
      totalInterest: summaryByLabel.get('Total Interest')?.value,
    };
    const projectionEnd = result.projection.at(-1);
    const payoffPoint = result.projection.find((point) => point.balance <= 0) ?? projectionEnd;
    const payoffYears = payoffPoint?.year ?? inputs.years;
    const mortgagePrincipal = Math.max(0, inputs.homePrice - inputs.downPayment);
    const totalPaid = mortgagePrincipal + (isValidNumber(summaryMetrics.totalInterest) ? summaryMetrics.totalInterest : 0);

    const hasValidCoreOutputs =
      isValidNumber(summaryMetrics.principalAndInterest) &&
      isValidNumber(summaryMetrics.totalMonthlyCost) &&
      isValidNumber(summaryMetrics.totalInterest) &&
      isValidNumber(payoffYears) &&
      isValidNumber(projectionEnd?.balance);

    if (!hasValidCoreOutputs || !projectionEnd) {
      return {
        isReady: false,
        whatItMeans:
          'Enter a complete mortgage scenario to unlock the interpretation. We only show narrative guidance when all required outputs are valid.',
        realWorldImpact: [
          'Summary cards and narrative will populate from one shared result model.',
          'Once inputs are valid, this section explains the same payment and interest values shown above.',
        ],
      };
    }

    const safePrincipal = mortgagePrincipal;
    const safePrincipalAndInterest = summaryMetrics.principalAndInterest as number;
    const safeTotalMonthlyCost = summaryMetrics.totalMonthlyCost as number;
    const safeTotalInterest = summaryMetrics.totalInterest as number;
    const interestShare = safePrincipal > 0 ? (safeTotalInterest / safePrincipal) * 100 : 0;
    const safeInterestShare = Number.isFinite(interestShare) ? interestShare : 0;
    const remainingBalance = Math.max(0, projectionEnd.balance);

    return {
      isReady: true,
      whatItMeans: `Your principal-and-interest payment is ${formatCurrency(safePrincipalAndInterest)}, and your estimated total monthly housing cost is ${formatCurrency(safeTotalMonthlyCost)}. This scenario pays about ${formatCurrency(safeTotalInterest)} in interest (${safeInterestShare.toFixed(1)}% of principal) over ${payoffYears.toFixed(1)} years.`,
      realWorldImpact: [
        `Mortgage principal in this scenario: ${formatCurrency(safePrincipal)}.`,
        `Total principal-and-interest paid across the modeled payoff timeline: ${formatCurrency(totalPaid)}.`,
        `Ending projected balance after the modeled term: ${formatCurrency(remainingBalance)}.`,
      ],
    };
  }, [formatCurrency, inputs.downPayment, inputs.homePrice, inputs.years, result.projection, slug, summaryByLabel]);

  const displayedInsight = mortgageNarrative
    ? {
        ...insight,
        whatItMeans: mortgageNarrative.whatItMeans,
        realWorldImpact: mortgageNarrative.realWorldImpact,
      }
    : insight;
  const aiContext = {
    pageType: 'calculator',
    pageTitle: definition.title,
    region: currency === 'INR' ? 'IN' : 'US',
    currency: currency === 'INR' ? 'INR' : 'USD',
    intent: 'calculator-result-explainer',
    groundingMessage: specializedConfig?.aiGroundingMessage ?? 'I’m using the live values already visible on this page, including calculator inputs and outputs.',
    calculatorState: {
      slug,
      inputs,
      outputs: {
        headlineMetric: primaryMetric?.label ?? 'headline figure',
        headlineValue: formatSummaryValue(baselineValue, primaryMetric?.currency, primaryMetric?.suffix),
        summary: result.summary,
        breakdown: formattedBreakdown,
        projection: result.projection
      }
    },
    structuredValues: {
      pageType: 'calculator',
      pageTitle: definition.title,
      region: currency === 'INR' ? 'IN' : 'US',
      calculatorTitle: definition.title,
      headlineMetric: primaryMetric?.label ?? 'headline figure',
      headlineValue: formatSummaryValue(baselineValue, primaryMetric?.currency, primaryMetric?.suffix),
      breakdown: formattedBreakdown,
      topInputs: fieldMeta.slice(0, 4).map((field) => ({
        label: field.label,
        value: inputs[field.key] ?? 0,
        suffix: field.suffix ?? '',
      })),
    },
    suggestedPrompts: specializedConfig?.aiPrompts ?? ['Explain this result using the values on this page', 'Stress-test this scenario with my current numbers', 'Show safer target values for this setup'],
  } satisfies Partial<AiPageContext>;

  useSyncAiPageContext(aiContext);

  return (
    <section className="space-y-8 pb-16" ref={exportRef}>
      <CalculatorHeader
        title={definition.title}
        description={definition.description}
        eyebrow={specializedConfig?.eyebrow ?? 'Finance Toolkit'}
        ctaLabel={specializedConfig ? undefined : 'Explore all calculators'}
      />
      {specializedConfig ? (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-500/40 dark:bg-blue-950/30">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">{specializedConfig.introTitle}</h2>
          <p className="mt-2 text-sm text-blue-900 dark:text-blue-200">{specializedConfig.introBody}</p>
          <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
            <p className="rounded-xl border border-blue-200 bg-white p-3 text-slate-700 dark:border-blue-500/30 dark:bg-slate-900 dark:text-slate-200"><span className="font-semibold text-slate-900 dark:text-slate-100">Who this is for:</span> {specializedConfig.audience}</p>
            <p className="rounded-xl border border-blue-200 bg-white p-3 text-slate-700 dark:border-blue-500/30 dark:bg-slate-900 dark:text-slate-200"><span className="font-semibold text-slate-900 dark:text-slate-100">Decision this page supports:</span> {specializedConfig.decision}</p>
          </div>
        </section>
      ) : null}
      {!specializedConfig ? (
        <div className="sticky top-16 z-20 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-100">
          You quantify every financial decision here. Current headline impact: {primaryMetric?.currency ? formatCurrency(baselineValue) : `${baselineValue.toFixed(2)}${primaryMetric?.suffix ?? ''}`}.
        </div>
      ) : null}
      {!specializedConfig ? (
        <SocialShareButtons title={definition.title} url={absoluteUrl(`/calculators/${slug}`)} />
      ) : null}

      {!specializedConfig && showGuide && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100" role="status">
          <p className="font-semibold">{guideMessage.title}</p>
          <p>{guideMessage.body}</p>
          <button type="button" onClick={dismissGuide} className="mt-2 rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            Dismiss
          </button>
        </div>
      )}

      <div className={`grid gap-6 ${specializedConfig ? '' : 'lg:grid-cols-[260px_1fr]'}`}>
        {!specializedConfig ? (
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
        ) : null}
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
                  <ResultCard key={item.label} label={item.label} helpText={item.helpText} value={formatSummaryValue(item.value, item.currency, item.suffix)} />
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
                  label={specializedConfig?.aiLabel ?? 'Ask AI about these numbers'}
                  prefillQuestion={`Help me understand my ${definition.title} result: ${primaryMetric?.label ?? 'headline figure'} is ${formatSummaryValue(baselineValue, primaryMetric?.currency, primaryMetric?.suffix)}`}
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
            <p className="text-sm leading-6 text-blue-900 dark:text-blue-200">{displayedInsight.whatItMeans}</p>
          </section>

          <section className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-500/40 dark:bg-indigo-950/30">
            <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Real-world impact</h2>
            <ul className="space-y-2 text-sm text-indigo-900 dark:text-indigo-200">
              {displayedInsight.realWorldImpact.map((point) => (
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
