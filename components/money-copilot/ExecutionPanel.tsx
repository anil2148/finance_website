'use client';

import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { usePathname } from 'next/navigation';
import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import { runPipeline } from '@/lib/money-copilot/pipeline';
import type { CopilotResponse, PipelineResult, ReasoningHistoryEntry } from '@/lib/money-copilot/types';
import { calcHomeAffordability, assessRiskLevel, formatCurrency } from '@/lib/money-copilot/calculators';

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

const DECISION_CARDS = [
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
  const n = parseFloat(s.replace(/[$,\s]/g, ''));
  return isNaN(n) || n < 0 ? 0 : n;
}

function computeHomeAffordability(v: HAFormValues): HAComputedOutput {
  const annualIncome = parseNumField(v.annualIncome);
  const downPayment = parseNumField(v.downPayment);
  const hiDebtPayment = v.hasHighInterestDebt ? parseNumField(v.highInterestDebtPayment) : 0;
  const monthlyDebt = parseNumField(v.monthlyDebt) + hiDebtPayment;
  const emergencyFund = parseNumField(v.emergencyFund);
  const monthlyExpenses = parseNumField(v.monthlyExpenses);

  const { maxHomePrice, monthlyPaymentEstimate } = calcHomeAffordability(annualIncome, downPayment, monthlyDebt);
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
    recommendation = 'Enter your annual gross income above to compute affordability.';
  } else if (riskLevel === 'low') {
    recommendation = `You can comfortably afford a home up to ${formatCurrency(maxHomePrice)} based on your income and current debts.`;
  } else if (riskLevel === 'medium') {
    recommendation = `You may qualify for a home up to ${formatCurrency(maxHomePrice)}, but your finances are stretched. Review the risks below before committing.`;
  } else {
    recommendation = `Home buying at this time carries significant financial risk. Consider stabilizing your finances before purchasing.`;
  }

  // ── Why ──────────────────────────────────────────────────────────────────────
  const why: string[] = [];
  if (annualIncome > 0) {
    why.push(`Maximum affordable home price: ${formatCurrency(maxHomePrice)} (28/36 rule, 7% rate, 30-year term)`);
    why.push(`Estimated monthly payment: ${formatCurrency(monthlyPaymentEstimate)}`);
    why.push(`Housing burden: ${(housingBurdenRatio * 100).toFixed(0)}% of gross income (guideline: ≤28%)`);
    why.push(`Total debt-to-income: ${(fullDtiRatio * 100).toFixed(0)}% including mortgage (guideline: ≤36%)`);
  }
  if (monthlyExpenses > 0) {
    why.push(`Emergency runway: ${emergencyRunwayMonths.toFixed(1)} months of expenses (target: 6+ months)`);
  }
  if (downPayment > 0 && maxHomePrice > 0) {
    const dpPct = (downPayment / maxHomePrice) * 100;
    why.push(
      `Down payment: ${formatCurrency(downPayment)} — ${dpPct.toFixed(0)}% of max home price${dpPct < 20 ? ' (below 20%; PMI likely applies)' : ''}`,
    );
  }

  // ── Risks to watch ───────────────────────────────────────────────────────────
  const risksToWatch: string[] = [];
  if (annualIncome > 0) {
    if (housingBurdenRatio > 0.35) {
      risksToWatch.push('Housing costs exceed 35% of gross income — leaves little room for savings or emergencies');
    } else if (housingBurdenRatio > 0.28) {
      risksToWatch.push('Housing costs are near the 28% guideline — monitor your budget closely');
    }
    if (fullDtiRatio > 0.43) {
      risksToWatch.push('Total debt-to-income exceeds 43% — may not qualify for a conventional mortgage');
    } else if (fullDtiRatio > 0.36) {
      risksToWatch.push('Total debt-to-income exceeds 36% — reducing existing debt first would improve your terms');
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
    risksToWatch.push(
      'High-interest debt (15%+ APR) erodes your net worth faster than a mortgage builds equity — consider paying it down first',
    );
  }
  if (downPayment > 0 && maxHomePrice > 0 && downPayment < maxHomePrice * 0.2) {
    const pmiEst = Math.round((maxHomePrice * 0.005) / 12);
    risksToWatch.push(
      `Down payment is below 20% — expect Private Mortgage Insurance (~${formatCurrency(pmiEst)}/mo until you reach 20% equity)`,
    );
  }

  // ── Best next step ───────────────────────────────────────────────────────────
  let bestNextStep: string;
  if (annualIncome <= 0) {
    bestNextStep = 'Enter your annual gross income to get a personalized next step.';
  } else if (riskLevel === 'low') {
    bestNextStep = `Get pre-approved for a mortgage up to ${formatCurrency(maxHomePrice)} and start working with a real estate agent to find homes in your budget.`;
  } else if (riskLevel === 'medium') {
    if (fullDtiRatio > 0.36) {
      bestNextStep = 'Pay down existing monthly debt to improve your debt-to-income ratio before applying for a mortgage.';
    } else if (emergencyRunwayMonths < 6) {
      bestNextStep = 'Build your emergency fund to at least 6 months of expenses before committing to a home purchase.';
    } else {
      bestNextStep = 'Review your monthly budget carefully and consider a lower-priced home or a larger down payment to reduce financial pressure.';
    }
  } else {
    if (v.hasHighInterestDebt) {
      bestNextStep = 'Prioritize eliminating high-interest debt over the next 12–18 months. Once cleared, reassess your home buying timeline.';
    } else if (emergencyRunwayMonths < 3) {
      bestNextStep = 'Build a 3–6 month emergency fund before taking on a mortgage. Consider renting while you save aggressively.';
    } else {
      bestNextStep = 'Focus on increasing income or reducing monthly obligations for the next 12 months, then revisit home affordability.';
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
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
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

function HomeAffordabilityCompletionForm({ onSubmit }: { onSubmit: (values: HAFormValues) => void }) {
  const [values, setValues] = useState<HAFormValues>(EMPTY_HA_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof HAFormValues, string>>>({});

  const set = <K extends keyof HAFormValues>(field: K, value: HAFormValues[K]) =>
    setValues((v) => ({ ...v, [field]: value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof HAFormValues, string>> = {};
    if (!values.annualIncome || parseNumField(values.annualIncome) <= 0) {
      errs.annualIncome = 'Required — enter your annual gross income';
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
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Complete your analysis</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Provide the details below for an accurate home affordability assessment. These inputs replace assumptions
              with real numbers.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <MoneyField
          id="ha-income"
          label="Annual gross income"
          required
          value={values.annualIncome}
          onChange={(v) => set('annualIncome', v)}
          placeholder="85000"
          hint="Before taxes — use your total salary or combined household income"
          error={errors.annualIncome}
        />

        <MoneyField
          id="ha-down"
          label="Down payment / cash on hand"
          value={values.downPayment}
          onChange={(v) => set('downPayment', v)}
          placeholder="40000"
          hint="Amount you plan to put toward the purchase"
        />

        <MoneyField
          id="ha-debt"
          label="Existing monthly debt payments"
          value={values.monthlyDebt}
          onChange={(v) => set('monthlyDebt', v)}
          placeholder="400"
          hint="Car loans, student loans, minimum credit card payments — not rent"
        />

        <MoneyField
          id="ha-emergency"
          label="Emergency fund (total saved)"
          value={values.emergencyFund}
          onChange={(v) => set('emergencyFund', v)}
          placeholder="15000"
          hint="Total liquid savings set aside for emergencies"
        />

        <MoneyField
          id="ha-expenses"
          label="Monthly essential expenses"
          value={values.monthlyExpenses}
          onChange={(v) => set('monthlyExpenses', v)}
          placeholder="3500"
          hint="Current rent, utilities, groceries, transportation, insurance, etc."
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
                I carry high-interest debt (15%+ APR)
              </span>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Credit cards, personal loans, payday loans, etc.
              </p>
            </div>
          </label>
          {values.hasHighInterestDebt && (
            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
              <MoneyField
                id="ha-hi-debt"
                label="Monthly payment on high-interest debt (optional)"
                value={values.highInterestDebtPayment}
                onChange={(v) => set('highInterestDebtPayment', v)}
                placeholder="300"
                hint="Total minimum + extra payments per month"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Run affordability analysis →
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

function HomeAffordabilityFlow({ result }: { result: PipelineResult }) {
  const [showRefinement, setShowRefinement] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<HAFormValues | null>(null);
  const output = submittedValues ? computeHomeAffordability(submittedValues) : null;

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
          onSubmit={(values) => { setSubmittedValues(values); setShowRefinement(false); }}
        />
      ) : (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700/50 dark:bg-blue-950/20">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Refine with your exact numbers</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            The estimate above uses default assumptions. Enter your income and debt for a precise, personalized affordability calculation.
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

// ─── Inline input form ────────────────────────────────────────────────────────

/** Imperative handle exposed via forwardRef so suggestion cards can trigger auto-submit. */
interface PanelInputHandle {
  /** Populate the input with text and immediately run the analysis. */
  triggerSubmit: (text: string) => void;
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
  useEffect(() => {
    if (initialQuestion.current && !initialHasResult.current) {
      setQuery(initialQuestion.current);
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
          inputs: {},
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

  // Expose triggerSubmit so suggestion cards in DrawerEmptyState can auto-run analysis.
  useImperativeHandle(ref, () => ({
    triggerSubmit: (text: string) => {
      setQuery(text);
      void handleSubmitRef.current(text);
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

// ─── Empty input state ────────────────────────────────────────────────────────

function DrawerEmptyState({
  history,
  dispatch,
  onSuggestionClick,
}: {
  history: ReturnType<typeof useCopilot>['state']['history'];
  dispatch: ReturnType<typeof useCopilot>['dispatch'];
  onSuggestionClick?: (question: string) => void;
}) {
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
          Describe your situation above or pick a topic to get a clear recommendation.
        </p>
      </div>

      {/* Decision category cards */}
      <div>
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Start a decision</p>
        <div className="flex flex-col gap-2">
          {DECISION_CARDS.map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => {
                if (onSuggestionClick) {
                  onSuggestionClick(card.question);
                } else {
                  dispatch({ type: 'OPEN_DRAWER', payload: { prefillQuestion: card.question } });
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
  const { isExecutionPanelOpen, activeResult, activeQuestion, history } = state;
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
                  <HomeAffordabilityFlow key={activeResult.requestId} result={activeResult} />
                ) : (
                  <div className="space-y-5">
                    <RecommendationSection result={activeResult} />
                    <hr className="border-slate-100 dark:border-slate-700/60" />
                    <KeyFindingsSection result={activeResult} />
                    <hr className="border-slate-100 dark:border-slate-700/60" />
                    <RisksSection result={activeResult} />
                    <hr className="border-slate-100 dark:border-slate-700/60" />
                    <NextStepsSection result={activeResult} />
                  </div>
                )}
              </div>

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
