type BeginnerVerdict = {
  headline: string;
  positives: string[];
  risks: string[];
};

type Props = {
  verdict: BeginnerVerdict;
  score: {
    total: number;
    rating: string;
  };
  upside: number;
};

export function StockOverviewSection({ verdict, score, upside }: Props) {
  return (
    <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Executive Summary</p>
      <h2 className="mt-2 text-2xl font-bold">{verdict.headline}</h2>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-bold text-white">Decision Snapshot</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">Score {score.total}/100 • {score.rating} • Estimated upside {upside.toFixed(1)}%</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">Use this as a starting point, not a final answer. Always compare it with earnings, valuation, risks, and your time horizon.</p>
        </div>
        <div className="rounded-xl border border-emerald-300/20 bg-black/20 p-4">
          <h3 className="font-bold text-emerald-200">What looks bullish?</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
            {verdict.positives.map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-300/20 bg-black/20 p-4">
          <h3 className="font-bold text-amber-200">What could be bearish?</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
            {verdict.risks.map((item) => <li key={item}>⚠ {item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
