'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdvancedResearchThesis } from '@/components/stocks/advanced-research-thesis';
import { DecisionSupportInsights } from '@/components/stocks/decision-support-insights';
import { EarningsIntelligencePanel } from '@/components/stocks/earnings-intelligence-panel';
import { InvestmentCommitteeVerdict } from '@/components/stocks/investment-committee-verdict';
import { LiveIntelligencePanel } from '@/components/stocks/live-intelligence-panel';
import { SmartMoneyPanel } from '@/components/stocks/smart-money-panel';
import { StockAnalyzerHero } from '@/components/stocks/stock-analyzer-hero';
import { StockEarningsSection } from '@/components/stocks/stock-earnings-section';
import { StockMetricsSection } from '@/components/stocks/stock-metrics-section';
import { StockOverviewSection } from '@/components/stocks/stock-overview-section';
import { StockOutlookInsights } from '@/components/stocks/stock-outlook-insights';
import { scoreStock, type StockMetrics } from '@/lib/stocks';

type SearchResult = { symbol: string; description: string; type: string };
type Candle = { date: string; open: number; high: number; low: number; close: number; volume: number };
type EarningsItem = { date?: string; epsActual?: number; epsEstimate?: number; revenueActual?: number; revenueEstimate?: number; quarter?: number; year?: number };

function getBeginnerVerdict(stock: StockMetrics, score: ReturnType<typeof scoreStock>, upside: number) {
  const positives = [stock.revenueGrowth > 10 ? 'Revenue growth is healthy, which can support a bullish outlook.' : 'Revenue growth is modest, so future upside may depend on improvement.', stock.profitMargin > 15 ? 'Profit margin looks strong enough to suggest business efficiency.' : 'Profit margin is weaker, so cost control matters.', stock.debtToEquity < 1 ? 'Debt looks manageable, which can reduce financial risk.' : 'Debt is higher, so balance-sheet risk should be watched.'];
  const risks = [stock.forwardPe > 35 ? 'Forward P/E is high, meaning expectations may already be priced in.' : 'Valuation is not extremely stretched based on forward P/E.', stock.rsi > 70 ? 'RSI suggests the stock may be overbought in the short term.' : stock.rsi < 35 ? 'RSI suggests weak momentum, but it may attract dip buyers.' : 'RSI is not at an extreme level.', upside < 0 ? 'Estimated target is below current price, which is a bearish risk.' : 'Estimated target suggests some upside, but verify with analyst data.'];
  return { headline: score.total >= 70 ? 'Potentially constructive, but verify risks' : score.total >= 50 ? 'Mixed signals — research further' : 'Risky setup — be cautious', positives, risks };
}

function getDecisionChecklist(stock: StockMetrics, score: ReturnType<typeof scoreStock>, upside: number) {
  return [
    { title: 'Business Quality', status: stock.profitMargin > 15 && stock.roe > 10 ? 'Looks healthy' : 'Needs review', detail: stock.profitMargin > 15 ? 'Margins suggest the company keeps a reasonable amount of sales as profit.' : 'Margins are not strong; check whether costs are rising or growth is slowing.' },
    { title: 'Growth Strength', status: stock.revenueGrowth > 10 || stock.epsGrowth > 10 ? 'Growth driver' : 'Moderate growth', detail: 'Look for revenue and EPS growth together. Revenue shows demand; EPS shows profit growth.' },
    { title: 'Valuation Risk', status: stock.forwardPe > 35 ? 'Expensive expectations' : 'Reasonable watch', detail: 'A high P/E is not always bad, but it means the stock needs strong future growth to justify the price.' },
    { title: 'Balance Sheet', status: stock.debtToEquity < 1 ? 'Manageable debt' : 'Debt risk', detail: 'Lower debt gives companies more flexibility during weak markets or high-rate periods.' },
    { title: 'Momentum', status: stock.rsi > 70 ? 'Possibly overbought' : stock.rsi < 35 ? 'Weak or oversold' : 'Balanced', detail: 'RSI is short-term momentum. It should not be used alone, but it can help with entry timing.' },
    { title: 'Risk/Reward', status: upside > 10 && score.total >= 60 ? 'Potentially attractive' : 'Needs patience', detail: 'Compare possible upside with the downside risks. Do not rely only on one target price.' },
  ];
}

export default function StockAnalyzer() {
  const [query, setQuery] = useState('MSFT');
  const [selectedSymbol, setSelectedSymbol] = useState('MSFT');
  const [stock, setStock] = useState<StockMetrics | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [earnings, setEarnings] = useState<EarningsItem[]>([]);
  const [earningsSource, setEarningsSource] = useState<string | null>(null);
  const [chatQuestion, setChatQuestion] = useState('Should I buy this stock for the next 3 years?');
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setProfileLoading(true); setProfileError(null);
      try { const response = await fetch(`/api/stocks/profile?symbol=${encodeURIComponent(selectedSymbol)}`); const data = await response.json(); if (!response.ok) throw new Error(data?.error || `No live stock profile found for ${selectedSymbol}.`); if (active) setStock(data.stock as StockMetrics); }
      catch (error) { if (active) { setStock(null); setProfileError(error instanceof Error ? error.message : 'Unable to load stock profile.'); } }
      finally { if (active) setProfileLoading(false); }
    }
    loadProfile(); return () => { active = false; };
  }, [selectedSymbol]);

  useEffect(() => {
    let active = true;
    async function loadResearchData() {
      try { const [candlesResponse, earningsResponse] = await Promise.all([fetch(`/api/stocks/candles?symbol=${encodeURIComponent(selectedSymbol)}`), fetch(`/api/stocks/earnings?symbol=${encodeURIComponent(selectedSymbol)}`)]); const candlesData = await candlesResponse.json(); const earningsData = await earningsResponse.json(); if (active) { setCandles(candlesResponse.ok ? candlesData.candles || [] : []); setEarnings(earningsResponse.ok ? earningsData.earnings || [] : []); setEarningsSource(earningsResponse.ok ? earningsData.source || null : null); } }
      catch { if (active) { setCandles([]); setEarnings([]); setEarningsSource(null); } }
    }
    loadResearchData(); setChatAnswer(null); setChatError(null); return () => { active = false; };
  }, [selectedSymbol]);

  useEffect(() => {
    const value = query.trim(); if (value.length < 1 || value.toUpperCase() === selectedSymbol) { setSuggestions([]); return; }
    const timeout = window.setTimeout(async () => { setSearchLoading(true); try { const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(value)}`); const data = await response.json(); setSuggestions(response.ok ? data.results || [] : []); } catch { setSuggestions([]); } finally { setSearchLoading(false); } }, 250);
    return () => window.clearTimeout(timeout);
  }, [query, selectedSymbol]);

  const score = useMemo(() => (stock ? scoreStock(stock) : null), [stock]);
  const upside = stock && stock.price > 0 ? ((stock.analystTarget - stock.price) / stock.price) * 100 : 0;
  const beginnerVerdict = stock && score ? getBeginnerVerdict(stock, score, upside) : null;
  const checklist = stock && score ? getDecisionChecklist(stock, score, upside) : [];

  function analyzeStock(symbolOverride?: string) { const symbol = (symbolOverride || query).trim().toUpperCase(); if (!symbol) return; setQuery(symbol); setSelectedSymbol(symbol); setSuggestions([]); }
  async function askAi() { setChatLoading(true); setChatError(null); setChatAnswer(null); try { const response = await fetch('/api/stocks/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symbol: selectedSymbol, question: chatQuestion }) }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Unable to generate AI answer.'); setChatAnswer(data.answer); } catch (error) { setChatError(error instanceof Error ? error.message : 'Unable to generate AI answer.'); } finally { setChatLoading(false); } }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8"><section className="mx-auto max-w-7xl">
      <StockAnalyzerHero query={query} setQuery={setQuery} selectedSymbol={selectedSymbol} suggestions={suggestions} searchLoading={searchLoading} profileLoading={profileLoading} profileError={profileError} stock={stock} score={score} upside={upside} analyzeStock={analyzeStock} />
      <GlossaryPanel />
      {profileError && !profileLoading && <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-100"><h2 className="text-2xl font-bold">Stock not found</h2><p className="mt-2">{profileError}</p><p className="mt-3 text-sm">Try searching for another symbol such as SOFI, AAPL, MSFT, NVDA, PLTR, or AMD.</p></div>}
      {stock && score && !profileLoading && !profileError && <>
        {beginnerVerdict && <StockOverviewSection verdict={beginnerVerdict} score={score} upside={upside} />}
        <AdvancedResearchThesis stock={stock} score={score} upside={upside} />
        <SmartMoneyPanel symbol={selectedSymbol} />
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="text-xl font-bold">Decision Checklist</h3><p className="mt-2 text-sm text-slate-400">A beginner-friendly checklist to help you avoid making a decision from only one number.</p><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{checklist.map((item) => <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-sm text-slate-400">{item.title}</p><h4 className="mt-1 text-lg font-bold text-white">{item.status}</h4><p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p></div>)}</div></section>
        <StockMetricsSection stock={stock} score={score} candles={candles} upside={upside} />
        <LiveIntelligencePanel symbol={selectedSymbol} />
        <EarningsIntelligencePanel earnings={earnings} source={earningsSource} />
        <StockEarningsSection earnings={earnings} source={earningsSource} />
        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6"><h3 className="text-xl font-bold">Ask FinanceSphere AI</h3><p className="mt-2 text-sm text-slate-300">Use AI like an investment research assistant. Ask for bull case, bear case, valuation risk, earnings risk, and what to verify next.</p><textarea value={chatQuestion} onChange={(event) => setChatQuestion(event.target.value)} className="mt-4 min-h-24 w-full rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none ring-emerald-400 focus:ring-2" /><div className="mt-3 flex flex-wrap gap-2">{['Explain this stock like I am new to investing.', 'What is the bull case?', 'What are the biggest risks?', 'Is the valuation expensive?', 'What should I verify before buying?'].map((question) => <button key={question} onClick={() => setChatQuestion(question)} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-200 hover:bg-white/10">{question}</button>)}</div><button onClick={askAi} disabled={chatLoading || !chatQuestion.trim()} className="mt-3 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">{chatLoading ? 'Analyzing...' : 'Ask AI'}</button>{chatError && <p className="mt-3 text-sm text-red-200">{chatError}</p>}{chatAnswer && <div className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-100">{chatAnswer}</div>}</div>
        <InvestmentCommitteeVerdict stock={stock} /><DecisionSupportInsights stock={stock} /><StockOutlookInsights stock={stock} />
      </>}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="text-xl font-bold">Important disclaimer</h3><div className="mt-4 space-y-4 text-slate-300"><p>FinanceSphere helps users structure decisions with data, but it does not know your full financial situation, time horizon, tax profile, or risk tolerance.</p><p>Use this tool to identify what to research next: earnings quality, valuation, debt, growth durability, technical setup, and position-sizing risk.</p><p className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">Educational information only. This is not financial advice or a recommendation to buy or sell any security.</p></div></div>
    </section></main>
  );
}

function GlossaryPanel() { const terms = [['Bullish', 'You expect the stock may go up. Usually supported by strong growth, profits, momentum, or positive news.'], ['Bearish', 'You expect the stock may go down or underperform. Often caused by weak growth, high valuation, debt, or bad news.'], ['P/E Ratio', 'Price divided by earnings. It helps judge whether the stock is expensive compared with profits.'], ['EPS', 'Earnings per share. It shows how much profit belongs to each share. Growing EPS is usually positive.'], ['Revenue', 'Total sales. Revenue growth means the business is selling more.'], ['Profit Margin', 'Profit as a percentage of sales. Higher margin means the company keeps more money after expenses.'], ['Debt / Equity', 'Debt compared with shareholder equity. Higher debt can increase risk.'], ['RSI', 'Relative Strength Index. A momentum signal: above 70 may be overbought, below 30 may be oversold.'], ['Market Cap', 'Stock price times shares outstanding. It measures company size.'], ['Dividend Yield', 'Annual dividends divided by stock price. Important for income investors.']]; return <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Stock Market Legend</p><h2 className="mt-2 text-2xl font-bold">New to stocks? Start here.</h2></div><p className="max-w-2xl text-sm text-slate-400">Use this legend while reading the page. It explains the most common terms in plain English.</p></div><div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{terms.map(([term, explanation]) => <div key={term} className="rounded-xl border border-white/10 bg-black/20 p-4"><h3 className="font-bold text-white">{term}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{explanation}</p></div>)}</div></section>; }
