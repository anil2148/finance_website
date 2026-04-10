import { getStarterPrompts } from '@/lib/money-copilot/prompts';

interface MoneyCopilotHeroProps {
  onSelectPrompt: (prompt: string) => void;
}

export function MoneyCopilotHero({ onSelectPrompt }: MoneyCopilotHeroProps) {
  const prompts = getStarterPrompts();

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-8 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-950/50">
          <span className="text-sm">✦</span>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Rule-based financial analysis</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl lg:text-4xl">
          AI Money Copilot for real&#8209;life money decisions
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
          Enter your income, expenses, and the decision you are facing. Get a structured breakdown of tradeoffs,
          risks, and next steps — based on your actual numbers, not generic advice.
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
          No account required. No data stored. All calculations happen in real time.
        </p>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Common questions to start with</p>
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-blue-400 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
