'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getRegionFromPath, REGION_CONFIG, type RegionCode } from '@/lib/region-config';
import { PREFERRED_REGION_COOKIE, parsePreferredRegion, setPreferredRegionCookie } from '@/lib/region-preference';

const STORAGE_KEY = 'finance-site-region';

type RegionContextValue = {
  region: RegionCode;
  config: (typeof REGION_CONFIG)[RegionCode];
  setRegion: (region: RegionCode) => void;
};

const RegionContext = createContext<RegionContextValue | null>(null);

function readCookieRegion(): RegionCode | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${PREFERRED_REGION_COOKIE}=`));

  return parsePreferredRegion(raw?.split('=')[1] ?? null);
}

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [region, setRegionState] = useState<RegionCode>(getRegionFromPath(pathname));

  useEffect(() => {
    const fromQuery = parsePreferredRegion(new URLSearchParams(window.location.search).get('region'));
    const fromStorage = parsePreferredRegion(localStorage.getItem(STORAGE_KEY));
    const fromCookie = readCookieRegion();
    const fromPath = getRegionFromPath(pathname);
    const nextRegion = fromQuery ?? fromCookie ?? fromStorage ?? fromPath;

    setRegionState(nextRegion);
  }, [pathname]);

  const setRegion = (nextRegion: RegionCode) => {
    setRegionState(nextRegion);
    localStorage.setItem(STORAGE_KEY, nextRegion);
    setPreferredRegionCookie(nextRegion);
  };

  const value = useMemo(
    () => ({ region, config: REGION_CONFIG[region], setRegion }),
    [region]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) throw new Error('useRegion must be used within RegionProvider');
  return context;
}
