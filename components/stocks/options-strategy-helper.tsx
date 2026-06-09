'use client';

import { useMemo, useState } from 'react';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { daysUntil, isValidDateInput, normalizeShortDateInput, todayDateInputValue, toDateInputValue } from '@/lib/date-utils';
import type { StockMetrics } from '@/lib/stocks';
import { calculateOptionsStrategy, currency, pct, type OptionStrategyInput, type RiskTolerance } from '@/lib/stock-decision-tools';

type Props = {
  stock: StockMetrics;
};

type OptionAction = OptionStrategyInput['action'];
type StrategyType = OptionStrategyInput['strategyType'];

function nextMonthlyExpiration() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(20);
  return toDateInputValue(date);
}

export function OptionsStrategyHelper({ stock }: Props) {
  const [strategyType, setStrategyType] = useState<StrategyType>('Covered Call');
  const [action, setAction] = useState<OptionAction>('Sold option');
  const [currentStockPrice, setCurrentStockPrice] = useState(String(stock.price.toFixed(2)));
  const [strikePrice, setStrikePrice] = useState(String(Math.round(stock.price * 1.05)));
  const [expirationDate, setExpirationDate] = useState(nextMonthlyExpiration());
  const [averageCredit, setAverageCredit] = useState('1.50');
  const [currentOptionPrice, setCurrentOptionPrice] = useState('0.75');
  const [contracts, setContracts] = useState('1');
  const [dateSold, setDateSold] = useState('');
  const [ownsShares, setOwnsShares] = useState(true);
  const [sharesOwned, setSharesOwned] = useState('100');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('Balanced');
  const [positionPaste, setPositionPaste] = useState('');

  const today = todayDateInputValue();
  const expirationDaysRemaining = daysUntil(expirationDate);
  const expirationError = !expirationDate || !isValidDateInput(expirationDate)
    ? 'Select an expiration date to calculate days remaining.'
    : expirationDaysRemaining !== null && expirationDaysRemaining < 0
      ? 'Expiration date is in the past.'
    : undefined;
  const dateSoldError = dateSold && !isValidDateInput(dateSold) ? 'Choose a valid date sold.' : undefined;
  const validation = expirationError || dateSoldError || (Math.abs(Number(contracts)) <= 0
    ? 'Contracts must be greater than 0.'
    : Number(strikePrice) <= 0 || Number(currentStockPrice) <= 0
      ? 'Stock price and strike price must be greater than 0.'
      : null);

  const result = useMemo(() => calculateOptionsStrategy({
    strategyType,
    action,
    currentStockPrice: Number(currentStockPrice) || stock.price,
    strikePrice: Number(strikePrice) || stock.price,
    expirationDate,
    averageCredit: Number(averageCredit) || 0,
    currentOptionPrice: Number(currentOptionPrice) || 0,
    contracts: Number(contracts) || 1,
    dateSold,
    ownsShares,
    sharesOwned: Number(sharesOwned) || 0,
    riskTolerance,
    beta: stock.beta,
  }), [action, averageCredit, contracts, currentOptionPrice, currentStockPrice, dateSold, expirationDate, ownsShares, riskTolerance, sharesOwned, stock.beta, stock.price, strategyType, strikePrice]);

  function parsePositionDetails() {
    const lines = positionPaste.split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const lower = line.toLowerCase();
      const money = line.match(/-?\$?([\d,]+(?:\.\d+)?)/)?.[1]?.replace(/,/g, '');
      if (lower.includes('current price') && money) setCurrentOptionPrice(money);
      else if (lower.includes('current') && lower.includes(stock.symbol.toLowerCase()) && money) setCurrentStockPrice(money);
      else if (lower.includes('expiration') && (line.match(/\d{4}-\d{2}-\d{2}/) || line.match(/\d{1,2}\/\d{1,2}/))) {
        const dateValue = line.match(/\d{4}-\d{2}-\d{2}/)?.[0] || line.match(/\d{1,2}\/\d{1,2}(?:\/\d{2,4})?/)?.[0] || '';
        const normalized = isValidDateInput(dateValue) ? dateValue : normalizeShortDateInput(dateValue);
        if (normalized) setExpirationDate(normalized);
      } else if (lower.includes('average credit') && money) setAverageCredit(money);
      else if (lower.includes('contract') && line.match(/-?\d+/)) setContracts(String(Math.abs(Number(line.match(/-?\d+/)?.[0] || '1'))));
      else if (lower.includes('date sold')) {
        const dateValue = line.match(/\d{4}-\d{2}-\d{2}/)?.[0] || line.replace(/date sold/i, '').trim();
        const normalized = isValidDateInput(dateValue) ? dateValue : normalizeShortDateInput(dateValue);
        if (normalized) setDateSold(normalized);
      }
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Options Strategy Helper</p>
        <h2 className="mt-2 text-3xl font-black text-white">Covered call, cash-secured put, and buy-to-close helper.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Model short-option credit, remaining premium, assignment risk, and whether closing or holding is more reasonable.
        </p>
        {validation && <p className="mt-4 rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">{validation}</p>}
        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <Select label="Strategy type" value={strategyType} options={['Covered Call', 'Cash-Secured Put', 'Short Call', 'Short Put']} onChange={(value) => setStrategyType(value as StrategyType)} />
            <Select label="Option action" value={action} options={['Sold option', 'Considering selling', 'Considering buying to close']} onChange={(value) => setAction(value as OptionAction)} />
            <Input label="Stock symbol" value={stock.symbol} readOnly />
            <Input label="Current stock price" value={currentStockPrice} onChange={setCurrentStockPrice} />
            <Input label="Strike price" value={strikePrice} onChange={setStrikePrice} />
            <DatePickerField label="Expiration date" value={expirationDate} onChange={setExpirationDate} min={today} required helperText="Click to choose a date. Choose the option expiration date." error={expirationError} />
            <Input label="Average credit received" value={averageCredit} onChange={setAverageCredit} helper="Use the premium you collected when selling the option, e.g. 4.38." />
            <Input label="Current option price" value={currentOptionPrice} onChange={setCurrentOptionPrice} helper="Use the current buyback price from your broker." />
            <Input label="Contracts" value={contracts} onChange={setContracts} helper="Enter the number of option contracts. One contract usually controls 100 shares." />
            <DatePickerField label="Date sold" value={dateSold} onChange={setDateSold} max={today} helperText="Click to choose a date. Optional. Used to understand how quickly premium was captured." error={dateSoldError} />
            <Select label="Risk tolerance" value={riskTolerance} options={['Conservative', 'Balanced', 'Aggressive']} onChange={(value) => setRiskTolerance(value as RiskTolerance)} />
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-slate-300"><input type="checkbox" checked={ownsShares} onChange={(event) => setOwnsShares(event.target.checked)} className="h-4 w-4 accent-emerald-400" />Owns shares?</label>
            <Input label="Shares owned" value={sharesOwned} onChange={setSharesOwned} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <label className="text-sm font-semibold text-slate-300">Paste position details</label>
            <textarea value={positionPaste} onChange={(event) => setPositionPaste(event.target.value)} placeholder={'Market value -$3,830\nCurrent price $19.15\nCurrent MSFT price $426.42\nExpiration date 2026-11-20\nAverage credit $33.45\nContracts -2\nDate sold 2026-06-01'} className="mt-2 min-h-52 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300" />
            <button type="button" onClick={parsePositionDetails} className="mt-3 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-300">Parse details</button>
            <p className="mt-3 text-xs leading-5 text-slate-400">Parser is a convenience helper. Review fields before using the output.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Profit if closed now" value={currency(result.currentProfit)} note={`${pct(result.premiumCapturedPercent)} premium captured`} tone={result.currentProfit >= 0 ? 'good' : 'warn'} />
        <Card title="Remaining max premium" value={currency(result.remainingPremium)} note="Premium left if the option goes to zero." />
        <Card title="Distance to strike" value={`${currency(result.distanceToStrike)} (${pct(result.distanceToStrikePercent)})`} note={`${result.assignmentRisk} assignment risk`} tone={result.assignmentRisk === 'High' ? 'warn' : 'neutral'} />
        <Card title="Suggested action" value={result.suggestedAction} note={`${result.daysToExpiration} days to expiration`} tone={result.suggestedAction === 'Close' ? 'good' : result.suggestedAction === 'Roll' ? 'warn' : 'neutral'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-2xl font-bold text-white">Why this decision?</h3>
          <div className="mt-4 grid gap-3">
            {result.why.map((reason) => <p key={reason} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">{reason}</p>)}
          </div>
          <div className="mt-4 grid gap-3 text-sm">
            <Metric label="Breakeven" value={currency(result.breakeven)} />
            <Metric label="Total credit received" value={currency(result.totalCredit)} />
            <Metric label="Buyback cost" value={currency(result.buybackCost)} />
            <Metric label="Annualized return on premium" value={pct(result.annualizedReturnPercent)} />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-2xl font-bold text-white">Scenario table</h3>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-slate-400"><tr><th className="py-2">Scenario</th><th>Option price</th><th>Buyback cost</th><th>Profit locked</th><th>Additional vs now</th></tr></thead>
              <tbody>
                {result.scenarios.map((scenario) => (
                  <tr key={scenario.name} className="border-t border-white/10 text-slate-200">
                    <td className="py-3 font-bold text-white">{scenario.name}</td>
                    <td>{currency(scenario.optionPrice)}</td>
                    <td>{currency(scenario.buybackCost)}</td>
                    <td>{currency(scenario.profitLocked)}</td>
                    <td>{currency(scenario.additionalProfitVsNow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">This is educational analysis only, not financial advice.</p>
        </div>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, type = 'text', readOnly = false, placeholder, helper }: { label: string; value: string; onChange?: (value: string) => void; type?: string; readOnly?: boolean; placeholder?: string; helper?: string }) {
  return <label className="block rounded-2xl border border-white/10 bg-black/20 p-4"><span className="text-sm font-semibold text-slate-300">{label}</span><input type={type} value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} inputMode={type === 'date' ? undefined : 'decimal'} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-300" />{helper && <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span>}</label>;
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
