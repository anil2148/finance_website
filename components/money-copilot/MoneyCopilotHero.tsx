interface MoneyCopilotHeroProps {
  onSelectChip: (chip: string) => void;
}

const SMART_CHIPS = ['Job Decision', 'Home Buying', 'Debt Strategy', 'Retirement'];

export function MoneyCopilotHero({ onSelectChip }: MoneyCopilotHeroProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 md:p-10 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="mb-6 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-950/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">AI-powered decision analysis</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          AI Money Copilot
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          Make better financial decisions in seconds
        </p>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          No account required · No data stored · All calculations happen in real time
        </p>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">I&apos;m thinking about…</p>
        <div className="flex flex-wrap gap-2">
          {SMART_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onSelectChip(chip)}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
