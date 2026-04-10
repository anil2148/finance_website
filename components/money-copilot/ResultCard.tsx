import { Card } from '@/components/ui/card';
import { scoreScenario } from '@/lib/money-copilot/calculators';
import { formatCurrency as fmt } from '@/lib/money-copilot/calculators';
import type { CopilotResponse, Scenario } from '@/lib/money-copilot/types';

const CONFIDENCE_STYLES = {
  low: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-700/40',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-700/40',
  high: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-700/40'
};

const CONFIDENCE_LABELS = {
  low: 'Low confidence',
  medium: 'Medium confidence',
  high: 'High confidence'
};

const RISK_COLORS = {
  low: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-700/40',
  medium: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-700/40',
  high: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/20 dark:border-red-700/40'
};

interface ResultCardProps {
  response: CopilotResponse;
}

function ScenarioCompareCard({ scenario, isWinner }: { scenario: Scenario; isWinner: boolean }) {
  const { results, name } = scenario;

  if (!results) {
    return (
      <div className={`relative rounded-2xl border p-5 ${isWinner ? 'border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900/80`}>
        <p className="text-sm text-slate-400">No data for this scenario.</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl border p-5 ${isWinner ? 'border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900/80`}>
      {isWinner && (
        <div className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white shadow">
          Better option
        </div>
      )}

      <div className="mb-4 flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{name}</h4>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_COLORS[results.riskLevel]}`}>
          {results.riskLevel === 'low' ? 'Low risk' : results.riskLevel === 'medium' ? 'Moderate risk' : 'High risk'}
        </span>
      </div>

      <dl className="space-y-2">
        <MetricRow label="Monthly leftover" value={fmt(results.monthlyLeftover)} highlight={results.monthlyLeftover > 500} />
        <MetricRow label="Savings capacity" value={`${fmt(results.savingsCapacity)}/mo`} />
        <MetricRow label="Housing burden" value={`${(results.housingBurdenRatio * 100).toFixed(0)}%`} alert={results.housingBurdenRatio > 0.35} />
      </dl>

      {results.tradeoffs.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Key tradeoff</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{results.tradeoffs[0]}</p>
        </div>
      )}
    </div>
  );
}

function MetricRow({ label, value, highlight, alert }: { label: string; value: string; highlight?: boolean; alert?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className={`text-sm font-semibold tabular-nums ${alert ? 'text-red-600 dark:text-red-400' : highlight ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
        {value}
      </dd>
    </div>
  );
}

export function ResultCard({ response }: ResultCardProps) {
  const hasScenarios = response.scenarios.length >= 2 &&
    response.scenarios[0].results != null &&
    response.scenarios[1].results != null;

  const winnerIndex = hasScenarios
    ? (scoreScenario(response.scenarios[0].results!) >= scoreScenario(response.scenarios[1].results!) ? 0 : 1)
    : -1;

  // Limit risks to 4 max, next step is first item only
  const risks = response.risks.slice(0, 4);
  const nextStep = response.nextSteps[0] ?? '';

  return (
    <div className="space-y-4">
      {/* TIER 1: Decision Summary */}
      <Card>
        <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">1</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Decision Summary</h2>
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[response.confidenceLevel]}`}>
            {CONFIDENCE_LABELS[response.confidenceLevel]}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{response.summary}</p>
        <div className="mt-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">Recommendation</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{response.recommendation}</p>
        </div>
      </Card>

      {/* TIER 2: Scenario Comparison (only when 2 scenarios available) */}
      {hasScenarios && (
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">2</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Scenario Comparison</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {response.scenarios.slice(0, 2).map((scenario, i) => (
              <ScenarioCompareCard key={scenario.id} scenario={scenario} isWinner={winnerIndex === i} />
            ))}
          </div>
        </Card>
      )}

      {/* TIER 3: Risks + Next Steps */}
      {(risks.length > 0 || nextStep) && (
        <Card className="border-amber-200 bg-amber-50/40 dark:border-amber-700/40 dark:bg-amber-950/10">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">3</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Risks &amp; Next Step</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {risks.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Risks</p>
                <ul className="space-y-1.5">
                  {risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="mt-0.5 shrink-0 text-amber-500">⚠</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {nextStep && (
              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Next Step</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{nextStep}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{response.disclaimer}</p>
      </div>
    </div>
  );
}
