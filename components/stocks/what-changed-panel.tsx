'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getLatestSavedAnalysisSnapshot,
  upsertSavedAnalysisSnapshot,
  type SavedAnalysisSnapshot,
} from '@/lib/stock-local-storage';
import type { StockMetrics } from '@/lib/stocks';
import type { scoreStock } from '@/lib/stocks';
import { buildDecisionSnapshot, compareAnalysisSnapshots, currency, pct, type StockDecisionSnapshot } from '@/lib/stock-decision-tools';

type Props = {
  stock: StockMetrics;
  score: ReturnType<typeof scoreStock>;
  upside: number;
};

function storageKey(symbol: string) {
  return `financeSphereLastAnalysis:${symbol.toUpperCase()}`;
}

export function WhatChangedPanel({ stock, score, upside }: Props) {
  const [previous, setPrevious] = useState<SavedAnalysisSnapshot | StockDecisionSnapshot | null>(null);
  const [userNote, setUserNote] = useState('');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const current = useMemo(() => buildDecisionSnapshot(stock, score, upside), [score, stock, upside]);
  const changes = previous ? compareAnalysisSnapshots(previous, current) : [];
  const positive = changes.filter((change) => change.tone === 'positive');
  const negative = changes.filter((change) => change.tone === 'negative');
  const neutral = changes.filter((change) => change.tone === 'neutral');

  useEffect(() => {
    setSavedMessage(null);
    setUserNote('');
    try {
      const saved = getLatestSavedAnalysisSnapshot(stock.symbol);
      if (saved) {
        setPrevious(saved);
        return;
      }
      const stored = window.localStorage.getItem(storageKey(stock.symbol));
      setPrevious(stored ? JSON.parse(stored) as StockDecisionSnapshot : null);
    } catch {
      setPrevious(null);
    }
  }, [stock.symbol]);

  function saveSnapshot() {
    const snapshot: SavedAnalysisSnapshot = {
      ...current,
      companyName: stock.name,
      lastPrice: stock.price,
      verdict: current.decision,
      savedAt: new Date().toISOString(),
      entryPlan: `${currency(stock.price * 0.95)} - ${currency(stock.price)} starter zone; reassess above ${currency(stock.analystTarget || stock.price * 1.1)}.`,
      userNote: userNote.trim(),
    };
    window.localStorage.setItem(storageKey(stock.symbol), JSON.stringify(current));
    upsertSavedAnalysisSnapshot(snapshot);
    setPrevious(snapshot);
    setSavedMessage(`Saved current ${stock.symbol} analysis snapshot.`);
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">What Changed?</p>
          <h2 className="mt-2 text-2xl font-black text-white">What changed since last analysis?</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Save a snapshot after researching a ticker, then compare the next analysis against it.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <label className="block text-sm font-semibold text-slate-300" htmlFor="analysis-note">User note</label>
          <textarea
            id="analysis-note"
            value={userNote}
            onChange={(event) => setUserNote(event.target.value)}
            placeholder="Why save this analysis?"
            className="mt-2 min-h-20 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300"
          />
          <button type="button" onClick={saveSnapshot} className="mt-3 w-full rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300">
            Save Analysis
          </button>
        </div>
      </div>

      {savedMessage && <p className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{savedMessage}</p>}

      {!previous ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
          This is your first saved analysis for this ticker.
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Mini label="Previous decision" value={previous.decision} note={new Date(previous.analyzedAt).toLocaleString()} />
            <Mini label="Current decision" value={current.decision} note={`${Math.round(current.confidence)}/100 confidence`} />
            <Mini label="Price change" value={`${currency(previous.price)} -> ${currency(current.price)}`} note={`${pct(((current.price - previous.price) / Math.max(1, previous.price)) * 100)} since snapshot`} />
            <Mini label="Risk score" value={`${Math.round(previous.riskScore)} -> ${Math.round(current.riskScore)}`} note="Lower is better" />
          </div>
          {'userNote' in previous && previous.userNote && (
            <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
              <strong className="text-white">Saved note:</strong> {previous.userNote}
            </p>
          )}
          {changes.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">No meaningful saved metric changes yet.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              <ChangeList title="Positive changes" changes={positive} tone="positive" />
              <ChangeList title="Negative changes" changes={negative} tone="negative" />
              <ChangeList title="Neutral changes" changes={neutral} tone="neutral" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Mini({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-xl font-black text-white">{value}</p><p className="mt-2 text-xs text-slate-500">{note}</p></div>;
}

function ChangeList({ title, changes, tone }: { title: string; changes: ReturnType<typeof compareAnalysisSnapshots>; tone: 'positive' | 'negative' | 'neutral' }) {
  const toneClass = tone === 'positive' ? 'border-emerald-300/20 bg-emerald-300/10' : tone === 'negative' ? 'border-red-300/20 bg-red-300/10' : 'border-white/10 bg-black/20';
  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {changes.length === 0 ? <p className="text-sm text-slate-400">None.</p> : changes.map((change) => (
          <div key={change.label} className="rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm">
            <p className="font-bold text-white">{change.label}</p>
            <p className="mt-1 text-slate-300">{change.before} to {change.after}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{change.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
