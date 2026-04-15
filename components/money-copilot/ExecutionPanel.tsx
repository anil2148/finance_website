'use client';

import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { usePathname } from 'next/navigation';
import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import { runPipeline } from '@/lib/money-copilot/pipeline';
import type { CopilotResponse, PipelineResult, ReasoningHistoryEntry } from '@/lib/money-copilot/types';
import { serializeAiPageContext } from '@/lib/money-copilot/ai-page-context';
import {
  calcHomeAffordability,
  calcHomeLoanEMI,
  calcDebtPayoff,
  calcInvestingProjection,
  calcJobOfferComparison,
  assessRiskLevel,
  formatCurrency,
} from '@/lib/money-copilot/calculators';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RISK_COLOR: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-700/40',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-700/40',
  high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-700/40',
};

const SEVERITY_ICON: Record<string, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🔴',
};


/** Maps intent type to a short consumer-readable label. */
const INTENT_TYPE_LABEL: Record<string, string> = {
  'job-offer': 'Job offer',
  'relocation': 'Relocation',
  'debt-payoff': 'Debt payoff',
  'roth-vs-traditional': 'Retirement',
  'emergency-fund': 'Emergency fund',
  'home-affordability': 'Home buying',
  'budget-stress-test': 'Budget',
  'ambiguous-offer': 'Offer',
  'custom': 'Decision',
};

// ─── Decision category cards ──────────────────────────────────────────────────

const DECISION_CARDS_US = [
  {
    key: 'job',
    label: 'Job offer',
    emoji: '💼',
    description: 'Compare offers or evaluate a raise',
    question: 'I have a job offer — should I take it?',
  },
  {
    key: 'home',
    label: 'Buying a home',
    emoji: '🏠',
    description: 'Estimate what you can afford',
    question: 'Can I afford to buy a home right now?',
  },
  {
    key: 'credit',
    label: 'Credit card',
    emoji: '💳',
    description: 'Find the right card for your spending',
    question: 'Which credit card is right for my spending?',
  },
  {
    key: 'debt',
    label: 'Debt payoff',
    emoji: '📉',
    description: 'Find the fastest way out of debt',
    question: 'What is the fastest way to pay off my debt?',
  },
  {
    key: 'invest',
    label: 'Investing',
    emoji: '📈',
    description: 'Plan your investment strategy',
    question: 'How should I start investing my money?',
  },
];

const DECISION_CARDS_INDIA = [
  {
    key: 'job',
    label: 'Job offer',
    emoji: '💼',
    description: 'Compare CTC or evaluate a hike',
    question: 'I have a job offer — should I take it?',
  },
  {
    key: 'home',
    label: 'Home loan / EMI',
    emoji: '🏠',
    description: 'Estimate what home loan you can afford',
    question: 'Can I afford a home loan in India right now?',
  },
  {
    key: 'tax',
    label: 'Tax saving',
    emoji: '🧾',
    description: 'Old vs new regime and 80C planning',
    question: 'Which tax regime is better for me — old or new?',
  },
  {
    key: 'debt',
    label: 'Loan / EMI payoff',
    emoji: '📉',
    description: 'Prepay loan or invest — which is better?',
    question: 'Should I prepay my home loan or invest instead?',
  },
  {
    key: 'invest',
    label: 'Investments',
    emoji: '📈',
    description: 'SIP, ELSS, PPF, or NPS — where to invest?',
    question: 'How should I invest my savings in India?',
  },
];

// ─── Consumer-friendly result sections ────────────────────────────────────────

function RecommendationSection({ result }: { result: PipelineResult }) {
  const { step3_analysis: analysis, step4_risk: risk, step1_intent: intent } = result;

  const riskLabel =
    risk.overallScore >= 60 ? 'Higher risk' : risk.overallScore >= 30 ? 'Moderate risk' : 'Lower risk';
  const riskColor =
    risk.overallScore >= 60
      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-700/40'
      : risk.overallScore >= 30
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-700/40'
      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-700/40';

  return (
    <section>
      {intent.clarificationQuestion && intent.type === 'ambiguous-offer' && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-700/40 dark:bg-blue-950/20 dark:text-blue-400">
          <p className="font-semibold">Tip: share the offer type for a more precise analysis</p>
          <p className="mt-0.5 opacity-90">{intent.clarificationQuestion}</p>
        </div>
      )}
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Recommendation</h3>
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/60 dark:bg-blue-950/30">
        <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100">{analysis.recommendation}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${riskColor}`}>{riskLabel}</span>
        </div>
      </div>
    </section>
  );
}

function KeyFindingsSection({ result }: { result: PipelineResult }) {
  const { step3_analysis: analysis } = result;
  if (!analysis.keyFindings.length && !analysis.comparisons.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Why</h3>
      {analysis.keyFindings.length > 0 && (
        <ul className="space-y-2">
          {analysis.keyFindings.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
              <span className="mt-0.5 shrink-0 text-blue-500">›</span>
              {f}
            </li>
          ))}
        </ul>
      )}
      {analysis.comparisons.length > 0 && (
        <div className="mt-3 space-y-2">
          {analysis.comparisons.map((c, i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center justify-between gap-1 font-medium text-slate-800 dark:text-slate-100">
                <span>{c.optionA}</span>
                <span className="text-slate-400">vs</span>
                <span>{c.optionB}</span>
              </div>
              {c.winner !== 'neutral' && (
                <p className={`mt-1 text-[11px] font-medium ${c.winner === 'A' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {c.winner === 'A' ? c.optionA : c.optionB} looks better — {c.delta}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RisksSection({ result }: { result: PipelineResult }) {
  const { step4_risk: risk } = result;
  if (!risk.factors.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Risks to watch</h3>
      <div className="space-y-2">
        {risk.factors.map((f, i) => (
          <div key={i} className={`flex items-start gap-2 rounded-lg border p-2 text-xs ${RISK_COLOR[f.severity]}`}>
            <span>{SEVERITY_ICON[f.severity]}</span>
            <div>
              <p className="font-semibold">{f.factor}</p>
              <p className="mt-0.5 opacity-80">{f.detail}</p>
            </div>
          </div>
        ))}
        {risk.mitigations.length > 0 && (
          <div className="pt-1">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">What you can do</p>
            <ul className="space-y-1">
              {risk.mitigations.map((m, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function NextStepsSection({ result }: { result: PipelineResult }) {
  const { step3_analysis: analysis, step5_actionPlan: plan } = result;
  if (!analysis.nextSteps.length && !plan.timeline) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Best next step</h3>
      {plan.timeline && (
        <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/50">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Timeline: </span>
          <span className="text-slate-700 dark:text-slate-300">{plan.timeline}</span>
        </div>
      )}
      {analysis.nextSteps.length > 0 && (
        <ul className="space-y-2">
          {/* Cap at 3 steps to keep the panel scannable without scrolling */}
          {analysis.nextSteps.slice(0, 3).map((step, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
              {step}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ─── Key Numbers section (shown for all intents with dataPoints) ──────────────

function KeyNumbersSection({ result }: { result: PipelineResult }) {
  const { step3_analysis: analysis } = result;
  const metrics = analysis.dataPoints.filter((d) => d.source !== 'assumed');
  if (!metrics.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Key numbers</h3>
      <div className="grid grid-cols-2 gap-2">
        {metrics.slice(0, 6).map((m, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {m.label}
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{m.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Home Affordability Completion Flow ───────────────────────────────────────

interface HAFormValues {
  annualIncome: string;
  downPayment: string;
  monthlyDebt: string;
  emergencyFund: string;
  monthlyExpenses: string;
  hasHighInterestDebt: boolean;
  highInterestDebtPayment: string;
}

interface HAComputedOutput {
  maxHomePrice: number;
  monthlyPayment: number;
  housingBurdenPct: number;
  fullDtiPct: number;
  emergencyRunwayMonths: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  why: string[];
  risksToWatch: string[];
  bestNextStep: string;
}

const EMPTY_HA_FORM: HAFormValues = {
  annualIncome: '',
  downPayment: '',
  monthlyDebt: '',
  emergencyFund: '',
  monthlyExpenses: '',
  hasHighInterestDebt: false,
  highInterestDebtPayment: '',
};

function parseNumField(s: string): number {
  const n = parseFloat(s.replace(/[$₹,\s]/g, ''));
  return isNaN(n) || n < 0 ? 0 : n;
}

function computeHomeAffordability(v: HAFormValues, region: 'US' | 'India' = 'US'): HAComputedOutput {
  const annualIncome = parseNumField(v.annualIncome);
  const downPayment = parseNumField(v.downPayment);
  const hiDebtPayment = v.hasHighInterestDebt ? parseNumField(v.highInterestDebtPayment) : 0;
  const monthlyDebt = parseNumField(v.monthlyDebt) + hiDebtPayment;
  const emergencyFund = parseNumField(v.emergencyFund);
  const monthlyExpenses = parseNumField(v.monthlyExpenses);
  const fmt = (n: number) => formatCurrency(n, region);

  let maxHomePrice: number;
  let monthlyPaymentEstimate: number;

  if (region === 'India') {
    const { maxHomePrice: mp, emiEstimate } = calcHomeLoanEMI(annualIncome, downPayment, monthlyDebt);
    maxHomePrice = mp;
    monthlyPaymentEstimate = emiEstimate;
  } else {
    const { maxHomePrice: mp, monthlyPaymentEstimate: mp2 } = calcHomeAffordability(annualIncome, downPayment, monthlyDebt);
    maxHomePrice = mp;
    monthlyPaymentEstimate = mp2;
  }

  const monthlyGross = annualIncome > 0 ? annualIncome / 12 : 0;

  const housingBurdenRatio = monthlyGross > 0 ? monthlyPaymentEstimate / monthlyGross : 0;
  const existingDebtRatio = monthlyGross > 0 ? monthlyDebt / monthlyGross : 0;
  const fullDtiRatio = monthlyGross > 0 ? (monthlyDebt + monthlyPaymentEstimate) / monthlyGross : 0;
  const emergencyRunwayMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : emergencyFund > 0 ? 12 : 0;

  const riskLevel = assessRiskLevel({
    housingBurdenRatio,
    debtLoadRatio: existingDebtRatio,
    emergencyRunwayMonths,
  });

  // ── Recommendation ───────────────────────────────────────────────────────────
  let recommendation: string;
  if (annualIncome <= 0) {
    recommendation = region === 'India'
      ? 'Enter your annual CTC above to compute home loan affordability.'
      : 'Enter your annual gross income above to compute affordability.';
  } else if (riskLevel === 'low') {
    recommendation = region === 'India'
      ? `You can comfortably take a home loan up to ${fmt(maxHomePrice)} based on your CTC and existing EMIs.`
      : `You can comfortably afford a home up to ${fmt(maxHomePrice)} based on your income and current debts.`;
  } else if (riskLevel === 'medium') {
    recommendation = region === 'India'
      ? `You may qualify for a home up to ${fmt(maxHomePrice)}, but your finances are stretched. Review the risks below before committing.`
      : `You may qualify for a home up to ${fmt(maxHomePrice)}, but your finances are stretched. Review the risks below before committing.`;
  } else {
    recommendation = region === 'India'
      ? 'Taking a home loan at this time carries significant financial risk. Consider improving your CIBIL score and reducing existing EMIs first.'
      : 'Home buying at this time carries significant financial risk. Consider stabilizing your finances before purchasing.';
  }

  // ── Why ──────────────────────────────────────────────────────────────────────
  const why: string[] = [];
  if (annualIncome > 0) {
    if (region === 'India') {
      why.push(`Maximum affordable home price: ${fmt(maxHomePrice)} (50% FOIR, 8.5% rate, 20-year term)`);
      why.push(`Max eligible EMI: ${fmt(monthlyPaymentEstimate)}/month`);
      why.push(`FOIR: ${(housingBurdenRatio * 100).toFixed(0)}% of gross monthly income (guideline: ≤50%)`);
      why.push(`Total EMI-to-income ratio: ${(fullDtiRatio * 100).toFixed(0)}% including new EMI`);
    } else {
      why.push(`Maximum affordable home price: ${fmt(maxHomePrice)} (28/36 rule, 7% rate, 30-year term)`);
      why.push(`Estimated monthly payment: ${fmt(monthlyPaymentEstimate)}`);
      why.push(`Housing burden: ${(housingBurdenRatio * 100).toFixed(0)}% of gross income (guideline: ≤28%)`);
      why.push(`Total debt-to-income: ${(fullDtiRatio * 100).toFixed(0)}% including mortgage (guideline: ≤36%)`);
    }
  }
  if (monthlyExpenses > 0) {
    why.push(`Emergency runway: ${emergencyRunwayMonths.toFixed(1)} months of expenses (target: 6+ months)`);
  }
  if (downPayment > 0 && maxHomePrice > 0) {
    const dpPct = (downPayment / maxHomePrice) * 100;
    why.push(
      `Down payment: ${fmt(downPayment)} — ${dpPct.toFixed(0)}% of max home price${
        region === 'India'
          ? dpPct < 20 ? ' (below 20%; you may need LMI/higher rate)' : ''
          : dpPct < 20 ? ' (below 20%; PMI likely applies)' : ''
      }`,
    );
  }

  // ── Risks to watch ───────────────────────────────────────────────────────────
  const risksToWatch: string[] = [];
  if (annualIncome > 0) {
    const foirLimit = region === 'India' ? 0.50 : 0.35;
    if (housingBurdenRatio > foirLimit) {
      risksToWatch.push(region === 'India'
        ? 'EMI exceeds 50% FOIR — most banks will not approve this loan without additional income proof'
        : 'Housing costs exceed 35% of gross income — leaves little room for savings or emergencies');
    } else if (housingBurdenRatio > (region === 'India' ? 0.40 : 0.28)) {
      risksToWatch.push(region === 'India'
        ? 'EMI is near the 40% FOIR threshold — monitor cash flow carefully after taking the loan'
        : 'Housing costs are near the 28% guideline — monitor your budget closely');
    }
    if (fullDtiRatio > (region === 'India' ? 0.55 : 0.43)) {
      risksToWatch.push(region === 'India'
        ? 'Total EMI obligations exceed 55% of income — banks may reject the application'
        : 'Total debt-to-income exceeds 43% — may not qualify for a conventional mortgage');
    } else if (fullDtiRatio > (region === 'India' ? 0.50 : 0.36)) {
      risksToWatch.push(region === 'India'
        ? 'Total EMI obligations exceed 50% of income — reducing existing EMIs first would improve your eligibility'
        : 'Total debt-to-income exceeds 36% — reducing existing debt first would improve your terms');
    }
  }
  if (monthlyExpenses > 0) {
    if (emergencyRunwayMonths < 3) {
      risksToWatch.push('Emergency fund covers less than 3 months — you are exposed to unexpected financial shocks');
    } else if (emergencyRunwayMonths < 6) {
      risksToWatch.push('Emergency fund is below the 6-month target — aim to build it before or alongside buying');
    }
  }
  if (v.hasHighInterestDebt) {
    risksToWatch.push(region === 'India'
      ? 'High-interest debt (personal loan >10% p.a.) erodes your net worth quickly — consider paying it down before taking a home loan'
      : 'High-interest debt (15%+ APR) erodes your net worth faster than a mortgage builds equity — consider paying it down first');
  }
  if (downPayment > 0 && maxHomePrice > 0 && downPayment < maxHomePrice * 0.2) {
    risksToWatch.push(region === 'India'
      ? `Down payment is below 20% — you will need to borrow more and pay higher EMIs; check if you qualify for PMAY subsidy`
      : `Down payment is below 20% — expect Private Mortgage Insurance (~${formatCurrency(Math.round((maxHomePrice * 0.005) / 12))}/mo until you reach 20% equity)`);
  }

  // ── Best next step ───────────────────────────────────────────────────────────
  let bestNextStep: string;
  if (annualIncome <= 0) {
    bestNextStep = region === 'India'
      ? 'Enter your annual CTC to get a personalized home loan estimate.'
      : 'Enter your annual gross income to get a personalized next step.';
  } else if (riskLevel === 'low') {
    bestNextStep = region === 'India'
      ? `Check your CIBIL score (target 750+) and get a home loan pre-approval from your bank for up to ${fmt(maxHomePrice)}.`
      : `Get pre-approved for a mortgage up to ${fmt(maxHomePrice)} and start working with a real estate agent to find homes in your budget.`;
  } else if (riskLevel === 'medium') {
    if (fullDtiRatio > (region === 'India' ? 0.50 : 0.36)) {
      bestNextStep = region === 'India'
        ? 'Reduce existing EMI obligations before applying for a home loan to improve your FOIR.'
        : 'Pay down existing monthly debt to improve your debt-to-income ratio before applying for a mortgage.';
    } else if (emergencyRunwayMonths < 6) {
      bestNextStep = 'Build your emergency fund to at least 6 months of expenses before committing to a home purchase.';
    } else {
      bestNextStep = region === 'India'
        ? 'Review your monthly budget carefully and consider a lower-priced property or a larger down payment to reduce EMI pressure.'
        : 'Review your monthly budget carefully and consider a lower-priced home or a larger down payment to reduce financial pressure.';
    }
  } else {
    if (v.hasHighInterestDebt) {
      bestNextStep = region === 'India'
        ? 'Prioritize closing personal loans and credit card debt first. Once cleared, revisit your home loan eligibility.'
        : 'Prioritize eliminating high-interest debt over the next 12–18 months. Once cleared, reassess your home buying timeline.';
    } else if (emergencyRunwayMonths < 3) {
      bestNextStep = region === 'India'
        ? 'Build a 3–6 month emergency fund in a liquid FD before taking a home loan. Continue renting while you save.'
        : 'Build a 3–6 month emergency fund before taking on a mortgage. Consider renting while you save aggressively.';
    } else {
      bestNextStep = region === 'India'
        ? 'Focus on increasing CTC or reducing EMI obligations for the next 12 months, then revisit home loan affordability.'
        : 'Focus on increasing income or reducing monthly obligations for the next 12 months, then revisit home affordability.';
    }
  }

  return {
    maxHomePrice,
    monthlyPayment: monthlyPaymentEstimate,
    housingBurdenPct: housingBurdenRatio * 100,
    fullDtiPct: fullDtiRatio * 100,
    emergencyRunwayMonths,
    riskLevel,
    recommendation,
    why,
    risksToWatch,
    bestNextStep,
  };
}

// ── MoneyField ─────────────────────────────────────────────────────────────────

function MoneyField({
  id,
  label,
  required,
  value,
  onChange,
  placeholder,
  hint,
  error,
  region,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  region?: 'US' | 'India';
}) {
  const currencySymbol = region === 'India' ? '₹' : '$';
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{currencySymbol}</span>
        <input
          id={id}
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-700"
        />
      </div>
      {hint && <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

// ── HomeAffordabilityCompletionForm ───────────────────────────────────────────

function HomeAffordabilityCompletionForm({ onSubmit, region = 'US' }: { onSubmit: (values: HAFormValues) => void; region?: 'US' | 'India' }) {
  const [values, setValues] = useState<HAFormValues>(EMPTY_HA_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof HAFormValues, string>>>({});
  const isIndia = region === 'India';

  const set = <K extends keyof HAFormValues>(field: K, value: HAFormValues[K]) =>
    setValues((v) => ({ ...v, [field]: value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof HAFormValues, string>> = {};
    if (!values.annualIncome || parseNumField(values.annualIncome) <= 0) {
      errs.annualIncome = isIndia ? 'Required — enter your annual CTC' : 'Required — enter your annual gross income';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(values);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-lg leading-none">📋</span>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Personalize with your numbers</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {isIndia
                ? 'Provide the details below for an accurate home loan (EMI) affordability assessment based on FOIR guidelines.'
                : 'Provide the details below for an accurate home affordability assessment. These inputs replace assumptions with real numbers.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <MoneyField
          id="ha-income"
          label={isIndia ? 'Annual CTC (Cost to Company)' : 'Annual gross income'}
          required
          value={values.annualIncome}
          onChange={(v) => set('annualIncome', v)}
          placeholder={isIndia ? '1000000' : '85000'}
          hint={isIndia ? 'Your total annual CTC — in-hand will be calculated automatically' : 'Before taxes — use your total salary or combined household income'}
          error={errors.annualIncome}
          region={region}
        />

        <MoneyField
          id="ha-down"
          label={isIndia ? 'Down payment available' : 'Down payment / cash on hand'}
          value={values.downPayment}
          onChange={(v) => set('downPayment', v)}
          placeholder={isIndia ? '500000' : '40000'}
          hint={isIndia ? 'Typically 20% of the property value; affects loan amount and EMI' : 'Amount you plan to put toward the purchase'}
          region={region}
        />

        <MoneyField
          id="ha-debt"
          label={isIndia ? 'Existing monthly EMI obligations' : 'Existing monthly debt payments'}
          value={values.monthlyDebt}
          onChange={(v) => set('monthlyDebt', v)}
          placeholder={isIndia ? '5000' : '400'}
          hint={isIndia ? 'Car EMI, personal loan EMI, credit card minimum — not rent' : 'Car loans, student loans, minimum credit card payments — not rent'}
          region={region}
        />

        <MoneyField
          id="ha-emergency"
          label={isIndia ? 'Liquid savings / emergency fund' : 'Emergency fund (total saved)'}
          value={values.emergencyFund}
          onChange={(v) => set('emergencyFund', v)}
          placeholder={isIndia ? '300000' : '15000'}
          hint={isIndia ? 'Total in savings account or liquid FD set aside for emergencies' : 'Total liquid savings set aside for emergencies'}
          region={region}
        />

        <MoneyField
          id="ha-expenses"
          label={isIndia ? 'Monthly essential expenses' : 'Monthly essential expenses'}
          value={values.monthlyExpenses}
          onChange={(v) => set('monthlyExpenses', v)}
          placeholder={isIndia ? '25000' : '3500'}
          hint={isIndia ? 'Rent, groceries, utilities, transport, insurance, etc.' : 'Current rent, utilities, groceries, transportation, insurance, etc.'}
          region={region}
        />

        {/* High-interest debt toggle */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={values.hasHighInterestDebt}
              onChange={(e) => set('hasHighInterestDebt', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
            />
            <div>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {isIndia ? 'I carry high-interest debt (personal loan/credit card >10% p.a.)' : 'I carry high-interest debt (15%+ APR)'}
              </span>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {isIndia ? 'Personal loans, credit card dues, etc.' : 'Credit cards, personal loans, payday loans, etc.'}
              </p>
            </div>
          </label>
          {values.hasHighInterestDebt && (
            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
              <MoneyField
                id="ha-hi-debt"
                label={isIndia ? 'Monthly payment on high-interest debt (optional)' : 'Monthly payment on high-interest debt (optional)'}
                value={values.highInterestDebtPayment}
                onChange={(v) => set('highInterestDebtPayment', v)}
                placeholder={isIndia ? '5000' : '300'}
                hint={isIndia ? 'Total minimum + extra payments per month' : 'Total minimum + extra payments per month'}
                region={region}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Get my recommendation →
        </button>
      </form>
    </div>
  );
}

// ── HomeAffordabilityFinalOutput ──────────────────────────────────────────────

const HA_RISK_STYLES: Record<'low' | 'medium' | 'high', string> = {
  low: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700/40 dark:bg-emerald-950/20 dark:text-emerald-300',
  medium:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-300',
  high: 'border-red-200 bg-red-50 text-red-900 dark:border-red-700/40 dark:bg-red-950/20 dark:text-red-300',
};

const HA_RISK_BADGE: Record<'low' | 'medium' | 'high', string> = {
  low: '✅ Good to proceed',
  medium: '⚠️ Proceed with caution',
  high: '🛑 High risk',
};

function HomeAffordabilityFinalOutput({ output, onRedo }: { output: HAComputedOutput; onRedo: () => void }) {
  return (
    <div className="space-y-5">
      {/* Recommendation */}
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Recommendation</h3>
        <div className={`rounded-xl border p-4 ${HA_RISK_STYLES[output.riskLevel]}`}>
          <p className="mb-1.5 text-xs font-semibold">{HA_RISK_BADGE[output.riskLevel]}</p>
          <p className="text-sm font-medium leading-relaxed">{output.recommendation}</p>
        </div>
      </section>

      <hr className="border-slate-100 dark:border-slate-700/60" />

      {/* Why */}
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Why</h3>
        <ul className="space-y-2">
          {output.why.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
              <span className="mt-0.5 shrink-0 text-blue-500">›</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {output.risksToWatch.length > 0 && (
        <>
          <hr className="border-slate-100 dark:border-slate-700/60" />
          <section>
            <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Risks to watch</h3>
            <ul className="space-y-2">
              {output.risksToWatch.map((risk, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-300"
                >
                  <span className="shrink-0">⚠️</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <hr className="border-slate-100 dark:border-slate-700/60" />

      {/* Best next step */}
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Best next step</h3>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-700/50 dark:bg-blue-950/20 dark:text-blue-200">
          {output.bestNextStep}
        </div>
      </section>

      {/* Update inputs link */}
      <button
        type="button"
        onClick={onRedo}
        className="text-xs text-slate-400 underline hover:text-blue-600 dark:hover:text-blue-400"
      >
        ← Update inputs
      </button>
    </div>
  );
}

// ── HomeAffordabilityFlow ─────────────────────────────────────────────────────

function HomeAffordabilityFlow({ result, region = 'US' }: { result: PipelineResult; region?: 'US' | 'India' }) {
  const [showRefinement, setShowRefinement] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<HAFormValues | null>(null);
  const output = submittedValues ? computeHomeAffordability(submittedValues, region) : null;
  const isIndia = region === 'India';

  if (output) {
    return <HomeAffordabilityFinalOutput output={output} onRedo={() => setSubmittedValues(null)} />;
  }

  return (
    <div className="space-y-5">
      {/* Show AI/rule-based result immediately with assumption-based defaults */}
      <RecommendationSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <KeyFindingsSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <RisksSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <NextStepsSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />

      {/* Offer precise calculation with real numbers */}
      {showRefinement ? (
        <HomeAffordabilityCompletionForm
          region={region}
          onSubmit={(values) => { setSubmittedValues(values); setShowRefinement(false); }}
        />
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Want a more precise number?</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {isIndia
              ? 'The estimate above uses default assumptions. Enter your CTC and existing EMIs for a precise home loan eligibility calculation.'
              : 'The estimate above uses default assumptions. Enter your income and debt for a precise, personalized affordability calculation.'}
          </p>
          <button
            type="button"
            onClick={() => setShowRefinement(true)}
            className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Enter my numbers →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Job Offer Inline Flow ────────────────────────────────────────────────────

interface JobOfferFormValues {
  currentSalary: string;
  newSalary: string;
  employmentType: 'w2' | 'c2c' | 'contractor';
  state: string;
}

interface JobOfferOutput {
  currentMonthlyNet: number;
  newMonthlyNet: number;
  monthlyGain: number;
  annualGain: number;
  verdict: string;
  risks: string[];
}

const EMPTY_JO_FORM: JobOfferFormValues = { currentSalary: '', newSalary: '', employmentType: 'w2', state: '' };

function computeJobOffer(v: JobOfferFormValues, region: 'US' | 'India'): JobOfferOutput {
  const cur = parseNumField(v.currentSalary);
  const nxt = parseNumField(v.newSalary);
  const fmt = (n: number) => formatCurrency(n, region);

  const { currentMonthlyNet, newMonthlyNet, monthlyGain, annualGain } =
    calcJobOfferComparison(cur > 0 ? cur : (region === 'India' ? 800_000 : 65_000),
      nxt > 0 ? nxt : (region === 'India' ? 1_000_000 : 75_000), region, v.state || undefined, v.employmentType);

  const isC2C = v.employmentType === 'c2c' || v.employmentType === 'contractor';
  let verdict: string;

  if (cur <= 0 || nxt <= 0) {
    verdict = 'Enter both salaries to see a personalised comparison.';
  } else if (monthlyGain > 500) {
    verdict = region === 'India'
      ? `Accept the offer. You gain +${fmt(monthlyGain)}/month (+${fmt(annualGain)}/year) in-hand after tax.`
      : `Take the offer — you gain +${fmt(monthlyGain)}/month (+${fmt(annualGain)}/year) after taxes.`;
  } else if (monthlyGain > 0) {
    verdict = `Marginal gain: +${fmt(monthlyGain)}/month. Negotiate for more or weigh non-salary benefits.`;
  } else {
    verdict = `The offers are roughly equivalent after tax. Prioritize benefits, growth, and work-life balance.`;
  }

  const risks: string[] = [];
  if (isC2C) risks.push('C2C/contractor adds ~15.3% self-employment tax + you cover health insurance.');
  if (region === 'India' && nxt > cur) risks.push('Request full CTC breakup — check guaranteed vs. variable pay split.');
  if (monthlyGain < 200 && nxt > cur) risks.push('After-tax gain is marginal — factor in equity, PTO, and career growth.');

  return { currentMonthlyNet, newMonthlyNet, monthlyGain, annualGain, verdict, risks };
}

function JobOfferRefinementForm({ onSubmit, region = 'US' }: { onSubmit: (v: JobOfferFormValues) => void; region?: 'US' | 'India' }) {
  const [values, setValues] = useState<JobOfferFormValues>(EMPTY_JO_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof JobOfferFormValues, string>>>({});
  const isIndia = region === 'India';

  const set = <K extends keyof JobOfferFormValues>(f: K, v: JobOfferFormValues[K]) =>
    setValues((p) => ({ ...p, [f]: v }));

  const validate = () => {
    const errs: Partial<Record<keyof JobOfferFormValues, string>> = {};
    if (!values.currentSalary || parseNumField(values.currentSalary) <= 0) errs.currentSalary = 'Required';
    if (!values.newSalary || parseNumField(values.newSalary) <= 0) errs.newSalary = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Refine with your numbers</p>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
          {isIndia ? 'Enter both CTCs for a precise in-hand comparison.' : 'Enter both salaries for a precise after-tax comparison.'}
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(values); }} className="space-y-3">
        <MoneyField id="jo-cur" label={isIndia ? 'Current annual CTC' : 'Current annual salary'} required
          value={values.currentSalary} onChange={(v) => set('currentSalary', v)}
          placeholder={isIndia ? '800000' : '65000'} error={errors.currentSalary} region={region} />
        <MoneyField id="jo-new" label={isIndia ? 'New offer CTC' : 'New offer annual salary'} required
          value={values.newSalary} onChange={(v) => set('newSalary', v)}
          placeholder={isIndia ? '1000000' : '75000'} error={errors.newSalary} region={region} />
        {!isIndia && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Employment type</label>
            <select value={values.employmentType} onChange={(e) => set('employmentType', e.target.value as JobOfferFormValues['employmentType'])}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
              <option value="w2">W2 (employee)</option>
              <option value="c2c">C2C / Corp-to-Corp</option>
              <option value="contractor">Independent contractor</option>
            </select>
          </div>
        )}
        {!isIndia && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">State (optional)</label>
            <input type="text" maxLength={2} placeholder="e.g. CA, TX" value={values.state} onChange={(e) => set('state', e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
          </div>
        )}
        <button type="submit" className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
          Compare offers →
        </button>
      </form>
    </div>
  );
}

function JobOfferFinalOutput({ output, region = 'US', onRedo }: { output: JobOfferOutput; region?: 'US' | 'India'; onRedo: () => void }) {
  const fmt = (n: number) => formatCurrency(n, region);
  const isPositive = output.monthlyGain >= 0;
  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Recommendation</h3>
        <div className={`rounded-xl border p-4 ${isPositive ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700/40 dark:bg-emerald-950/20' : 'border-amber-200 bg-amber-50 dark:border-amber-700/40 dark:bg-amber-950/20'}`}>
          <p className="text-sm font-medium leading-relaxed text-slate-900 dark:text-slate-100">{output.verdict}</p>
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Key numbers</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Current monthly net', value: fmt(output.currentMonthlyNet) },
            { label: 'New offer monthly net', value: fmt(output.newMonthlyNet) },
            { label: 'Monthly gain', value: `${output.monthlyGain >= 0 ? '+' : ''}${fmt(output.monthlyGain)}` },
            { label: 'Annual gain', value: `${output.annualGain >= 0 ? '+' : ''}${fmt(output.annualGain)}` },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{m.label}</p>
              <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{m.value}</p>
            </div>
          ))}
        </div>
      </section>
      {output.risks.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Risks to watch</h3>
          <ul className="space-y-1.5">
            {output.risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-300">
                <span className="shrink-0">⚠️</span><span>{r}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <button type="button" onClick={onRedo} className="text-xs text-slate-400 underline hover:text-blue-600 dark:hover:text-blue-400">
        ← Update inputs
      </button>
    </div>
  );
}

function JobOfferFlow({ result, region = 'US' }: { result: PipelineResult; region?: 'US' | 'India' }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState<JobOfferFormValues | null>(null);
  const output = submitted ? computeJobOffer(submitted, region) : null;

  if (output) return <JobOfferFinalOutput output={output} region={region} onRedo={() => setSubmitted(null)} />;

  return (
    <div className="space-y-5">
      <RecommendationSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <KeyNumbersSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <RisksSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <NextStepsSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      {showForm ? (
        <JobOfferRefinementForm region={region} onSubmit={(v) => { setSubmitted(v); setShowForm(false); }} />
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Get precise numbers</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {region === 'India' ? 'Enter your current CTC and the new offer CTC for an exact in-hand comparison.' : 'Enter your current salary and new offer for an exact after-tax comparison.'}
          </p>
          <button type="button" onClick={() => setShowForm(true)} className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
            Enter my numbers →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Debt Payoff Inline Flow ──────────────────────────────────────────────────

interface DebtPayoffFormValues {
  totalDebt: string;
  interestRate: string;
  monthlyPayment: string;
  region: 'US' | 'India';
}

interface DebtPayoffOutput {
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  minimumPayment: number;
  extraPayoffText: string;
  recommendation: string;
  nextStep: string;
}

const EMPTY_DP_FORM: DebtPayoffFormValues = { totalDebt: '', interestRate: '', monthlyPayment: '', region: 'US' };

function computeDebtPayoff(v: DebtPayoffFormValues): DebtPayoffOutput {
  const principal = parseNumField(v.totalDebt);
  const annualRate = parseNumField(v.interestRate) / 100;
  const monthlyPayment = parseNumField(v.monthlyPayment);
  const region = v.region;
  const fmt = (n: number) => formatCurrency(n, region);

  const result = calcDebtPayoff(
    principal > 0 ? principal : 10_000,
    annualRate > 0 ? annualRate : 0.18,
    monthlyPayment > 0 ? monthlyPayment : 300,
  );

  const isPaidOff = isFinite(result.monthsToPayoff);
  const years = Math.floor(result.monthsToPayoff / 12);
  const months = result.monthsToPayoff % 12;
  const timeText = years > 0 ? `${years}yr ${months}mo` : `${months} months`;

  const recommendation = isPaidOff
    ? result.monthsToPayoff <= 12
      ? `You can be debt-free in ${timeText}. Stay the course and accelerate any extra cash toward this.`
      : `Debt-free in ${timeText}. You will pay ${fmt(result.totalInterest)} in interest. Consider the avalanche method (highest rate first) to save on interest.`
    : `Your monthly payment is too low to cover interest. Increase payment to at least ${fmt(result.minimumPayment + 1)}/month.`;

  const extraPayoffText = isPaidOff && result.monthsToPayoff > 6
    ? `Paying ${fmt(monthlyPayment > 0 ? monthlyPayment * 1.5 : 450)}/month instead would save ~${fmt(result.totalInterest * 0.3)} in interest.`
    : '';

  const nextStep = isPaidOff
    ? region === 'India'
      ? 'Set up auto-debit for the monthly payment so you never miss a due date. Redirect freed cash to SIP/PPF after payoff.'
      : 'Automate the payment to avoid missing due dates. Once debt-free, redirect the freed cash to your emergency fund and 401(k).'
    : 'Increase your monthly payment immediately. Even a small increase dramatically reduces total interest paid.';

  return {
    monthsToPayoff: result.monthsToPayoff,
    totalInterest: result.totalInterest,
    totalPaid: result.totalPaid,
    minimumPayment: result.minimumPayment,
    extraPayoffText,
    recommendation,
    nextStep,
  };
}

function DebtPayoffRefinementForm({ onSubmit, region = 'US' }: { onSubmit: (v: DebtPayoffFormValues) => void; region?: 'US' | 'India' }) {
  const [values, setValues] = useState<DebtPayoffFormValues>({ ...EMPTY_DP_FORM, region });
  const [errors, setErrors] = useState<Partial<Record<keyof DebtPayoffFormValues, string>>>({});
  const set = <K extends keyof DebtPayoffFormValues>(f: K, val: DebtPayoffFormValues[K]) =>
    setValues((p) => ({ ...p, [f]: val }));

  const validate = () => {
    const errs: Partial<Record<keyof DebtPayoffFormValues, string>> = {};
    if (!values.totalDebt || parseNumField(values.totalDebt) <= 0) errs.totalDebt = 'Required';
    if (!values.interestRate || parseNumField(values.interestRate) <= 0) errs.interestRate = 'Required';
    if (!values.monthlyPayment || parseNumField(values.monthlyPayment) <= 0) errs.monthlyPayment = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const isIndia = region === 'India';
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Calculate exact payoff timeline</p>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">Enter your debt details to see exactly when you&apos;ll be debt-free.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(values); }} className="space-y-3">
        <MoneyField id="dp-debt" label={isIndia ? 'Total debt balance' : 'Total debt balance'} required
          value={values.totalDebt} onChange={(v) => set('totalDebt', v)}
          placeholder={isIndia ? '200000' : '10000'} error={errors.totalDebt} region={region} />
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Annual interest rate (%)<span className="ml-0.5 text-red-500">*</span></label>
          <input type="number" min="0" max="100" step="0.1" placeholder={isIndia ? '18' : '21'}
            value={values.interestRate} onChange={(e) => set('interestRate', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
          {errors.interestRate && <p className="mt-1 text-[11px] text-red-600">{errors.interestRate}</p>}
        </div>
        <MoneyField id="dp-payment" label="Monthly payment" required
          value={values.monthlyPayment} onChange={(v) => set('monthlyPayment', v)}
          placeholder={isIndia ? '5000' : '300'} error={errors.monthlyPayment} region={region} />
        <button type="submit" className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
          Calculate payoff →
        </button>
      </form>
    </div>
  );
}

function DebtPayoffFinalOutput({ output, region = 'US', onRedo }: { output: DebtPayoffOutput; region?: 'US' | 'India'; onRedo: () => void }) {
  const fmt = (n: number) => formatCurrency(n, region);
  const isPaidOff = isFinite(output.monthsToPayoff);
  const years = Math.floor(output.monthsToPayoff / 12);
  const mos = output.monthsToPayoff % 12;

  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Recommendation</h3>
        <div className={`rounded-xl border p-4 ${isPaidOff ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700/40 dark:bg-emerald-950/20' : 'border-red-200 bg-red-50 dark:border-red-700/40 dark:bg-red-950/20'}`}>
          <p className="text-sm font-medium leading-relaxed text-slate-900 dark:text-slate-100">{output.recommendation}</p>
        </div>
      </section>
      {isPaidOff && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Key numbers</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Payoff time', value: years > 0 ? `${years}yr ${mos}mo` : `${mos} months` },
              { label: 'Total interest paid', value: fmt(output.totalInterest) },
              { label: 'Total paid', value: fmt(output.totalPaid) },
              { label: 'Monthly payment', value: fmt(output.totalPaid / output.monthsToPayoff) },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{m.label}</p>
                <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{m.value}</p>
              </div>
            ))}
          </div>
          {output.extraPayoffText && (
            <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">💡 {output.extraPayoffText}</p>
          )}
        </section>
      )}
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Best next step</h3>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-700/50 dark:bg-blue-950/20 dark:text-blue-200">
          {output.nextStep}
        </div>
      </section>
      <button type="button" onClick={onRedo} className="text-xs text-slate-400 underline hover:text-blue-600 dark:hover:text-blue-400">
        ← Update inputs
      </button>
    </div>
  );
}

function DebtPayoffFlow({ result, region = 'US' }: { result: PipelineResult; region?: 'US' | 'India' }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState<DebtPayoffFormValues | null>(null);
  const output = submitted ? computeDebtPayoff(submitted) : null;

  if (output) return <DebtPayoffFinalOutput output={output} region={region} onRedo={() => setSubmitted(null)} />;

  return (
    <div className="space-y-5">
      <RecommendationSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <KeyNumbersSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <RisksSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <NextStepsSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      {showForm ? (
        <DebtPayoffRefinementForm region={region} onSubmit={(v) => { setSubmitted({ ...v, region }); setShowForm(false); }} />
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Calculate exact payoff timeline</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {region === 'India' ? 'Enter your loan balance, interest rate, and EMI for an exact payoff projection.' : 'Enter your debt balance, APR, and monthly payment for an exact payoff projection.'}
          </p>
          <button type="button" onClick={() => setShowForm(true)} className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
            Enter my numbers →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Investing Projections Inline Flow ────────────────────────────────────────

interface InvestingFormValues {
  monthlyContribution: string;
  currentSavings: string;
  annualReturn: string;
  years: string;
}

interface InvestingOutput {
  finalValue: number;
  totalContributed: number;
  gain: number;
  years: number;
  monthlyContribution: number;
  recommendation: string;
  nextStep: string;
}

const EMPTY_INV_FORM: InvestingFormValues = { monthlyContribution: '', currentSavings: '', annualReturn: '', years: '' };

function computeInvesting(v: InvestingFormValues, region: 'US' | 'India'): InvestingOutput {
  const monthly = parseNumField(v.monthlyContribution) || (region === 'India' ? 10_000 : 500);
  const initial = parseNumField(v.currentSavings);
  const rate = parseNumField(v.annualReturn) / 100 || (region === 'India' ? 0.12 : 0.07);
  const yrs = parseNumField(v.years) || 20;
  const fmt = (n: number) => formatCurrency(n, region);

  const { finalValue, totalContributed, gain } = calcInvestingProjection(monthly, initial, rate, yrs);

  const multiplier = totalContributed > 0 ? finalValue / totalContributed : 1;

  const recommendation =
    multiplier >= 3
      ? `${fmt(monthly)}/month for ${yrs} years grows to ${fmt(finalValue)} — ${multiplier.toFixed(1)}× your money at ${(rate * 100).toFixed(0)}% annual return.`
      : `${fmt(monthly)}/month for ${yrs} years grows to ${fmt(finalValue)}. Consider increasing contributions or extending the horizon to build more wealth.`;

  const nextStep = region === 'India'
    ? `Start or increase your SIP by ${fmt(monthly)}/month today. Diversify across equity mutual funds (index funds + ELSS) for long-term growth.`
    : `Automate ${fmt(monthly)}/month to a low-cost index fund (e.g. VTSAX or SPY). Max out your 401(k) match first, then IRA.`;

  return { finalValue, totalContributed, gain, years: yrs, monthlyContribution: monthly, recommendation, nextStep };
}

function InvestingRefinementForm({ onSubmit, region = 'US' }: { onSubmit: (v: InvestingFormValues) => void; region?: 'US' | 'India' }) {
  const [values, setValues] = useState<InvestingFormValues>(EMPTY_INV_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof InvestingFormValues, string>>>({});
  const set = <K extends keyof InvestingFormValues>(f: K, val: InvestingFormValues[K]) =>
    setValues((p) => ({ ...p, [f]: val }));

  const validate = () => {
    const errs: Partial<Record<keyof InvestingFormValues, string>> = {};
    if (!values.monthlyContribution || parseNumField(values.monthlyContribution) <= 0) errs.monthlyContribution = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const isIndia = region === 'India';
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Project your investment growth</p>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">See exactly how your investments grow over time with compound returns.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(values); }} className="space-y-3">
        <MoneyField id="inv-monthly" label={isIndia ? 'Monthly SIP / investment' : 'Monthly investment amount'} required
          value={values.monthlyContribution} onChange={(v) => set('monthlyContribution', v)}
          placeholder={isIndia ? '10000' : '500'} error={errors.monthlyContribution} region={region} />
        <MoneyField id="inv-existing" label={isIndia ? 'Existing portfolio / savings (optional)' : 'Current savings / portfolio (optional)'}
          value={values.currentSavings} onChange={(v) => set('currentSavings', v)}
          placeholder={isIndia ? '200000' : '10000'} region={region} />
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Expected annual return (%)</label>
          <input type="number" min="0" max="50" step="0.5" placeholder={isIndia ? '12' : '7'}
            value={values.annualReturn} onChange={(e) => set('annualReturn', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
          <p className="mt-0.5 text-[11px] text-slate-400">{isIndia ? 'Nifty 50 avg ~12% CAGR; conservative: 8–10%' : 'S&P 500 historical avg ~7%; conservative: 5–6%'}</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Investment horizon (years)</label>
          <input type="number" min="1" max="50" placeholder="20"
            value={values.years} onChange={(e) => set('years', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
        </div>
        <button type="submit" className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
          Project growth →
        </button>
      </form>
    </div>
  );
}

function InvestingFinalOutput({ output, region = 'US', onRedo }: { output: InvestingOutput; region?: 'US' | 'India'; onRedo: () => void }) {
  const fmt = (n: number) => formatCurrency(n, region);
  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Recommendation</h3>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/40 dark:bg-emerald-950/20">
          <p className="text-sm font-medium leading-relaxed text-slate-900 dark:text-slate-100">{output.recommendation}</p>
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Key numbers</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Projected value', value: fmt(output.finalValue) },
            { label: 'Total contributed', value: fmt(output.totalContributed) },
            { label: 'Investment gains', value: fmt(output.gain) },
            { label: 'Investment horizon', value: `${output.years} years` },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{m.label}</p>
              <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{m.value}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-100">Best next step</h3>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-700/50 dark:bg-blue-950/20 dark:text-blue-200">
          {output.nextStep}
        </div>
      </section>
      <button type="button" onClick={onRedo} className="text-xs text-slate-400 underline hover:text-blue-600 dark:hover:text-blue-400">
        ← Update inputs
      </button>
    </div>
  );
}

function InvestingFlow({ result, region = 'US' }: { result: PipelineResult; region?: 'US' | 'India' }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState<InvestingFormValues | null>(null);
  const output = submitted ? computeInvesting(submitted, region) : null;

  if (output) return <InvestingFinalOutput output={output} region={region} onRedo={() => setSubmitted(null)} />;

  return (
    <div className="space-y-5">
      <RecommendationSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <KeyNumbersSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <RisksSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <NextStepsSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      {showForm ? (
        <InvestingRefinementForm region={region} onSubmit={(v) => { setSubmitted(v); setShowForm(false); }} />
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Project your portfolio growth</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {region === 'India' ? 'Enter your SIP amount and horizon to see your projected corpus.' : 'Enter your monthly contribution and horizon to see projected portfolio value.'}
          </p>
          <button type="button" onClick={() => setShowForm(true)} className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
            Enter my numbers →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Generic result view (for intents without a dedicated flow) ───────────────

function GenericResultView({ result }: { result: PipelineResult }) {
  return (
    <div className="space-y-5">
      <RecommendationSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <KeyNumbersSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <KeyFindingsSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <RisksSection result={result} />
      <hr className="border-slate-100 dark:border-slate-700/60" />
      <NextStepsSection result={result} />
    </div>
  );
}

// ─── Inline input form ────────────────────────────────────────────────────────

/** Imperative handle exposed via forwardRef so suggestion cards can trigger auto-submit. */
interface PanelInputHandle {
  /** Populate the input with text and immediately run the analysis. */
  triggerSubmit: (text: string) => void;
  /** Populate the input with text and focus it without submitting. */
  prefill: (text: string) => void;
}

const PanelInputForm = forwardRef<PanelInputHandle, object>(function PanelInputFormInner(_, ref) {
  const pathname = usePathname();
  const { state, dispatch } = useCopilot();
  const [query, setQuery] = useState(state.activeQuestion ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync region from pathname
  const pathRegion: 'US' | 'India' =
    pathname === '/in' || pathname.startsWith('/in/') ? 'India' : 'US';
  useEffect(() => {
    if (pathRegion !== state.region) {
      dispatch({ type: 'SET_REGION', payload: pathRegion });
    }
  }, [pathRegion, state.region, dispatch]);

  // When the panel first opens: sync any prefill question and focus the input.
  // We capture the initial values as refs so the focus effect only runs on mount.
  const initialQuestion = useRef(state.activeQuestion);
  const initialHasResult = useRef(!!state.activeResult);
  const initialPendingAutoSubmit = useRef(state.pendingAutoSubmit);
  useEffect(() => {
    if (initialQuestion.current && !initialHasResult.current) {
      setQuery(initialQuestion.current);
    }
    // Auto-submit immediately when opened from a decision card on the page.
    // Early return skips the manual focus step — the submit handler drives UX from here.
    if (initialPendingAutoSubmit.current && initialQuestion.current) {
      dispatch({ type: 'CLEAR_PENDING_AUTO_SUBMIT' });
      void handleSubmitRef.current(initialQuestion.current);
      return; // Skip focus — the loading state and result render will take over
    }
    // Focus after the component paints using rAF so the element is definitely in the DOM.
    const raf = requestAnimationFrame(() => { inputRef.current?.focus(); });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally runs once on mount only — initial values captured via refs above.

  // Sync prefill question when OPEN_DRAWER is dispatched while the panel is already
  // mounted (e.g. clicking a prompt in DrawerEmptyState or an AskAIButton while open).
  // Only fires in input mode (activeResult === null) to avoid overwriting the query
  // after a successful submission when OPEN_PANEL sets activeQuestion to the submitted text.
  useEffect(() => {
    if (state.activeResult === null && state.activeQuestion) {
      setQuery(state.activeQuestion);
      const raf = requestAnimationFrame(() => { inputRef.current?.focus(); });
      return () => cancelAnimationFrame(raf);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeQuestion]);

  const handleSubmit = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/money-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          responseMode: 'deep',
          region: state.region,
          mode: 'custom',
          context: serializeAiPageContext(state.activePageContext),
          pageContext: state.activePageContext ?? undefined,
          inputs: state.activePageContext?.calculatorState ?? {},
          scenarios: [],
        }),
      });

      if (!res.ok) throw new Error(`Analysis failed (${res.status})`);

      let copilotResponse: CopilotResponse | null = null;
      const contentType = res.headers.get('content-type') ?? '';

      if (contentType.includes('text/event-stream')) {
        if (!res.body) throw new Error('Response body is empty');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') break;
            try {
              const ev = JSON.parse(raw) as { type: string; payload?: CopilotResponse };
              if ((ev.type === 'narrative' || ev.type === 'base') && ev.payload) {
                copilotResponse = ev.payload;
              }
            } catch { /* ignore parse errors */ }
          }
        }
      } else {
        copilotResponse = await res.json() as CopilotResponse;
      }

      if (!copilotResponse) throw new Error('No response received from analysis engine');

      const pipelineResult = runPipeline(
        q, copilotResponse, state.region, state.riskProfile, state.sessionId, state.history,
      );

      const historyEntry: ReasoningHistoryEntry = {
        id: pipelineResult.requestId,
        question: q,
        intent: pipelineResult.step1_intent,
        result: pipelineResult,
        timestamp: pipelineResult.timestamp,
      };
      dispatch({ type: 'ADD_HISTORY_ENTRY', payload: historyEntry });
      dispatch({ type: 'OPEN_PANEL', payload: { question: q, result: pipelineResult } });
      setQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, state, dispatch]);

  // Always-current ref to handleSubmit so the imperative handle never goes stale.
  const handleSubmitRef = useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;

  // Expose triggerSubmit / prefill so callers can drive the input imperatively.
  useImperativeHandle(ref, () => ({
    triggerSubmit: (text: string) => {
      setQuery(text);
      void handleSubmitRef.current(text);
    },
    prefill: (text: string) => {
      setQuery(text);
      requestAnimationFrame(() => { inputRef.current?.focus(); });
    },
  }), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); void handleSubmit(query); }
    if (e.key === 'Escape') { setQuery(''); inputRef.current?.blur(); }
  }, [query, handleSubmit]);

  return (
    <div className="shrink-0 border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="What are you deciding?"
            disabled={isLoading}
            aria-label="What financial decision are you trying to make?"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-700"
          />
          {error && (
            <span role="alert" className="absolute -bottom-5 left-0 whitespace-nowrap text-[10px] text-rose-600 dark:text-rose-400">
              {error}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => void handleSubmit(query)}
          disabled={isLoading || query.trim().length === 0}
          aria-label="Run analysis"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          <span>{isLoading ? 'Analyzing…' : 'Ask'}</span>
        </button>
      </div>
    </div>
  );
});

// ─── Next actions bar (shown after every response) ───────────────────────────

function NextActionsBar({
  question,
  onPrefill,
  onNewDecision,
}: {
  question: string;
  onPrefill: (text: string) => void;
  onNewDecision: () => void;
}) {
  const ACTIONS = [
    { label: '🔢 Refine with my numbers', text: `Refine with my specific numbers: ${question}` },
    { label: '⚖️ Compare options', text: `Compare the options for: ${question}` },
    { label: '📊 Run full analysis', text: `Run a full analysis for: ${question}` },
  ];

  return (
    <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-700/60">
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Next actions</p>
      <div className="flex flex-col gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => onPrefill(a.text)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
          >
            {a.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onNewDecision}
          className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-left text-xs font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-blue-700/50 dark:bg-blue-950/20 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
        >
          🆕 Start new decision
        </button>
      </div>
    </div>
  );
}

// ─── Compact decision cards (shown below response so suggestions stay visible) ─

function CompactDecisionCards({ onSuggestionClick, region = 'US' }: { onSuggestionClick: (question: string) => void; region?: 'US' | 'India' }) {
  const cards = region === 'India' ? DECISION_CARDS_INDIA : DECISION_CARDS_US;
  return (
    <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-700/60">
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Try these</p>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => onSuggestionClick(card.question)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
          >
            <span className="text-lg leading-none">{card.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{card.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{card.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Empty input state ────────────────────────────────────────────────────────

function DrawerEmptyState({
  history,
  dispatch,
  onSuggestionClick,
  region = 'US',
  pageContext,
}: {
  history: ReturnType<typeof useCopilot>['state']['history'];
  dispatch: ReturnType<typeof useCopilot>['dispatch'];
  onSuggestionClick?: (question: string) => void;
  region?: 'US' | 'India';
  pageContext?: ReturnType<typeof useCopilot>['state']['activePageContext'];
}) {
  const decisionCards = region === 'India' ? DECISION_CARDS_INDIA : DECISION_CARDS_US;
  const suggestedPrompts = pageContext?.suggestedPrompts ?? [];
  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      {/* Icon + subtitle */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">What are you deciding?</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Pick a topic below or type your situation to get an instant recommendation.
        </p>
        {pageContext?.groundingMessage ? (
          <p className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-300">Context loaded: {pageContext.groundingMessage}</p>
        ) : null}
      </div>

      {suggestedPrompts.length > 0 && (
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Page suggestions</p>
          <div className="flex flex-col gap-2">
            {suggestedPrompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSuggestionClick?.(prompt)}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-left text-xs font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-700/50 dark:bg-blue-950/30 dark:text-blue-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* You'll get */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-800/30 dark:bg-blue-950/20">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">You&apos;ll get</p>
        <ul className="space-y-1.5">
          {[
            { icon: '✅', text: 'A clear recommendation' },
            { icon: '💡', text: 'Why it makes sense for you' },
            { icon: '⚠️', text: 'Risks to watch out for' },
            { icon: '→', text: 'What to do next' },
          ].map(({ icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
              <span className="shrink-0">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Decision category cards */}
      <div>
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Start a decision</p>
        <div className="flex flex-col gap-2">
          {decisionCards.map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => {
                if (onSuggestionClick) {
                  onSuggestionClick(card.question);
                } else {
                  dispatch({ type: 'OPEN_DRAWER', payload: { prefillQuestion: card.question, pageContext: pageContext ?? undefined } });
                }
              }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
            >
              <span className="text-xl leading-none">{card.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{card.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent decisions */}
      {history.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Recent decisions</p>
          <div className="flex flex-col gap-1.5">
            {history.slice(0, 3).map((entry) => {
              const typeLabel =
                INTENT_TYPE_LABEL[entry.result.step1_intent.type] ?? entry.result.step1_intent.category;
              const summary = entry.result.step3_analysis.recommendation;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() =>
                    dispatch({ type: 'OPEN_PANEL', payload: { question: entry.question, result: entry.result } })
                  }
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      {typeLabel}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {entry.question}
                  </p>
                  {summary && (
                    <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">{summary}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panel Root ───────────────────────────────────────────────────────────────

/**
 * Right-side execution panel.
 *
 * Slides in from the right when `state.isExecutionPanelOpen` is true.
 * Shows an inline input form at the top for new questions, and the
 * 5-step pipeline output below when a result is available.
 */
export function ExecutionPanel() {
  const { state, dispatch } = useCopilot();
  const { isExecutionPanelOpen, activeResult, activeQuestion, history, region, activePageContext } = state;
  const formRef = useRef<PanelInputHandle | null>(null);

  if (!isExecutionPanelOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="complementary"
        aria-label="AI Decision Assistant"
        className="fixed right-0 top-0 z-50 flex h-full w-[min(420px,100vw)] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-sm font-bold text-white">AI Decision Assistant</p>
          </div>
          <div className="flex items-center gap-2">
            {activeResult && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'OPEN_DRAWER', payload: { pageContext: activePageContext ?? undefined } })}
                className="rounded-md px-2 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/30 transition hover:bg-white/10 hover:text-white"
              >
                New decision
              </button>
            )}
            <button
              onClick={() => dispatch({ type: 'CLOSE_PANEL' })}
              aria-label="Close AI assistant"
              className="rounded-md p-1 text-white/70 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Inline input form — always visible */}
        <PanelInputForm ref={formRef} />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {activeResult ? (
            <>
              {/* Active question label */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-1.5 text-[10px] text-slate-400 dark:border-slate-700/60 dark:bg-slate-800/40">
                <span className="line-clamp-1 italic">&ldquo;{activeQuestion}&rdquo;</span>
                <span className="shrink-0">{new Date(activeResult.timestamp).toLocaleTimeString()}</span>
              </div>

              {/* Consumer-friendly result output */}
              <div className="px-5 py-4">
                {activeResult.step1_intent.type === 'home-affordability' ? (
                  <HomeAffordabilityFlow key={activeResult.requestId} result={activeResult} region={region ?? 'US'} />
                ) : activeResult.step1_intent.type === 'job-offer' || activeResult.step1_intent.type === 'relocation' ? (
                  <JobOfferFlow key={activeResult.requestId} result={activeResult} region={region ?? 'US'} />
                ) : activeResult.step1_intent.type === 'debt-payoff' ? (
                  <DebtPayoffFlow key={activeResult.requestId} result={activeResult} region={region ?? 'US'} />
                ) : activeResult.step1_intent.type === 'roth-vs-traditional' ? (
                  <InvestingFlow key={activeResult.requestId} result={activeResult} region={region ?? 'US'} />
                ) : (
                  <GenericResultView key={activeResult.requestId} result={activeResult} />
                )}
              </div>

              {/* Next actions — lets users continue without a refresh */}
              <NextActionsBar
                question={activeQuestion ?? ''}
                onPrefill={(text) => formRef.current?.prefill(text)}
                onNewDecision={() => dispatch({ type: 'OPEN_DRAWER', payload: { pageContext: activePageContext ?? undefined } })}
              />

              {/* Decision cards — always visible so users can explore other topics */}
              <CompactDecisionCards
                onSuggestionClick={(q) => formRef.current?.triggerSubmit(q)}
                region={region ?? 'US'}
              />

              {/* History breadcrumb */}
              {history.length > 1 && (
                <div className="shrink-0 border-t border-slate-100 px-5 py-3 dark:border-slate-700">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Recent decisions ({history.length})
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {history.slice(0, 4).map((entry) => {
                      const typeLabel =
                        INTENT_TYPE_LABEL[entry.result.step1_intent.type] ?? entry.result.step1_intent.category;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() =>
                            dispatch({ type: 'OPEN_PANEL', payload: { question: entry.question, result: entry.result } })
                          }
                          className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                              {typeLabel}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-600 dark:text-slate-400">
                            {entry.question}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <DrawerEmptyState
              history={history}
              dispatch={dispatch}
              region={region ?? 'US'}
              pageContext={activePageContext}
              onSuggestionClick={(q) => formRef.current?.triggerSubmit(q)}
            />
          )}
        </div>

        {/* Footer: disclaimer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-3 dark:border-slate-700">
          <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            Educational decision-support only. Not financial, tax, or legal advice. All projections use estimates and stated assumptions.
          </p>
        </div>
      </aside>
    </>
  );
}
