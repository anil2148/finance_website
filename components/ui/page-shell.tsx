import type { ReactNode } from 'react';

export function PageShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <main className={`min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8 ${className}`}>
      <section className="mx-auto max-w-7xl">{children}</section>
    </main>
  );
}
