import { Card } from '@/components/ui/card';
import { formatCurrency as fmt } from '@/lib/money-copilot/calculators';
import type { Scenario } from '@/lib/money-copilot/types';

const RISK_COLORS = {
  low: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  high: 'text-red-700 bg-red-50 border-red-200'
};

const RISK_LABELS = {
  low: 'Low Risk',
  medium: 'Moderate Risk',
  high: 'High Risk'
};

interface ScenarioCardProps {
  scenario: Scenario;
  isWinner?: boolean;
}

export function ScenarioCard({ scenario, isWinner }: ScenarioCardProps) {
  const { results, name } = scenario;

  if (!results) {
    return (
      <Card className="relative">
        <p className="text-sm text-slate-500">No results computed for this scenario.</p>
      </Card>
    );
  }

  const riskColor = RISK_COLORS[results.riskLevel];

  return (
    <Card className={`relative ${isWinner ? 'ring-2 ring-blue-500' : ''}`}>
      {isWinner && (
        <div className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white shadow">
          Better Scenario
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskColor}`}>
          {RISK_LABELS[results.riskLevel]}
        </span>
      </div>

      <dl className="space-y-2.5">
        <MetricRow label="Monthly take-home" value={fmt(results.monthlyTakeHome)} />
        <MetricRow label="Monthly obligations" value={fmt(results.fixedObligations)} />
        <MetricRow label="Monthly surplus" value={fmt(results.monthlyLeftover)} highlight={results.monthlyLeftover > 500} />
        <MetricRow label="Savings capacity" value={fmt(results.savingsCapacity) + '/mo'} />
        <MetricRow label="Housing burden" value={(results.housingBurdenRatio * 100).toFixed(1) + '%'} alert={results.housingBurdenRatio > 0.35} />
        <MetricRow label="Debt load ratio" value={(results.debtLoadRatio * 100).toFixed(1) + '%'} alert={results.debtLoadRatio > 0.2} />
        <MetricRow
          label="Emergency runway"
          value={results.emergencyRunwayMonths > 50 ? '50+ months' : results.emergencyRunwayMonths.toFixed(1) + ' months'}
          alert={results.emergencyRunwayMonths < 3}
        />
      </dl>

      {results.tradeoffs.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Key tradeoffs</p>
          <ul className="space-y-1">
            {results.tradeoffs.map((t, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="mt-0.5 shrink-0 text-slate-400">•</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function MetricRow({
  label,
  value,
  highlight,
  alert
}: {
  label: string;
  value: string;
  highlight?: boolean;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd
        className={`text-sm font-semibold tabular-nums ${
          alert ? 'text-red-600' : highlight ? 'text-emerald-700' : 'text-slate-900 dark:text-slate-100'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
