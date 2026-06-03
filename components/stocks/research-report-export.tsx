'use client';

import type { StockMetrics } from '@/lib/stocks';

type Props = {
  stock: StockMetrics;
  score: {
    total: number;
    rating: string;
  };
  upside: number;
};

export function ResearchReportExport({ stock, score, upside }: Props) {
  function printReport() {
    window.print();
  }

  function copySummary() {
    const summary = [
      `FinanceSphere Research Summary: ${stock.symbol} - ${stock.name}`,
      `Price: $${stock.price.toFixed(2)}`,
      `Daily Change: ${stock.changePercent.toFixed(2)}%`,
      `Score: ${score.total}/100 (${score.rating})`,
      `Estimated Upside: ${upside.toFixed(1)}%`,
      `Forward P/E: ${stock.forwardPe.toFixed(2)}`,
      `Revenue Growth: ${stock.revenueGrowth.toFixed(2)}%`,
      `EPS Growth: ${stock.epsGrowth.toFixed(2)}%`,
      `Profit Margin: ${stock.profitMargin.toFixed(2)}%`,
      `Debt/Equity: ${stock.debtToEquity.toFixed(2)}`,
      '',
      'Educational information only. Not financial advice.',
    ].join('\n');
    navigator.clipboard?.writeText(summary);
  }

  return (
    <section className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 print:hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Research Report Export</p>
          <h3 className="mt-2 text-2xl font-bold">Save or share this analysis</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Use browser print to save this page as a PDF, or copy a short research summary for notes, email, or portfolio tracking.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={printReport} className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">
            Print / Save PDF
          </button>
          <button onClick={copySummary} className="rounded-xl border border-white/10 bg-black/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
            Copy Summary
          </button>
        </div>
      </div>
    </section>
  );
}
