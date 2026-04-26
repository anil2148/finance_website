const activeDecisions = [
  { title: 'Buy house vs rent 18 months', risk: 72, action: 'Pause purchase & raise cash buffer' },
  { title: 'Debt avalanche plan', risk: 34, action: 'Increase payoff by $180/mo' }
];

const savedScenarios = [
  { name: 'Base case', score: 66 },
  { name: 'Recession case', score: 41 },
  { name: 'Optimistic upside', score: 79 }
];

export function DecisionDashboardPreview() {
  return (
    <section id="example-decision" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900" aria-labelledby="decision-dashboard-title">
      <h2 id="decision-dashboard-title" className="text-xl font-semibold">Decision dashboard</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Saved decisions</h3>
          <ul className="mt-2 space-y-2">
            {activeDecisions.map((decision) => (
              <li key={decision.title} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
                <p className="font-semibold">{decision.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">Recommended action: {decision.action}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Risk score</h3>
          <p className="mt-2 text-3xl font-bold text-rose-600">72</p>
          <p className="text-xs text-slate-500">Elevated because housing costs exceed 40% threshold.</p>
        </article>

        <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Suggested next actions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600 dark:text-slate-300">
            <li>Build 3-month emergency reserve</li>
            <li>Cap housing cost at 33% income</li>
            <li>Re-run decision after rate check</li>
          </ul>
        </article>
      </div>

      <article className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700" aria-label="Scenario comparisons chart">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Scenario comparisons</h3>
        <div className="mt-3 space-y-2">
          {savedScenarios.map((scenario) => (
            <div key={scenario.name}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{scenario.name}</span>
                <span>{scenario.score}/100</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${scenario.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
