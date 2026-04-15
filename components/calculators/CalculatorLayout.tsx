'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  firstAction?: string;
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
    firstAction: 'Enter home price and down payment first, then confirm Monthly P&I versus Estimated Total Monthly Cost before changing term or rate.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this result', 'Stress-test this scenario', 'What is a safer all-in monthly housing cost target?'],
    aiGroundingMessage: 'I’m using your current mortgage inputs and outputs from this page.'
  },
  'debt-snowball-calculator': {
    eyebrow: 'Debt Payoff Strategy Page',
    introTitle: 'Build a snowball plan that survives real life months',
    introBody: 'Use this payoff view to set a smallest-balance-first sequence, then test whether your monthly payment level is realistic when income or expenses fluctuate.',
    audience: 'Borrowers managing multiple balances who need a consistent payoff sequence.',
    decision: 'Choose the payoff order and monthly payment level you can sustain through inconsistent months.',
    firstAction: 'Set your combined minimum payment and extra monthly payment first, then check payoff time and interest impact.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this result', 'Stress-test this scenario', 'How should I recover after one missed payment month?'],
    aiGroundingMessage: 'I’m using your current debt snowball inputs and payoff outputs from this page.'
  },
  'debt-payoff-calculator': {
    eyebrow: 'Debt Payoff Decision Page',
    introTitle: 'Choose a payoff pace you can actually sustain',
    introBody: 'Use your current balance, APR, and payment capacity to pick a plan that shortens payoff time without breaking your month-to-month cashflow.',
    audience: 'Borrowers balancing debt reduction speed with real monthly budget limits.',
    decision: 'Set a monthly payment target that reduces interest while staying durable through variable months.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this payoff timeline using my current numbers', 'What if I add $150 extra each month?', 'How much interest can I cut without overcommitting?'],
    aiGroundingMessage: 'I’m using your current debt payoff inputs and outputs from this page.'
  },
  'loan-calculator': {
    eyebrow: 'Loan Decision Page',
    introTitle: 'Compare loan affordability before you sign',
    introBody: 'Model monthly payment, payoff timeline, and total interest together so your loan decision is based on full borrowing cost — not just teaser monthly payment.',
    audience: 'Borrowers comparing personal, auto, or refinancing loan offers.',
    decision: 'Choose a payment and term that stay affordable while minimizing avoidable interest.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this monthly payment using my current values', 'Show the trade-off between shorter and longer term', 'How much interest can I save with extra monthly payment?'],
    aiGroundingMessage: 'I’m using your current loan inputs and outputs from this page.'
  },
  'compound-interest-calculator': {
    eyebrow: 'Compounding Decision Page',
    introTitle: 'Turn monthly contribution choices into long-term outcomes',
    introBody: 'Use this projection to see how contribution size, return assumptions, and time horizon combine so you can pick a contribution level you can sustain.',
    audience: 'Savers and investors planning long-term wealth growth.',
    decision: 'Set a contribution and timeline target that is durable in both normal and lower-income months.',
    firstAction: 'Set your monthly contribution first, then test return and timeline assumptions one variable at a time.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this result', 'Stress-test this scenario', 'How much more if I contribute an extra amount each month?'],
    aiGroundingMessage: 'I’m using your current compounding inputs and outputs from this page.'
  },
  'retirement-calculator': {
    eyebrow: 'Retirement Decision Page',
    introTitle: 'Check if your current pace can support retirement goals',
    introBody: 'Translate contribution and return assumptions into a realistic retirement trajectory, then test whether your pace holds under conservative assumptions.',
    audience: 'Workers planning retirement readiness and contribution targets.',
    decision: 'Choose a retirement contribution pace that survives lower-return scenarios.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this retirement projection with my current values', 'What safer return assumption should I test?', 'How much should I increase contributions to improve readiness?'],
    aiGroundingMessage: 'I’m using your current retirement inputs and outputs from this page.'
  },
  'auto-loan-calculator': {
    eyebrow: 'Auto Loan Decision Page',
    introTitle: 'Set a car payment that stays safe after insurance and maintenance',
    introBody: 'Model principal, APR, and term together so your car decision is based on full financing cost, not only dealership monthly payment framing.',
    audience: 'Car buyers comparing financing terms before signing at the dealership.',
    decision: 'Pick a loan term and payment that stay manageable after total car ownership costs.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this auto-loan result with my current numbers', 'What if I shorten the term by one year?', 'How much interest do I avoid with extra monthly payment?'],
    aiGroundingMessage: 'I’m using your current auto loan inputs and outputs from this page.'
  },
  'student-loan-calculator': {
    eyebrow: 'Student Loan Decision Page',
    introTitle: 'Balance faster payoff with monthly cashflow stability',
    introBody: 'Use this to test how payment changes affect payoff speed and total interest so you can choose a plan you can maintain without relapsing into missed payments.',
    audience: 'Borrowers managing student debt while balancing rent, savings, and career transitions.',
    decision: 'Choose a repayment pace that lowers interest while remaining sustainable month to month.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this student-loan payoff result', 'How much faster if I add an extra monthly payment?', 'What is a safer payment target if income changes?'],
    aiGroundingMessage: 'I’m using your current student loan inputs and outputs from this page.'
  },
  'investment-growth-calculator': {
    eyebrow: 'Investment Growth Decision Page',
    introTitle: 'Convert contribution choices into a realistic long-term range',
    introBody: 'Model contributions, return assumptions, and horizon together so you can pick an investing pace that remains consistent during both strong and weak markets.',
    audience: 'Investors planning long-run growth with monthly contributions.',
    decision: 'Set contribution targets that remain realistic in volatile periods.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this projection with my current numbers', 'Stress-test this scenario with 2% lower returns', 'What contribution increase has the biggest impact?'],
    aiGroundingMessage: 'I’m using your current investment-growth inputs and outputs from this page.'
  },
  'savings-goal-calculator': {
    eyebrow: 'Savings Goal Decision Page',
    introTitle: 'Choose a monthly savings target you can actually sustain',
    introBody: 'Use your target amount, timeline, and expected return to confirm whether your current contribution plan reaches the goal on schedule.',
    audience: 'People planning down payments, emergency funds, or near-term milestone goals.',
    decision: 'Set a realistic monthly contribution and timeline before committing.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this savings-goal result with my current inputs', 'How much should I increase my monthly contribution?', 'What changes if I extend the timeline by one year?'],
    aiGroundingMessage: 'I’m using your current savings-goal inputs and outputs from this page.'
  },
  'credit-card-payoff-calculator': {
    eyebrow: 'Credit Card Payoff Decision Page',
    introTitle: 'Stop revolving-interest drag with a clear payoff path',
    introBody: 'Use current balance, APR, and monthly payment capacity to compare payoff speed and interest cost before choosing a card payoff plan.',
    audience: 'Cardholders trying to eliminate high-interest revolving balances.',
    decision: 'Choose a monthly payoff amount that consistently reduces principal.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this payoff result with my current numbers', 'How much interest do I save by adding $100 monthly?', 'What is the safer payoff target for bad months?'],
    aiGroundingMessage: 'I’m using your current credit-card payoff inputs and outputs from this page.'
  },
  'debt-avalanche-calculator': {
    eyebrow: 'Debt Interest-Reduction Page',
    introTitle: 'Minimize interest drag with an avalanche sequence',
    introBody: 'Use this view to focus extra payment on your highest-rate balance first, so each payment cuts future interest as quickly as possible.',
    audience: 'Borrowers prioritizing lowest total interest over quick early wins.',
    decision: 'Set an avalanche payment pace you can sustain through variable-expense months.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this avalanche result using my current numbers', 'How much interest do I save if I add $100 monthly?', 'What is a safer payment target for bad months?'],
    aiGroundingMessage: 'I’m using your current debt avalanche inputs and outputs from this page.'
  },
  'budget-planner': {
    eyebrow: 'Cashflow Decision Page',
    introTitle: 'Translate monthly cashflow into a practical plan',
    introBody: 'Model your current monthly surplus and contribution assumptions so you can choose a spending/saving split that remains realistic each month.',
    audience: 'Households trying to rebalance spending, debt, and savings without overcommitting.',
    decision: 'Choose a monthly allocation that still works in lower-income or higher-expense months.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this budget projection with my current values', 'Stress-test this budget for one bad month', 'What is a safer monthly contribution target?'],
    aiGroundingMessage: 'I’m using your current budget-planner inputs and outputs from this page.'
  },
  'salary-after-tax-calculator': {
    eyebrow: 'Take-Home Planning Page',
    introTitle: 'Convert gross salary into usable monthly cashflow',
    introBody: 'Use this estimate to understand how much annual income is available after taxes, then size savings and debt plans from realistic take-home pay.',
    audience: 'Workers comparing compensation, savings plans, or debt commitments.',
    decision: 'Set contribution and spending targets using estimated net pay, not gross income.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this take-home estimate with my current values', 'What tax-rate sensitivity should I test next?', 'How should I split this monthly take-home between goals?'],
    aiGroundingMessage: 'I’m using your current salary-after-tax inputs and outputs from this page.'
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

function buildAssumptionLabels(
  slug: string,
  inputs: BaseCalculatorInputs,
  formatCurrency: (value: number) => string
): string[] {
  const generic = [
    'Every result card, breakdown row, and narrative section on this page updates from the same current calculator inputs.'
  ];

  if (slug === 'mortgage-calculator') {
    return [
      `Monthly P&I Payment includes principal and interest only (loan amount, rate, and term).`,
      `Estimated Total Monthly Cost includes Monthly P&I${inputs.monthlyContribution > 0 ? ` + extra principal (${formatCurrency(inputs.monthlyContribution)})` : ''} + property tax + home insurance + PMI.`,
      'Total Paid (Principal + Interest) and Total Interest cover principal-and-interest cashflows only; taxes, insurance, and PMI are shown separately.'
    ];
  }

  if (slug.includes('loan') || slug.includes('debt') || slug.includes('credit-card')) {
    return [
      'Monthly payment and payoff timeline are based on current principal, APR, and term assumptions.',
      `Any extra monthly payment input is treated as additional principal reduction each month.`,
      'Payoff timing and interest totals are estimates; lender fees, penalties, and compounding conventions can change exact outcomes.'
    ];
  }

  if (slug.includes('compound') || slug.includes('retirement') || slug.includes('investment') || slug.includes('fire') || slug.includes('savings-goal')) {
    return [
      'Growth projections assume a constant annual return and fixed monthly contribution.',
      'Real Return is shown as expected return minus inflation to reflect purchasing-power impact.',
      'Actual market returns vary by year; use conservative and stress scenarios before committing to a contribution target.'
    ];
  }

  if (slug === 'salary-after-tax-calculator') {
    return [
      'After-tax salary uses your effective tax-rate input as a planning assumption.',
      'Monthly take-home is annual after-tax salary divided by 12.',
      'This is an estimate for planning decisions and does not replace payroll or tax filing calculations.'
    ];
  }

  return generic;
}

function isGrowthCalculator(slug: string): boolean {
  return slug.includes('compound') || slug.includes('retirement') || slug.includes('investment') || slug.includes('fire') || slug.includes('savings-goal');
}

function isDebtStyleCalculator(slug: string): boolean {
  return slug.includes('loan') || slug.includes('debt') || slug.includes('credit-card') || slug === 'mortgage-calculator';
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
  const activeConfig = specializedConfig ?? {
    eyebrow: `${definition.title.replace('Calculator', '').trim()} Decision Page`,
    introTitle: `Use ${definition.title} to make a clearer decision`,
    introBody: definition.description,
    audience: 'People evaluating this exact money decision with real numbers.',
    decision: 'Use the result to choose your safest next step before comparing products.',
    firstAction: 'Enter your current numbers first, then validate the first result card before adjusting assumptions.',
    aiLabel: 'Ask AI about this result (use my numbers)',
    aiPrompts: ['Explain this result using my current numbers', 'Stress-test this scenario with my current numbers', 'What is the safer next step from this result?'],
    aiGroundingMessage: `I’m using your current ${definition.title.toLowerCase()} inputs and outputs from this page.`,
  };

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

  const sanitizedSummary = useMemo(
    () =>
      result.summary.map((item) => ({
        ...item,
        isValid: Number.isFinite(item.value),
        value: Number.isFinite(item.value) ? item.value : 0,
      })),
    [result.summary]
  );
  const formatSummaryValue = useCallback(
    (value: number, currencyMetric?: boolean, suffix?: string) =>
      currencyMetric ? formatCurrency(value) : `${value.toFixed(2)}${suffix ?? ''}`,
    [formatCurrency]
  );
  const formatSummaryDisplay = (value: number, isValid: boolean, currencyMetric?: boolean, suffix?: string) =>
    isValid ? formatSummaryValue(value, currencyMetric, suffix) : '—';
  const csvRows = sanitizedSummary.map((item) => ({
    label: item.label,
    value: formatSummaryDisplay(item.value, item.isValid, item.currency, item.suffix)
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
  const primaryMetric = sanitizedSummary.find((item) => item.isValid) ?? sanitizedSummary[0];
  const baselineValue = primaryMetric?.isValid ? primaryMetric.value : 0;
  const summaryByLabel = useMemo(
    () => new Map(sanitizedSummary.map((item) => [item.label, item])),
    [sanitizedSummary]
  );
  const isValidNumber = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value);
  const formattedBreakdown = result.breakdown.map((row) => {
    if (!row.currency || typeof row.amount !== 'number') return row;
    return { ...row, value: formatCurrency(row.amount) };
  });
  // Per-calculator specific insight layer
  const insightInputs = useMemo(
    () => ({ ...INSIGHT_BASELINE_INPUTS, ...inputs } as BaseCalculatorInputs),
    [inputs]
  );
  const assumptionLabels = useMemo(
    () => buildAssumptionLabels(slug, insightInputs, formatCurrency),
    [formatCurrency, insightInputs, slug]
  );
  const insight = getCalculatorInsight(slug, insightInputs, primaryMetric?.label ?? 'result');
  const resultNarrative = useMemo(() => {
    if (sanitizedSummary.length === 0) {
      return {
        whatItMeans:
          'Enter complete values to generate a full explanation. We only show narrative guidance once a valid result is available.',
        realWorldImpact: ['The summary cards, table, and narrative all update from the same result output model.']
      };
    }

    const headline = sanitizedSummary[0];
    const supporting = sanitizedSummary.slice(1, 3);
    const projectionEnd = result.projection.at(-1);
    const payoffPoint = result.projection.find((point) => point.balance <= 0);
    const payoffYears = payoffPoint?.year;
    const hasPayoffTerm = typeof payoffYears === 'number' && Number.isFinite(payoffYears) && payoffYears > 0;
    const safeBalance = Math.max(0, projectionEnd?.balance ?? 0);
    const modeledYears = Math.max(0, projectionEnd?.year ?? 0);

    const headlineLabel = headline?.label ?? 'Primary result';
    const headlineValue = headline ? formatSummaryValue(headline.value, headline.currency, headline.suffix) : formatCurrency(0);
    const supportLine = supporting
      .map((item) => `${item.label}: ${formatSummaryValue(item.value, item.currency, item.suffix)}`)
      .join('; ');

    return {
      whatItMeans: supportLine
        ? `${headlineLabel} is ${headlineValue}. Supporting outputs from the same calculation: ${supportLine}.`
        : `${headlineLabel} is ${headlineValue}.`,
      realWorldImpact: [
        isDebtStyleCalculator(slug) && hasPayoffTerm
          ? `At current assumptions, this payoff model reaches a zero balance around ${payoffYears.toFixed(1)} years.`
          : isGrowthCalculator(slug)
            ? `This projection runs for ${modeledYears.toFixed(1)} years using your current contribution and return assumptions.`
            : 'Use this output as the baseline before changing one variable at a time for stress tests.',
        isGrowthCalculator(slug)
          ? `Projected ending value from this same model: ${formatCurrency(safeBalance)}.`
          : `Projected ending balance from this same model: ${formatCurrency(safeBalance)}.`,
        slug === 'mortgage-calculator'
          ? 'Estimated Total Monthly Cost includes Monthly P&I, extra principal (if entered), property tax, insurance, and PMI exactly as shown in the result cards.'
          : 'Use the exact result cards above as the source of truth before choosing your next step.',
      ],
    };
  }, [formatCurrency, formatSummaryValue, result.projection, sanitizedSummary, slug]);

  const displayedInsight = {
    ...insight,
    whatItMeans: resultNarrative.whatItMeans,
    realWorldImpact: resultNarrative.realWorldImpact,
  };
  const dynamicFaq = useMemo(() => {
    if (slug !== 'mortgage-calculator') return definition.faq;
    const includesExtraPrincipal = (inputs.monthlyContribution ?? 0) > 0;
    return [
      definition.faq[0],
      {
        question: 'Exactly what is included in Estimated Total Monthly Cost?',
        answer: includesExtraPrincipal
          ? `It includes Monthly P&I, your extra principal payment (${formatCurrency(inputs.monthlyContribution ?? 0)}), property tax, homeowners insurance, and PMI.`
          : 'It includes Monthly P&I, property tax, homeowners insurance, and PMI.'
      },
      {
        question: 'Why is Total Paid (Principal + Interest) different from total housing cost?',
        answer: 'Total Paid (Principal + Interest) only tracks principal-and-interest cashflows. Taxes, insurance, and PMI are listed separately so assumptions remain explicit.'
      }
    ].filter(Boolean) as Array<{ question: string; answer: string }>;
  }, [definition.faq, formatCurrency, inputs.monthlyContribution, slug]);
  const aiContext = {
    pageType: 'calculator',
    pageTitle: definition.title,
    region: currency === 'INR' ? 'IN' : 'US',
    currency: currency === 'INR' ? 'INR' : 'USD',
    intent: 'calculator-result-explainer',
    groundingMessage: activeConfig.aiGroundingMessage,
    calculatorState: {
      slug,
      inputs,
      outputs: {
        headlineMetric: primaryMetric?.label ?? 'headline figure',
        headlineValue: formatSummaryDisplay(
          baselineValue,
          Boolean(primaryMetric?.isValid),
          primaryMetric?.currency,
          primaryMetric?.suffix
        ),
        summary: sanitizedSummary,
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
      headlineValue: formatSummaryDisplay(
        baselineValue,
        Boolean(primaryMetric?.isValid),
        primaryMetric?.currency,
        primaryMetric?.suffix
      ),
      breakdown: formattedBreakdown,
      topInputs: fieldMeta.slice(0, 4).map((field) => ({
        label: field.label,
        value: inputs[field.key] ?? 0,
        suffix: field.suffix ?? '',
      })),
    },
    suggestedPrompts: activeConfig.aiPrompts,
  } satisfies Partial<AiPageContext>;

  useSyncAiPageContext(aiContext);

  return (
    <section className="space-y-8 pb-16" ref={exportRef}>
      <CalculatorHeader
        title={definition.title}
        description={definition.description}
        eyebrow={activeConfig.eyebrow}
        ctaLabel={undefined}
      />
      {activeConfig ? (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-500/40 dark:bg-blue-950/30">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">{activeConfig.introTitle}</h2>
          <p className="mt-2 text-sm text-blue-900 dark:text-blue-200">{activeConfig.introBody}</p>
          <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
            <p className="rounded-xl border border-blue-200 bg-white p-3 text-slate-700 dark:border-blue-500/30 dark:bg-slate-900 dark:text-slate-200"><span className="font-semibold text-slate-900 dark:text-slate-100">Who this is for:</span> {activeConfig.audience}</p>
            <p className="rounded-xl border border-blue-200 bg-white p-3 text-slate-700 dark:border-blue-500/30 dark:bg-slate-900 dark:text-slate-200"><span className="font-semibold text-slate-900 dark:text-slate-100">Decision this page supports:</span> {activeConfig.decision}</p>
          </div>
          <p className="mt-3 rounded-xl border border-blue-200 bg-white p-3 text-sm text-slate-700 dark:border-blue-500/30 dark:bg-slate-900 dark:text-slate-200">
            <span className="font-semibold text-slate-900 dark:text-slate-100">First action:</span> {activeConfig.firstAction}
          </p>
        </section>
      ) : null}

      {showGuide && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100" role="status">
          <p className="font-semibold">{guideMessage.title}</p>
          <p>{guideMessage.body}</p>
          <button type="button" onClick={dismissGuide} className="mt-2 rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid gap-6">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-4 rounded-3xl bg-slate-950 p-4 sm:p-6">
              {fieldMeta.map((field) => (
                <InputSlider key={field.key} label={field.label} tooltip={field.tooltip} value={inputs[field.key] ?? 0} min={field.min} max={field.max} step={field.step} prefix={resolveCurrencyPrefix(field.prefix, currencySymbol)} suffix={field.suffix} locale={currencyLocale} onChange={(value) => setInputs((prev) => ({ ...prev, [field.key]: value }))} />
              ))}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sanitizedSummary.map((item) => (
                  <ResultCard key={item.label} label={item.label} helpText={item.helpText} value={formatSummaryDisplay(item.value, item.isValid, item.currency, item.suffix)} />
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
                  label={activeConfig.aiLabel}
                  prefillQuestion={`Help me understand my ${definition.title} result: ${primaryMetric?.label ?? 'headline figure'} is ${formatSummaryDisplay(baselineValue, Boolean(primaryMetric?.isValid), primaryMetric?.currency, primaryMetric?.suffix)}`}
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

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-100">
            <h2 className="text-base font-semibold">Assumptions used in this result</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {assumptionLabels.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>Defensive guards are applied before rendering output values, so invalid inputs do not show NaN or undefined values.</li>
            </ul>
          </section>

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
            {dynamicFaq.map((item) => (
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
      <SocialShareButtons title={definition.title} url={absoluteUrl(`/calculators/${slug}`)} />

      <AdUnit slot={AD_SLOTS.CALCULATOR} format="auto" className="my-2" />

    </section>
  );
}
