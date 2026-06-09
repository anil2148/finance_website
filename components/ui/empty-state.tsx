import Link from 'next/link';

export function EmptyState({ title, description, action }: { title: string; description: string; action?: { label: string; href: string } }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-white">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">Ready when you are</p>
      <h2 className="mt-3 text-2xl font-black">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      {action && <Link href={action.href} className="mt-5 inline-flex rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-emerald-300">{action.label}</Link>}
    </div>
  );
}
