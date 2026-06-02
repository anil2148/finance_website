'use client';

import type { StockMetrics } from '@/lib/stocks';
import { scoreStock } from '@/lib/stocks';

type Props = {
  stock: StockMetrics;
};

function percent(value: number) {
  return `${value.toFixed(1)}%`;
}

function getStyle(stock: StockMetrics) {
  if (stock.epsGrowth > 20 && stock.revenueGrowth > 15) return 'Growth';
  if (stock.forwardPe < 22 && stock.profitMargin > 15) return 'Value / Quality';
  if (stock.dividendYield > 2) return 'Dividend Income';
  if (stock.epsGrowth > 8 && stock.forwardPe < 35) return 'GARP';
  return 'Quality Watchlist';
}

function macroSensitivity(stock: StockMetrics) {
  const rate = stock.forwardPe > 35 ? 'High' : stock.forwardPe > 25 ? 'Medium' : 'Low';
  const recession = stock.profitMargin < 12 || stock.beta > 1.6 ? 'High' : stock.beta > 1.1 ? 'Medium' : 'Low';
  const inflation = stock.profitMargin > 25 ? 'Low' : stock.profitMargin > 12 ? 'Medium' : 'High';
  return { rate, recession, inflation };
}

function sectorComparison(stock: StockMetrics) {
  const sectorForwardPe = 28;
  const sectorGrowth = 9;
  const sectorMargin = 18;
  return {
    valuation: stock.forwardPe <= sectorForwardPe ? 'Cheaper than sector proxy' : 'Pricier than sector proxy',
    growth: stock.revenueGrowth >= sectorGrowth ? 'Growth above sector proxy' : 'Growth below sector proxy',
    profitability: stock.profitMargin >= sectorMargin ? 'Profitability above sector proxy' : 'Profitability below sector proxy',
  };
}

function institutionalSignals(stock: StockMetrics) {
  const insider = stock.price < stock.analystTarget && stock.forwardPe < 35 ? 'Constructive' : 'Mixed';
  const institutions = stock.beta < 1.4 && stock.profitMargin > 20 ? 'Stable ownership profile likely' : 'Volatile ownership profile likely';
  const hedgeFunds = stock.epsGrowth > 15 || stock.revenueGrowth > 15 ? 'Could attract growth-oriented funds' : 'May be less attractive to momentum funds';
  return { insider, institutions, hedgeFunds };
}

function earningsTranscriptSummary(stock: StockMetrics) {
  const positives = [
    stock.revenueGrowth > 10 ? 'Management can emphasize revenue momentum.' : 'Management needs to explain how revenue growth will accelerate.',
    stock.profitMargin > 20 ? 'Margins support a quality narrative.' : 'Margin pressure needs close monitoring.',
    stock.debtToEquity < 0.8 ? 'Balance sheet gives flexibility.' : 'Debt discipline should be discussed.',
  ];
  const negatives = [
    stock.forwardPe > 35 ? 'Valuation leaves little room for weak guidance.' : 'Valuation risk is not the main concern.',
    stock.rsi > 68 ? 'Momentum may already be stretched into earnings.' : 'Technical setup is not extremely overbought.',
    stock.beta > 1.5 ? 'Stock may react sharply to macro or earnings surprises.' : 'Volatility risk is moderate.',
  ];
  return { positives, negatives, ceoConfidence: stock.epsGrowth > 10 && stock.revenueGrowth > 8 ? 'High' : 'Medium' };
}

function finalVerdict(stock: StockMetrics) {
  const score = scoreStock(stock);
  const upside = ((stock.analystTarget - stock.price) / stock.price) * 100;
  let verdict = 'HOLD / WATCH';
  if (score.total >= 78 && upside > 8) verdict = 'BUY CANDIDATE';
  if (score.total < 55 || upside < -5) verdict = 'AVOID / WAIT';
  const confidence = Math.min(95, Math.max(45, score.total + (upside > 10 ? 7 : upside < 0 ? -8 : 0)));
  return { verdict, confidence, upside, score };
}

export function InvestmentCommitteeVerdict({ stock }: Props) {
  const verdict = finalVerdict(stock);
  const macro = macroSensitivity(stock);
  const sector = sectorComparison(stock);
  const institutional = institutionalSignals(stock);
  const transcript = earningsTranscriptSummary(stock);
  const style = getStyle(stock);

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Investment Committee</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-black">Final verdict for {stock.symbol}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              This combines fundamentals, valuation, technicals, risk, macro sensitivity, and analyst target upside into a decision-support verdict. It is educational and should not be treated as personalized financial advice.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-right">
            <p className="text-sm text-slate-400">Verdict</p>
            <p className="mt-1 text-3xl font-black text-emerald-300">{verdict.verdict}</p>
            <p className="mt-2 text-sm text-slate-300">Confidence: {verdict.confidence}% • Score: {verdict.score.total}/100</p>
            <p className={verdict.upside >= 0 ? 'mt-1 text-sm text-emerald-300' : 'mt-1 text-sm text-red-300'}>Target upside: {percent(verdict.upside)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InsightPanel title="Investment Style" value={style} points={[`Best classified as ${style}.`, 'Use this style label to compare against your portfolio goals.', 'A growth stock needs different valuation tolerance than a dividend stock.']} />
        <InsightPanel title="Macro Risk Engine" value="Rate / Recession / Inflation" points={[`Interest-rate sensitivity: ${macro.rate}`, `Recession sensitivity: ${macro.recession}`, `Inflation sensitivity: ${macro.inflation}`]} />
        <InsightPanel title="Sector Comparison" value="Relative quality" points={[sector.valuation, sector.growth, sector.profitability]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightPanel title="Institutional Activity Proxy" value="Ownership signals" points={[`Insider signal: ${institutional.insider}`, institutional.institutions, institutional.hedgeFunds]} />
        <InsightPanel title="Earnings Transcript AI Preview" value={`CEO confidence: ${transcript.ceoConfidence}`} points={[...transcript.positives, ...transcript.negatives]} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xl font-bold">Portfolio-Level AI Checklist</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Checklist title="Concentration" text={`Avoid making ${stock.symbol} too large a position if its beta or earnings risk is high.`} />
          <Checklist title="Diversification" text={`Pair ${style} exposure with other styles such as value, dividend, bonds, or cash depending on your goals.`} />
          <Checklist title="Entry Discipline" text="Consider staged buying, alerts, or waiting for a better valuation if expected return is not attractive." />
        </div>
      </div>
    </section>
  );
}

function InsightPanel({ title, value, points }: { title: string; value: string; points: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-white">{value}</h3>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
        {points.map((point) => <li key={point}>• {point}</li>)}
      </ul>
    </div>
  );
}

function Checklist({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <h4 className="font-bold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}
