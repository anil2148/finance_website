'use client';

import { useEffect, useState } from 'react';
import type { IntelligenceReport } from '@/lib/stock-intelligence';

type Props = {
  symbol: string;
};

export function LiveIntelligencePanel({ symbol }: Props) {
  const [report, setReport] = useState<IntelligenceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadReport() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/stocks/intelligence?symbol=${encodeURIComponent(symbol)}`);
        if (!response.ok) throw new Error('Unable to load live intelligence report.');
        const data = await response.json() as IntelligenceReport;
        if (active) setReport(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load live intelligence report.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadReport();
    return () => {
      active = false;
    };
  }, [symbol]);

  if (loading) {
    return (
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Live Intelligence</p>
        <p className="mt-3 text-slate-300">Loading AI, SEC, Finnhub, analyst, insider, and news intelligence for {symbol}...</p>
      </section>
    );
  }

  if (error || !report) {
    return (
      <section className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-200">Live Intelligence</p>
        <p className="mt-3 text-red-100">{error || 'No intelligence report available.'}</p>
      </section>
    );
  }

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Live Intelligence</p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-black">AI Research Summary</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {report.aiSummary || report.finalVerdict.reason}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-right">
            <p className="text-sm text-slate-400">Live verdict</p>
            <p className="mt-1 text-2xl font-black text-emerald-300">{report.finalVerdict.verdict}</p>
            <p className="mt-2 text-sm text-slate-300">Confidence: {report.finalVerdict.confidence}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="News Sentiment"
          value={report.newsSentiment.sentiment}
          items={report.newsSentiment.drivers}
        />
        <SectionCard
          title="Analyst Consensus"
          value={report.analystRevisions.signal}
          items={[report.analystRevisions.explanation]}
        />
        <SectionCard
          title="Insider Activity"
          value={report.insiderTransactions.signal}
          items={[report.insiderTransactions.explanation]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="SEC Filing Insights"
          value={report.secFiling.latestFiling ? `${report.secFiling.latestFiling.form} • ${report.secFiling.latestFiling.filedDate}` : 'Filing metadata unavailable'}
          items={[report.secFiling.businessQuality, ...report.secFiling.riskFactors, ...report.secFiling.accountingWatchlist.map((item) => `Accounting watch: ${item}`)]}
        />
        <SectionCard
          title="Earnings Transcript AI"
          value={`CEO confidence: ${report.earningsTranscript.ceoConfidence}`}
          items={[report.earningsTranscript.summary, ...report.earningsTranscript.positives, ...report.earningsTranscript.concerns]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Institutional Activity"
          value={report.institutionalOwnership.signal}
          items={[report.institutionalOwnership.explanation]}
        />
        <SectionCard
          title="Economic Calendar & Macro Risks"
          value="Upcoming events"
          items={[...report.economicCalendar.upcomingEvents, ...report.economicCalendar.macroRisks]}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xl font-bold">Data Sources Used</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {report.dataSources.map((source) => (
            <span key={source} className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
              {source}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Live intelligence uses your configured FINNHUB_API_KEY, SEC_USER_AGENT, and OPENAI_API_KEY when available, then falls back gracefully to FinanceSphere scoring models.
        </p>
      </div>
    </section>
  );
}

function SectionCard({ title, value, items }: { title: string; value: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-white">{value}</h3>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
        {items.slice(0, 8).map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </article>
  );
}
