'use client';

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

interface RegionSelectorProps {
  isIndiaContext: boolean;
  currentRegionLabel: string;
  currentCurrencyLabel: string;
  onRegionChange: (region: 'India' | 'US') => void;
  mobile?: boolean;
}

type RegionOption = {
  value: 'India' | 'US';
  label: string;
  badge: string;
};

const REGION_OPTIONS: RegionOption[] = [
  { value: 'India', label: 'India', badge: '🇮🇳' },
  { value: 'US', label: 'United States', badge: '🇺🇸' },
];

export const RegionSelector = memo(function RegionSelector({
  isIndiaContext,
  currentRegionLabel,
  currentCurrencyLabel,
  onRegionChange,
  mobile = false,
}: RegionSelectorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listboxId = useId();

  const selectedRegion = useMemo<'India' | 'US'>(() => (isIndiaContext ? 'India' : 'US'), [isIndiaContext]);

  const selectedOption = useMemo(
    () => REGION_OPTIONS.find((option) => option.value === selectedRegion) ?? REGION_OPTIONS[0],
    [selectedRegion],
  );

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => buttonRef.current?.focus());
    }
  }, []);

  const selectRegion = useCallback(
    (region: 'India' | 'US') => {
      if (region !== selectedRegion) {
        onRegionChange(region);
      }
      setOpen(false);
    },
    [onRegionChange, selectedRegion],
  );

  const openMenu = useCallback(() => {
    const selectedIndex = REGION_OPTIONS.findIndex((option) => option.value === selectedRegion);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [selectedRegion]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % REGION_OPTIONS.length);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + REGION_OPTIONS.length) % REGION_OPTIONS.length);
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const next = REGION_OPTIONS[activeIndex]?.value;
        if (next) selectRegion(next);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, closeMenu, open, selectRegion]);

  const onTriggerKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (!open) {
          openMenu();
        }
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!open) {
          openMenu();
          setActiveIndex(REGION_OPTIONS.length - 1);
        }
        return;
      }

      if (event.key === 'Escape' && open) {
        event.preventDefault();
        closeMenu(true);
      }
    },
    [closeMenu, open, openMenu],
  );

  return (
    <div ref={rootRef} className={`relative ${mobile ? 'w-full' : 'shrink-0'}`}>
      <div className={`flex items-start gap-1.5 ${mobile ? 'w-full flex-col' : 'items-center'}`}>
        <div className={`flex items-center gap-1.5 ${mobile ? 'w-full' : ''}`}>
          <span className="hidden whitespace-nowrap text-xs font-semibold text-slate-600 dark:text-slate-300 xl:inline">
            Market
          </span>
          <button
            ref={buttonRef}
            type="button"
            className={`inline-flex min-h-11 items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm transition-all duration-150 ease-out hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 active:scale-[0.98] active:opacity-95 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800 ${mobile ? 'w-full' : 'min-w-[11rem]'}`}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            onClick={() => (open ? closeMenu() : openMenu())}
            onKeyDown={onTriggerKeyDown}
          >
            <span className="flex items-center gap-2 font-semibold">
              <span aria-hidden="true">{selectedOption.badge}</span>
              <span>{selectedOption.label}</span>
            </span>
            <svg className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M5 7.5 10 12.5l5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <span className={`whitespace-nowrap rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 ${mobile ? 'w-full text-center' : ''}`}>
          {currentRegionLabel} · {currentCurrencyLabel}
        </span>
      </div>

      <div
        id={listboxId}
        role="listbox"
        aria-label="Region"
        className={`absolute left-0 top-[calc(100%+0.4rem)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-150 ease-out dark:border-slate-700 dark:bg-slate-900 ${open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'}`}
      >
        {REGION_OPTIONS.map((option, index) => {
          const isSelected = option.value === selectedRegion;
          const isFocused = index === activeIndex;

          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`flex min-h-11 w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition-all duration-150 ease-out ${
                isSelected
                  ? 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-200'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
              } ${isFocused ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectRegion(option.value)}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden="true">{option.badge}</span>
                <span>{option.label}</span>
              </span>
              {isSelected ? (
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 10.5 8.2 13.5 15 6.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
});
