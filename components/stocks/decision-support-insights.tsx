'use client';

import type { StockMetrics } from '@/lib/stocks';
import { calculateDcf, scoreStock } from '@/lib/stocks';

type DecisionSupportInsightsProps = {
  stock: StockMetrics;
};

function getMoatScore(stock: StockMetrics) {
  let score = 0;
  if (stock.profitMargin >= 25) score += 30;
  else if (stock.profitMargin >= 15) score += 20;
  else score += 10;

  if (stock.roe >= 30) score += 30;
  else if (stock.roe >= 15) score += 20;
  else score += 8;

  if (stock.revenueGrowth >= 10) score += 20;
  else if (stock.revenueGrowth >= 5) score += 12;
  else score += 5;

  if (stock.debtToEquity <= 0.6) score += 20;
  else if (stock.debtToEquity <= 1.5) score += 12;
  else score += 4;

  return Math.min(100, score);
}

function getManagementScore(stock: StockMetrics) {
  let score = 50;
  if (stock.roe > 20) score += 20;
  if (stock.profitMargin > 20) score += 15;
  if (stock.debtToEquity < 0.7) score += 10;
  if (stock.epsGrowth > stock.revenueGrowth) score += 5;
  return Math.min(100, score);
}

function getEarningsRisk(stock: StockMetrics) {
  let risk = 35;
  if (stock.forwardPe > 40) risk += 20;
  if (stock.rsi > 70) risk += 15;
  if (stock.beta > 1.5) risk += 15;
  if (stock.epsGrowth < 8) risk += 15;
  if (stock.profitMargin < 12) risk += 10;
  return Math.min(100, risk);
}

function getRiskLevel(stock: StockMetrics) {
  const risk = getEarningsRisk(stock);
  if (risk >= 70) return { label: 'High', detail: 'High volatility, valuation, or earnings-risk profile. Position sizing matters.' };
  if (risk >= 45) return { label: 'Medium', detail: 'Balanced risk profile. Watch valuation, earnings, and market trend.' };
  return { label: 'Low', detail: 'Lower relative risk based on current quality, balance sheet, and volatility inputs.' };
}

function getFairValue(stock: StockMetrics) {
  const estimatedFcf = stock.price * 1000 * Math.max(0.05, stock.profitMargin / 100);
  const shares = 1000;
  const growth = Math.min(18, Math.max(3, stock.epsGrowth));
  return calculateDcf({
    freeCashFlow: estimatedFcf,
    growthRate: growth,
    discountRate: stock.beta > 1.5 ? 12 : 10,
    terminalGrowthRate: 3,
    sharesOutstanding: shares,
  });
}

function getExpectedReturn(stock: StockMetrics, fairValue: number) {
  const fairValueReturn = ((fairValue - stock.price) / stock.price) * 100;
  return fairValueReturn + stock.dividendYield;
}

function labelForScore(score: number) {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Mixed';
  return 'Weak';
}

export function DecisionSupportInsights({ stock }: DecisionSupportInsightsProps) {
  const score = scoreStock(stock);
  const moatScore = getMoatScore(stock);
  const managementScore = getManagementScore(stock);
  const earningsRisk = getEarningsRisk(stock);
  const riskLevel = getRiskLevel(stock);
  const fairValue = getFairValue(stock);
  const expectedReturn = getExpectedReturn(stock, fairValue);
  const targetUpside = ((stock.analystTarget - stock.price) / stock.price) * 100;
  const buffettFit = moatScore >= 70 && managementScore >= 70 && stock.forwardPe <= 35 && stock.debtToEquity <= 1.2;

  const bullPoints = [
    stock.revenueGrowth > 10 ? 'Revenue growth is strong enough to support future earnings expansion.' : 'Revenue growth is positive but needs acceleration for stronger upside.',
    stock.profitMargin > 20 ? 'Profit margins show pricing power and business quality.' : 'Margins are not yet strong enough to be a clear bullish driver.',
    targetUpside > 10 ? 'Analyst target suggests meaningful upside from the current price.' : 'Analyst target upside is limited, so valuation discipline is important.',
  ];

  const bearPoints = [
    stock.forwardPe > 35 ? 'Forward P/E is elevated, so the stock may fall if earnings disappoint.' : 'Valuation risk is moderate compared with very expensive growth stocks.',
    stock.beta > 1.5 ? 'High beta can cause larger drawdowns during market weakness.' : 'Beta is not extremely high, which may reduce volatility risk.',
    earningsRisk > 65 ? 'Earnings risk is high because expectations, momentum, or valuation may be stretched.' : 'Earnings risk is not extreme, but guidance still matters.',
  ];

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Decision Support</p>
            <h2 className="mt-2 text-2xl font-bold">Should you buy, hold, or avoid {stock.symbol}?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              This is a data-driven decision framework. It is not personalized financial advice, but it helps you understand the bullish case, bearish case, valuation, risk, and quality signals before acting.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-black/30 p-4 text-right">
            <p className="text-sm text-slate-400">Decision signal</p>
            <p className="text-2xl font-black text-emerald-300">{score.rating}</p>
            <p className="text-xs text-slate-400">Composite score {score.total}/100</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DecisionCard title="Economic Moat" value={`${moatScore}/100`} label={labelForScore(moatScore)} note="Measures pricing power, ROE, margin quality, growth, and balance-sheet strength." />
          <DecisionCard title="Management Quality" value={`${managementScore}/100`} label={labelForScore(managementScore)} note="Uses capital efficiency, margins, debt discipline, and earnings execution proxies." />
          <DecisionCard title="Earnings Risk" value={`${earningsRisk}/100`} label={earningsRisk >= 70 ? 'High Risk' : earningsRisk >= 45 ? 'Medium Risk' : 'Lower Risk'} note="Higher score means more risk around earnings, valuation, momentum, or volatility." />
          <DecisionCard title="Risk Meter" value={riskLevel.label} label="Position sizing" note={riskLevel.detail} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ThesisCard title="Bull Case" tone="bull" items={bullPoints} />
        <ThesisCard title="Bear Case" tone="bear" items={bearPoints} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-bold">Fair Value Estimate</h3>
          <p className="mt-3 text-4xl font-black text-emerald-300">${fairValue.toFixed(2)}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Estimated using a simplified DCF model based on profitability, growth, beta-adjusted discount rate, and terminal growth. Treat this as a directional estimate, not a precise price target.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-bold">Expected Return</h3>
          <p className={expectedReturn >= 0 ? 'mt-3 text-4xl font-black text-emerald-300' : 'mt-3 text-4xl font-black text-red-300'}>
            {expectedReturn.toFixed(1)}%
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Combines estimated fair-value upside/downside plus dividend yield. A negative number means the current price may already be above estimated fair value.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-bold">Buffett-Style Checklist</h3>
          <p className={buffettFit ? 'mt-3 text-3xl font-black text-emerald-300' : 'mt-3 text-3xl font-black text-amber-300'}>
            {buffettFit ? 'Possible Fit' : 'Needs Caution'}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Looks for durable moat, strong management-quality proxies, reasonable valuation, and manageable debt. This is inspired by quality-investing principles, not an endorsement.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xl font-bold">5-Year Investment Thesis</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Scenario title="Best Case" text={`${stock.name} compounds earnings through strong revenue growth, stable margins, and continued investor confidence. Upside improves if valuation remains supported.`} />
          <Scenario title="Base Case" text={`${stock.name} performs in line with fundamentals. Returns depend on earnings growth, current valuation, and whether management keeps margins stable.`} />
          <Scenario title="Worst Case" text={`Growth slows, margins compress, or the market assigns a lower multiple. High valuation or high beta can make drawdowns sharper.`} />
        </div>
      </div>
    </section>
  );
}

function DecisionCard({ title, value, label, note }: { title: string; value: string; label: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">{label}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{note}</p>
    </div>
  );
}

function ThesisCard({ title, items, tone }: { title: string; items: string[]; tone: 'bull' | 'bear' }) {
  const color = tone === 'bull' ? 'border-emerald-400/20 bg-emerald-400/10' : 'border-red-400/20 bg-red-400/10';
  return (
    <div className={`rounded-2xl border p-6 ${color}`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-100">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}

function Scenario({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <h4 className="font-bold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}
