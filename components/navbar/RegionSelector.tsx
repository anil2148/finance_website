'use client';

interface RegionSelectorProps {
  isIndiaContext: boolean;
  currentRegionLabel: string;
  currentCurrencyLabel: string;
  onRegionChange: (region: 'India' | 'US') => void;
}

export function RegionSelector({
  isIndiaContext,
  currentRegionLabel,
  currentCurrencyLabel,
  onRegionChange,
}: RegionSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span className="hidden xl:inline">Region</span>
        <select
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          aria-label="Region"
          value={isIndiaContext ? 'India' : 'US'}
          onChange={(e) => onRegionChange(e.target.value as 'India' | 'US')}
        >
          <option value="India">🇮🇳 IN</option>
          <option value="US">🇺🇸 US</option>
        </select>
      </label>
      <span className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
        {currentCurrencyLabel}
        <span className="ml-1 hidden text-slate-500 dark:text-slate-400 xl:inline">
          · {currentRegionLabel}
        </span>
      </span>
    </div>
  );
}
