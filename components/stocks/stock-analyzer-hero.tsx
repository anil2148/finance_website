'use client';

import type { StockMetrics } from '@/lib/stocks';
import type { RecentAnalyzedStock } from '@/lib/stock-local-storage';

type SearchResult = { symbol: string; description: string; exchange?: string; type: string };

type Props = {
  query: string;
  setQuery: (value: string) => void;
  selectedSymbol: string;
  suggestions: SearchResult[];
  searchLoading: boolean;
  searchMessage?: string | null;
  profileLoading: boolean;
  profileError: string | null;
  isAnalyzing: boolean;
  isRefreshing: boolean;
  lastUpdated?: string | null;
  dataSourceStatus?: string | null;
  isFallback?: boolean;
  profileWarning?: string | null;
  stock: StockMetrics | null;
  score: { total: number; rating: string } | null;
  upside: number;
  recentStocks?: RecentAnalyzedStock[];
  analyzeStock: (symbolOverride?: string) => void;
  onRefresh: () => void;
};

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function GuideStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">{number}</span>
        <strong className="text-white">{title}</strong>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>
    </div>
  );
}

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" aria-hidden="true" />;
}

function formatUpdated(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatRecentTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Saved locally';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function StockAnalyzerHero({
  query,
  setQuery,
  selectedSymbol,
  suggestions,
  searchLoading,
  searchMessage,
  profileLoading,
  profileError,
  isAnalyzing,
  isRefreshing,
  lastUpdated,
  dataSourceStatus,
  isFallback,
  profileWarning,
  stock,
  score,
  upside,
  recentStocks = [],
  analyzeStock,
  onRefresh,
}: Props) {
  const updatedAt = formatUpdated(lastUpdated);
  const pendingSymbol = query.trim().toUpperCase() || selectedSymbol;
  const buttonText = isAnalyzing ? (isRefreshing ? 'Refreshing...' : 'Analyzing...') : 'Analyze';
  const showSuggestions = (suggestions.length > 0 || searchLoading || searchMessage) && query.trim().toUpperCase() !== selectedSymbol;

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-8 shadow-2xl">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">AI-powered market research</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Analyze any stock like an investment committee.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">Get a clear verdict, entry plan, valuation context, earnings risk, smart money signals, and options decision support in one guided workspace.</p>
          <div className="mt-5 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <GuideStep number="1" title="Decision score" text="See whether the setup points to buy, wait, trim, or avoid." />
            <GuideStep number="2" title="Entry plan" text="Build a staged buying plan instead of chasing a hot move." />
            <GuideStep number="3" title="Risk checklist" text="Spot valuation, earnings, debt, and momentum risks before acting." />
          </div>
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
                disabled={isAnalyzing}
                className="inline-flex min-w-[118px] items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAnalyzing && <Spinner />}
                {buttonText}
              </button>
            </div>
            {showSuggestions && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
                {searchLoading && <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>}
                {suggestions.map((item) => (
                  <button key={`${item.symbol}-${item.description}`} onClick={() => analyzeStock(item.symbol)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm hover:bg-white/10">
                    <span className="min-w-0">
                      <span className="block font-bold text-white">{item.symbol}</span>
                      <span className="block truncate text-slate-400">{item.description}</span>
                    </span>
                    <span className="shrink-0 text-xs text-slate-500">{item.exchange || item.type}</span>
                  </button>
                ))}
                {!searchLoading && !suggestions.length && searchMessage && (
                  <div className="px-4 py-3 text-sm text-slate-400">{searchMessage}</div>
                )}
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400">
            <p>Search by ticker or company name. Example: SOFI, PLTR, NVDA, AAPL, MSFT.</p>
            {isAnalyzing && <p className="text-emerald-200">{isRefreshing ? `Refreshing ${selectedSymbol}...` : `Analyzing ${pendingSymbol}...`}</p>}
            {!isAnalyzing && updatedAt && <p className="text-emerald-200">{selectedSymbol} updated just now · Last updated: {updatedAt}{dataSourceStatus ? ` · Source: ${dataSourceStatus}` : ''}</p>}
            {profileError && <p className="text-red-200">Could not refresh {selectedSymbol}. Try again.</p>}
          </div>

          {recentStocks.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Recently analyzed</p>
                <p className="text-xs text-slate-500">Saved in this browser</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recentStocks.map((item) => (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => analyzeStock(item.symbol)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-left text-xs transition hover:border-emerald-300/40 hover:bg-emerald-300/10"
                  >
                    <span className="block font-black text-white">{item.symbol}</span>
                    <span className="block max-w-32 truncate text-slate-400">{item.companyName}</span>
                    <span className="block text-slate-500">
                      {currency(item.lastPrice)}{item.verdict ? ` · ${item.verdict}` : ''} · {formatRecentTime(item.analyzedAt)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {stock && score && !profileLoading && !profileError && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Live Snapshot</p>
                  <h2 className="mt-1 text-xl font-bold text-white">{stock.symbol} · {stock.name}</h2>
                  <p className="mt-2 text-3xl font-black text-white">{currency(stock.price)}</p>
                  <p className={stock.changePercent >= 0 ? 'text-sm text-emerald-300' : 'text-sm text-red-300'}>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}% today</p>
                </div>
                {stock.logo && <img src={stock.logo} alt={`${stock.name} logo`} className="h-12 w-12 rounded-xl bg-white p-1" />}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-black/20 p-3"><p className="text-xs text-slate-400">Score</p><p className="text-lg font-bold text-emerald-300">{score.total}/100</p></div>
                <div className="rounded-xl bg-black/20 p-3"><p className="text-xs text-slate-400">Rating</p><p className="text-lg font-bold text-white">{score.rating}</p></div>
                <div className="rounded-xl bg-black/20 p-3"><p className="text-xs text-slate-400">Upside</p><p className={upside >= 0 ? 'text-lg font-bold text-emerald-300' : 'text-lg font-bold text-red-300'}>{upside.toFixed(1)}%</p></div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-slate-400">
                  {updatedAt && <p>Last updated: {updatedAt}</p>}
                  {dataSourceStatus && <p>Source: {dataSourceStatus}</p>}
                </div>
                <button
                  onClick={onRefresh}
                  disabled={isAnalyzing}
                  className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              {(isFallback || profileWarning) && (
                <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm leading-6 text-amber-100">
                  {profileWarning || 'Some data may be limited because provider data was unavailable.'}
                </div>
              )}
            </div>
          )}
          {profileLoading && <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">Building investment view for {selectedSymbol}: checking valuation, growth, momentum, earnings, and risk signals...</div>}
        </div>
      </div>
    </div>
  );
}
