type FailureScenario = {
  label: string;
  what: string;
  consequence: string;
  saferMove?: string;
};

type FailureScenarioPanelProps = {
  heading?: string;
  intro?: string;
  scenarios: FailureScenario[];
  className?: string;
};

/**
 * FailureScenarioPanel — reusable "where this breaks" section for US and India
 * pages. Shows real-life situations where a plan or strategy fails, what the
 * consequence is, and optionally a safer move.
 *
 * Use for calculator pages, comparison pages, hub pages, and articles where
 * the failure surface is specific enough to be genuinely useful. Keep each
 * scenario grounded in a concrete income/expense trigger — not abstract risk.
 */
export function FailureScenarioPanel({
  heading = 'Where this plan breaks in real life',
  intro,
  scenarios,
  className = ''
}: FailureScenarioPanelProps) {
  return (
    <section className={`rounded-2xl border border-rose-100 bg-rose-50/60 p-5 dark:border-rose-900/40 dark:bg-rose-950/20 ${className}`}>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{heading}</h2>
      {intro ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{intro}</p>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {scenarios.map((scenario) => (
          <article
            key={scenario.label}
            className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-800/40 dark:bg-slate-900"
          >
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">{scenario.label}</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{scenario.what}</p>
            {scenario.consequence ? (
              <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400">{scenario.consequence}</p>
            ) : null}
            {scenario.saferMove ? (
              <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                ↳ {scenario.saferMove}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
