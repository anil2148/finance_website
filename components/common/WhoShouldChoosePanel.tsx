type WhoShouldChooseRow = {
  profile: string;
  choice: string;
  why: string;
  avoid?: string;
};

type WhoShouldChoosePanelProps = {
  heading?: string;
  intro?: string;
  rows: WhoShouldChooseRow[];
  className?: string;
};

/**
 * WhoShouldChoosePanel — reusable "who should choose what / who should avoid
 * this" framework block. Use on comparison pages and major decision pages to
 * replace or supplement generic "pros and cons" lists with profile-based
 * guidance. Keep each profile concise and grounded in a real household
 * situation — not a marketing persona.
 */
export function WhoShouldChoosePanel({
  heading = 'Who should choose what',
  intro,
  rows,
  className = ''
}: WhoShouldChoosePanelProps) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 ${className}`}>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{heading}</h2>
      {intro ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{intro}</p>
      ) : null}
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <article
            key={row.profile}
            className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                {row.profile}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.choice}</p>
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{row.why}</p>
            {row.avoid ? (
              <p className="mt-2 text-sm text-rose-700 dark:text-rose-400">
                <span className="font-medium">Avoid if:</span> {row.avoid}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
