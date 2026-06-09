'use client';

import { useEffect, useState } from 'react';

type SmartMoneyResponse = {
  symbol: string;
  score: number;
  signal: 'Bullish' | 'Neutral' | 'Bearish';
  insider: {
    signal: 'Bullish' | 'Neutral' | 'Bearish';
    netShares: number;
    buys: number;
    sells: number;
    transactions: Array<{
      name?: string;
      date?: string;
      change?: number;
      shares?: number;
      price?: number;
      code?: string;
    }>;
  };
  institutional: {
    signal: 'Bullish' | 'Neutral' | 'Bearish';
    netChange: number;
    holders: Array<{
      name?: string;
      shares?: number;
      change?: number;
      filingDate?: string;
      reportDate?: string;
    }>;
  };
  warnings?: string[];
  fetchedAt?: string;
  source?: string;
  isFallback?: boolean;
};

function compact(value?: number) {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(Number(value));
}

function signalClass(signal?: string) {
  if (signal === 'Bullish') return 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100';
  if (signal === 'Bearish') return 'border-red-300/30 bg-red-300/10 text-red-100';
  return 'border-slate-300/20 bg-slate-300/10 text-slate-100';
}

function signalInterpretation(signal?: string) {
  if (signal === 'Bullish') return 'Accumulation';
  if (signal === 'Bearish') return 'Distribution';
  if (signal === 'Neutral') return 'Neutral';
  return 'Mixed';
}

export function SmartMoneyPanel({ symbol, refreshKey = 0 }: { symbol: string; refreshKey?: number }) {
  const [data, setData] = useState<SmartMoneyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/stocks/smart-money?symbol=${encodeURIComponent(symbol)}&refresh=${refreshKey}`, { cache: 'no-store', signal: controller.signal });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load smart money data.');
        if (!controller.signal.aborted && (!payload?.symbol || payload.symbol === symbol)) setData(payload);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Unable to load smart money data.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [symbol, refreshKey]);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Smart Money Intelligence</p>
          <h3 className="mt-2 text-2xl font-bold">What are insiders and institutions doing?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            This section tracks insider transactions and institutional ownership. It helps users see whether company insiders or large investors appear to be accumulating, reducing, or staying neutral.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <InterpretationCard title="What smart money means" text="Insider and institutional activity can support or challenge a thesis, but it should not override earnings, valuation, and risk." />
            <InterpretationCard title="Signal interpretation" text="Bullish maps to accumulation, bearish maps to distribution, and neutral or mixed signals need confirmation." />
            <InterpretationCard title="What to watch next" text="Look for repeated insider buying, broad institutional accumulation, or warnings about missing provider data." />
          </div>
        </div>
        {data && (
          <div className={`rounded-2xl border p-4 text-center ${signalClass(data.signal)}`}>
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">Smart Money View</p>
            <p className="mt-2 text-2xl font-black">{data.signal}</p>
            <p className="mt-1 text-sm">Score {data.score}/100</p>
            {data.fetchedAt && <p className="mt-1 text-xs opacity-70">Updated {new Date(data.fetchedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>}
          </div>
        )}
      </div>

      {loading && <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">Updating insider and institutional data for {symbol}...</div>}
      {error && <div className="mt-5 rounded-xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">{error}</div>}

      {data && !loading && !error && (
        <>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <InsightCard title="Smart Money Score" value={`${data.score}/100`} note="Combines insider and institutional activity into a simple signal." />
            <InsightCard title="Insider Signal" value={signalInterpretation(data.insider.signal)} note="Bullish when insiders are net buyers; bearish when net selling dominates." />
            <InsightCard title="Institutional Signal" value={signalInterpretation(data.institutional.signal)} note="Bullish when large holders appear to be increasing positions." />
          </div>

          {!data.insider.transactions.length && !data.institutional.holders.length && (
            <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              Smart money data is limited from the current source. Treat this section as supporting context, not a standalone decision.
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <h4 className="font-bold text-white">Insider Activity</h4>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Insiders are executives, directors, or major shareholders. Insider buying can be a positive confidence signal. Insider selling is not always bad, but heavy selling deserves review.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MiniStat label="Net Shares" value={compact(data.insider.netShares)} />
                <MiniStat label="Buy Rows" value={String(data.insider.buys)} />
                <MiniStat label="Sell Rows" value={String(data.insider.sells)} />
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="text-slate-400">
                    <tr><th className="pb-2">Date</th><th className="pb-2">Insider</th><th className="pb-2">Change</th><th className="pb-2">Price</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {data.insider.transactions.slice(0, 6).map((row, index) => (
                      <tr key={`${row.name}-${row.date}-${index}`}>
                        <td className="py-2">{row.date || 'N/A'}</td>
                        <td className="py-2">{row.name || 'N/A'}</td>
                        <td className="py-2">{compact(row.change)}</td>
                        <td className="py-2">{typeof row.price === 'number' ? `$${row.price.toFixed(2)}` : 'N/A'}</td>
                      </tr>
                    ))}
                    {!data.insider.transactions.length && <tr><td colSpan={4} className="py-3 text-slate-400">No insider transaction rows returned by the provider.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <h4 className="font-bold text-white">Institutional Ownership</h4>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Institutions include funds, asset managers, and large investors. Accumulation can support confidence, while distribution may indicate caution.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MiniStat label="Net Change" value={compact(data.institutional.netChange)} />
                <MiniStat label="Holder Rows" value={String(data.institutional.holders.length)} />
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="text-slate-400">
                    <tr><th className="pb-2">Holder</th><th className="pb-2">Shares</th><th className="pb-2">Change</th><th className="pb-2">Report</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {data.institutional.holders.slice(0, 6).map((row, index) => (
                      <tr key={`${row.name}-${index}`}>
                        <td className="py-2">{row.name || 'N/A'}</td>
                        <td className="py-2">{compact(row.shares)}</td>
                        <td className="py-2">{compact(row.change)}</td>
                        <td className="py-2">{row.reportDate || row.filingDate || 'N/A'}</td>
                      </tr>
                    ))}
                    {!data.institutional.holders.length && <tr><td colSpan={4} className="py-3 text-slate-400">No institutional ownership rows returned by the provider or API tier.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {!!data.warnings?.length && (
            <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              <h4 className="font-bold">Data coverage notes</h4>
              <ul className="mt-2 space-y-1">{data.warnings.map((warning) => <li key={warning}>• {warning}</li>)}</ul>
              <p className="mt-3">When provider data is limited, verify insider Form 4 filings and institutional 13F filings directly through SEC EDGAR.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function InterpretationCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>
    </div>
  );
}

function InsightCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{note}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
