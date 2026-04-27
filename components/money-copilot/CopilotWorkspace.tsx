'use client';

import { useMemo, useState } from 'react';
import { useCopilot } from '@/components/money-copilot/CopilotProvider';
import { useAiPageContext } from '@/components/money-copilot/useAiPageContext';
import { getRegion, regionDefaults } from '@/lib/region';
import type { CopilotResponse, ReasoningHistoryEntry } from '@/lib/money-copilot/types';

const DECISION_CARDS = [
  { key: 'job', label: 'Job offer', emoji: '💼', description: 'Compare offers or evaluate a raise', question: 'I have a job offer — should I take it?' },
  { key: 'home', label: 'Buying a home', emoji: '🏠', description: 'Estimate what you can afford', question: 'Can I afford to buy a home right now?' },
  { key: 'credit', label: 'Credit card', emoji: '💳', description: 'Find the right card for your spending', question: 'Which credit card is right for my spending?' },
  { key: 'debt', label: 'Debt payoff', emoji: '📉', description: 'Find the fastest way out of debt', question: 'What is the fastest way to pay off my debt?' },
  { key: 'invest', label: 'Investing', emoji: '📈', description: 'Plan your investment strategy', question: 'How should I start investing my money?' }
] as const;

function DecisionCard({ entry }: { entry: ReasoningHistoryEntry }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.question}</p>
      <p className="mt-2 text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString()}</p>
    </article>
  );
}

export function CopilotWorkspace() {
  const { state, dispatch } = useCopilot();
  const { history } = state;
  const pageContext = useAiPageContext({ pageType: 'decision-workspace', intent: 'financial-decision-triage', aiMode: 'contextual' });

  const region = getRegion();
  const defaults = useMemo(() => regionDefaults(region), [region]);
  const [selectedCategory, setSelectedCategory] = useState<(typeof DECISION_CARDS)[number] | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseText, setResponseText] = useState('');

  const onSelectCategory = (card: (typeof DECISION_CARDS)[number]) => {
    setSelectedCategory(card);
    setResponseText('');
    setError('');
    setPrompt(`${defaults.promptPrefix} ${card.question} My salary is ${defaults.salary}, monthly debt is ${defaults.monthlyDebt}, and my target emergency fund is ${defaults.emergencyFundMonths} months.`);
  };

  const submitPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResponseText('');

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'custom',
          question: prompt.trim(),
          region: region === 'in' ? 'India' : 'US',
          pageContext
        })
      });

      if (!res.ok) throw new Error('Failed to fetch response');

      const contentType = res.headers.get('content-type') ?? '';
      const canStream = typeof ReadableStream !== 'undefined' && !!res.body && !contentType.includes('application/json');

      if (canStream) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let streamed = '';

        while (!done) {
          const chunk = await reader.read();
          done = chunk.done;
          if (chunk.value) {
            streamed += decoder.decode(chunk.value, { stream: !done });
            setResponseText(streamed);
          }
        }
      } else {
        const data = (await res.json()) as CopilotResponse;
        setResponseText(data.recommendation ?? data.summary ?? 'Response received.');
      }
    } catch {
      setError('Could not fetch AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">AI Decision Assistant</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Pick a category, refine your prompt, and get a recommendation.</p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {DECISION_CARDS.map((card) => (
            <button
              key={card.key}
              type="button"
              onClick={() => onSelectCategory(card)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="text-2xl">{card.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{card.label}</p>
                <p className="text-xs text-slate-500">{card.description}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedCategory ? (
          <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected: {selectedCategory.label}</p>
            <textarea
              rows={5}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={submitPrompt}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {loading ? 'Generating…' : 'Get recommendation'}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'OPEN_DRAWER', payload: { prefillQuestion: prompt, pageContext } })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
              >
                Open full copilot
              </button>
            </div>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            {responseText ? <pre className="whitespace-pre-wrap rounded-xl bg-white p-3 text-sm dark:bg-slate-900">{responseText}</pre> : null}
          </div>
        ) : null}
      </div>

      {history.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your decisions</h2>
          {history.map((entry) => (
            <DecisionCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
