'use client';

import { useEffect, useMemo, useState } from 'react';
import type { StockMetrics } from '@/lib/stocks';
import type { scoreStock } from '@/lib/stocks';
import { buildPortfolioDecision, currency, pct, type RiskTolerance } from '@/lib/stock-decision-tools';

type Props = {
  stock: StockMetrics;
  score: ReturnType<typeof scoreStock>;
};

type StoredInputs = {
  portfolioSize: string;
  sharesOwned: string;
  averageCost: string;
  cashAvailable: string;
  targetAllocationPercent: string;
  riskTolerance: RiskTolerance;
  timeHorizon: '< 1 year' | '1-3 years' | '3+ years';
  alreadyOwns: boolean;
};

function storageKey(symbol: string) {
  return `financeSpherePortfolioInputs:${symbol.toUpperCase()}`;
}

const defaults: StoredInputs = {
  portfolioSize: '100000',
  sharesOwned: '0',
  averageCost: '0',
  cashAvailable: '5000',
  targetAllocationPercent: '5',
  riskTolerance: 'Balanced',
  timeHorizon: '1-3 years',
  alreadyOwns: false,
};

export function PortfolioAwareDecision({ stock, score }: Props) {
  const [inputs, setInputs] = useState<StoredInputs>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(false);
    try {
      const stored = window.localStorage.getItem(storageKey(stock.symbol));
      setInputs(stored ? { ...defaults, ...JSON.parse(stored) } : defaults);
    } catch {
      setInputs(defaults);
    }
  }, [stock.symbol]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey(stock.symbol), JSON.stringify(inputs));
      setSaved(true);
      const timeout = window.setTimeout(() => setSaved(false), 1200);
      return () => window.clearTimeout(timeout);
    } catch {
      return undefined;
    }
  }, [inputs, stock.symbol]);

  const validation = Number(inputs.portfolioSize) <= 0
    ? 'Portfolio size must be greater than 0.'
    : Number(inputs.targetAllocationPercent) < 0 || Number(inputs.targetAllocationPercent) > 100
      ? 'Target allocation must be between 0 and 100.'
      : null;

  const decision = useMemo(() => buildPortfolioDecision(stock, score, {
    portfolioSize: Number(inputs.portfolioSize) || 1,
    sharesOwned: Number(inputs.sharesOwned) || 0,
    averageCost: Number(inputs.averageCost) || 0,
    cashAvailable: Number(inputs.cashAvailable) || 0,
    targetAllocationPercent: Number(inputs.targetAllocationPercent) || 0,
    riskTolerance: inputs.riskTolerance,
    timeHorizon: inputs.timeHorizon,
    alreadyOwns: inputs.alreadyOwns,
  }), [inputs, score, stock]);

  const update = (key: keyof StoredInputs, value: string | boolean) => setInputs((current) => ({ ...current, [key]: value }));

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Portfolio-Aware Decision</p>
        <h2 className="mt-2 text-3xl font-black text-white">Turn the stock verdict into a position-size decision.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          A good stock can still be a bad buy if you are already concentrated. These inputs stay in your browser only.
        </p>
        {validation && <p className="mt-4 rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">{validation}</p>}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input label="Portfolio size" value={inputs.portfolioSize} onChange={(value) => update('portfolioSize', value)} />
          <Input label="Current shares owned" value={inputs.sharesOwned} onChange={(value) => update('sharesOwned', value)} />
          <Input label="Average cost" value={inputs.averageCost} onChange={(value) => update('averageCost', value)} />
          <Input label="Cash available" value={inputs.cashAvailable} onChange={(value) => update('cashAvailable', value)} />
          <Input label="Target allocation %" value={inputs.targetAllocationPercent} onChange={(value) => update('targetAllocationPercent', value)} />
          <Select label="Risk tolerance" value={inputs.riskTolerance} options={['Conservative', 'Balanced', 'Aggressive']} onChange={(value) => update('riskTolerance', value)} />
          <Select label="Time horizon" value={inputs.timeHorizon} options={['< 1 year', '1-3 years', '3+ years']} onChange={(value) => update('timeHorizon', value)} />
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-slate-300">
            <input type="checkbox" checked={inputs.alreadyOwns} onChange={(event) => update('alreadyOwns', event.target.checked)} className="h-4 w-4 accent-emerald-400" />
            Already owns this stock
          </label>
        </div>
        {saved && <p className="mt-3 text-xs font-semibold text-emerald-300">Saved locally for {stock.symbol}.</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Personalized verdict" value={decision.suggestedAction} note={decision.warning} tone={decision.suggestedAction === 'Add' ? 'good' : decision.suggestedAction === 'Trim' ? 'warn' : 'neutral'} />
        <Card title="Current exposure" value={currency(decision.currentPositionValue)} note={`${pct(decision.currentAllocationPercent)} of portfolio`} />
        <Card title="Target exposure" value={currency(decision.targetExposureValue)} note={`${inputs.targetAllocationPercent}% target allocation`} />
        <Card title="Suggested buy amount" value={currency(Math.min(Number(inputs.cashAvailable) || 0, decision.additionalDollarsNeeded))} note={`${decision.sharesToBuy.toFixed(2)} shares to move toward target`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-2xl font-bold text-white">Exposure summary</h3>
          <div className="mt-5 grid gap-3 text-sm">
            <Metric label="Sizing status" value={decision.sizingStatus} />
            <Metric label="Suggested max position" value={pct(decision.suggestedMaxPositionPercent)} />
            <Metric label="Unrealized gain/loss" value={`${currency(decision.unrealizedGainLoss)} (${pct(decision.unrealizedGainLossPercent)})`} />
            <Metric label="Cash-constrained shares to buy" value={decision.sharesToBuy.toFixed(2)} />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-2xl font-bold text-white">What I would do next</h3>
          <div className="mt-5 grid gap-3">
            {decision.checklist.map((item) => <p key={item} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">{item}</p>)}
          </div>
          <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            Educational analysis only, not financial advice. Inputs are saved locally in this browser, not sent to a backend.
          </p>
        </div>
      </div>
    </section>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block rounded-2xl border border-white/10 bg-black/20 p-4"><span className="text-sm font-semibold text-slate-300">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} inputMode="decimal" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-300" /></label>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="block rounded-2xl border border-white/10 bg-black/20 p-4"><span className="text-sm font-semibold text-slate-300">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-300">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function Card({ title, value, note, tone = 'neutral' }: { title: string; value: string; note: string; tone?: 'good' | 'warn' | 'neutral' }) {
  const toneClass = tone === 'good' ? 'border-emerald-300/20 bg-emerald-300/10' : tone === 'warn' ? 'border-amber-300/20 bg-amber-300/10' : 'border-white/10 bg-white/[0.04]';
  return <div className={`rounded-2xl border p-5 ${toneClass}`}><p className="text-sm text-slate-400">{title}</p><p className="mt-2 text-2xl font-black text-white">{value}</p><p className="mt-2 text-sm leading-6 text-slate-300">{note}</p></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><span className="text-slate-400">{label}</span><strong className="text-white">{value}</strong></div>;
}
