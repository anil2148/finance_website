type BeginnerVerdict = {
  headline: string;
  positives: string[];
  risks: string[];
};

type Props = {
  stock: {
    symbol: string;
    name: string;
    sector?: string;
    industry?: string;
    description?: string;
    marketCap?: number;
    beta: number;
    dividendYield: number;
    analystTarget: number;
    price: number;
  };
  verdict: BeginnerVerdict;
  score: {
    total: number;
    rating: string;
  };
  upside: number;
};

function compactNumber(value?: number) {
  if (!Number.isFinite(Number(value))) return 'Not available from the current data source.';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(Number(value));
}

function currency(value?: number) {
  if (!Number.isFinite(Number(value))) return 'Not available from the current data source.';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
}

export function StockOverviewSection({ stock, verdict, score, upside }: Props) {
  return (
    <section className="mt-8 space-y-5">
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Executive Summary</p>
        <h2 className="mt-2 text-2xl font-bold">{verdict.headline}</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-bold text-white">Decision Snapshot</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Score {score.total}/100 - {score.rating} - Estimated upside {upside.toFixed(1)}%</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">Use this as a starting point, not a final answer. Always compare it with earnings, valuation, risks, and your time horizon.</p>
          </div>
          <div className="rounded-xl border border-emerald-300/20 bg-black/20 p-4">
            <h3 className="font-bold text-emerald-200">What looks bullish?</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              {verdict.positives.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-300/20 bg-black/20 p-4">
            <h3 className="font-bold text-amber-200">What could be bearish?</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
              {verdict.risks.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-bold text-white">What the company does</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{stock.description || `${stock.name} is listed as ${stock.industry || 'an industry not available from the current source'}${stock.sector ? ` in the ${stock.sector} sector` : ''}.`}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-bold text-white">How to read this profile</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            <li>Market cap: {compactNumber(stock.marketCap)}</li>
            <li>Analyst target: {currency(stock.analystTarget)} versus {currency(stock.price)} current price.</li>
            <li>Industry context matters; compare with peers before judging valuation.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-bold text-white">What to watch</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            <li>Beta of {stock.beta.toFixed(2)} shows how volatile the stock may be versus the market.</li>
            <li>Dividend yield of {stock.dividendYield.toFixed(2)}% matters for income investors but does not replace growth analysis.</li>
            <li>Analyst targets are useful context, not a guarantee.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
