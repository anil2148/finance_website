'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { StockMetrics } from '@/lib/stocks';

type Candle = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Score = {
  total: number;
  rating: string;
  parts: Array<{
    name: string;
    value: number;
    max: number;
  }>;
};

type Props = {
  stock: StockMetrics;
  score: Score;
  candles: Candle[];
  upside: number;
};

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function compactNumber(value?: number) {
  if (!value || !Number.isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 break-words text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{note}</p>
    </div>
  );
}

export function StockMetricsSection({ stock, score, candles, upside }: Props) {
  const chartData = candles.length ? candles.slice(-180).map((candle) => ({ date: candle.date.slice(5), close: candle.close })) : [];

  return (
    <>
      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:col-span-1">
          <p className="text-sm text-slate-400">Live score</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-6xl font-black text-emerald-300">{score.total}</span>
            <span className="pb-2 text-slate-400">/100</span>
          </div>
          <p className="mt-4 rounded-full bg-emerald-400/10 px-4 py-2 text-center font-semibold text-emerald-300">{score.rating}</p>
          <p className="mt-3 text-xs leading-5 text-slate-400">The score combines valuation, growth, profitability, financial health, and technical trend. It is a research shortcut, not a buy/sell instruction.</p>
          <div className="mt-6 space-y-4">
            {score.parts.map((part) => (
              <div key={part.name}>
                <div className="mb-1 flex justify-between text-sm text-slate-300">
                  <span>{part.name}</span>
                  <span>{part.value}/{part.max}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${(part.value / part.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:col-span-3">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-4">
              {stock.logo && <img src={stock.logo} alt={`${stock.name} logo`} className="mt-1 h-12 w-12 rounded-xl bg-white p-1" />}
              <div>
                <p className="text-sm text-slate-400">{stock.symbol}</p>
                <h2 className="text-3xl font-bold">{stock.name}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-bold">{currency(stock.price)}</span>
                  <span className={stock.changePercent >= 0 ? 'text-emerald-300' : 'text-red-300'}>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}% today</span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">Price is what the market pays today. Your job is to decide whether the business quality and future growth justify that price.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 text-right">
              <p className="text-sm text-slate-400">Estimated target</p>
              <p className="text-2xl font-bold">{currency(stock.analystTarget)}</p>
              <p className={upside >= 0 ? 'text-emerald-300' : 'text-red-300'}>{upside.toFixed(1)}% upside</p>
              <p className="mt-2 text-xs text-slate-400">Treat this as a rough directional guide. Targets can change quickly after earnings or news.</p>
            </div>
          </div>

          <div className="mt-8 h-72">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" minTickGap={24} />
                  <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ background: '#020617', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="close" stroke="#34d399" fill="url(#priceGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-slate-400">Historical chart unavailable for this symbol.</div>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400">Chart guide: uptrend may show momentum; sharp spikes may mean higher risk; long downtrends require extra caution.</p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xl font-bold">Company Overview</h3>
        <p className="mt-2 text-sm text-slate-400">This tells you what the company is, where it trades, and how large it is. Bigger companies are not always better, but they are often more established.</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <MetricCard label="Market Cap" value={compactNumber(stock.marketCap)} note="Total market value of the company. Larger can mean stability; smaller can mean more growth and more risk." />
          <MetricCard label="Industry" value={stock.industry || 'N/A'} note="Shows the business category. Compare stocks within the same industry for fairer judgment." />
          <MetricCard label="Exchange" value={stock.exchange || 'N/A'} note="Where the stock trades, such as NASDAQ or NYSE." />
          <MetricCard label="Country" value={stock.country || 'N/A'} note="Company's listed country. This can affect currency, regulation, and market risk." />
          <MetricCard label="IPO Date" value={stock.ipo || 'N/A'} note="When the company became public. Newer companies can be more volatile." />
          <MetricCard label="Website" value={stock.website || 'N/A'} note="Official company website for deeper research." />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xl font-bold">Key Metrics Explained</h3>
        <p className="mt-2 text-sm text-slate-400">These numbers help you judge valuation, growth, profitability, debt risk, momentum, and income potential.</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <MetricCard label="P/E Ratio" value={stock.pe.toFixed(2)} note="Price divided by earnings. High P/E means investors expect growth; low P/E may mean cheap or low expectations." />
          <MetricCard label="EPS Growth" value={`${stock.epsGrowth.toFixed(2)}%`} note="Earnings per share growth. Higher is usually bullish because profits are growing." />
          <MetricCard label="Profit Margin" value={`${stock.profitMargin.toFixed(2)}%`} note="How much profit remains from sales. Higher margin can mean pricing power and efficiency." />
          <MetricCard label="Debt / Equity" value={stock.debtToEquity.toFixed(2)} note="Compares debt with shareholder equity. Lower usually means less financial risk." />
          <MetricCard label="RSI" value={stock.rsi.toFixed(2)} note="Momentum indicator. Above 70 may be overbought; below 30 may be oversold." />
          <MetricCard label="Dividend Yield" value={`${stock.dividendYield.toFixed(2)}%`} note="Cash paid to shareholders as a percentage of price. Useful for income investors." />
        </div>
      </section>
    </>
  );
}
