import Link from 'next/link';
import type { ReactNode } from 'react';

type Action = {
  label: string;
  href: string;
};

type Highlight = {
  label: string;
  value: string;
  detail: string;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  highlights?: Highlight[];
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, primaryAction, secondaryAction, highlights = [], children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-950 px-5 py-8 text-white shadow-[0_30px_90px_-50px_rgba(16,185,129,0.65)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.45),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.34),transparent_32%),linear-gradient(rgba(148,163,184,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.13)_1px,transparent_1px)] [background-size:auto,auto,28px_28px,28px_28px]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-emerald-300">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
          {(primaryAction || secondaryAction) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {primaryAction && (
                <Link href={primaryAction.href} className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200">
                  {primaryAction.label}
                </Link>
              )}
              {secondaryAction && (
                <Link href={secondaryAction.href} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200">
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur">
          {children || (
            <div className="grid gap-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
