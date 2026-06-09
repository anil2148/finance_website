'use client';

import { useMemo, useState } from 'react';
import type { StockMetrics } from '@/lib/stocks';
import { buildEntryPlan, currency, pct, type RiskTolerance } from '@/lib/stock-decision-tools';
import type { scoreStock } from '@/lib/stocks';

type Props = {
  stock: StockMetrics;
  score: ReturnType<typeof scoreStock>;
  upside: number;
};

export function EntryPricePlanner({ stock, score, upside }: Props) {
  const [fairValueEstimate, setFairValueEstimate] = useState('');
  const [allocationAmount, setAllocationAmount] = useState('5000');
  const [buyStyle, setBuyStyle] = useState<RiskTolerance>('Balanced');
  const [timeHorizon, setTimeHorizon] = useState<'Short-term' | '1 year' | '3+ years'>('1 year');
  const [pullbackPercent, setPullbackPercent] = useState(5);
  const [stagedBuys, setStagedBuys] = useState(3);

  const plan = useMemo(() => buildEntryPlan(stock, score, {
    currentPrice: stock.price,
    analystTarget: stock.analystTarget,
    fairValueEstimate: Number(fairValueEstimate) || undefined,
    allocationAmount: Number(allocationAmount) || 0,
    buyStyle,
    timeHorizon,
    pullbackPercent,
    stagedBuys,
  }), [allocationAmount, buyStyle, fairValueEstimate, pullbackPercent, score, stagedBuys, stock, timeHorizon]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Entry Price Planner</p>
        <h2 className="mt-2 text-3xl font-black text-white">Plan staged buys instead of chasing one price.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          This planner blends valuation, upside, RSI, quality score, and your buy style to suggest starter, add-more, and final-add levels.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InputCard label="Fair value estimate" value={fairValueEstimate} onChange={setFairValueEstimate} placeholder={stock.analystTarget.toFixed(2)} />
          <InputCard label="Target allocation amount" value={allocationAmount} onChange={setAllocationAmount} placeholder="5000" />
          <SelectCard label="Buy style" value={buyStyle} onChange={(value) => setBuyStyle(value as RiskTolerance)} options={['Conservative', 'Balanced', 'Aggressive']} />
          <SelectCard label="Time horizon" value={timeHorizon} onChange={(value) => setTimeHorizon(value as typeof timeHorizon)} options={['Short-term', '1 year', '3+ years']} />
          <SelectCard label="Technical pullback" value={`${pullbackPercent}`} onChange={(value) => setPullbackPercent(Number(value))} options={['3', '5', '8', '10']} suffix="%" />
          <SelectCard label="Staged buys" value={`${stagedBuys}`} onChange={(value) => setStagedBuys(Number(value))} options={['2', '3', '4']} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ResultCard title="Buy now?" value={plan.verdict} note={plan.riskRewardSummary} tone={plan.verdict === 'Wait' ? 'warn' : 'good'} />
        <ResultCard title="Preferred entry zone" value={plan.preferredEntryZone} note="Use staged buying inside this range." />
        <ResultCard title="Avoid adding above" value={currency(plan.avoidAddingAbove)} note="Do not chase unless fundamentals improve." />
        <ResultCard title="Stop-review level" value={currency(plan.stopReviewLevel)} note="Review thesis if price breaks below this area." tone="warn" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-2xl font-bold text-white">Suggested staged allocation</h3>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-2">Stage</th>
                  <th>Allocation</th>
                  <th>Buy price</th>
                  <th>Dollars</th>
                  <th>Estimated shares</th>
                </tr>
              </thead>
              <tbody>
                {plan.stages.map((stage) => (
                  <tr key={stage.label} className="border-t border-white/10 text-slate-200">
                    <td className="py-3 font-bold text-white">{stage.label}</td>
                    <td>{stage.allocationPercent}%</td>
                    <td>{currency(stage.price)}</td>
                    <td>{currency(stage.dollars)}</td>
                    <td>{stage.shares.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-2xl font-bold text-white">Decision inputs</h3>
          <div className="mt-5 grid gap-3 text-sm">
            <Metric label="Current price" value={currency(stock.price)} />
            <Metric label="Analyst target" value={currency(stock.analystTarget)} />
            <Metric label="Estimated upside" value={pct(upside)} />
            <Metric label="Margin of safety" value={pct(plan.marginOfSafety)} />
            <Metric label="RSI" value={stock.rsi.toFixed(1)} />
            <Metric label="Forward P/E" value={stock.forwardPe.toFixed(1)} />
            <Metric label="Revenue growth" value={pct(stock.revenueGrowth)} />
            <Metric label="EPS growth" value={pct(stock.epsGrowth)} />
          </div>
          <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            Educational analysis only, not financial advice. Use entries with your own risk limits and portfolio plan.
          </p>
        </div>
      </div>
    </section>
  );
}

function InputCard({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/20 p-4">
      <span className="text-sm font-semibold text-slate-300">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} inputMode="decimal" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-300" />
    </label>
  );
}

function SelectCard({ label, value, onChange, options, suffix = '' }: { label: string; value: string; onChange: (value: string) => void; options: string[]; suffix?: string }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/20 p-4">
      <span className="text-sm font-semibold text-slate-300">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-300">
        {options.map((option) => <option key={option} value={option}>{option}{suffix}</option>)}
      </select>
    </label>
  );
}

function ResultCard({ title, value, note, tone = 'neutral' }: { title: string; value: string; note: string; tone?: 'good' | 'warn' | 'neutral' }) {
  const toneClass = tone === 'good' ? 'border-emerald-300/20 bg-emerald-300/10' : tone === 'warn' ? 'border-amber-300/20 bg-amber-300/10' : 'border-white/10 bg-white/[0.04]';
  return <div className={`rounded-2xl border p-5 ${toneClass}`}><p className="text-sm text-slate-400">{title}</p><p className="mt-2 text-2xl font-black text-white">{value}</p><p className="mt-2 text-sm leading-6 text-slate-300">{note}</p></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><span className="text-slate-400">{label}</span><strong className="text-white">{value}</strong></div>;
}
