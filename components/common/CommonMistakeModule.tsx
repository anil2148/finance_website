type CommonMistakeModuleProps = {
  heading?: string;
  mistake: string;
  whyItBackfires: string;
  betterAlternative: string;
};

/**
 * CommonMistakeModule — standalone reusable mistake block for US pages and
 * any page not using IndiaArticleRenderer. Renders the common mistake →
 * why it backfires → better alternative pattern with consistent rose styling.
 */
export function CommonMistakeModule({
  heading = 'Common mistake to avoid',
  mistake,
  whyItBackfires,
  betterAlternative
}: CommonMistakeModuleProps) {
  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 dark:border-rose-500/40 dark:bg-rose-500/10">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{heading}</h2>
      <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
        <article className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-800/40 dark:bg-slate-900">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-400">
            Common mistake
          </h3>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{mistake}</p>
        </article>
        <article className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-800/40 dark:bg-slate-900">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-400">
            Why it backfires
          </h3>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{whyItBackfires}</p>
        </article>
        <article className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-800/40 dark:bg-slate-900">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Better alternative
          </h3>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{betterAlternative}</p>
        </article>
      </div>
    </section>
  );
}
