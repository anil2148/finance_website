'use client';

import { useMemo, useState } from 'react';
import { scoreStock, type StockMetrics } from '@/lib/stocks';
import { currency, pct, rankCompetitors } from '@/lib/stock-decision-tools';

type Props = {
  stock: StockMetrics;
};

type ProfileResponse = {
  stock?: StockMetrics;
  error?: string;
  symbol?: string;
};

type CompareRow = {
  symbol: string;
  stock?: StockMetrics;
  status: 'idle' | 'loading' | 'loaded' | 'failed';
  error?: string;
};

const presets = [
  { label: 'Big Tech', symbols: 'MSFT,AAPL,GOOGL,AMZN,META' },
  { label: 'AI / Semis', symbols: 'NVDA,AMD,AVGO,TSM' },
  { label: 'Fintech', symbols: 'SOFI,PYPL,AFRM,SQ' },
  { label: 'Data / Cloud', symbols: 'PLTR,SNOW,DDOG,CRM' },
];

export function CompetitorComparison({ stock }: Props) {
  const [symbols, setSymbols] = useState(stock.symbol);
  const [rows, setRows] = useState<CompareRow[]>([{ symbol: stock.symbol, stock, status: 'loaded' }]);
  const [loading, setLoading] = useState(false);

  const loadedStocks = useMemo(() => rows.map((row) => row.stock).filter(Boolean) as StockMetrics[], [rows]);
  const winners = useMemo(() => rankCompetitors(loadedStocks), [loadedStocks]);
  const overall = loadedStocks.find((item) => item.symbol === winners.bestOverall);

  async function runComparison(nextSymbols = symbols) {
    const tickers = Array.from(new Set(nextSymbols.split(',').map((item) => item.trim().toUpperCase()).filter(Boolean)));
    if (!tickers.includes(stock.symbol)) tickers.unshift(stock.symbol);
    setSymbols(tickers.join(','));
    setRows(tickers.map((symbol) => symbol === stock.symbol ? { symbol, stock, status: 'loaded' } : { symbol, status: 'loading' }));
    setLoading(true);

    const results = await Promise.allSettled(tickers.map(async (symbol) => {
      if (symbol === stock.symbol) return { symbol, stock };
      const response = await fetch(`/api/stocks/profile?symbol=${encodeURIComponent(symbol)}&refresh=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json() as ProfileResponse;
      if (!response.ok || !data.stock) throw new Error(data.error || `Could not load ${symbol}.`);
      if (data.symbol && data.symbol !== symbol) throw new Error(`Provider returned ${data.symbol} instead of ${symbol}.`);
      return { symbol, stock: data.stock };
    }));

    setRows(results.map((result, index) => {
      const symbol = tickers[index];
      if (result.status === 'fulfilled') return { symbol, stock: result.value.stock, status: 'loaded' };
      return { symbol, status: 'failed', error: result.reason instanceof Error ? result.reason.message : `Could not load ${symbol}.` };
    }));
    setLoading(false);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Competitor Comparison</p>
        <h2 className="mt-2 text-3xl font-black text-white">Compare growth, valuation, risk, quality, and momentum.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Enter tickers separated by commas. One failed ticker will show an error row without breaking the table.
        </p>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <input value={symbols} onChange={(event) => setSymbols(event.target.value)} className="min-h-12 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-emerald-300" />
          <button type="button" onClick={() => void runComparison()} disabled={loading} className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-60">
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button key={preset.label} type="button" onClick={() => void runComparison(preset.symbols)} className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Winner label="Best growth" symbol={winners.bestGrowth} />
        <Winner label="Best valuation" symbol={winners.bestValuation} />
        <Winner label="Best profitability" symbol={winners.bestProfitability} />
        <Winner label="Best overall opportunity" symbol={winners.bestOverall} tone="good" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-2xl font-bold text-white">Comparison table</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-slate-400">
              <tr><th className="py-2">Symbol</th><th>Price</th><th>Market cap</th><th>Revenue growth</th><th>EPS growth</th><th>Profit margin</th><th>Debt/equity</th><th>Forward P/E</th><th>RSI</th><th>Beta</th><th>Analyst upside</th><th>Dividend</th><th>Score</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                if (row.status === 'failed') {
                  return <tr key={row.symbol} className="border-t border-white/10 text-red-100"><td className="py-3 font-bold">{row.symbol}</td><td colSpan={12}>{row.error || 'Invalid ticker or data unavailable.'}</td></tr>;
                }
                if (!row.stock) {
                  return <tr key={row.symbol} className="border-t border-white/10 text-slate-300"><td className="py-3 font-bold">{row.symbol}</td><td colSpan={12}>Loading...</td></tr>;
                }
                const rowScore = scoreStock(row.stock);
                const analystUpside = row.stock.price > 0 ? ((row.stock.analystTarget - row.stock.price) / row.stock.price) * 100 : 0;
                return (
                  <tr key={row.symbol} className="border-t border-white/10 text-slate-200">
                    <td className="py-3 font-bold text-white">{row.stock.symbol}</td>
                    <td>{currency(row.stock.price)}</td>
                    <td>{row.stock.marketCap ? currency(row.stock.marketCap) : 'N/A'}</td>
                    <td>{pct(row.stock.revenueGrowth)}</td>
                    <td>{pct(row.stock.epsGrowth)}</td>
                    <td>{pct(row.stock.profitMargin)}</td>
                    <td>{row.stock.debtToEquity.toFixed(2)}</td>
                    <td>{row.stock.forwardPe.toFixed(1)}</td>
                    <td>{row.stock.rsi.toFixed(1)}</td>
                    <td>{row.stock.beta.toFixed(2)}</td>
                    <td>{pct(analystUpside)}</td>
                    <td>{pct(row.stock.dividendYield)}</td>
                    <td>{rowScore.total} / {rowScore.rating}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-2xl font-bold text-white">Best overall pick</h3>
        {overall ? (
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {overall.symbol} currently ranks best overall because it has the highest FinanceSphere score among loaded peers. It may still lose on specific dimensions: valuation winner is {winners.bestValuation || 'N/A'}, lowest volatility is {winners.lowestVolatility || 'N/A'}, and lowest debt risk is {winners.lowestDebtRisk || 'N/A'}.
          </p>
        ) : <p className="mt-3 text-sm text-slate-400">Run a comparison to see rankings.</p>}
        <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">Educational analysis only, not financial advice. Missing provider data may affect rankings.</p>
      </div>
    </section>
  );
}

function Winner({ label, symbol, tone = 'neutral' }: { label: string; symbol?: string; tone?: 'good' | 'neutral' }) {
  return <div className={`rounded-2xl border p-5 ${tone === 'good' ? 'border-emerald-300/20 bg-emerald-300/10' : 'border-white/10 bg-white/[0.04]'}`}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-black text-white">{symbol || 'N/A'}</p></div>;
}
