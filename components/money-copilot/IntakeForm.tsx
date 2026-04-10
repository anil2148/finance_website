'use client';

import { useState } from 'react';
import type { CopilotRequest, DecisionMode } from '@/lib/money-copilot/types';

const CHIP_MODE_MAP: Record<string, DecisionMode> = {
  'Job change': 'job-offer',
  'Rent vs Buy': 'home-affordability',
  'Debt payoff': 'debt-payoff',
  'Save vs Invest': 'emergency-fund',
  'Retirement planning': 'roth-vs-traditional'
};

interface IntakeFormProps {
  onSubmit: (request: CopilotRequest) => void;
  isLoading: boolean;
  initialQuestion?: string;
}

export function IntakeForm({ onSubmit, isLoading, initialQuestion = '' }: IntakeFormProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [context, setContext] = useState('');
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [error, setError] = useState('');

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
    const mode: DecisionMode = (selectedChip ? CHIP_MODE_MAP[selectedChip] : undefined) ?? inferMode(question);
    onSubmit({ mode, question: question.trim(), context: context.trim() || undefined, inputs: {}, scenarios: [] });
  };

  return (
    <form id="copilot-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Main question input */}
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

      {/* Optional context textarea */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/90 md:p-6">
        <label htmlFor="copilot-context" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Add your financial details{' '}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="copilot-context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
          placeholder="Example: I earn 120k, rent is 2500, have 10k savings, 15k debt"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800"
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Write in plain language — AI will extract what it needs automatically.
        </p>
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

