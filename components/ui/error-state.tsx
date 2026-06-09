import type { ReactNode } from 'react';

export function ErrorState({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-100">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6">{description}</p>
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
