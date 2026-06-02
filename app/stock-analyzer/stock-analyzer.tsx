'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type StockMetrics = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  pe: number;
  forwardPe: number;
  epsGrowth: number;
  revenueGrowth: number;
  profitMargin: number;
  debtToEquity: number;
  roe: number;
  dividendYield: number;
  analystTarget: number;
  rsi: number;
  beta: number;
};

const demoStocks: Record<string, StockMetrics> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 214.35,
    changePercent: 1.24,
    pe: 28.4,
    forwardPe: 24.6,
    epsGrowth: 8.1,
    revenueGrowth: 5.4,
    profitMargin: 26.3,
    debtToEquity: 1.45,
    roe: 145.2,
    dividendYield: 0.47,
    analystTarget: 235,
    rsi: 58,
    beta: 1.12,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 427.8,
    changePercent: 0.86,
    pe: 34.7,
    forwardPe: 29.2,
    epsGrowth: 14.8,
    revenueGrowth: 13.2,
    profitMargin: 36.4,
    debtToEquity: 0.35,
    roe: 37.8,
    dividendYield: 0.72,
    analystTarget: 485,
    rsi: 62,
    beta: 0.94,
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 139.12,
    changePercent: 2.91,
    pe: 49.5,
    forwardPe: 35.8,
    epsGrowth: 36.5,
    revenueGrowth: 42.1,
    profitMargin: 48.8,
    debtToEquity: 0.21,
    roe: 91.4,
    dividendYield: 0.03,
    analystTarget: 165,
    rsi: 68,
    beta: 1.76,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 184.44,
    changePercent: -1.18,
    pe: 61.2,
    forwardPe: 47.4,
    epsGrowth: 6.7,
    revenueGrowth: 8.2,
    profitMargin: 9.7,
    debtToEquity: 0.18,
    roe: 13.9,
    dividendYield: 0,
    analystTarget: 205,
    rsi: 44,
    beta: 2.02,
  },
};

const chartData = [
  { month: 'Jan', price: 100, revenue: 70 },
  { month: 'Feb', price: 106, revenue: 73 },
  { month: 'Mar', price: 102, revenue: 78 },
  { month: 'Apr', price: 114, revenue: 84 },
  { month: 'May', price: 121, revenue: 89 },
  { month: 'Jun', price: 118, revenue: 94 },
  { month: 'Jul', price: 127, revenue: 101 },
  { month: 'Aug', price: 133, revenue: 108 },
  { month: 'Sep', price: 129, revenue: 112 },
  { month: 'Oct', price: 141, revenue: 118 },
  { month: 'Nov', price: 148, revenue: 124 },
  { month: 'Dec', price: 155, revenue: 131 },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function scoreStock(stock: StockMetrics) {
  const valuation = clamp(25 - stock.forwardPe * 0.45 + Math.max(0, stock.analystTarget / stock.price - 1) * 30, 0, 25);
  const growth = clamp((stock.epsGrowth + stock.revenueGrowth) * 0.6, 0, 25);
  const profitability = clamp(stock.profitMargin * 0.35 + stock.roe * 0.08, 0, 20);
  const health = clamp(15 - stock.debtToEquity * 4 + (stock.beta < 1.4 ? 3 : 0), 0, 15);
  const technical = clamp(15 - Math.abs(55 - stock.rsi) * 0.35 + (stock.changePercent > 0 ? 2 : -1), 0, 15);
  const total = Math.round(valuation + growth + profitability + health + technical);

  let rating = 'Avoid';
  if (total >= 80) rating = 'Strong Buy';
  else if (total >= 65) rating = 'Buy';
  else if (total >= 50) rating = 'Hold';

  return {
    total,
    rating,
    parts: [
      { name: 'Valuation', value: Math.round(valuation), max: 25 },
      { name: 'Growth', value: Math.round(growth), max: 25 },
      { name: 'Profitability', value: Math.round(profitability), max: 20 },
      { name: 'Financial Health', value: Math.round(health), max: 15 },
      { name: 'Technical Trend', value: Math.round(technical), max: 15 },
    ],
  };
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export default function StockAnalyzer() {
  const [query, setQuery] = useState('MSFT');
  const [selectedSymbol, setSelectedSymbol] = useState('MSFT');
  const stock = demoStocks[selectedSymbol] ?? demoStocks.MSFT;
  const score = useMemo(() => scoreStock(stock), [stock]);
  const upside = ((stock.analystTarget - stock.price) / stock.price) * 100;

  function analyzeStock() {
    const symbol = query.trim().toUpperCase();
    setSelectedSymbol(demoStocks[symbol] ? symbol : 'MSFT');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">FinanceSphere Tool</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Stock Analyzer</h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                Compare valuation, growth, profitability, balance-sheet risk, and technical momentum in one simple stock score.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-black/30 p-5">
              <label className="text-sm font-medium text-slate-300" htmlFor="symbol">Enter stock symbol</label>
              <div className="mt-3 flex gap-3">
                <input
                  id="symbol"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && analyzeStock()}
                  placeholder="AAPL, MSFT, NVDA"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-emerald-400 transition focus:ring-2"
                />
                <button
                  onClick={analyzeStock}
                  className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Analyze
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-400">Demo symbols: AAPL, MSFT, NVDA, TSLA. Connect a stock API later for live data.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:col-span-1">
            <p className="text-sm text-slate-400">Overall score</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-6xl font-black text-emerald-300">{score.total}</span>
              <span className="pb-2 text-slate-400">/100</span>
            </div>
            <p className="mt-4 rounded-full bg-emerald-400/10 px-4 py-2 text-center font-semibold text-emerald-300">{score.rating}</p>
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
              <div>
                <p className="text-sm text-slate-400">{stock.symbol}</p>
                <h2 className="text-3xl font-bold">{stock.name}</h2>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-3xl font-bold">{currency(stock.price)}</span>
                  <span className={stock.changePercent >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}% today
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 text-right">
                <p className="text-sm text-slate-400">Analyst target</p>
                <p className="text-2xl font-bold">{currency(stock.analystTarget)}</p>
                <p className={upside >= 0 ? 'text-emerald-300' : 'text-red-300'}>{upside.toFixed(1)}% upside</p>
              </div>
            </div>

            <div className="mt-8 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#020617', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="price" stroke="#34d399" fill="url(#priceGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <MetricCard label="P/E Ratio" value={stock.pe.toString()} note="Lower can mean cheaper valuation" />
          <MetricCard label="EPS Growth" value={`${stock.epsGrowth}%`} note="Higher growth improves score" />
          <MetricCard label="Profit Margin" value={`${stock.profitMargin}%`} note="Shows business efficiency" />
          <MetricCard label="Debt / Equity" value={stock.debtToEquity.toString()} note="Lower is usually safer" />
          <MetricCard label="RSI" value={stock.rsi.toString()} note="30 oversold, 70 overbought" />
          <MetricCard label="Dividend Yield" value={`${stock.dividendYield}%`} note="Income return from dividends" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold">Growth trend</h3>
            <p className="mt-1 text-sm text-slate-400">Demo revenue trend for visualization.</p>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#020617', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Bar dataKey="revenue" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold">AI-style insight</h3>
            <div className="mt-4 space-y-4 text-slate-300">
              <p>
                {stock.name} currently receives a <strong className="text-white">{score.rating}</strong> rating based on a {score.total}/100 blended score.
              </p>
              <p>
                The strongest areas are growth and profitability. Watch valuation risk if forward P/E stays elevated or RSI moves above 70.
              </p>
              <p className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                Educational demo only. This is not financial advice. Add live market data and disclosures before production launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{note}</p>
    </div>
  );
}
