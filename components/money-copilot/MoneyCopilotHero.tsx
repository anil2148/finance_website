interface MoneyCopilotHeroProps {
  onSelectChip: (chip: string) => void;
}

const SMART_CHIPS = [
  { label: 'Job offer', question: 'I have a job offer — should I take it?' },
  { label: 'Buying a home', question: 'Can I afford to buy a home right now?' },
  { label: 'Credit card', question: 'Which credit card is right for my spending?' },
  { label: 'Debt payoff', question: 'What is the fastest way to pay off my debt?' },
  { label: 'Investing', question: 'How should I start investing my money?' },
];

export function MoneyCopilotHero({ onSelectChip }: MoneyCopilotHeroProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="mb-6 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          AI Decision Assistant
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          Get a clear recommendation on your next financial decision
        </p>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          No account required · No data stored · All calculations happen in real time
        </p>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Start a decision</p>
        <div className="flex flex-wrap gap-2">
          {SMART_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onSelectChip(chip.question)}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
