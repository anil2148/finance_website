import type { ReactNode } from 'react';

export function StatusPill({ children, variant = 'neutral' }: { children: ReactNode; variant?: 'good' | 'caution' | 'risk' | 'neutral' | 'info' }) {
  const classes = {
    good: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100',
    caution: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
    risk: 'border-red-300/30 bg-red-300/10 text-red-100',
    neutral: 'border-white/10 bg-white/10 text-slate-200',
    info: 'border-sky-300/30 bg-sky-300/10 text-sky-100',
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${classes[variant]}`}>{children}</span>;
}
