import type { StockMetrics } from '@/lib/stocks';

type EarningsItem = {
  date?: string;
  epsActual?: number;
  epsEstimate?: number;
  revenueActual?: number;
  revenueEstimate?: number;
};

type Score = {
  total: number;
  rating: string;
};

type Props = {
  stock: StockMetrics;
  score: Score;
  earnings: EarningsItem[];
  upside: number;
};

type Pointer = {
  title: string;
  detail: string;
  impact: number;
};

function currency(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
}

function pct(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return `${Number(value).toFixed(1)}%`;
}

function getEarningsBeatRate(earnings: EarningsItem[]) {
  const comparable = earnings
    .slice(0, 8)
    .filter((item) => typeof item.epsActual === 'number' && typeof item.epsEstimate === 'number');
  if (!comparable.length) return null;
  const beats = comparable.filter((item) => Number(item.epsActual) >= Number(item.epsEstimate)).length;
  return (beats / comparable.length) * 100;
}

function buildDecision(stock: StockMetrics, score: Score, earnings: EarningsItem[], upside: number) {
  const bullish: Pointer[] = [];
  const bearish: Pointer[] = [];
  const addBull = (title: string, detail: string, impact: number) => bullish.push({ title, detail, impact });
  const addBear = (title: string, detail: string, impact: number) => bearish.push({ title, detail, impact });

  if (score.total >= 75) addBull('Strong overall research score', `FinanceSphere score is ${score.total}/100 (${score.rating}).`, 16);
  else if (score.total >= 60) addBull('Constructive overall score', `FinanceSphere score is ${score.total}/100 (${score.rating}).`, 9);
  else addBear('Weak overall score', `FinanceSphere score is only ${score.total}/100 (${score.rating}).`, 15);

  if (upside >= 20) addBull('Attractive estimated upside', `Estimated upside is ${pct(upside)} based on the current analyst target.`, 15);
  else if (upside >= 8) addBull('Some estimated upside', `Estimated upside is ${pct(upside)}.`, 8);
  else if (upside < -5) addBear('Estimated downside risk', `Estimated target is below current price by ${pct(Math.abs(upside))}.`, 14);
  else addBear('Limited estimated upside', `Estimated upside is only ${pct(upside)}, so risk/reward may not be strong today.`, 7);

  if (stock.revenueGrowth >= 15) addBull('Revenue growth supports the thesis', `Revenue growth is ${pct(stock.revenueGrowth)}.`, 13);
  else if (stock.revenueGrowth >= 6) addBull('Revenue growth is positive', `Revenue growth is ${pct(stock.revenueGrowth)}.`, 6);
  else addBear('Revenue growth is weak', `Revenue growth is ${pct(stock.revenueGrowth)}, which can limit price upside.`, 12);

  if (stock.epsGrowth >= 15) addBull('EPS growth is strong', `EPS growth is ${pct(stock.epsGrowth)}, showing profit improvement.`, 13);
  else if (stock.epsGrowth < 0) addBear('EPS growth is negative', `EPS growth is ${pct(stock.epsGrowth)}, which can pressure valuation.`, 13);
  else addBear('EPS growth needs confirmation', `EPS growth is ${pct(stock.epsGrowth)}, not strong enough by itself.`, 6);

  if (stock.profitMargin >= 15) addBull('Profitability is healthy', `Profit margin is ${pct(stock.profitMargin)}.`, 9);
  else if (stock.profitMargin < 6) addBear('Profitability is weak', `Profit margin is ${pct(stock.profitMargin)}.`, 10);

  if (stock.debtToEquity <= 0.8) addBull('Debt looks manageable', `Debt/equity is ${stock.debtToEquity.toFixed(2)}.`, 7);
  else if (stock.debtToEquity > 1.5) addBear('Debt risk is elevated', `Debt/equity is ${stock.debtToEquity.toFixed(2)}.`, 10);

  if (stock.forwardPe > 0 && stock.forwardPe <= 22) addBull('Forward valuation is reasonable', `Forward P/E is ${stock.forwardPe.toFixed(2)}.`, 9);
  else if (stock.forwardPe > 40) addBear('Valuation is expensive', `Forward P/E is ${stock.forwardPe.toFixed(2)}, so growth must stay strong.`, 13);
  else if (stock.forwardPe > 30) addBear('Valuation needs growth support', `Forward P/E is ${stock.forwardPe.toFixed(2)}.`, 8);

  if (stock.rsi >= 70) addBear('Entry timing may be stretched', `RSI is ${stock.rsi.toFixed(1)}, which may indicate overbought short-term momentum.`, 8);
  else if (stock.rsi <= 35) addBear('Short-term momentum is weak', `RSI is ${stock.rsi.toFixed(1)}.`, 5);
  else addBull('Momentum is not extreme', `RSI is ${stock.rsi.toFixed(1)}, not showing an overbought extreme.`, 4);

  const beatRate = getEarningsBeatRate(earnings);
  if (beatRate !== null && beatRate >= 65) addBull('Recent EPS beat history is strong', `EPS beat rate is ${pct(beatRate)} across available recent quarters.`, 9);
  else if (beatRate !== null && beatRate < 45) addBear('Recent EPS beat history is weak', `EPS beat rate is ${pct(beatRate)} across available recent quarters.`, 9);
  else if (beatRate === null) addBear('Earnings history needs manual verification', 'Provider did not return enough comparable EPS rows for a strong earnings signal.', 5);

  if (stock.beta > 1.6) addBear('Volatility risk is high', `Beta is ${stock.beta.toFixed(2)}, so position size should be smaller.`, 7);

  const bullScore = bullish.reduce((sum, item) => sum + item.impact, 0);
  const bearScore = bearish.reduce((sum, item) => sum + item.impact, 0);
  const confidence = Math.max(0, Math.min(100, Math.round(50 + bullScore - bearScore)));
  const verdict = confidence >= 78 ? 'STRONG BUY' : confidence >= 62 ? 'BUY' : confidence >= 45 ? 'HOLD / WATCH' : confidence >= 32 ? 'REDUCE' : 'SELL / AVOID';
  const riskLevel = stock.beta > 1.6 || stock.forwardPe > 40 || stock.debtToEquity > 1.5 ? 'High' : stock.beta > 1.2 || stock.forwardPe > 30 ? 'Medium' : 'Lower';

  return {
    verdict,
    confidence,
    riskLevel,
    action: verdict === 'STRONG BUY'
      ? 'Bullish signals dominate. Consider buying in stages, not all at once.'
      : verdict === 'BUY'
        ? 'Setup looks constructive. Consider a starter position or staged accumulation after verifying earnings and valuation.'
        : verdict === 'HOLD / WATCH'
          ? 'Mixed setup. Do not rush. Wait for better price, stronger earnings, or clearer confirmation.'
          : verdict === 'REDUCE'
            ? 'Risk/reward is weakening. Consider reducing exposure or waiting for stronger evidence.'
            : 'Bearish signals dominate. Avoid new buying unless the thesis materially improves.',
    entryZone: verdict === 'STRONG BUY' || verdict === 'BUY'
      ? `${currency(stock.price * 0.95)} - ${currency(stock.price * 1.02)}`
      : 'Wait for a better entry, improved earnings, or stronger technical confirmation.',
    exitTrigger: `Review or trim if price approaches ${currency(stock.analystTarget)} without improving fundamentals, or if growth slows materially.`,
    invalidation: [
      'Revenue growth falls below 5% or keeps decelerating.',
      'EPS misses expectations for two consecutive quarters.',
      'Debt/equity increases materially or margins weaken.',
      'Forward valuation expands while growth slows.',
      'Price breaks down while earnings and smart money signals weaken.',
    ],
    monitor: [
      'Next earnings report: EPS, revenue, and guidance.',
      'Forward P/E versus revenue and EPS growth.',
      'Profit margin and debt/equity trend.',
      'RSI and price trend for entry timing.',
      'Analyst target changes after earnings or major news.',
    ],
    bullish: bullish.sort((a, b) => b.impact - a.impact),
    bearish: bearish.sort((a, b) => b.impact - a.impact),
  };
}

function verdictClass(verdict: string) {
  if (verdict.includes('BUY')) return 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100';
  if (verdict.includes('SELL') || verdict.includes('REDUCE')) return 'border-red-300/30 bg-red-300/10 text-red-100';
  return 'border-amber-300/30 bg-amber-300/10 text-amber-100';
}

export function StockDecisionSection({ stock, score, earnings, upside }: Props) {
  const decision = buildDecision(stock, score, earnings, upside);

  return (
    <section className="space-y-6">
      <div className={`rounded-3xl border p-6 ${verdictClass(decision.verdict)}`}>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] opacity-80">Decision</p>
            <h2 className="mt-3 text-5xl font-black">{decision.verdict}</h2>
            <p className="mt-3 text-lg">Confidence: <strong>{decision.confidence}/100</strong></p>
            <p className="mt-4 max-w-2xl text-sm leading-6 opacity-90">{decision.action}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <DecisionMini title="Current Price" value={currency(stock.price)} note={`${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}% today`} />
            <DecisionMini title="Risk Level" value={decision.riskLevel} note="Based on beta, valuation, and debt" />
            <DecisionMini title="Suggested Entry" value={decision.entryZone} note="Prefer staged buying" />
            <DecisionMini title="Review / Exit" value={decision.exitTrigger} note="Do not ignore thesis changes" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PointerList title="Why this could be a BUY" tone="bull" items={decision.bullish} />
        <PointerList title="Why this could be a SELL / Avoid" tone="bear" items={decision.bearish} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Checklist title="What could go wrong?" items={decision.invalidation} tone="warning" />
        <Checklist title="What should I monitor next?" items={decision.monitor} tone="info" />
      </div>

      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50">
        <h3 className="text-xl font-bold">How to use this decision</h3>
        <p className="mt-2">Use this as a decision checklist, not a blind buy/sell signal. The best decision depends on your time horizon, portfolio size, existing exposure, and risk tolerance.</p>
      </div>
    </section>
  );
}

function DecisionMini({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] opacity-70">{title}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
      <p className="mt-1 text-xs opacity-70">{note}</p>
    </div>
  );
}

function PointerList({ title, items, tone }: { title: string; items: Pointer[]; tone: 'bull' | 'bear' }) {
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

function Checklist({ title, items, tone }: { title: string; items: string[]; tone: 'warning' | 'info' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h3 className={tone === 'warning' ? 'text-2xl font-bold text-amber-200' : 'text-2xl font-bold text-sky-200'}>{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item) => <div key={item} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">{item}</div>)}
      </div>
    </div>
  );
}
