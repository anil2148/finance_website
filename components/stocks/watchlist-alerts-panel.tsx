'use client';

import { useEffect, useMemo, useState } from 'react';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { daysUntil, formatDateForDisplay, isValidDateInput, todayDateInputValue } from '@/lib/date-utils';
import type { StockMetrics } from '@/lib/stocks';
import type { scoreStock } from '@/lib/stocks';
import { buildDecisionSnapshot, currency, pct } from '@/lib/stock-decision-tools';

type Props = {
  stock: StockMetrics;
  score: ReturnType<typeof scoreStock>;
  upside: number;
};

type AlertRule = {
  type: 'price_below' | 'price_above' | 'opportunity_score_above' | 'risk_score_above' | 'earnings_reminder';
  value: string;
  enabled: boolean;
  reminderDate?: string;
};

type WatchlistItem = {
  symbol: string;
  name: string;
  priceAtSave: number;
  savedAt: string;
  decision: string;
  confidence: number;
  opportunityScore: number;
  riskScore: number;
  entryZone: string;
  targetPrice: string;
  targetDate?: string;
  nextReviewDate?: string;
  notes: string;
  alerts: AlertRule[];
};

const watchlistKey = 'financeSphereStockWatchlist';

function normalizeWatchlistItem(item: WatchlistItem): WatchlistItem {
  return {
    ...item,
    targetDate: item.targetDate && isValidDateInput(item.targetDate) ? item.targetDate : '',
    nextReviewDate: item.nextReviewDate && isValidDateInput(item.nextReviewDate) ? item.nextReviewDate : '',
    alerts: (item.alerts || []).map((alert) => ({
      ...alert,
      reminderDate: alert.reminderDate && isValidDateInput(alert.reminderDate) ? alert.reminderDate : '',
    })),
  };
}

export function WatchlistAlertsPanel({ stock, score, upside }: Props) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [entryZone, setEntryZone] = useState('');
  const [targetPrice, setTargetPrice] = useState(String(stock.analystTarget.toFixed(2)));
  const [targetDate, setTargetDate] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [notes, setNotes] = useState('');
  const [alertType, setAlertType] = useState<AlertRule['type']>('price_below');
  const [alertValue, setAlertValue] = useState(String((stock.price * 0.95).toFixed(2)));
  const [alertReminderDate, setAlertReminderDate] = useState('');
  const snapshot = useMemo(() => buildDecisionSnapshot(stock, score, upside), [score, stock, upside]);
  const today = todayDateInputValue();

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(watchlistKey) || '[]') as WatchlistItem[];
      setItems(stored.map(normalizeWatchlistItem));
    } catch {
      setItems([]);
    }
  }, []);

  function persist(nextItems: WatchlistItem[]) {
    setItems(nextItems);
    window.localStorage.setItem(watchlistKey, JSON.stringify(nextItems));
  }

  function addCurrentStock() {
    const nextItem: WatchlistItem = {
      symbol: stock.symbol,
      name: stock.name,
      priceAtSave: stock.price,
      savedAt: new Date().toISOString(),
      decision: snapshot.decision,
      confidence: snapshot.confidence,
      opportunityScore: snapshot.opportunityScore,
      riskScore: snapshot.riskScore,
      entryZone,
      targetPrice,
      targetDate,
      nextReviewDate,
      notes,
      alerts: alertValue || alertReminderDate ? [{ type: alertType, value: alertValue, reminderDate: alertReminderDate, enabled: true }] : [],
    };
    persist([nextItem, ...items.filter((item) => item.symbol !== stock.symbol)]);
  }

  function remove(symbol: string) {
    persist(items.filter((item) => item.symbol !== symbol));
  }

  function updateItem(symbol: string, updates: Partial<WatchlistItem>) {
    persist(items.map((item) => item.symbol === symbol ? { ...item, ...updates } : item));
  }

  function addAlert(symbol: string) {
    updateItem(symbol, { alerts: [...(items.find((item) => item.symbol === symbol)?.alerts || []), { type: alertType, value: alertValue, reminderDate: alertReminderDate, enabled: true }] });
  }

  const currentItem = items.find((item) => item.symbol === stock.symbol);
  const triggeredAlerts = currentItem?.alerts.filter((alert) => alert.enabled && isAlertMet(alert, stock, snapshot)) || [];

  return (
    <section className="space-y-6">
      {triggeredAlerts.length > 0 && (
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 text-emerald-100">
          Your saved alert condition is met for {stock.symbol}: {triggeredAlerts.map((alert) => alertLabel(alert)).join(', ')}.
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Watchlist and Alert Planning</p>
        <h2 className="mt-2 text-3xl font-black text-white">Save stocks, planned entries, notes, and local alert rules.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Local watchlist only. Alerts are saved as rules, but background notifications require a future backend job.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input label="Planned entry price or zone" value={entryZone} onChange={setEntryZone} placeholder={`${currency(stock.price * 0.95)} - ${currency(stock.price)}`} />
          <Input label="Target trim price" value={targetPrice} onChange={setTargetPrice} />
          <Select label="Alert type" value={alertType} onChange={(value) => setAlertType(value as AlertRule['type'])} options={['price_below', 'price_above', 'opportunity_score_above', 'risk_score_above', 'earnings_reminder']} />
          <Input label="Alert value" value={alertValue} onChange={setAlertValue} />
          <DatePickerField label="Saved target date" value={targetDate} onChange={setTargetDate} min={today} helperText="Optional date for your target or trim plan." />
          <DatePickerField label="Next review date" value={nextReviewDate} onChange={setNextReviewDate} min={today} helperText="Choose when you want to review this stock again." />
          <DatePickerField label="Alert reminder date" value={alertReminderDate} onChange={setAlertReminderDate} min={today} helperText="Optional. Used for earnings reminder or local review rules." />
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-semibold text-slate-300">Notes</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-300" />
        </label>
        <button type="button" onClick={addCurrentStock} className="mt-4 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300">
          Add {stock.symbol} to watchlist
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-2xl font-bold text-white">Saved stocks</h3>
        {items.length === 0 ? (
          <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">No saved stocks yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="text-slate-400"><tr><th className="py-2">Symbol</th><th>Price at save</th><th>Current loaded price</th><th>Decision</th><th>Confidence</th><th>Entry plan</th><th>Target</th><th>Review</th><th>Notes</th><th>Alerts</th><th></th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.symbol} className="border-t border-white/10 text-slate-200">
                    <td className="py-3 font-bold text-white">{item.symbol}<span className="block text-xs font-normal text-slate-500">{item.name}</span></td>
                    <td>{currency(item.priceAtSave)}</td>
                    <td>{item.symbol === stock.symbol ? currency(stock.price) : 'Load stock to compare'}</td>
                    <td>{item.decision}</td>
                    <td>{Math.round(item.confidence)}/100</td>
                    <td><input value={item.entryZone} onChange={(event) => updateItem(item.symbol, { entryZone: event.target.value })} className="w-40 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-white" /></td>
                    <td>
                      <input value={item.targetPrice} onChange={(event) => updateItem(item.symbol, { targetPrice: event.target.value })} className="w-28 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-white" />
                      <input type="date" value={item.targetDate || ''} min={today} onChange={(event) => updateItem(item.symbol, { targetDate: event.target.value })} className="mt-2 w-36 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-white" />
                    </td>
                    <td>
                      <input type="date" value={item.nextReviewDate || ''} min={today} onChange={(event) => updateItem(item.symbol, { nextReviewDate: event.target.value })} className="w-36 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-white" />
                      <span className="mt-1 block text-xs text-slate-500">{item.nextReviewDate ? formatDateForDisplay(item.nextReviewDate) : 'No review date'}</span>
                    </td>
                    <td><input value={item.notes} onChange={(event) => updateItem(item.symbol, { notes: event.target.value })} className="w-56 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-white" /></td>
                    <td>{item.alerts.length ? item.alerts.map(alertLabel).join('; ') : 'None'}<button type="button" onClick={() => addAlert(item.symbol)} className="ml-2 rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300">Add rule</button></td>
                    <td><button type="button" onClick={() => remove(item.symbol)} className="rounded-lg border border-red-300/20 px-2 py-1 text-xs text-red-100">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">Educational analysis only, not financial advice. Watchlist and alert rules are saved locally in this browser.</p>
      </div>
    </section>
  );
}

function isAlertMet(alert: AlertRule, stock: StockMetrics, snapshot: ReturnType<typeof buildDecisionSnapshot>) {
  const value = Number(alert.value);
  if (alert.type === 'price_below') return stock.price <= value;
  if (alert.type === 'price_above') return stock.price >= value;
  if (alert.type === 'opportunity_score_above') return snapshot.opportunityScore >= value;
  if (alert.type === 'risk_score_above') return snapshot.riskScore >= value;
  if (alert.type === 'earnings_reminder') return alert.reminderDate ? (daysUntil(alert.reminderDate) ?? 1) <= 0 : false;
  return false;
}

function alertLabel(alert: AlertRule) {
  const reminder = alert.reminderDate ? ` on ${formatDateForDisplay(alert.reminderDate)}` : '';
  return `${alert.type.replaceAll('_', ' ')} ${alert.value}${reminder}`;
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block rounded-2xl border border-white/10 bg-black/20 p-4"><span className="text-sm font-semibold text-slate-300">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-300" /></label>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="block rounded-2xl border border-white/10 bg-black/20 p-4"><span className="text-sm font-semibold text-slate-300">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-300">{options.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}</select></label>;
}
