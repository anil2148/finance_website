'use client';

import { useState } from 'react';
import type { CopilotRequest, DecisionMode, FinancialInputs } from '@/lib/money-copilot/types';

const CHIP_MODE_MAP: Record<string, DecisionMode> = {
  'Job change': 'job-offer',
  'Rent vs Buy': 'home-affordability',
  'Debt payoff': 'debt-payoff',
  'Save vs Invest': 'emergency-fund',
  'Retirement planning': 'roth-vs-traditional'
};

function emptyInputs(): FinancialInputs {
  return {};
}

interface IntakeFormProps {
  onSubmit: (request: CopilotRequest) => void;
  isLoading: boolean;
  initialQuestion?: string;
}

export function IntakeForm({ onSubmit, isLoading, initialQuestion = '' }: IntakeFormProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [inputs, setInputs] = useState<FinancialInputs>(emptyInputs());
  const [error, setError] = useState('');

  const updateInput = (key: keyof FinancialInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value === '' ? undefined : parseFloat(value) }));
  };

  const inferMode = (q: string): DecisionMode => {
    const lower = q.toLowerCase();
    if (lower.includes('job') || lower.includes('offer') || lower.includes('salary') || lower.includes('compensation')) return 'job-offer';
    if (lower.includes('rent') || lower.includes('buy') || lower.includes('home') || lower.includes('house') || lower.includes('mortgage')) return 'home-affordability';
    if (lower.includes('debt') || lower.includes('loan') || lower.includes('payoff') || lower.includes('credit')) return 'debt-payoff';
    if (lower.includes('retire') || lower.includes('roth') || lower.includes('401k') || lower.includes('ira')) return 'roth-vs-traditional';
    if (lower.includes('emergency') || lower.includes('fund')) return 'emergency-fund';
    if (lower.includes('budget') || lower.includes('stress')) return 'budget-stress-test';
    if (lower.includes('reloc') || lower.includes('mov') || lower.includes('state')) return 'relocation';
    return 'custom';
  };

  const handleChipClick = (chip: string) => {
    const chipQuestions: Record<string, string> = {
      'Job change': 'Should I take this new job offer?',
      'Rent vs Buy': 'Should I rent or buy a home right now?',
      'Debt payoff': 'Should I pay off my debt or invest?',
      'Save vs Invest': 'Should I save in a HYSA or invest in the market?',
      'Retirement planning': 'Am I on track for retirement? Roth vs Traditional?'
    };
    setQuestion(chipQuestions[chip] ?? chip);
    setSelectedChip(chip);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please describe the financial decision you are trying to make.');
      return;
    }
    setError('');
    // Use chip-mapped mode when the question came from a chip click; otherwise infer from text
    const mode: DecisionMode = (selectedChip ? CHIP_MODE_MAP[selectedChip] : undefined) ?? inferMode(question);
    onSubmit({ mode, question: question.trim(), inputs, scenarios: [] });
  };

  return (
    <form id="copilot-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Main input */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/90 md:p-6">
        <label htmlFor="copilot-question" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          What financial decision are you trying to make?
        </label>
        <textarea
          id="copilot-question"
          value={question}
          onChange={(e) => { setQuestion(e.target.value); setSelectedChip(null); setError(''); }}
          rows={3}
          placeholder="e.g. I got a job offer in Texas for $120k vs staying in NYC for $145k — which is better financially?"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800"
        />
        {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}

        {/* Smart chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.keys(CHIP_MODE_MAP).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Optional details (collapsible) */}
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/90">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 md:px-6"
          aria-expanded={showDetails}
        >
          <span>Optional details <span className="ml-1 font-normal text-slate-400">(improves accuracy)</span></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-slate-400 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetails && (
          <div className="border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-700 md:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput
                label="Annual income ($)"
                placeholder="e.g. 95000"
                onChange={(v) => updateInput('annualSalary', v)}
              />
              <NumberInput
                label="Monthly expenses ($)"
                placeholder="e.g. 3500"
                onChange={(v) => updateInput('monthlyRent', v)}
              />
              <NumberInput
                label="Total monthly debt ($)"
                placeholder="e.g. 800"
                onChange={(v) => updateInput('debtPayments', v)}
              />
              <NumberInput
                label="Savings / cash on hand ($)"
                placeholder="e.g. 20000"
                onChange={(v) => updateInput('cashOnHand', v)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analyze button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Analyzing…
          </span>
        ) : (
          'Analyze'
        )}
      </button>
    </form>
  );
}

function NumberInput({
  label,
  placeholder,
  onChange
}: {
  label: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
      <input
        type="number"
        min="0"
        step="any"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
      />
    </div>
  );
}

