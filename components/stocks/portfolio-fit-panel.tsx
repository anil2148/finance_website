import type { StockMetrics } from '@/lib/stocks';

type Props = {
  stock: StockMetrics;
  score: {
    total: number;
    rating: string;
  };
};

function getFit(stock: StockMetrics, score: Props['score']) {
  const growth = stock.revenueGrowth > 12 || stock.epsGrowth > 12;
  const value = stock.forwardPe > 0 && stock.forwardPe < 22;
  const income = stock.dividendYield >= 2;
  const speculative = stock.beta > 1.6 || score.total < 50 || stock.profitMargin < 5;
  const retirement = score.total >= 70 && stock.beta < 1.2 && stock.debtToEquity < 1 && stock.profitMargin > 12;

  const tags = [
    growth && { label: 'Growth', explanation: 'Revenue or EPS growth is strong enough to support a growth-stock profile.' },
    value && { label: 'Value', explanation: 'Forward P/E is relatively low, which may appeal to value investors.' },
    income && { label: 'Income', explanation: 'Dividend yield is meaningful for income-focused investors.' },
    speculative && { label: 'Speculative', explanation: 'Higher volatility, weaker score, or low margins increase risk.' },
    retirement && { label: 'Retirement Friendly', explanation: 'Higher score, lower beta, manageable debt, and stable margins support a more conservative profile.' },
  ].filter(Boolean) as Array<{ label: string; explanation: string }>;

  const primary = retirement ? 'Retirement Friendly / Quality Compounder'
    : growth && !speculative ? 'Growth Candidate'
    : value ? 'Value Candidate'
    : income ? 'Income Candidate'
    : speculative ? 'Speculative / High Risk'
    : 'Balanced Watchlist Candidate';

  const risk = speculative ? 'High' : stock.beta > 1.25 || stock.debtToEquity > 1.2 ? 'Medium' : 'Lower';

  return { primary, risk, tags };
}

export function PortfolioFitPanel({ stock, score }: Props) {
  const fit = getFit(stock, score);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Portfolio Fit</p>
          <h3 className="mt-2 text-2xl font-bold">Where could this stock fit?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            This section translates raw metrics into a portfolio role. It helps users understand whether a stock behaves more like a growth, value, income, retirement-friendly, or speculative holding.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Primary Fit</p>
          <p className="mt-2 text-2xl font-black text-white">{fit.primary}</p>
          <p className="mt-2 text-sm text-slate-300">Risk level: {fit.risk}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fit.tags.length ? fit.tags.map((tag) => (
          <div key={tag.label} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h4 className="font-bold text-white">{tag.label}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-400">{tag.explanation}</p>
          </div>
        )) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h4 className="font-bold text-white">Balanced Watchlist</h4>
            <p className="mt-2 text-sm leading-6 text-slate-400">No single category dominates. Review valuation, earnings, and risk before deciding where it fits.</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
        <strong>Beginner tip:</strong> A good stock can still be a bad fit if it does not match your goal. Growth stocks may be volatile, income stocks may grow slower, and speculative stocks need smaller position sizes.
      </div>
    </section>
  );
}
