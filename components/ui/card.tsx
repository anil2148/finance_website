import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/40 bg-white/75 p-6 text-slate-900 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100',
        className
      )}
    >
      {children}
    </div>
  );
}
