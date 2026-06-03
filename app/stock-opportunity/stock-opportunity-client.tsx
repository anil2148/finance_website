'use client';

import { useMemo, useState } from 'react';

type StockMetrics = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  analystTarget: number;
  pe: number;
  forwardPe: number;
  epsGrowth: number;
  revenueGrowth: number;
  profitMargin: number;
  debtToEquity: number;
  roe: number;
  rsi: number;
  dividendYield: number;
  beta: number;
  marketCap?: number;
  industry?: string;
  exchange?: string;
  logo?: string;
};

type EarningsItem = {
  date?: string;
  epsActual?: number;
  epsEstimate?: number;
  revenueActual?: number;
  revenueEstimate?: number;
};

type SmartMoney = {
  score?: number;
  signal?: 'Bullish' | 'Neutral' | 'Bearish';
  insider?: { signal?: 'Bullish' | 'Neutral' | 'Bearish'; netShares?: number; buys?: number; sells?: number };
  institutional?: { signal?: 'Bullish' | 'Neutral' | 'Bearish'; netChange?: number };
  warnings?: string[];
};

type Opportunity = {
  verdict: 'STRONG BUY' | 'BUY' | 'HOLD / WATCH' | 'REDUCE' | 'SELL';
  confidence: number;
  action: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  timeHorizon: string;
  entryZone: string;
  exitTrigger: string;
  stopReview: string;
  bullish: Array<{ title: string; detail: string; impact: number }>;
  bearish: Array<{ title: string; detail: string; impact: number }>;
  monitor: string[];
};

function currency(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
}

function compact(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(Number(value));
}

function pct(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return `${Number(value).toFixed(1)}%`;
}

function getEarningsStats(earnings: EarningsItem[]) {
  const rows = earnings.slice(0, 8);
  const epsComparable = rows.filter((item) => typeof item.epsActual === 'number' && typeof item.epsEstimate === 'number');
  const revenueComparable = rows.filter((item) => typeof item.revenueActual === 'number' && typeof item.revenueEstimate === 'number');
  const epsBeats = epsComparable.filter((item) => Number(item.epsActual) >= Number(item.epsEstimate)).length;
  const revenueBeats = revenueComparable.filter((item) => Number(item.revenueActual) >= Number(item.revenueEstimate)).length;
  const epsBeatRate = epsComparable.length ? (epsBeats / epsComparable.length) * 100 : null;
  const revenueBeatRate = revenueComparable.length ? (revenueBeats / revenueComparable.length) * 100 : null;
  return { epsBeatRate, revenueBeatRate, count: rows.length };
}

function buildOpportunity(stock: StockMetrics, earnings: EarningsItem[], smartMoney: SmartMoney | null): Opportunity {
  const upside = stock.price > 0 ? ((stock.analystTarget - stock.price) / stock.price) * 100 : 0;
  const earningsStats = getEarningsStats(earnings);
  const bullish: Opportunity['bullish'] = [];
  const bearish: Opportunity['bearish'] = [];

  const addBull = (title: string, detail: string, impact: number) => bullish.push({ title, detail, impact });
  const addBear = (title: string, detail: string, impact: number) => bearish.push({ title, detail, impact });

  if (upside >= 20) addBull('Analyst target has strong upside', `Target implies about ${pct(upside)} upside from current price.`, 16);
  else if (upside >= 8) addBull('Analyst target has some upside', `Target implies about ${pct(upside)} upside.`, 9);
  else if (upside < -5) addBear('Analyst target is below current price', `Target implies about ${pct(upside)} downside.`, 16);
  else addBear('Limited target upside', `Target upside is only ${pct(upside)}, so risk/reward may not be attractive yet.`, 7);

  if (stock.revenueGrowth >= 15) addBull('Strong revenue growth', `Revenue growth is ${pct(stock.revenueGrowth)}, showing demand is expanding.`, 14);
  else if (stock.revenueGrowth >= 6) addBull('Moderate revenue growth', `Revenue growth is ${pct(stock.revenueGrowth)}.`, 7);
  else addBear('Weak revenue growth', `Revenue growth is ${pct(stock.revenueGrowth)}, which may limit upside.`, 12);

  if (stock.epsGrowth >= 15) addBull('Strong EPS growth', `EPS growth is ${pct(stock.epsGrowth)}, showing profits are improving.`, 14);
  else if (stock.epsGrowth < 0) addBear('EPS growth is negative', `EPS growth is ${pct(stock.epsGrowth)}, which can pressure valuation.`, 14);
  else addBear('EPS growth is not strong', `EPS growth is ${pct(stock.epsGrowth)} and needs confirmation.`, 6);

  if (stock.profitMargin >= 18) addBull('Healthy profitability', `Profit margin is ${pct(stock.profitMargin)}, suggesting efficient operations.`, 10);
  else if (stock.profitMargin < 6) addBear('Low profitability', `Profit margin is ${pct(stock.profitMargin)}, leaving less room for mistakes.`, 11);

  if (stock.debtToEquity <= 0.8) addBull('Manageable debt', `Debt/equity is ${stock.debtToEquity.toFixed(2)}, reducing balance-sheet risk.`, 8);
  else if (stock.debtToEquity > 1.5) addBear('Higher debt risk', `Debt/equity is ${stock.debtToEquity.toFixed(2)}, which can increase risk in weak markets.`, 10);

  if (stock.forwardPe > 0 && stock.forwardPe <= 22) addBull('Reasonable forward valuation', `Forward P/E is ${stock.forwardPe.toFixed(2)}.`, 10);
  else if (stock.forwardPe > 40) addBear('Expensive valuation', `Forward P/E is ${stock.forwardPe.toFixed(2)}, so the stock needs strong future growth.`, 14);
  else if (stock.forwardPe > 30) addBear('Valuation needs growth support', `Forward P/E is ${stock.forwardPe.toFixed(2)}.`, 8);

  if (stock.rsi >= 70) addBear('Short-term overbought risk', `RSI is ${stock.rsi.toFixed(1)}, so entry timing may be risky.`, 8);
  else if (stock.rsi <= 35) addBear('Weak momentum', `RSI is ${stock.rsi.toFixed(1)}, showing weak short-term momentum.`, 5);
  else addBull('Momentum is not extreme', `RSI is ${stock.rsi.toFixed(1)}, not showing an extreme overbought signal.`, 5);

  if (earningsStats.epsBeatRate !== null && earningsStats.epsBeatRate >= 65) addBull('Strong EPS beat history', `EPS beat rate is ${pct(earningsStats.epsBeatRate)} over recent available quarters.`, 10);
  else if (earningsStats.epsBeatRate !== null && earningsStats.epsBeatRate < 45) addBear('Weak EPS beat history', `EPS beat rate is ${pct(earningsStats.epsBeatRate)}, so earnings execution needs review.`, 10);
  else if (!earningsStats.count) addBear('Earnings data unavailable', 'Recent earnings rows were not returned by the provider, so verify manually before deciding.', 6);

  if (smartMoney?.signal === 'Bullish') addBull('Smart money signal is bullish', `Smart money score is ${smartMoney.score ?? 'N/A'}/100.`, 9);
  else if (smartMoney?.signal === 'Bearish') addBear('Smart money signal is bearish', `Smart money score is ${smartMoney.score ?? 'N/A'}/100.`, 9);

  if (smartMoney?.insider?.signal === 'Bullish') addBull('Insider activity supports the thesis', `Net insider shares: ${compact(smartMoney.insider.netShares)}.`, 7);
  else if (smartMoney?.insider?.signal === 'Bearish') addBear('Insider selling pressure', `Net insider shares: ${compact(smartMoney.insider.netShares)}.`, 7);

  if (smartMoney?.institutional?.signal === 'Bullish') addBull('Institutions appear supportive', `Institutional net change: ${compact(smartMoney.institutional.netChange)}.`, 7);
  else if (smartMoney?.institutional?.signal === 'Bearish') addBear('Institutional ownership is weakening', `Institutional net change: ${compact(smartMoney.institutional.netChange)}.`, 7);

  if (stock.beta > 1.6) addBear('High volatility', `Beta is ${stock.beta.toFixed(2)}, so position sizing matters.`, 7);
  else if (stock.beta > 0 && stock.beta < 1.1) addBull('Lower volatility profile', `Beta is ${stock.beta.toFixed(2)}, which may be easier to hold.`, 4);

  const bullScore = bullish.reduce((sum, item) => sum + item.impact, 0);
  const bearScore = bearish.reduce((sum, item) => sum + item.impact, 0);
  const rawScore = Math.max(0, Math.min(100, 50 + bullScore - bearScore));
  const confidence = Math.round(rawScore);

  const verdict: Opportunity['verdict'] = confidence >= 78 ? 'STRONG BUY' : confidence >= 62 ? 'BUY' : confidence >= 45 ? 'HOLD / WATCH' : confidence >= 32 ? 'REDUCE' : 'SELL';
  const riskLevel: Opportunity['riskLevel'] = stock.beta > 1.6 || stock.forwardPe > 40 || stock.debtToEquity > 1.5 ? 'High' : stock.beta > 1.2 || stock.forwardPe > 30 ? 'Medium' : 'Low';

  const entryLow = stock.price * 0.95;
  const entryHigh = stock.price * 1.02;
  const target = stock.analystTarget > 0 ? stock.analystTarget : stock.price * 1.15;

  return {
    verdict,
    confidence,
    riskLevel,
    timeHorizon: verdict === 'SELL' || verdict === 'REDUCE' ? 'Immediate review' : '6 months to 3 years, depending on earnings execution',
    entryZone: verdict === 'BUY' || verdict === 'STRONG BUY' ? `${currency(entryLow)} - ${currency(entryHigh)}` : 'Wait for better price, stronger earnings, or clearer trend',
    exitTrigger: `Review or trim if price approaches ${currency(target)} without improving fundamentals, or if the thesis weakens.`,
    stopReview: `Re-check if revenue growth falls below 5%, EPS misses repeatedly, debt rises sharply, or smart money turns bearish.`,
    action: verdict === 'STRONG BUY'
      ? 'Opportunity looks attractive. Consider buying in stages instead of all at once.'
      : verdict === 'BUY'
        ? 'Opportunity is constructive, but use position sizing and verify earnings trend.'
        : verdict === 'HOLD / WATCH'
          ? 'Do not rush. Watch for better price, stronger earnings, or clearer bullish confirmation.'
          : verdict === 'REDUCE'
            ? 'Risk/reward is weakening. Consider reducing exposure or waiting for better confirmation.'
            : 'Bearish signals dominate. Avoid new buying unless the thesis materially improves.',
    bullish: bullish.sort((a, b) => b.impact - a.impact),
    bearish: bearish.sort((a, b) => b.impact - a.impact),
    monitor: [
      'Next earnings report: EPS, revenue, and guidance.',
      'Forward P/E compared with growth rate.',
      'Debt/equity and margin trend.',
      'Insider and institutional activity.',
      'Whether price moves toward target with improving fundamentals.',
    ],
  };
}

function verdictClass(verdict: Opportunity['verdict']) {
  if (verdict === 'STRONG BUY' || verdict === 'BUY') return 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100';
  if (verdict === 'SELL' || verdict === 'REDUCE') return 'border-red-300/30 bg-red-300/10 text-red-100';
  return 'border-amber-300/30 bg-amber-300/10 text-amber-100';
}

export default function StockOpportunityClient() {
  const [query, setQuery] = useState('MSFT');
  const [stock, setStock] = useState<StockMetrics | null>(null);
  const [earnings, setEarnings] = useState<EarningsItem[]>([]);
  const [smartMoney, setSmartMoney] = useState<SmartMoney | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const opportunity = useMemo(() => stock ? buildOpportunity(stock, earnings, smartMoney) : null, [stock, earnings, smartMoney]);

  async function analyze() {
    const symbol = query.trim().toUpperCase();
    if (!symbol) return;
    setLoading(true);
    setError(null);
    setStock(null);
    setEarnings([]);
    setSmartMoney(null);
    try {
      const [profileResponse, earningsResponse, smartMoneyResponse] = await Promise.all([
        fetch(`/api/stocks/profile?symbol=${encodeURIComponent(symbol)}`),
        fetch(`/api/stocks/earnings?symbol=${encodeURIComponent(symbol)}`),
        fetch(`/api/stocks/smart-money?symbol=${encodeURIComponent(symbol)}`),
      ]);
      const profileData = await profileResponse.json();
      const earningsData = await earningsResponse.json().catch(() => ({}));
      const smartMoneyData = await smartMoneyResponse.json().catch(() => null);
      if (!profileResponse.ok) throw new Error(profileData?.error || `Unable to load ${symbol}.`);
      setQuery(symbol);
      setStock(profileData.stock);
      setEarnings(earningsResponse.ok ? earningsData.earnings || [] : []);
      setSmartMoney(smartMoneyResponse.ok ? smartMoneyData : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate opportunity decision.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">FinanceSphere Decision Engine</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Buy / Sell Opportunity</h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">A dedicated decision page that converts stock data into a clear opportunity verdict, confidence score, action plan, and every reason behind the decision.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-black/30 p-5">
              <label htmlFor="opportunity-symbol" className="text-sm font-medium text-slate-300">Enter stock symbol</label>
              <div className="mt-3 flex gap-3">
                <input id="opportunity-symbol" value={query} onChange={(event) => setQuery(event.target.value.toUpperCase())} onKeyDown={(event) => event.key === 'Enter' && analyze()} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-emerald-400 focus:ring-2" placeholder="SOFI, NVDA, MSFT" />
                <button onClick={analyze} disabled={loading} className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60">{loading ? 'Analyzing...' : 'Analyze'}</button>
              </div>
              <p className="mt-3 text-xs text-slate-400">This page is educational and should be used with your own risk tolerance, time horizon, and position sizing.</p>
            </div>
          </div>
        </div>

        {error && <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-100">{error}</div>}

        {opportunity && stock && (
          <>
            <section className={`mt-8 rounded-3xl border p-6 ${verdictClass(opportunity.verdict)}`}>
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] opacity-80">Opportunity Verdict</p>
                  <h2 className="mt-3 text-5xl font-black">{opportunity.verdict}</h2>
                  <p className="mt-3 text-lg">Confidence: <strong>{opportunity.confidence}/100</strong></p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 opacity-90">{opportunity.action}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SummaryCard title="Current Price" value={currency(stock.price)} note={`${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}% today`} />
                  <SummaryCard title="Analyst Target" value={currency(stock.analystTarget)} note="Directional guide, not guarantee" />
                  <SummaryCard title="Entry Zone" value={opportunity.entryZone} note="Prefer staged buying" />
                  <SummaryCard title="Risk Level" value={opportunity.riskLevel} note={opportunity.timeHorizon} />
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-3">
              <DecisionCard title="Entry Strategy" text={opportunity.entryZone} />
              <DecisionCard title="Exit / Trim Trigger" text={opportunity.exitTrigger} />
              <DecisionCard title="What Invalidates Thesis" text={opportunity.stopReview} />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <PointerList title="Why this could be a BUY" items={opportunity.bullish} tone="bull" />
              <PointerList title="Why this could be a SELL / Avoid" items={opportunity.bearish} tone="bear" />
            </section>

            <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-bold">Decision Score Breakdown</h3>
              <p className="mt-2 text-sm text-slate-400">This shows how the page reached the verdict. Higher bullish impact improves confidence; higher bearish impact reduces it.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Metric title="Growth" value={`${pct(stock.revenueGrowth)} revenue / ${pct(stock.epsGrowth)} EPS`} />
                <Metric title="Valuation" value={`Forward P/E ${stock.forwardPe?.toFixed?.(2) ?? 'N/A'}`} />
                <Metric title="Financial Risk" value={`Debt/Equity ${stock.debtToEquity?.toFixed?.(2) ?? 'N/A'}`} />
                <Metric title="Momentum" value={`RSI ${stock.rsi?.toFixed?.(1) ?? 'N/A'}`} />
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-bold">What to monitor next</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {opportunity.monitor.map((item) => <div key={item} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">{item}</div>)}
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50">
              <h3 className="text-xl font-bold">Important</h3>
              <p className="mt-2">This is not financial advice. It is a structured research signal to help you decide what to verify before buying, holding, reducing, or selling.</p>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function SummaryCard({ title, value, note }: { title: string; value: string; note: string }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-[0.2em] opacity-70">{title}</p><p className="mt-2 text-xl font-black">{value}</p><p className="mt-1 text-xs opacity-70">{note}</p></div>;
}

function DecisionCard({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><h3 className="font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>;
}

function PointerList({ title, items, tone }: { title: string; items: Opportunity['bullish']; tone: 'bull' | 'bear' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h3 className={tone === 'bull' ? 'text-2xl font-bold text-emerald-200' : 'text-2xl font-bold text-red-200'}>{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length ? items.map((item) => (
          <div key={`${item.title}-${item.detail}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-white">{tone === 'bull' ? '✓' : '⚠'} {item.title}</h4>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs text-slate-300">Impact {item.impact}</span>
            </div>
          </div>
        )) : <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">No strong signals found in this category.</p>}
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-sm text-slate-400">{title}</p><p className="mt-2 text-lg font-bold text-white">{value}</p></div>;
}
