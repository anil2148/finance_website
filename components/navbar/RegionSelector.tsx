'use client';

interface RegionSelectorProps {
  isIndiaContext: boolean;
  onRegionChange: (region: 'India' | 'US') => void;
  mobile?: boolean;
}

export function RegionSelector({ isIndiaContext, onRegionChange, mobile = false }: RegionSelectorProps) {
  const nextRegion = isIndiaContext ? 'US' : 'India';
  const currentFlag = isIndiaContext ? '🇮🇳' : '🇺🇸';

  return (
    <button
      type="button"
      onClick={() => onRegionChange(nextRegion)}
      className={`inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-lg leading-none transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 dark:border-slate-600 dark:bg-slate-900 ${mobile ? 'w-full' : ''}`}
      aria-label={`Switch market. Current market ${isIndiaContext ? 'India' : 'United States'}`}
      title={isIndiaContext ? 'India market' : 'US market'}
    >
      <span aria-hidden="true">{currentFlag}</span>
    </button>
  );
}
