import { Card } from '@/components/ui/card';
import { ScenarioCard } from '@/components/money-copilot/ScenarioCard';
import { scoreScenario } from '@/lib/money-copilot/calculators';
import type { CopilotResponse } from '@/lib/money-copilot/types';

const CONFIDENCE_STYLES = {
  low: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const CONFIDENCE_LABELS = {
  low: 'Low confidence — key data missing',
  medium: 'Medium confidence — some assumptions used',
  high: 'High confidence — well-specified inputs'
};

interface ResultCardProps {
  response: CopilotResponse;
}

export function ResultCard({ response }: ResultCardProps) {
  const winnerIndex =
    response.scenarios.length === 2 && response.scenarios[0].results && response.scenarios[1].results
      ? scoreScenario(response.scenarios[0].results) >= scoreScenario(response.scenarios[1].results)
        ? 0
        : 1
      : -1;

  return (
    <div className="space-y-6">
      {/* Bottom line */}
      <Card>
        <div className="mb-2 flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Bottom line</h2>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[response.confidenceLevel]}`}
          >
            {CONFIDENCE_LABELS[response.confidenceLevel]}
          </span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300">{response.summary}</p>
        <div className="mt-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">Recommendation</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{response.recommendation}</p>
        </div>
      </Card>

      {/* Key metrics */}
      {response.keyMetrics.length > 0 && (
        <Card>
          <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">Key numbers used</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {response.keyMetrics.map((metric, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{metric.label}</dt>
                <dd className="mt-0.5 text-base font-bold text-slate-900 dark:text-slate-100">{metric.value}</dd>
                {metric.note && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{metric.note}</p>}
              </div>
            ))}
          </dl>
        </Card>
      )}

      {/* Scenarios */}
      {response.scenarios.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">Scenario comparison</h2>
          <div className={`grid gap-4 ${response.scenarios.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {response.scenarios.map((scenario, i) => (
              <ScenarioCard key={scenario.id} scenario={scenario} isWinner={winnerIndex === i} />
            ))}
          </div>
        </div>
      )}

      {/* Sensitivities */}
      {response.sensitivities.length > 0 && (
        <Card>
          <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">What could change the answer</h2>
          <ul className="space-y-2">
            {response.sensitivities.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Risks */}
      {response.risks.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-700/40 dark:bg-amber-950/20">
          <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">Risks &amp; blind spots</h2>
          <ul className="space-y-2">
            {response.risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 shrink-0 text-amber-500">⚠</span>
                {r}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Next steps */}
      {response.nextSteps.length > 0 && (
        <Card>
          <h2 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">Suggested next steps</h2>
          <ol className="space-y-2">
            {response.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Missing data */}
      {response.missingData.length > 0 && (
        <Card className="border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40">
          <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Data that would improve accuracy</h2>
          <ul className="space-y-1">
            {response.missingData.map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-slate-400">+</span> {d}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Assumptions */}
      {response.assumptions.length > 0 && (
        <details className="group rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/90">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300 list-none flex items-center gap-2">
            <span className="text-slate-400 group-open:rotate-90 transition-transform inline-block">▶</span>
            Assumptions &amp; methodology
          </summary>
          <ul className="mt-3 space-y-1.5">
            {response.assumptions.map((a, i) => (
              <li key={i} className="text-xs text-slate-600 dark:text-slate-400">• {a}</li>
            ))}
          </ul>
        </details>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{response.disclaimer}</p>
      </div>
    </div>
  );
}
