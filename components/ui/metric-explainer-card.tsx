import { StatusPill } from '@/components/ui/status-pill';

export function MetricExplainerCard({ label, value, status, explanation, variant = 'neutral' }: { label: string; value: string; status: string; explanation: string; variant?: 'good' | 'caution' | 'risk' | 'neutral' | 'info' }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <StatusPill variant={variant}>{status}</StatusPill>
      </div>
      <p className="mt-3 text-xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{explanation}</p>
    </article>
  );
}
