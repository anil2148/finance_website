'use client';

import { useState, type ReactNode } from 'react';

type TabItem = {
  id: string;
  label: string;
  description?: string;
  content: ReactNode;
};

type Props = {
  tabs: TabItem[];
  defaultTab?: string;
};

export function StockResearchTabs({ tabs, defaultTab }: Props) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || 'overview');
  const active = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <section className="mt-8">
      <div className="sticky top-0 z-10 -mx-4 border-y border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/[0.04]">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id
                ? 'shrink-0 rounded-full bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950'
                : 'shrink-0 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10'}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="mt-5">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">{active.label}</p>
            {active.description && <p className="mt-2 text-sm leading-6 text-slate-400">{active.description}</p>}
          </div>
          {active.content}
        </div>
      )}
    </section>
  );
}
