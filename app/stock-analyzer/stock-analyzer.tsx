'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { DecisionSupportInsights } from '@/components/stocks/decision-support-insights';
import { InvestmentCommitteeVerdict } from '@/components/stocks/investment-committee-verdict';
import { LiveIntelligencePanel } from '@/components/stocks/live-intelligence-panel';
import { StockOutlookInsights } from '@/components/stocks/stock-outlook-insights';
import { scoreStock, type StockMetrics } from '@/lib/stocks';

type SearchResult = {
  symbol: string;
  description: string;
  type: string;
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

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export default function StockAnalyzer() {
  const [query, setQuery] = useState('MSFT');
  const [selectedSymbol, setSelectedSymbol] = useState('MSFT');
  const [stock, setStock] = useState<StockMetrics | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const response = await fetch(`/api/stocks/profile?symbol=${encodeURIComponent(selectedSymbol)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || `No live stock profile found for ${selectedSymbol}.`);
        if (active) setStock(data.stock as StockMetrics);
      } catch (error) {
        if (active) {
          setStock(null);
          setProfileError(error instanceof Error ? error.message : 'Unable to load stock profile.');
        }
      } finally {
        if (active) setProfileLoading(false);
      }
    }
    loadProfile();
    return () => {
      active = false;
    };
  }, [selectedSymbol]);

  useEffect(() => {
    const value = query.trim();
    if (value.length < 1 || value.toUpperCase() === selectedSymbol) {
      setSuggestions([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(value)}`);
        const data = await response.json();
        setSuggestions(response.ok ? data.results || [] : []);
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query, selectedSymbol]);

  const score = useMemo(() => (stock ? scoreStock(stock) : null), [stock]);
  const upside = stock && stock.price > 0 ? ((stock.analystTarget - stock.price) / stock.price) * 100 : 0;

  function analyzeStock(symbolOverride?: string) {
    const symbol = (symbolOverride || query).trim().toUpperCase();
    if (!symbol) return;
    setQuery(symbol);
    setSelectedSymbol(symbol);
    setSuggestions([]);
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
                A live decision-support app powered by Finnhub, SEC EDGAR, OpenAI, and FinanceSphere scoring models.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-black/30 p-5">
              <label className="text-sm font-medium text-slate-300" htmlFor="symbol">Search stock symbol</label>
              <div className="relative mt-3">
                <div className="flex gap-3">
                  <input
                    id="symbol"
                    value={query}
                    onChange={(event) => setQuery(event.target.value.toUpperCase())}
                    onKeyDown={(event) => event.key === 'Enter' && analyzeStock()}
                    placeholder="Search SOFI, AAPL, MSFT, NVDA"
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-emerald-400 transition focus:ring-2"
                    autoComplete="off"
                  />
                  <button
                    onClick={() => analyzeStock()}
                    className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Analyze
                  </button>
                </div>
                {(suggestions.length > 0 || searchLoading) && query !== selectedSymbol && (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
                    {searchLoading && <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>}
                    {suggestions.map((item) => (
                      <button
                        key={`${item.symbol}-${item.description}`}
                        onClick={() => analyzeStock(item.symbol)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm hover:bg-white/10"
                      >
                        <span className="font-bold text-white">{item.symbol}</span>
                        <span className="truncate text-slate-400">{item.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-slate-400">Search is live from Finnhub. Invalid or unsupported symbols show an error instead of fallback data.</p>
            </div>
          </div>
        </div>

        {profileLoading && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-slate-300">
            Loading live profile for {selectedSymbol}...
          </div>
        )}

        {profileError && !profileLoading && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-100">
            <h2 className="text-2xl font-bold">Stock not found</h2>
            <p className="mt-2">{profileError}</p>
            <p className="mt-3 text-sm">Try searching for another symbol such as SOFI, AAPL, MSFT, NVDA, PLTR, or AMD.</p>
          </div>
        )}

        {stock && score && !profileLoading && !profileError && (
          <>
            <div className="mt-8 grid gap-6 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:col-span-1">
                <p className="text-sm text-slate-400">Live score</p>
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
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}% today
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 text-right">
                    <p className="text-sm text-slate-400">Estimated target</p>
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

            <LiveIntelligencePanel symbol={selectedSymbol} />

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <MetricCard label="P/E Ratio" value={stock.pe.toFixed(2)} note="Lower can mean cheaper valuation" />
              <MetricCard label="EPS Growth" value={`${stock.epsGrowth.toFixed(2)}%`} note="Higher growth improves score" />
              <MetricCard label="Profit Margin" value={`${stock.profitMargin.toFixed(2)}%`} note="Shows business efficiency" />
              <MetricCard label="Debt / Equity" value={stock.debtToEquity.toFixed(2)} note="Lower is usually safer" />
              <MetricCard label="RSI" value={stock.rsi.toFixed(2)} note="30 oversold, 70 overbought" />
              <MetricCard label="Dividend Yield" value={`${stock.dividendYield.toFixed(2)}%`} note="Income return from dividends" />
            </div>

            <InvestmentCommitteeVerdict stock={stock} />
            <DecisionSupportInsights stock={stock} />
            <StockOutlookInsights stock={stock} />
          </>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold">Growth trend</h3>
            <p className="mt-1 text-sm text-slate-400">Revenue trend visualization placeholder. Historical chart API integration can be added next.</p>
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
            <h3 className="text-xl font-bold">Important disclaimer</h3>
            <div className="mt-4 space-y-4 text-slate-300">
              <p>FinanceSphere helps users structure decisions with data, but it does not know your full financial situation, time horizon, tax profile, or risk tolerance.</p>
              <p>Use this tool to identify what to research next: earnings quality, valuation, debt, growth durability, technical setup, and position-sizing risk.</p>
              <p className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                Educational information only. This is not financial advice or a recommendation to buy or sell any security.
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
