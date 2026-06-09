export function InsightStrip({ takeaway, watch, risk, next }: { takeaway: string; watch: string; risk: string; next: string }) {
  return (
    <div className="mb-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">Key Takeaway</p>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-200 md:grid-cols-3">
        <li className="rounded-xl border border-white/10 bg-black/20 p-3">{takeaway}</li>
        <li className="rounded-xl border border-white/10 bg-black/20 p-3">{watch}</li>
        <li className="rounded-xl border border-white/10 bg-black/20 p-3">{risk}</li>
      </ul>
      <p className="mt-3 rounded-xl border border-emerald-200/20 bg-black/20 p-3 text-sm font-semibold leading-6 text-emerald-100">
        Next step: {next}
      </p>
    </div>
  );
}
