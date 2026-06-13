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
import { StatusPill } from '@/components/ui/status-pill';
import { getRecentAnalyses, saveRecentAnalysis, type RecentAnalyzedStock } from '@/lib/stock-local-storage';
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

const tabInsights: Record<string, { takeaway: string; watch: string; risk: string; next: string }> = {
  decision: {
    takeaway: 'Use the score as a starting thesis, then read the reasons before acting.',
    watch: 'Growth, valuation, earnings execution, and whether momentum is stretched.',
    risk: 'A strong business can still be a poor buy if expectations are already too high.',
    next: 'Open Entry Planner before committing new capital.',
  },
  entry: {
    takeaway: 'Better risk/reward usually comes from staged buying instead of chasing.',
    watch: 'Pullback zones, margin of safety, and how much capital you plan to deploy.',
    risk: 'Buying a full position at once leaves no room for volatility or revised data.',
    next: 'Set a starter allocation and a second buy zone.',
  },
  portfolio: {
    takeaway: 'A good stock can still be too large for your portfolio.',
    watch: 'Current exposure, available cash, and whether this adds concentration risk.',
    risk: 'Position size can turn a reasonable idea into a stressful one.',
    next: 'Use portfolio inputs before increasing an existing holding.',
  },
  options: {
    takeaway: 'Options decisions should start with premium captured and assignment risk.',
    watch: 'Days remaining, distance to strike, and how much premium is left.',
    risk: 'Holding for the last bit of premium can add more risk than reward.',
    next: 'Check whether closing, rolling, or holding has the better trade-off.',
  },
  compare: {
    takeaway: 'Compare against alternatives before assuming this is the best use of capital.',
    watch: 'Quality, valuation, risk, and growth versus peers.',
    risk: 'A stock may look attractive alone but weak against better alternatives.',
    next: 'Add peers from the same industry or theme.',
  },
  watchlist: {
    takeaway: 'Save stocks you like but do not want to chase today.',
    watch: 'Buy-below price, review date, and the reason you are waiting.',
    risk: 'A watchlist without a plan becomes another ticker list.',
    next: 'Add a review note and next review date.',
  },
  overview: {
    takeaway: 'Start here when you need the plain-English version of the report.',
    watch: 'The checklist items marked as weak or uncertain.',
    risk: 'Single metrics can mislead when separated from the full thesis.',
    next: 'Use the checklist to choose which deeper tab to read.',
  },
  thesis: {
    takeaway: 'Treat this as the investment memo: why it works, why it fails, and what would change your mind.',
    watch: 'Bull case, bear case, management quality, and earnings risk.',
    risk: 'A thesis without invalidation rules becomes confirmation bias.',
    next: 'Write down the event that would make you sell or wait.',
  },
  'smart-money': {
    takeaway: 'Smart money data is a supporting signal, not the whole decision.',
    watch: 'Insider buying, insider selling, and institutional ownership changes.',
    risk: 'Insiders sell for many reasons, so use context before reacting.',
    next: 'Compare the signal with earnings and valuation.',
  },
  metrics: {
    takeaway: 'Metrics show whether growth, valuation, profitability, and momentum support the current price.',
    watch: 'Revenue growth, margins, debt, forward P/E, beta, and RSI.',
    risk: 'Raw numbers without interpretation can create false confidence.',
    next: 'Focus on metrics that conflict with the verdict.',
  },
  earnings: {
    takeaway: 'Earnings quality decides whether the valuation can stay supported.',
    watch: 'EPS beats, revenue surprises, and guidance trends.',
    risk: 'Provider gaps or stale earnings rows need manual verification.',
    next: 'Verify upcoming earnings date and recent guidance.',
  },
  ai: {
    takeaway: 'Use AI to ask what you might be missing, not to outsource the decision.',
    watch: 'Contradictions, missing data, and the strongest bear case.',
    risk: 'AI can sound confident even when provider data is limited.',
    next: 'Ask for the top three things to verify before buying.',
  },
  export: {
    takeaway: 'Export a research memo after you have reviewed the decision tabs.',
    watch: 'Include the current tab or full report depending on your workflow.',
    risk: 'A PDF snapshot can become stale after earnings or major news.',
    next: 'Refresh the ticker before exporting a final copy.',
  },
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

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function getRiskLevel(stock: StockMetrics, score: ReturnType<typeof scoreStock>) {
  const health = score.parts.find((part) => part.name === 'Financial Health')?.value ?? 0;
  const technical = score.parts.find((part) => part.name === 'Technical Trend')?.value ?? 0;
  if (stock.beta > 1.6 || stock.forwardPe > 40 || stock.rsi > 75 || health < 6) return 'High';
  if (stock.beta > 1.2 || stock.forwardPe > 30 || stock.rsi > 68 || technical < 7) return 'Medium';
  return 'Lower';
}

function getNextBestAction(score: ReturnType<typeof scoreStock>, upside: number, riskLevel: string) {
  if (riskLevel === 'High') return 'Review risk before adding. Consider staged sizing or waiting for a better entry.';
  if (score.total >= 70 && upside > 10) return 'Use Entry Planner to build a staged buying plan before committing capital.';
  if (score.total >= 55) return 'Compare valuation and earnings risk, then decide whether this belongs on your watchlist.';
  return 'Avoid rushing. Look for stronger fundamentals, better price, or clearer earnings confirmation.';
}

function getInitialSymbol() {
  if (typeof window === 'undefined') return 'MSFT';
  const params = new URLSearchParams(window.location.search);
  return (params.get('symbol') || 'MSFT').trim().toUpperCase();
}

function getMissingImportantMetrics(stock: StockMetrics) {
  const checks: Array<[string, number | undefined]> = [
    ['P/E', stock.pe],
    ['Forward P/E', stock.forwardPe],
    ['EPS growth', stock.epsGrowth],
    ['Revenue growth', stock.revenueGrowth],
    ['Profit margin', stock.profitMargin],
    ['Debt/equity', stock.debtToEquity],
    ['RSI', stock.rsi],
    ['Beta', stock.beta],
    ['Analyst target', stock.analystTarget],
  ];
  return checks
    .filter(([, value]) => !Number.isFinite(Number(value)) || Number(value) === 0)
    .map(([label]) => label);
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
  const [recentStocks, setRecentStocks] = useState<RecentAnalyzedStock[]>([]);

  useEffect(() => {
    setRecentStocks(getRecentAnalyses());
    const initialSymbol = getInitialSymbol();
    if (initialSymbol && initialSymbol !== 'MSFT') {
      setQuery(initialSymbol);
      setSelectedSymbol(initialSymbol);
      setRefreshMode('new');
      setRefreshKey((key) => key + 1);
    }
  }, []);

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
  const missingImportantMetrics = stock ? getMissingImportantMetrics(stock) : [];

  useEffect(() => {
    if (!stock || !score || profileLoading || profileError) return;
    const next = saveRecentAnalysis({
      symbol: stock.symbol,
      companyName: stock.name,
      lastPrice: stock.price,
      verdict: score.rating,
      analyzedAt: profileFetchedAt || new Date().toISOString(),
    });
    setRecentStocks(next);
  }, [profileError, profileFetchedAt, profileLoading, score, stock]);

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
    { id: 'decision', label: 'Decision', description: 'Buy, hold, reduce, or sell view with confidence, reasons, risks, and what to monitor.', insight: tabInsights.decision, content: earningsLoading ? <LoadingCard title={`Building investment view for ${selectedSymbol}...`} text="Checking valuation, growth, momentum, earnings, and risk signals before showing the Decision tab." /> : <><WarningCard text={earningsWarning} /><WhatChangedPanel stock={stock} score={score} upside={upside} /><div className="mt-6"><StockDecisionSection stock={stock} score={score} earnings={earnings} upside={upside} /></div></> },
    { id: 'entry', label: 'Entry Planner', description: 'Plan buy zones, staged entries, pullbacks, and risk levels.', insight: tabInsights.entry, content: <EntryPricePlanner stock={stock} score={score} upside={upside} /> },
    { id: 'portfolio', label: 'Portfolio', description: 'Personalize buy/hold/trim decision based on your portfolio exposure.', insight: tabInsights.portfolio, content: <PortfolioAwareDecision stock={stock} score={score} /> },
    { id: 'options', label: 'Options', description: 'Covered call, cash-secured put, and buy-to-close decision helper.', insight: tabInsights.options, content: <OptionsStrategyHelper stock={stock} /> },
    { id: 'compare', label: 'Compare', description: 'Compare this stock against competitors using growth, valuation, risk, and quality.', insight: tabInsights.compare, content: <CompetitorComparison stock={stock} /> },
    { id: 'watchlist', label: 'Watchlist', description: 'Save stocks, planned entry prices, and alert conditions locally.', insight: tabInsights.watchlist, content: <WatchlistAlertsPanel stock={stock} score={score} upside={upside} /> },
    { id: 'overview', label: 'Overview', description: 'Executive summary, beginner checklist, and live intelligence.', insight: tabInsights.overview, content: <>{beginnerVerdict && <StockOverviewSection stock={stock} verdict={beginnerVerdict} score={score} upside={upside} />}<section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="text-xl font-bold">Decision Checklist</h3><p className="mt-2 text-sm text-slate-400">A beginner-friendly checklist to help you avoid making a decision from only one number.</p><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{checklist.map((item) => <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-sm text-slate-400">{item.title}</p><h4 className="mt-1 text-lg font-bold text-white">{item.status}</h4><p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p></div>)}</div></section><LiveIntelligencePanel symbol={selectedSymbol} refreshKey={refreshKey} /></> },
    { id: 'thesis', label: 'Thesis', description: 'Investment thesis, bull case, bear case, SWOT, and committee-style decision support.', insight: tabInsights.thesis, content: <><AdvancedResearchThesis stock={stock} score={score} upside={upside} /><InvestmentCommitteeVerdict stock={stock} /><DecisionSupportInsights stock={stock} /><StockOutlookInsights stock={stock} /></> },
    { id: 'smart-money', label: 'Smart Money', description: 'Insider transactions and institutional ownership signals.', insight: tabInsights['smart-money'], content: <SmartMoneyPanel symbol={selectedSymbol} refreshKey={refreshKey} /> },
    { id: 'metrics', label: 'Metrics', description: 'Score, chart, company overview, and key metric explanations.', insight: tabInsights.metrics, content: <>{chartLoading && <LoadingCard title="Refreshing market tape..." text={`Fetching fresh price history for ${selectedSymbol}.`} />}<WarningCard text={chartWarning || chartError} /><StockMetricsSection stock={stock} score={score} candles={candles} upside={upside} /></> },
    { id: 'earnings', label: 'Earnings', description: 'Earnings beat rate, surprise, and detailed earnings history.', insight: tabInsights.earnings, content: <>{earningsLoading && <LoadingCard title="Checking earnings quality..." text={`Fetching fresh earnings rows for ${selectedSymbol}.`} />}<WarningCard text={earningsWarning || earningsError} /><EarningsIntelligencePanel earnings={earnings} source={earningsSource} /><StockEarningsSection earnings={earnings} source={earningsSource} /></> },
    { id: 'ai', label: 'AI Assistant', description: 'Ask beginner-friendly research questions. Includes local fallback when OpenAI quota is unavailable.', insight: tabInsights.ai, content: <StockAISection question={chatQuestion} setQuestion={setChatQuestion} answer={chatAnswer} loading={chatLoading} error={chatError} askAi={askAi} /> },
    { id: 'export', label: 'Export', description: 'Export the current tab or full research report as a clean PDF.', insight: tabInsights.export, content: <ResearchReportExport stock={stock} score={score} upside={upside} earnings={earnings} earningsSource={earningsSource} currentTabId={currentReportTab} currentTabLabel={researchTabLabels[currentReportTab]} beginnerVerdict={beginnerVerdict} checklist={checklist} aiQuestion={chatQuestion} aiAnswer={chatAnswer} /> },
  ] : [];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8"><section className="mx-auto max-w-7xl">
      <StockAnalyzerHero query={query} setQuery={setQuery} selectedSymbol={selectedSymbol} suggestions={suggestions} searchLoading={searchLoading} searchMessage={searchMessage} profileLoading={profileLoading} profileError={profileError} isAnalyzing={profileLoading || chartLoading || earningsLoading} isRefreshing={refreshMode === 'same'} lastUpdated={profileFetchedAt} dataSourceStatus={profileSource} isFallback={profileFallback} profileWarning={profileWarning} stock={stock} score={score} upside={upside} recentStocks={recentStocks} analyzeStock={analyzeStock} onRefresh={refreshCurrentStock} />
      {stock && score && !profileLoading && !profileError && <TickerIntelligenceHeader stock={stock} score={score} upside={upside} />}
      {stock && !profileLoading && !profileError && (
        <DataQualityNotice
          lastUpdated={profileFetchedAt}
          source={profileSource}
          missingMetrics={missingImportantMetrics}
          warning={profileWarning || chartWarning || earningsWarning}
        />
      )}
      <GlossaryPanel />
      {(profileLoading || chartLoading || earningsLoading) && <StatusGrid symbol={selectedSymbol} profileLoading={profileLoading} chartLoading={chartLoading} earningsLoading={earningsLoading} status={requestStatus} />}
      {profileError && !profileLoading && <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-100"><h2 className="text-2xl font-bold">Could not load live data for {selectedSymbol}</h2><p className="mt-2">{profileError}</p><p className="mt-3 text-sm">Please verify the ticker or try again. The analyzer will not show stale data for a failed request.</p></div>}
      {tabs.length > 0 && <StockResearchTabs tabs={tabs} defaultTab="decision" onActiveTabChange={(tabId) => { if (tabId !== 'export') setCurrentReportTab(tabId); }} />}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6"><h3 className="text-xl font-bold">Important disclaimer</h3><div className="mt-4 space-y-4 text-slate-300"><p>FinanceSphere helps users structure decisions with data, but it does not know your full financial situation, time horizon, tax profile, or risk tolerance.</p><p>Use this tool to identify what to research next: earnings quality, valuation, debt, growth durability, technical setup, and position-sizing risk.</p><p className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">Educational information only. This is not financial advice or a recommendation to buy or sell any security.</p></div></div>
    </section></main>
  );
}

function TickerIntelligenceHeader({ stock, score, upside }: { stock: StockMetrics; score: ReturnType<typeof scoreStock>; upside: number }) {
  const riskLevel = getRiskLevel(stock, score);
  const riskVariant = riskLevel === 'High' ? 'risk' : riskLevel === 'Medium' ? 'caution' : 'good';
  const verdictVariant = score.total >= 70 ? 'good' : score.total >= 55 ? 'caution' : 'risk';
  return (
    <section className="mt-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-[0_24px_70px_-50px_rgba(16,185,129,0.5)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">Ticker intelligence header</p>
          <h2 className="mt-2 text-3xl font-black text-white">{stock.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{stock.symbol}{stock.exchange ? ` · ${stock.exchange}` : ''}{stock.industry ? ` · ${stock.industry}` : ''}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill variant={verdictVariant}>{score.rating}</StatusPill>
          <StatusPill variant={riskVariant}>{riskLevel} risk</StatusPill>
          <StatusPill variant={upside > 10 ? 'good' : upside < 0 ? 'risk' : 'neutral'}>{upside.toFixed(1)}% upside</StatusPill>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <MemoCard title="Current View" value={`${currency(stock.price)} current price`} text={`Analyst target: ${currency(stock.analystTarget)}. FinanceSphere score: ${score.total}/100.`} />
        <MemoCard title="Why it matters" value={score.rating} text="This combines growth, quality, valuation, risk, and momentum into a starting research view." />
        <MemoCard title="Next best action" value="Do this next" text={getNextBestAction(score, upside, riskLevel)} />
      </div>
      <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">Educational analysis only. Not financial advice.</p>
    </section>
  );
}

function MemoCard({ title, value, text }: { title: string; value: string; text: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </article>
  );
}

function DataQualityNotice({ lastUpdated, source, missingMetrics, warning }: { lastUpdated?: string | null; source?: string | null; missingMetrics: string[]; warning?: string | null }) {
  const formatted = lastUpdated && !Number.isNaN(new Date(lastUpdated).getTime())
    ? new Date(lastUpdated).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : 'Just now';
  const hasQualityIssue = missingMetrics.length > 0 || Boolean(warning);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <p><strong className="text-white">Last updated:</strong> {formatted}{source ? ` · Source: ${source}` : ''}</p>
        <p className="font-semibold text-amber-100">Educational analysis only. Not financial advice.</p>
      </div>
      {hasQualityIssue && (
        <p className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-100">
          Some metrics are unavailable from the current data source, so confidence may be lower.
          {missingMetrics.length ? ` Missing or incomplete: ${missingMetrics.join(', ')}.` : ''}
          {warning ? ` ${warning}` : ''}
        </p>
      )}
    </section>
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

function GlossaryPanel() {
  const terms = [
    ['P/E', 'Price divided by trailing earnings. It helps judge whether the stock is expensive compared with profits.'],
    ['Forward P/E', 'Price divided by expected future earnings. Useful, but only if estimates are reliable.'],
    ['EPS', 'Earnings per share. It shows how much profit belongs to each share.'],
    ['Revenue Growth', 'How quickly sales are growing. It should be checked with margins and EPS growth.'],
    ['Profit Margin', 'Profit as a percentage of sales. Higher margin can show efficiency or pricing power.'],
    ['Debt/Equity', 'Debt compared with shareholder equity. Higher values can increase financial risk.'],
    ['RSI', 'A short-term momentum indicator from 0 to 100. Above 70 may be overheated.'],
    ['Beta', 'Volatility compared with the market. Higher beta can mean bigger swings.'],
    ['Analyst Target', 'A directional estimate from analysts, not a guaranteed future price.'],
    ['Premium Captured', 'How much of an option credit you have already kept if you close now.'],
    ['Assignment Risk', 'The chance a short option position results in shares being called away or assigned.'],
  ];
  return (
    <details className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <summary className="cursor-pointer text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">Quick glossary</summary>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Open this when a metric or options term needs a plain-English reminder.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {terms.map(([term, explanation]) => (
          <div key={term} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-bold text-white">{term}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{explanation}</p>
          </div>
        ))}
      </div>
    </details>
  );
}
