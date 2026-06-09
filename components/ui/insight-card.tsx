import { StatusPill } from '@/components/ui/status-pill';

export function InsightCard({ title, value, status, description, variant = 'neutral' }: { title: string; value?: string; status?: string; description: string; variant?: 'good' | 'caution' | 'risk' | 'neutral' | 'info' }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-white">{title}</h3>
        {status && <StatusPill variant={variant}>{status}</StatusPill>}
      </div>
      {value && <p className="mt-3 text-2xl font-black text-white">{value}</p>}
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );
}
