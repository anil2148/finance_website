"use client";

import { useMemo, useState } from 'react';

type Item = { prompt: string; answer: string; ts: string };

type Props = {
  history: Item[];
  pins: Item[];
  sidebarTab: 'history' | 'pins';
  searchQuery: string;
  searchVisible: boolean;
  onTabChange: (tab: 'history' | 'pins') => void;
  onSearchChange: (q: string) => void;
  onSelectHistory: (item: { prompt: string; answer: string }) => void;
  onSelectPin: (item: { prompt: string; answer: string }) => void;
  onNewConversation: () => void;
  onExport: () => void;
  onClear: () => void;
};

const truncate = (value: string) => (value.length > 42 ? `${value.slice(0, 42)}…` : value);

export default function Sidebar({
  history,
  pins,
  sidebarTab,
  searchQuery,
  searchVisible,
  onTabChange,
  onSearchChange,
  onSelectHistory,
  onSelectPin,
  onNewConversation,
  onExport,
  onClear
}: Props) {
  const [selectedKey, setSelectedKey] = useState('');

  const items = useMemo(() => {
    const source = sidebarTab === 'history' ? history : pins;
    return source.filter((item) => item.prompt.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [history, pins, searchQuery, sidebarTab]);

  return (
    <aside id="sidebar">
      <div className="sidebar-header">
        <span>CONVERSATIONS</span>
        <button onClick={onNewConversation}>＋</button>
      </div>
      {searchVisible && (
        <input
          className="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search history…"
        />
      )}
      <div className="tab-row">
        <button className={sidebarTab === 'history' ? 'active' : ''} onClick={() => onTabChange('history')}>
          History
        </button>
        <button className={sidebarTab === 'pins' ? 'active' : ''} onClick={() => onTabChange('pins')}>
          ⭐ Pinned
        </button>
      </div>
      <div className="list-panel">
        {items.map((item, index) => {
          const key = `${item.ts}-${index}`;
          const onSelect = sidebarTab === 'history' ? onSelectHistory : onSelectPin;
          return (
            <button
              className={`list-item ${selectedKey === key ? 'selected' : ''}`}
              key={key}
              onClick={() => {
                setSelectedKey(key);
                onSelect({ prompt: item.prompt, answer: item.answer });
              }}
            >
              <span>{truncate(item.prompt)}</span>
              <small>{item.ts}</small>
            </button>
          );
        })}
      </div>
      <div className="sidebar-actions">
        <button className="export" onClick={onExport}>
          Export
        </button>
        <button className="clear" onClick={onClear}>
          Clear
        </button>
      </div>
    </aside>
  );
}
