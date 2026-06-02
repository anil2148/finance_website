'use client';

import type { StockMetrics } from '@/lib/stocks';
import { scoreStock } from '@/lib/stocks';

type Factor = {
  title: string;
  value: string;
  outlook: 'Bullish' | 'Neutral' | 'Bearish';
  explanation: string;
  watch: string;
};

function getOutlookClass(outlook: Factor['outlook']) {
  if (outlook === 'Bullish') return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200';
  if (outlook === 'Bearish') return 'border-red-400/30 bg-red-400/10 text-red-200';
  return 'border-amber-300/30 bg-amber-300/10 text-amber-100';
}

function factorsFor(stock: StockMetrics): Factor[] {
  const upside = ((stock.analystTarget - stock.price) / stock.price) * 100;
  return [
    {
      title: 'Valuation',
      value: `Forward P/E ${stock.forwardPe}`,
      outlook: stock.forwardPe < 25 ? 'Bullish' : stock.forwardPe <= 40 ? 'Neutral' : 'Bearish',
      explanation: stock.forwardPe < 25
        ? 'The stock is not extremely expensive relative to expected earnings, which can support a bullish outlook if growth stays stable.'
        : stock.forwardPe <= 40
          ? 'The valuation needs earnings growth to continue. A miss in revenue or guidance can pressure the stock.'
          : 'The stock is priced for strong future performance. Any slowdown can create bearish pressure.',
      watch: 'Watch earnings growth, guidance, and whether the P/E multiple expands or contracts.',
    },
    {
      title: 'Growth',
      value: `EPS ${stock.epsGrowth}% / Revenue ${stock.revenueGrowth}%`,
      outlook: stock.epsGrowth > 15 && stock.revenueGrowth > 10 ? 'Bullish' : stock.epsGrowth > 6 && stock.revenueGrowth > 5 ? 'Neutral' : 'Bearish',
      explanation: stock.epsGrowth > 15 && stock.revenueGrowth > 10
        ? 'Strong earnings and revenue growth usually supports higher investor confidence and bullish momentum.'
        : stock.epsGrowth > 6 && stock.revenueGrowth > 5
          ? 'Growth is positive, but investors may need more acceleration to justify a higher price.'
          : 'Slow growth can make the market question future upside, especially if the stock trades at a high valuation.',
      watch: 'Watch quarterly revenue growth, EPS beats/misses, and forward guidance.',
    },
    {
      title: 'Profitability',
      value: `Margin ${stock.profitMargin}% / ROE ${stock.roe}%`,
      outlook: stock.profitMargin > 25 ? 'Bullish' : stock.profitMargin > 12 ? 'Neutral' : 'Bearish',
      explanation: stock.profitMargin > 25
        ? 'High margins show pricing power and operating efficiency, which is usually bullish for long-term quality.'
        : stock.profitMargin > 12
          ? 'Profitability is acceptable but should be monitored for margin compression.'
          : 'Weak margins can reduce earnings resilience and create bearish risk during slowdowns.',
      watch: 'Watch gross margin, operating margin, and whether costs are rising faster than sales.',
    },
    {
      title: 'Balance Sheet Risk',
      value: `Debt/Equity ${stock.debtToEquity}`,
      outlook: stock.debtToEquity < 0.6 ? 'Bullish' : stock.debtToEquity <= 1.5 ? 'Neutral' : 'Bearish',
      explanation: stock.debtToEquity < 0.6
        ? 'Lower leverage gives the company more flexibility during weak markets and higher interest-rate periods.'
        : stock.debtToEquity <= 1.5
          ? 'Debt is manageable, but rising rates or falling cash flow could increase risk.'
          : 'Higher leverage can become bearish if earnings weaken or refinancing costs rise.',
      watch: 'Watch free cash flow, interest expense, credit rating, and debt maturity schedule.',
    },
    {
      title: 'Technical Momentum',
      value: `RSI ${stock.rsi}`,
      outlook: stock.rsi >= 45 && stock.rsi <= 65 && stock.changePercent >= 0 ? 'Bullish' : stock.rsi > 70 || stock.rsi < 35 ? 'Bearish' : 'Neutral',
      explanation: stock.rsi >= 45 && stock.rsi <= 65 && stock.changePercent >= 0
        ? 'Momentum is constructive without looking extremely overbought.'
        : stock.rsi > 70
          ? 'RSI above 70 can indicate the stock is overbought and vulnerable to a pullback.'
          : stock.rsi < 35
            ? 'RSI below 35 can signal weak momentum, though it may also attract dip buyers.'
            : 'Momentum is mixed. Confirm trend with moving averages, volume, and support levels.',
      watch: 'Watch RSI, 50-day moving average, 200-day moving average, volume, and support/resistance levels.',
    },
    {
      title: 'Analyst Target Upside',
      value: `${upside.toFixed(1)}% upside`,
      outlook: upside > 15 ? 'Bullish' : upside >= 0 ? 'Neutral' : 'Bearish',
      explanation: upside > 15
        ? 'Analyst target suggests meaningful upside, but targets can change quickly after earnings or macro news.'
        : upside >= 0
          ? 'Analyst upside exists but is limited, so near-term risk/reward may be balanced.'
          : 'The target is below current price, which can indicate downside risk or overly optimistic current pricing.',
      watch: 'Watch analyst revisions, earnings estimate changes, and target price cuts/upgrades.',
    },
  ];
}

export function StockOutlookInsights({ stock }: { stock: StockMetrics }) {
  const score = scoreStock(stock);
  const factors = factorsFor(stock);
  const bullish = factors.filter((factor) => factor.outlook === 'Bullish').length;
  const bearish = factors.filter((factor) => factor.outlook === 'Bearish').length;
  const finalOutlook = bullish > bearish + 1 ? 'Bullish' : bearish > bullish ? 'Bearish' : 'Neutral / Watchlist';

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Bullish vs Bearish Outlook</p>
          <h2 className="mt-2 text-2xl font-bold">What is driving {stock.symbol}?</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            This section explains the key factors that can push the stock higher or lower. Use it as a checklist before buying, holding, or avoiding the stock.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-black/30 p-4 text-right">
          <p className="text-sm text-slate-400">Overall outlook</p>
          <p className="text-2xl font-black text-emerald-300">{finalOutlook}</p>
          <p className="text-xs text-slate-400">Score: {score.total}/100 • {score.rating}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {factors.map((factor) => (
          <article key={factor.title} className={`rounded-2xl border p-5 ${getOutlookClass(factor.outlook)}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">{factor.title}</h3>
                <p className="mt-1 text-sm opacity-90">{factor.value}</p>
              </div>
              <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold">{factor.outlook}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-100">{factor.explanation}</p>
            <div className="mt-4 rounded-xl bg-black/25 p-3 text-xs leading-5 text-slate-200">
              <strong>What to watch:</strong> {factor.watch}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
