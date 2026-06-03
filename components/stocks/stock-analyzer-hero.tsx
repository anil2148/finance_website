'use client';

import type { StockMetrics } from '@/lib/stocks';

type SearchResult = { symbol: string; description: string; type: string };

type Props = {
  query: string;
  setQuery: (value: string) => void;
  selectedSymbol: string;
  suggestions: SearchResult[];
  searchLoading: boolean;
  profileLoading: boolean;
  profileError: string | null;
  stock: StockMetrics | null;
  score: { total: number; rating: string } | null;
  upside: number;
  analyzeStock: (symbolOverride?: string) => void;
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

export function StockAnalyzerHero({
  query,
  setQuery,
  selectedSymbol,
  suggestions,
  searchLoading,
  profileLoading,
  profileError,
  stock,
  score,
  upside,
  analyzeStock,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-8 shadow-2xl">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">FinanceSphere Research Report</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Stock Analyzer</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">A guided stock research report for beginners and experienced investors. It explains what each signal means, why it matters, and what to verify next.</p>
          <div className="mt-5 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <GuideStep number="1" title="Quality" text="Is this a strong business with growth, profit, and manageable debt?" />
            <GuideStep number="2" title="Valuation" text="Is the stock price reasonable compared with earnings and future expectations?" />
            <GuideStep number="3" title="Risk" text="What can go wrong, and is the reward worth that risk?" />
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
              <button onClick={() => analyzeStock()} className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">Analyze</button>
            </div>
            {(suggestions.length > 0 || searchLoading) && query !== selectedSymbol && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
                {searchLoading && <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>}
                {suggestions.map((item) => (
                  <button key={`${item.symbol}-${item.description}`} onClick={() => analyzeStock(item.symbol)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm hover:bg-white/10">
                    <span className="font-bold text-white">{item.symbol}</span>
                    <span className="truncate text-slate-400">{item.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400">Start with a ticker symbol. Example: SOFI, PLTR, NVDA, AAPL, MSFT.</p>

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
            </div>
          )}
          {profileLoading && <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">Loading live snapshot...</div>}
        </div>
      </div>
    </div>
  );
}
