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
  if (!value || !Number.isFinite(value)) return 'Not available from the current data source.';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
}

function unavailable(value: number | undefined, formatter: (value: number) => string) {
  return Number.isFinite(Number(value)) ? formatter(Number(value)) : 'Not available from the current data source.';
}

function metricStatus(label: string, value: number): 'Good' | 'Neutral' | 'Caution' | 'Risk' {
  if (!Number.isFinite(value)) return 'Neutral';
  if (label === 'P/E Ratio') return value > 45 ? 'Risk' : value > 30 ? 'Caution' : value > 0 ? 'Neutral' : 'Neutral';
  if (label === 'Forward P/E') return value > 40 ? 'Risk' : value > 30 ? 'Caution' : value > 0 && value <= 22 ? 'Good' : 'Neutral';
  if (label === 'EPS Growth' || label === 'Revenue Growth') return value >= 15 ? 'Good' : value >= 5 ? 'Neutral' : value < 0 ? 'Risk' : 'Caution';
  if (label === 'Profit Margin') return value >= 18 ? 'Good' : value >= 8 ? 'Neutral' : 'Caution';
  if (label === 'Debt / Equity') return value > 1.5 ? 'Risk' : value > 0.8 ? 'Caution' : 'Good';
  if (label === 'RSI') return value >= 75 ? 'Risk' : value >= 68 ? 'Caution' : value <= 30 ? 'Caution' : 'Neutral';
  if (label === 'Beta') return value > 1.6 ? 'Risk' : value > 1.2 ? 'Caution' : 'Neutral';
  if (label === 'Analyst Upside') return value >= 15 ? 'Good' : value >= 5 ? 'Neutral' : value < 0 ? 'Risk' : 'Caution';
  if (label === 'Dividend Yield') return value > 0 ? 'Neutral' : 'Neutral';
  return 'Neutral';
}

function statusClass(status: string) {
  if (status === 'Good') return 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100';
  if (status === 'Caution') return 'border-amber-300/30 bg-amber-300/10 text-amber-100';
  if (status === 'Risk') return 'border-red-300/30 bg-red-300/10 text-red-100';
  return 'border-slate-300/20 bg-slate-300/10 text-slate-100';
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

function ExplainedMetricCard({ category, label, value, rawValue, means, matters }: { category: string; label: string; value: string; rawValue: number; means: string; matters: string }) {
  const status = metricStatus(label, rawValue);
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{category}</p>
          <h4 className="mt-2 font-bold text-white">{label}</h4>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-xs font-bold ${statusClass(status)}`}>{status}</span>
      </div>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300"><span className="font-semibold text-slate-100">What it means:</span> {means}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400"><span className="font-semibold text-slate-200">Why it matters:</span> {matters}</p>
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
        <p className="mt-2 text-sm text-slate-400">Read these together. A stock can be high quality and still expensive, or cheap because growth and balance-sheet quality are weak.</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <ExplainedMetricCard category="Valuation" label="P/E Ratio" rawValue={stock.pe} value={unavailable(stock.pe, (value) => value.toFixed(2))} means="Price divided by trailing earnings." matters="High P/E can be acceptable for durable growth, but creates downside risk if growth slows." />
          <ExplainedMetricCard category="Valuation" label="Forward P/E" rawValue={stock.forwardPe} value={unavailable(stock.forwardPe, (value) => value.toFixed(2))} means="How much investors are paying for expected future earnings." matters="Forward valuation should be compared with expected growth, not read alone." />
          <ExplainedMetricCard category="Growth" label="EPS Growth" rawValue={stock.epsGrowth} value={unavailable(stock.epsGrowth, (value) => `${value.toFixed(2)}%`)} means="Earnings per share growth." matters="EPS growth shows whether profits are improving for each share." />
          <ExplainedMetricCard category="Growth" label="Revenue Growth" rawValue={stock.revenueGrowth} value={unavailable(stock.revenueGrowth, (value) => `${value.toFixed(2)}%`)} means="Sales growth trend." matters="Revenue growth shows demand; EPS growth shows whether demand converts into profit." />
          <ExplainedMetricCard category="Profitability" label="Profit Margin" rawValue={stock.profitMargin} value={unavailable(stock.profitMargin, (value) => `${value.toFixed(2)}%`)} means="Profit kept from each dollar of sales." matters="Stronger margins can signal pricing power and room to handle cost pressure." />
          <ExplainedMetricCard category="Balance Sheet" label="Debt / Equity" rawValue={stock.debtToEquity} value={unavailable(stock.debtToEquity, (value) => value.toFixed(2))} means="Debt compared with shareholder equity." matters="Higher leverage can increase risk when rates rise or earnings weaken." />
          <ExplainedMetricCard category="Momentum" label="RSI" rawValue={stock.rsi} value={unavailable(stock.rsi, (value) => value.toFixed(2))} means="A momentum indicator from 0 to 100." matters="Above 70 can mean the stock is overheated short term; below 30 can mean weak or oversold." />
          <ExplainedMetricCard category="Momentum" label="Beta" rawValue={stock.beta} value={unavailable(stock.beta, (value) => value.toFixed(2))} means="Volatility compared with the broad market." matters="Higher beta can create larger drawdowns, so position sizing matters." />
          <ExplainedMetricCard category="Company Size" label="Market Cap" rawValue={stock.marketCap ?? Number.NaN} value={compactNumber(stock.marketCap)} means="The total market value of the company." matters="Large companies can be more established; smaller companies can offer more upside and more risk." />
          <ExplainedMetricCard category="Shareholder Returns" label="Dividend Yield" rawValue={stock.dividendYield} value={unavailable(stock.dividendYield, (value) => `${value.toFixed(2)}%`)} means="Annual dividend as a percentage of share price." matters="Useful for income investors, but dividend yield should be checked against payout safety and growth." />
          <ExplainedMetricCard category="Risk / Reward" label="Analyst Upside" rawValue={upside} value={`${upside.toFixed(1)}%`} means="Estimated distance between current price and analyst target." matters="Targets are context, not promises. They can change quickly after earnings or major news." />
        </div>
      </section>
    </>
  );
}
