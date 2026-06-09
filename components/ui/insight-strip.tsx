export function InsightStrip({ takeaway, watch, risk, next }: { takeaway: string; watch: string; risk: string; next: string }) {
  const items = [
    ['Key takeaway', takeaway],
    ['What matters now', watch],
    ['Main risk', risk],
    ['Suggested next step', next],
  ];

  return (
    <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, text]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
        </div>
      ))}
    </div>
  );
}
