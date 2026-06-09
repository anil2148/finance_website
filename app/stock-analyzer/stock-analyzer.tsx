'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdvancedResearchThesis } from '@/components/stocks/advanced-research-thesis';
import { CompetitorComparison } from '@/components/stocks/competitor-comparison';
import { DecisionSupportInsights } from '@/components/stocks/decision-support-insights';
import { EarningsIntelligencePanel } from '@/components/stocks/earnings-intelligence-panel';
import { EntryPricePlanner } from '@/components/stocks/entry-price-planner';
import { InvestmentCommitteeVerdict } from '@/components/stocks/investment-committee-verdict';
import { LiveIntelligencePanel } from '@/components/stocks/live-intelligence-panel';
import { OptionsStrategyHelper } from '@/components/stocks/options-strategy-helper';
import { PortfolioAwareDecision } from '@/components/stocks/portfolio-aware-decision';
import { ResearchReportExport } from '@/components/stocks/research-report-export';
import { SmartMoneyPanel } from '@/components/stocks/smart-money-panel';
import { StockAISection } from '@/components/stocks/stock-ai-section';
import { StockAnalyzerHero } from '@/components/stocks/stock-analyzer-hero';
import { StockDecisionSection } from '@/components/stocks/stock-decision-section';
import { StockEarningsSection } from '@/components/stocks/stock-earnings-section';
import { StockMetricsSection } from '@/components/stocks/stock-metrics-section';
import { StockOverviewSection } from '@/components/stocks/stock-overview-section';
import { StockResearchTabs } from '@/components/stocks/stock-research-tabs';
import { StockOutlookInsights } from '@/components/stocks/stock-outlook-insights';
import { WatchlistAlertsPanel } from '@/components/stocks/watchlist-alerts-panel';
import { WhatChangedPanel } from '@/components/stocks/what-changed-panel';
import { scoreStock, type StockMetrics } from '@/lib/stocks';

type SearchResult = { symbol: string; description: string; exchange?: string; type: string };
type Candle = { date: string; open: number; high: number; low: number; close: number; volume: number };
type EarningsItem = { date?: string; epsActual?: number; epsEstimate?: number; revenueActual?: number; revenueEstimate?: number; quarter?: number; year?: number };
type StockApiMeta = { symbol?: string; fetchedAt?: string; source?: string; isFallback?: boolean; warning?: string; error?: string; message?: string };
type ProfileResponse = StockApiMeta & { stock?: StockMetrics };
type SearchResponse = StockApiMeta & { results?: SearchResult[] };
type CandlesResponse = StockApiMeta & { candles?: Candle[] };
type EarningsResponse = StockApiMeta & { earnings?: EarningsItem[] };

const researchTabLabels: Record<string, string> = {
  decision: 'Decision',
  entry: 'Entry Planner',
  portfolio: 'Portfolio',
  options: 'Options',
  compare: 'Compare',
  watchlist: 'Watchlist',
  overview: 'Overview',
  thesis: 'Thesis',
  'smart-money': 'Smart Money',
  metrics: 'Metrics',
  earnings: 'Earnings',
  ai: 'AI Assistant',
};

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshMode, setRefreshMode] = useState<'new' | 'same'>('new');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileFetchedAt, setProfileFetchedAt] = useState<string | null>(null);
  const [profileSource, setProfileSource] = useState<string | null>(null);
  const [profileWarning, setProfileWarning] = useState<string | null>(null);
  const [profileFallback, setProfileFallback] = useState(false);
  const [requestStatus, setRequestStatus] = useState('Loading live quote...');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartWarning, setChartWarning] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<EarningsItem[]>([]);
  const [earningsSource, setEarningsSource] = useState<string | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState<string | null>(null);
  const [earningsWarning, setEarningsWarning] = useState<string | null>(null);
  const [chatQuestion, setChatQuestion] = useState('Should I buy this stock for the next 3 years?');
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [currentReportTab, setCurrentReportTab] = useState('decision');

  useEffect(() => {
    const controller = new AbortController();
    const requestedSymbol = selectedSymbol;
    async function loadProfile() {
      setProfileLoading(true);
      setProfileError(null);
      setProfileWarning(null);
      setRequestStatus(refreshMode === 'same' ? `Refreshing ${requestedSymbol}...` : `Analyzing ${requestedSymbol}...`);
      try {
        const response = await fetch(`/api/stocks/profile?symbol=${encodeURIComponent(requestedSymbol)}&refresh=${refreshKey}`, { cache: 'no-store', signal: controller.signal });
        const data = await response.json() as ProfileResponse;
        if (controller.signal.aborted) return;
        if (!response.ok || !data.stock) throw new Error(data?.error || `Could not load live data for ${requestedSymbol}. Please verify the ticker or try again.`);
        if (data.symbol && data.symbol !== requestedSymbol) return;
        setStock(data.stock);
        setProfileFetchedAt(data.fetchedAt || new Date().toISOString());
        setProfileSource(data.source || 'Provider');
        setProfileFallback(Boolean(data.isFallback));
        setProfileWarning(data.warning || null);
        setRequestStatus(`${requestedSymbol} updated just now`);
      } catch (error) {
        if (controller.signal.aborted) return;
        setStock(null);
        setProfileFetchedAt(null);
        setProfileSource(null);
        setProfileFallback(false);
        setProfileWarning(null);
        setProfileError(error instanceof Error ? error.message : `Could not load live data for ${requestedSymbol}. Please verify the ticker or try again.`);
        setRequestStatus(`Could not refresh ${requestedSymbol}. Try again.`);
      } finally {
        if (!controller.signal.aborted) setProfileLoading(false);
      }
    }
    loadProfile();
    return () => controller.abort();
  }, [selectedSymbol, refreshKey, refreshMode]);

  useEffect(() => {
    const controller = new AbortController();
    const requestedSymbol = selectedSymbol;
    async function loadResearchData() {
      setChartLoading(true);
      setEarningsLoading(true);
      setChartError(null);
      setChartWarning(null);
      setEarningsError(null);
      setEarningsWarning(null);
      try {
        const [candlesResponse, earningsResponse] = await Promise.all([
          fetch(`/api/stocks/candles?symbol=${encodeURIComponent(requestedSymbol)}&refresh=${refreshKey}`, { cache: 'no-store', signal: controller.signal }),
          fetch(`/api/stocks/earnings?symbol=${encodeURIComponent(requestedSymbol)}&refresh=${refreshKey}`, { cache: 'no-store', signal: controller.signal }),
        ]);
        const candlesData = await candlesResponse.json() as CandlesResponse;
        const earningsData = await earningsResponse.json() as EarningsResponse;
        if (controller.signal.aborted) return;

        if (candlesResponse.ok && (!candlesData.symbol || candlesData.symbol === requestedSymbol)) {
          setCandles(candlesData.candles || []);
          setChartWarning(candlesData.warning || null);
        } else {
          setCandles([]);
          setChartError(candlesData.error || 'Historical chart unavailable right now.');
        }

        if (earningsResponse.ok && (!earningsData.symbol || earningsData.symbol === requestedSymbol)) {
          setEarnings(earningsData.earnings || []);
          setEarningsSource(earningsData.source || null);
          setEarningsWarning(earningsData.warning || null);
        } else {
          setEarnings([]);
          setEarningsSource(null);
          setEarningsError(earningsData.error || 'Earnings data unavailable right now.');
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setCandles([]);
        setEarnings([]);
        setEarningsSource(null);
        setChartError('Historical chart unavailable right now.');
        setEarningsError('Earnings data unavailable right now.');
      } finally {
        if (!controller.signal.aborted) {
          setChartLoading(false);
          setEarningsLoading(false);
        }
      }
    }
    loadResearchData(); setChatAnswer(null); setChatError(null); return () => controller.abort();
  }, [selectedSymbol, refreshKey]);

  useEffect(() => {
    const value = query.trim().toUpperCase();
    setSearchMessage(null);
    if (value.length < 1 || value === selectedSymbol) { setSuggestions([]); setSearchLoading(false); return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(value)}&refresh=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
        const data = await response.json() as SearchResponse;
        if (controller.signal.aborted) return;
        const results = response.ok ? data.results || [] : [];
        setSuggestions(results);
        setSearchMessage(results.length ? null : data.message || `No matches found for ${value}.`);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setSearchMessage(`No matches found for ${value}.`);
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 275);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [query, selectedSymbol]);

  const score = useMemo(() => (stock ? scoreStock(stock) : null), [stock]);
  const upside = stock && stock.price > 0 ? ((stock.analystTarget - stock.price) / stock.price) * 100 : 0;
  const beginnerVerdict = stock && score ? getBeginnerVerdict(stock, score, upside) : null;
  const checklist = stock && score ? getDecisionChecklist(stock, score, upside) : [];

  function analyzeStock(symbolOverride?: string) {
    const symbol = (symbolOverride || query).trim().toUpperCase();
    if (!symbol) return;
    const sameSymbol = symbol === selectedSymbol;
    setQuery(symbol);
    setSelectedSymbol(symbol);
    setSuggestions([]);
    setSearchMessage(null);
    setRefreshMode(sameSymbol ? 'same' : 'new');
    if (!sameSymbol) {
      setStock(null);
      setCandles([]);
      setEarnings([]);
      setEarningsSource(null);
      setProfileFetchedAt(null);
      setProfileSource(null);
      setProfileWarning(null);
      setProfileFallback(false);
      setProfileError(null);
    }
    setRefreshKey((key) => key + 1);
  }
  function refreshCurrentStock() {
    setQuery(selectedSymbol);
    setSuggestions([]);
    setSearchMessage(null);
    setRefreshMode('same');
    setRefreshKey((key) => key + 1);
  }
  async function askAi() { setChatLoading(true); setChatError(null); setChatAnswer(null); try { const response = await fetch('/api/stocks/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ symbol: selectedSymbol, question: chatQuestion }) }); const data = await response.json(); if (!response.ok) throw new Error(data?.error || 'Unable to generate AI answer.'); setChatAnswer(data.answer); } catch (error) { setChatError(error instanceof Error ? error.message : 'Unable to generate AI answer.'); } finally { setChatLoading(false); } }

  const tabs = stock && score && !profileLoading && !profileError ? [
    { id: 'decision', label: 'Decision', description: 'Buy, hold, reduce, or sell view with confidence, reasons, risks, and what to monitor.', content: earningsLoading ? <LoadingCard title={`Updating decision model for ${selectedSymbol}...`} text="Checking earnings history and recalculating risk/reward before showing the Decision tab." /> : <><WarningCard text={earningsWarning} /><WhatChangedPanel stock={stock} score={score} upside={upside} /><div className="mt-6"><StockDecisionSection stock={stock} score={score} earnings={earnings} upside={upside} /></div></> },
    { id: 'entry', label: 'Entry Planner', description: 'Plan buy zones, staged entries, pullbacks, and risk levels.', content: <EntryPricePlanner stock={stock} score={score} upside={upside} /> },
    { id: 'portfolio', label: 'Portfolio', description: 'Personalize buy/hold/trim decision based on your portfolio exposure.', content: <PortfolioAwareDecision stock={stock} score={score} /> },
    { id: 'options', label: 'Options', description: 'Covered call, cash-secured put, and buy-to-close decision helper.', content: <OptionsStrategyHelper stock={stock} /> },
    { id: 'compare', label: 'Compare', description: 'Compare this stock against competitors using growth, valuation, risk, and quality.', content: <CompetitorComparison stock={stock} /> },
    { id: 'watchlist', label: 'Watchlist', description: 'Save stocks, planned entry prices, and alert conditions locally.', content: <WatchlistAlertsPanel stock={stock} score={score} upside={upside} /> },
    { id: 'overview', label: 'Overview', description: 'Executive summary, beginner checklist, and live intelligence.', content: <>{beginnerVerdict && <StockOverviewSection verdict={beginnerVerdict} score={score} upside={upside} />}<section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="text-xl font-bold">Decision Checklist</h3><p className="mt-2 text-sm text-slate-400">A beginner-friendly checklist to help you avoid making a decision from only one number.</p><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{checklist.map((item) => <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-sm text-slate-400">{item.title}</p><h4 className="mt-1 text-lg font-bold text-white">{item.status}</h4><p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p></div>)}</div></section><LiveIntelligencePanel symbol={selectedSymbol} refreshKey={refreshKey} /></> },
    { id: 'thesis', label: 'Thesis', description: 'Investment thesis, bull case, bear case, SWOT, and committee-style decision support.', content: <><AdvancedResearchThesis stock={stock} score={score} upside={upside} /><InvestmentCommitteeVerdict stock={stock} /><DecisionSupportInsights stock={stock} /><StockOutlookInsights stock={stock} /></> },
    { id: 'smart-money', label: 'Smart Money', description: 'Insider transactions and institutional ownership signals.', content: <SmartMoneyPanel symbol={selectedSymbol} refreshKey={refreshKey} /> },
    { id: 'metrics', label: 'Metrics', description: 'Score, chart, company overview, and key metric explanations.', content: <>{chartLoading && <LoadingCard title="Refreshing historical chart..." text={`Fetching fresh price history for ${selectedSymbol}.`} />}<WarningCard text={chartWarning || chartError} /><StockMetricsSection stock={stock} score={score} candles={candles} upside={upside} /></> },
    { id: 'earnings', label: 'Earnings', description: 'Earnings beat rate, surprise, and detailed earnings history.', content: <>{earningsLoading && <LoadingCard title="Checking earnings history..." text={`Fetching fresh earnings rows for ${selectedSymbol}.`} />}<WarningCard text={earningsWarning || earningsError} /><EarningsIntelligencePanel earnings={earnings} source={earningsSource} /><StockEarningsSection earnings={earnings} source={earningsSource} /></> },
    { id: 'ai', label: 'AI Assistant', description: 'Ask beginner-friendly research questions. Includes local fallback when OpenAI quota is unavailable.', content: <StockAISection question={chatQuestion} setQuestion={setChatQuestion} answer={chatAnswer} loading={chatLoading} error={chatError} askAi={askAi} /> },
    { id: 'export', label: 'Export', description: 'Export the current tab or full research report as a clean PDF.', content: <ResearchReportExport stock={stock} score={score} upside={upside} earnings={earnings} earningsSource={earningsSource} currentTabId={currentReportTab} currentTabLabel={researchTabLabels[currentReportTab]} beginnerVerdict={beginnerVerdict} checklist={checklist} aiQuestion={chatQuestion} aiAnswer={chatAnswer} /> },
  ] : [];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8"><section className="mx-auto max-w-7xl">
      <StockAnalyzerHero query={query} setQuery={setQuery} selectedSymbol={selectedSymbol} suggestions={suggestions} searchLoading={searchLoading} searchMessage={searchMessage} profileLoading={profileLoading} profileError={profileError} isAnalyzing={profileLoading || chartLoading || earningsLoading} isRefreshing={refreshMode === 'same'} lastUpdated={profileFetchedAt} dataSourceStatus={profileSource} isFallback={profileFallback} profileWarning={profileWarning} stock={stock} score={score} upside={upside} analyzeStock={analyzeStock} onRefresh={refreshCurrentStock} />
      <GlossaryPanel />
      {(profileLoading || chartLoading || earningsLoading) && <StatusGrid symbol={selectedSymbol} profileLoading={profileLoading} chartLoading={chartLoading} earningsLoading={earningsLoading} status={requestStatus} />}
      {profileError && !profileLoading && <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-100"><h2 className="text-2xl font-bold">Could not load live data for {selectedSymbol}</h2><p className="mt-2">{profileError}</p><p className="mt-3 text-sm">Please verify the ticker or try again. The analyzer will not show stale data for a failed request.</p></div>}
      {tabs.length > 0 && <StockResearchTabs tabs={tabs} defaultTab="decision" onActiveTabChange={(tabId) => { if (tabId !== 'export') setCurrentReportTab(tabId); }} />}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="text-xl font-bold">Important disclaimer</h3><div className="mt-4 space-y-4 text-slate-300"><p>FinanceSphere helps users structure decisions with data, but it does not know your full financial situation, time horizon, tax profile, or risk tolerance.</p><p>Use this tool to identify what to research next: earnings quality, valuation, debt, growth durability, technical setup, and position-sizing risk.</p><p className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">Educational information only. This is not financial advice or a recommendation to buy or sell any security.</p></div></div>
    </section></main>
  );
}

function LoadingCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 text-sm leading-6 text-emerald-50">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-100/30 border-t-emerald-100" />
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="mt-2 text-emerald-100/90">{text}</p>
    </div>
  );
}

function WarningCard({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50">
      {text}
    </div>
  );
}

function StatusGrid({ symbol, profileLoading, chartLoading, earningsLoading, status }: { symbol: string; profileLoading: boolean; chartLoading: boolean; earningsLoading: boolean; status: string }) {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-3">
      <StatusCard active={profileLoading} title="Loading live quote..." text={profileLoading ? status : `${symbol} quote refreshed.`} />
      <StatusCard active={chartLoading} title="Refreshing historical chart..." text={chartLoading ? `Fetching fresh chart data for ${symbol}.` : 'Historical chart check complete.'} />
      <StatusCard active={earningsLoading} title="Checking earnings history..." text={earningsLoading ? `Updating earnings rows for ${symbol}.` : 'Earnings check complete.'} />
    </section>
  );
}

function StatusCard({ active, title, text }: { active: boolean; title: string; text: string }) {
  return (
    <div className={active ? 'rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4' : 'rounded-2xl border border-white/10 bg-white/[0.04] p-4'}>
      <div className="flex items-center gap-2">
        {active && <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-100/30 border-t-emerald-100" />}
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function GlossaryPanel() { const terms = [['Bullish', 'You expect the stock may go up. Usually supported by strong growth, profits, momentum, or positive news.'], ['Bearish', 'You expect the stock may go down or underperform. Often caused by weak growth, high valuation, debt, or bad news.'], ['P/E Ratio', 'Price divided by earnings. It helps judge whether the stock is expensive compared with profits.'], ['EPS', 'Earnings per share. It shows how much profit belongs to each share. Growing EPS is usually positive.'], ['Revenue', 'Total sales. Revenue growth means the business is selling more.'], ['Profit Margin', 'Profit as a percentage of sales. Higher margin means the company keeps more money after expenses.'], ['Debt / Equity', 'Debt compared with shareholder equity. Higher debt can increase risk.'], ['RSI', 'Relative Strength Index. A momentum signal: above 70 may be overbought, below 30 may be oversold.'], ['Market Cap', 'Stock price times shares outstanding. It measures company size.'], ['Dividend Yield', 'Annual dividends divided by stock price. Important for income investors.']]; return <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Stock Market Legend</p><h2 className="mt-2 text-2xl font-bold">New to stocks? Start here.</h2></div><p className="max-w-2xl text-sm text-slate-400">Use this legend while reading the page. It explains the most common terms in plain English.</p></div><div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{terms.map(([term, explanation]) => <div key={term} className="rounded-xl border border-white/10 bg-black/20 p-4"><h3 className="font-bold text-white">{term}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{explanation}</p></div>)}</div></section>; }
