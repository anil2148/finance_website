type RealLifeContradictionModuleProps = {
  title?: string;
  mathWinner: string;
  realLifeChoice: string;
  reason: string;
  resolution?: string;
};

/**
 * RealLifeContradictionModule — renders the "mathematically X wins; in real
 * life many people choose Y because…" pattern for US pages and any page not
 * using IndiaArticleRenderer. Mirrors the 'contradiction' section type in
 * IndiaArticleRenderer with consistent styling.
 *
 * Use once per page where there is a genuine tension between what the numbers
 * say and what most people actually do. Keep the tone calm and non-judgmental.
 */
export function RealLifeContradictionModule({
  title,
  mathWinner,
  realLifeChoice,
  reason,
  resolution
}: RealLifeContradictionModuleProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/70">
      {title ? (
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      ) : null}
      <div className={`space-y-3 text-sm ${title ? 'mt-3' : ''}`}>
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-500/40 dark:bg-blue-500/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            What the math says
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{mathWinner}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/40 dark:bg-amber-500/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            In real life
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{realLifeChoice}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Why this gap exists
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{reason}</p>
          {resolution ? (
            <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">{resolution}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
