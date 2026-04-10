'use client';

import { useState } from 'react';
import type { CopilotRequest, DecisionMode } from '@/lib/money-copilot/types';
import { detectIntent, intentToDecisionMode } from '@/lib/money-copilot/intent';

const CHIP_MODE_MAP: Record<string, DecisionMode> = {
  'Job Decision': 'job-offer',
  'Home Buying': 'home-affordability',
  'Debt Strategy': 'debt-payoff',
  'Retirement': 'roth-vs-traditional'
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
    const intent = detectIntent(q);
    return (intentToDecisionMode(intent) as DecisionMode) ?? 'custom';
  };

  const handleChipClick = (chip: string) => {
    const chipQuestions: Record<string, string> = {
      'Job Decision': 'Should I take this new job offer?',
      'Home Buying': 'Can I afford a $500k house?',
      'Debt Strategy': 'Should I pay off debt or invest?',
      'Retirement': 'Am I on track for retirement? Roth vs Traditional?'
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
          placeholder="e.g. Should I take a $120k job in NJ or $100k in NC?"
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
          placeholder="I earn 120k, rent 2500, savings 10k, debt 15k"
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

