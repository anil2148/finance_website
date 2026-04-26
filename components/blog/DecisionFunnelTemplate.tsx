import Link from 'next/link';

type DecisionFunnelTemplateProps = {
  calculatorHref: string;
  calculatorLabel: string;
};

const structure = [
  { title: '1) Problem', body: 'Define the exact money decision and the timeline. Example: choose refinance now vs wait 6 months.' },
  { title: '2) Common mistake', body: 'Show the default behavior that feels right but creates hidden cost.' },
  { title: '3) Numbers example', body: 'Use one baseline and one stress-case with real dollar impact.' },
  { title: '4) What happens if wrong', body: 'Quantify the downside: cash-flow pressure, fee drag, or lost flexibility.' },
  { title: '5) Correct decision', body: 'State the clear next action and link to a calculator or comparison page.' }
];

export function DecisionFunnelTemplate({ calculatorHref, calculatorLabel }: DecisionFunnelTemplateProps) {
  return (
    <>
      <section className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 dark:border-blue-500/40 dark:from-blue-950/40 dark:to-cyan-950/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Start with your numbers</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Decision-first blog template</h2>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">This format removes fluff and pushes action every few scrolls.</p>

        <div className="mt-4 rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-400/40 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Inline calculator preview</p>
          <div className="mt-2 grid gap-2 text-sm md:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-2 dark:bg-slate-800"><p className="text-xs text-slate-500">Input</p><p className="font-semibold text-slate-900 dark:text-slate-100">$500/month</p></div>
            <div className="rounded-md bg-slate-50 p-2 dark:bg-slate-800"><p className="text-xs text-slate-500">Change tested</p><p className="font-semibold text-slate-900 dark:text-slate-100">+1.0% rate</p></div>
            <div className="rounded-md bg-slate-50 p-2 dark:bg-slate-800"><p className="text-xs text-slate-500">Annual impact</p><p className="font-semibold text-slate-900 dark:text-slate-100">~$60</p></div>
          </div>
          <Link href={calculatorHref} className="mt-3 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Start with your numbers</Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Conversion-driven content structure</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {structure.map((item) => (
            <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/40 dark:bg-amber-950/20">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">Reality check</h3>
            <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">If a plan fails in one bad month, it is not a plan.</p>
          </article>
          <article className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-500/40 dark:bg-rose-950/20">
            <h3 className="font-semibold text-rose-900 dark:text-rose-200">Most people do this wrong</h3>
            <p className="mt-1 text-sm text-rose-900 dark:text-rose-200">They optimize one metric and ignore execution risk.</p>
          </article>
          <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/40 dark:bg-emerald-950/20">
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">Better approach</h3>
            <p className="mt-1 text-sm text-emerald-900 dark:text-emerald-200">Run baseline + downside scenarios before choosing.</p>
          </article>
        </div>

        <div className="mt-4">
          <Link href={calculatorHref} className="inline-flex rounded-full border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-400/50 dark:text-blue-300 dark:hover:bg-blue-900/30">
            Run your scenario ({calculatorLabel})
          </Link>
        </div>
      </section>
    </>
  );
}
