'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CopilotResponse, DecisionMode } from '@/lib/money-copilot/types';

interface StartDecisionModalProps {
  open: boolean;
  onClose: () => void;
}

type GoalKey = 'job-offer' | 'home-affordability' | 'debt-payoff' | 'roth-vs-traditional' | 'budget-stress-test' | 'custom';

const GOAL_OPTIONS: Array<{ key: GoalKey; label: string; description: string }> = [
  { key: 'job-offer', label: 'Job / Income Change', description: 'Compare offers, evaluate a raise, or assess W2 vs. contractor.' },
  { key: 'home-affordability', label: 'Home Buying', description: 'Determine what you can afford with your income and existing debt.' },
  { key: 'debt-payoff', label: 'Debt Strategy', description: 'Pay off debt vs. invest — find the best path for your cash.' },
  { key: 'roth-vs-traditional', label: 'Retirement Planning', description: 'Roth vs. traditional 401(k) and retirement contribution strategy.' },
  { key: 'budget-stress-test', label: 'Budget & Cash Flow', description: 'Stress-test your monthly budget and find cash-flow improvements.' },
  { key: 'custom', label: 'Other Decision', description: 'Describe any financial decision and get structured analysis.' }
];

type Step = 'income' | 'goal' | 'scenario' | 'recommendation';

const STEPS: Step[] = ['income', 'goal', 'scenario', 'recommendation'];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 30 } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }
};

function StepIndicator({ current }: { current: Step }) {
  const labels: Record<Step, string> = {
    income: '1. Income',
    goal: '2. Goal',
    scenario: '3. Scenario',
    recommendation: '4. Result'
  };
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      {STEPS.map((step, i) => {
        const idx = STEPS.indexOf(current);
        const done = i < idx;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-1">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                done ? 'bg-emerald-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className={active ? 'text-blue-700 dark:text-blue-300' : done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
              {labels[step]}
            </span>
            {i < STEPS.length - 1 && <span className="text-slate-300 dark:text-slate-600">›</span>}
          </div>
        );
      })}
    </div>
  );
}

export function StartDecisionModal({ open, onClose }: StartDecisionModalProps) {
  const pathname = usePathname();
  const isIndiaContext = pathname === '/in' || pathname.startsWith('/in/');
  const [step, setStep] = useState<Step>('income');

  // Step 1 — income
  const [baseIncome, setBaseIncome] = useState('');
  const [newIncome, setNewIncome] = useState('');
  // India defaults to monthly (CTC); US defaults to annual
  const [incomePeriod, setIncomePeriod] = useState<'annual' | 'monthly'>(isIndiaContext ? 'monthly' : 'annual');

  // Step 2 — goal
  const [goal, setGoal] = useState<GoalKey | null>(null);

  // Step 3 — scenario
  const [scenarioText, setScenarioText] = useState('');

  // Step 4 — result
  const [result, setResult] = useState<CopilotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setStep('income');
    setBaseIncome('');
    setNewIncome('');
    setIncomePeriod('annual');
    setGoal(null);
    setScenarioText('');
    setResult(null);
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Step validations
  const incomeValid = baseIncome.trim() !== '' && !isNaN(Number(baseIncome.replace(/,/g, '')));

  const parseIncome = (val: string) => {
    const n = Number(val.replace(/,/g, ''));
    return isNaN(n) ? undefined : n;
  };

  const handleSubmit = async () => {
    if (!goal || !scenarioText.trim()) return;
    setLoading(true);
    setError('');
    try {
      const baseVal = parseIncome(baseIncome);
      const newVal = parseIncome(newIncome);
      // Always normalise to annual before sending so the backend receives annual values
      const baseAnnual = baseVal !== undefined
        ? (incomePeriod === 'monthly' ? baseVal * 12 : baseVal)
        : undefined;
      const newAnnual = newVal !== undefined
        ? (incomePeriod === 'monthly' ? newVal * 12 : newVal)
        : undefined;
      const inputs = {
        annualSalary: baseAnnual,
        newAnnualSalary: newAnnual,
        incomePeriod: 'annual' as const
      };
      const body = {
        mode: goal as DecisionMode,
        question: scenarioText.trim(),
        inputs,
        scenarios: [],
        region: isIndiaContext ? 'India' : 'US'
      };
      const res = await fetch('/api/money-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Request failed');
      const data = (await res.json()) as CopilotResponse;
      setResult(data);
      setStep('recommendation');
    } catch {
      setError('Something went wrong. Please try again or use the full AI Copilot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Start a Decision"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Start a Decision</h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Guided financial analysis — takes 30 seconds</p>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 dark:border-slate-700 dark:hover:bg-slate-800"
                  aria-label="Close"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Step indicator */}
              <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
                <StepIndicator current={step} />
              </div>

              {/* Step content */}
              <div className="px-5 py-5">
                {/* ─── Step 1: Income ─────────────────────────────── */}
                {step === 'income' && (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">What is your current income?</p>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Baseline income</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={baseIncome}
                          onChange={(e) => setBaseIncome(e.target.value)}
                          placeholder="e.g. 95000"
                          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">New / comparison income <span className="text-slate-400">(optional)</span></label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={newIncome}
                          onChange={(e) => setNewIncome(e.target.value)}
                          placeholder="e.g. 115000"
                          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Income period</label>
                      <div className="flex gap-2">
                        {(['annual', 'monthly'] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setIncomePeriod(p)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                              incomePeriod === p
                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/20 dark:text-blue-300'
                                : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {p === 'annual' ? 'Annual (yearly)' : 'Monthly'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {!incomeValid && baseIncome !== '' && (
                      <p className="text-xs text-red-500">Please enter a valid number for baseline income.</p>
                    )}
                  </div>
                )}

                {/* ─── Step 2: Goal ───────────────────────────────── */}
                {step === 'goal' && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">What kind of decision are you making?</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {GOAL_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setGoal(opt.key)}
                          className={`rounded-xl border p-3 text-left text-xs transition ${
                            goal === opt.key
                              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/20'
                              : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'
                          }`}
                        >
                          <span className="block font-semibold text-slate-800 dark:text-slate-200">{opt.label}</span>
                          <span className="mt-0.5 block text-slate-500 dark:text-slate-400">{opt.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Step 3: Scenario ───────────────────────────── */}
                {step === 'scenario' && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Describe your specific situation</p>
                    <textarea
                      rows={4}
                      value={scenarioText}
                      onChange={(e) => setScenarioText(e.target.value)}
                      placeholder="e.g. I'm considering a job offer in Texas at $115k (no state income tax) vs my current $95k role in New Jersey. Which is better net?"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                  </div>
                )}

                {/* ─── Step 4: Recommendation ─────────────────────── */}
                {step === 'recommendation' && result && (
                  <div className="space-y-4">
                    {/* Decision Summary */}
                    {result.decisionSummary && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Decision Summary</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            Confidence: {result.decisionSummary.confidenceLevel}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
                            Take-home: {result.decisionSummary.monthlyTakeHome}/mo
                          </span>
                          <span className={`rounded-full border px-2.5 py-1 font-semibold ${
                            result.decisionSummary.riskLevel === 'Low'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : result.decisionSummary.riskLevel === 'Medium'
                              ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            Risk: {result.decisionSummary.riskLevel}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Decision Engine */}
                    {result.decisionEngine && (
                      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Analysis</p>
                        <dl className="grid grid-cols-2 gap-2 text-xs">
                          <div><dt className="text-slate-500 dark:text-slate-400">Current Income</dt><dd className="font-semibold text-slate-800 dark:text-slate-200">{result.decisionEngine.currentIncome}</dd></div>
                          <div><dt className="text-slate-500 dark:text-slate-400">New Income</dt><dd className="font-semibold text-slate-800 dark:text-slate-200">{result.decisionEngine.newIncome}</dd></div>
                          <div><dt className="text-slate-500 dark:text-slate-400">Net Change</dt><dd className="font-semibold text-slate-800 dark:text-slate-200">{result.decisionEngine.netChange}</dd></div>
                          <div><dt className="text-slate-500 dark:text-slate-400">Benefits Impact</dt><dd className="font-semibold text-slate-800 dark:text-slate-200">{result.decisionEngine.benefitsImpact}</dd></div>
                          <div><dt className="text-slate-500 dark:text-slate-400">Risk Score</dt><dd className="font-semibold text-slate-800 dark:text-slate-200">{result.decisionEngine.riskScore}/100</dd></div>
                          <div><dt className="text-slate-500 dark:text-slate-400">Confidence</dt><dd className="font-semibold text-slate-800 dark:text-slate-200">{result.decisionEngine.confidenceScore}/100</dd></div>
                        </dl>
                      </div>
                    )}

                    {/* Insight */}
                    {result.insight && (
                      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                        💡 {result.insight}
                      </p>
                    )}

                    {/* Recommendation */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-900/20">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Recommendation</p>
                      <p className="text-xs text-emerald-900 dark:text-emerald-200">{result.recommendation}</p>
                    </div>

                    <Link
                      href="/ai-money-copilot"
                      className="block rounded-xl bg-gradient-to-r from-brand to-blue-600 px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
                      onClick={handleClose}
                    >
                      View Full Analysis in AI Copilot →
                    </Link>
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Analysing your scenario…</p>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              {!loading && step !== 'recommendation' && (
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                  {step !== 'income' ? (
                    <button
                      type="button"
                      onClick={() => setStep(STEPS[STEPS.indexOf(step) - 1])}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      ← Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step === 'scenario' ? (
                    <button
                      type="button"
                      disabled={!scenarioText.trim()}
                      onClick={handleSubmit}
                      className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                    >
                      Get Recommendation →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={step === 'income' ? !incomeValid : step === 'goal' ? goal === null : false}
                      onClick={() => setStep(STEPS[STEPS.indexOf(step) + 1])}
                      className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
                    >
                      Next →
                    </button>
                  )}
                </div>
              )}

              {/* Reset/close after result */}
              {!loading && step === 'recommendation' && (
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    ← Start Over
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
