'use client';

type Props = {
  question: string;
  setQuestion: (value: string) => void;
  answer: string | null;
  loading: boolean;
  error: string | null;
  askAi: () => void;
};

const suggestedQuestions = [
  'Explain this stock in beginner terms',
  'Should I buy now or wait?',
  'What is the biggest risk?',
  'Create bull/base/bear case',
  'Explain valuation risk',
  'Summarize earnings risk',
  'Create a 3-month action plan',
  'What would make this stock a sell?',
];

export function StockAISection({ question, setQuestion, answer, loading, error, askAi }: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6">
      <h3 className="text-xl font-bold">Ask FinanceSphere AI</h3>
      <p className="mt-2 text-sm text-slate-300">Use AI like an investment research assistant. Ask for bull case, bear case, valuation risk, earnings risk, and what to verify next.</p>
      <p className="mt-2 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">Use the assistant to explain the current analysis, not as financial advice.</p>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        className="mt-4 min-h-24 w-full rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none ring-emerald-400 focus:ring-2"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestedQuestions.map((suggestedQuestion) => (
          <button
            key={suggestedQuestion}
            onClick={() => setQuestion(suggestedQuestion)}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
          >
            {suggestedQuestion}
          </button>
        ))}
      </div>
      <button
        onClick={askAi}
        disabled={loading || !question.trim()}
        className="mt-3 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Analyzing...' : 'Ask AI'}
      </button>
      {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
      {answer && <div className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-100">{answer}</div>}
    </div>
  );
}
