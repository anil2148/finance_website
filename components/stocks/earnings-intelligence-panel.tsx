'use client';

type EarningsItem = {
  date?: string;
  epsActual?: number;
  epsEstimate?: number;
  revenueActual?: number;
  revenueEstimate?: number;
  quarter?: number;
  year?: number;
};

type Props = {
  earnings: EarningsItem[];
  source?: string | null;
};

function compact(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(Number(value));
}

function percent(value: number) {
  if (!Number.isFinite(value)) return 'N/A';
  return `${value.toFixed(1)}%`;
}

function getEarningsInsights(earnings: EarningsItem[]) {
  const rows = earnings
    .filter((item) => typeof item.epsActual === 'number' || typeof item.epsEstimate === 'number')
    .slice(0, 8);

  const epsComparable = rows.filter((item) => typeof item.epsActual === 'number' && typeof item.epsEstimate === 'number');
  const revenueComparable = rows.filter((item) => typeof item.revenueActual === 'number' && typeof item.revenueEstimate === 'number');
  const epsBeats = epsComparable.filter((item) => Number(item.epsActual) >= Number(item.epsEstimate)).length;
  const revenueBeats = revenueComparable.filter((item) => Number(item.revenueActual) >= Number(item.revenueEstimate)).length;
  const surprises = epsComparable.map((item) => {
    const estimate = Number(item.epsEstimate);
    if (estimate === 0) return 0;
    return ((Number(item.epsActual) - estimate) / Math.abs(estimate)) * 100;
  });
  const avgSurprise = surprises.length ? surprises.reduce((sum, item) => sum + item, 0) / surprises.length : 0;
  const latest = rows[0];
  const latestBeat = latest && typeof latest.epsActual === 'number' && typeof latest.epsEstimate === 'number'
    ? latest.epsActual >= latest.epsEstimate
    : null;

  const score = Math.max(0, Math.min(100,
    50 +
    (epsComparable.length ? (epsBeats / epsComparable.length - 0.5) * 40 : 0) +
    (revenueComparable.length ? (revenueBeats / revenueComparable.length - 0.5) * 25 : 0) +
    Math.max(-15, Math.min(15, avgSurprise / 2))
  ));

  return {
    rows,
    epsBeatRate: epsComparable.length ? (epsBeats / epsComparable.length) * 100 : null,
    revenueBeatRate: revenueComparable.length ? (revenueBeats / revenueComparable.length) * 100 : null,
    avgSurprise,
    latest,
    latestBeat,
    score: Math.round(score),
    signal: score >= 65 ? 'Positive' : score <= 40 ? 'Negative' : 'Mixed',
  };
}

export function EarningsIntelligencePanel({ earnings, source }: Props) {
  const insights = getEarningsInsights(earnings);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Earnings Intelligence</p>
          <h3 className="mt-2 text-2xl font-bold">Is the company beating expectations?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Earnings beats can support bullish momentum. Earnings misses, weak revenue, or shrinking surprises can pressure valuation and sentiment.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Earnings Signal</p>
          <p className="mt-2 text-2xl font-black text-white">{insights.signal}</p>
          <p className="mt-1 text-sm text-slate-300">Score {insights.score}/100</p>
          {source && <p className="mt-2 text-xs text-slate-500">Source: {source}</p>}
        </div>
      </div>

      {earnings.length ? (
        <>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            <InsightCard title="EPS Beat Rate" value={insights.epsBeatRate === null ? 'N/A' : percent(insights.epsBeatRate)} note="How often EPS actual met or beat estimates." />
            <InsightCard title="Revenue Beat Rate" value={insights.revenueBeatRate === null ? 'N/A' : percent(insights.revenueBeatRate)} note="How often revenue actual met or beat estimates." />
            <InsightCard title="Avg EPS Surprise" value={percent(insights.avgSurprise)} note="Average difference between reported EPS and expected EPS." />
            <InsightCard title="Latest Quarter" value={insights.latestBeat === null ? 'N/A' : insights.latestBeat ? 'Beat' : 'Miss'} note="Latest reported EPS compared with estimate." />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
            <h4 className="font-bold text-white">Plain-English Interpretation</h4>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {insights.signal === 'Positive'
                ? 'Recent earnings history looks supportive. This can help justify valuation if guidance and revenue trends also remain strong.'
                : insights.signal === 'Negative'
                  ? 'Earnings history looks weak or inconsistent. Be careful if valuation is high or growth expectations are aggressive.'
                  : 'Earnings history is mixed. Look closely at whether misses are one-time events or signs of slowing business momentum.'}
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">EPS Actual</th>
                  <th className="pb-3">EPS Estimate</th>
                  <th className="pb-3">EPS Result</th>
                  <th className="pb-3">Revenue Actual</th>
                  <th className="pb-3">Revenue Estimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-200">
                {insights.rows.map((item, index) => {
                  const hasEps = typeof item.epsActual === 'number' && typeof item.epsEstimate === 'number';
                  const beat = hasEps ? Number(item.epsActual) >= Number(item.epsEstimate) : null;
                  return (
                    <tr key={`${item.date}-${index}`}>
                      <td className="py-3">{item.date || 'N/A'}</td>
                      <td className="py-3">{typeof item.epsActual === 'number' ? item.epsActual.toFixed(2) : 'N/A'}</td>
                      <td className="py-3">{typeof item.epsEstimate === 'number' ? item.epsEstimate.toFixed(2) : 'N/A'}</td>
                      <td className={beat === null ? 'py-3 text-slate-400' : beat ? 'py-3 text-emerald-300' : 'py-3 text-red-300'}>{beat === null ? 'N/A' : beat ? 'Beat' : 'Miss'}</td>
                      <td className="py-3">{compact(item.revenueActual)}</td>
                      <td className="py-3">{compact(item.revenueEstimate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50">
          <h4 className="font-bold">No earnings rows are available yet.</h4>
          <p className="mt-2">Provider data may be missing because of API tier, symbol coverage, or limited reporting history. Use the company investor relations page and SEC filings to verify quarterly results.</p>
        </div>
      )}
    </section>
  );
}

function InsightCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{note}</p>
    </div>
  );
}
