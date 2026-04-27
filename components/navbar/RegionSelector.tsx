'use client';

import { useMemo, useState } from 'react';
import { REGION_CONFIG, type RegionCode } from '@/lib/region-config';

interface RegionSelectorProps {
  region: RegionCode;
  onRegionChange: (region: RegionCode) => void;
  mobile?: boolean;
}

const REGION_OPTIONS: Array<{ value: RegionCode; label: string; flag: string }> = [
  { value: 'US', label: 'US /us (USD)', flag: '🇺🇸' },
  { value: 'IN', label: 'India /india (INR)', flag: '🇮🇳' },
  { value: 'EU', label: 'Europe (EUR)', flag: '🇪🇺' }
];

export function RegionSelector({ region, onRegionChange, mobile = false }: RegionSelectorProps) {
  const [toast, setToast] = useState('');
  const current = useMemo(() => REGION_OPTIONS.find((option) => option.value === region) ?? REGION_OPTIONS[0], [region]);

  const handleChange = (nextRegion: RegionCode) => {
    onRegionChange(nextRegion);
    const next = REGION_OPTIONS.find((option) => option.value === nextRegion);
    if (!next) return;

    setToast(`Region switched to ${REGION_CONFIG[nextRegion].label} ${next.flag} (${REGION_CONFIG[nextRegion].currency})`);
    window.setTimeout(() => setToast(''), 2400);
  };

  return (
    <div className={`relative ${mobile ? 'w-full' : ''}`}>
      <label className="sr-only" htmlFor="region-selector">Region</label>
      <select
        id="region-selector"
        value={region}
        onChange={(event) => handleChange(event.target.value as RegionCode)}
        className={`inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm leading-none transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:bg-slate-900 ${mobile ? 'w-full' : ''}`}
        aria-label={`Current region ${current.label}`}
      >
        {REGION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.flag} {option.label}
          </option>
        ))}
      </select>
      {toast ? (
        <p className="absolute right-0 top-12 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-slate-200 dark:text-slate-900">
          {toast}
        </p>
      ) : null}
    </div>
  );
}
