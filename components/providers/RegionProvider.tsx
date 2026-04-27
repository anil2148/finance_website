'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  getRegionFromPath,
  normalizeRegionCode,
  REGION_CONFIG,
  withRegionPrefix,
  type RegionCode,
  DEFAULT_REGION
} from '@/lib/region-config';
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

export function RegionProvider({ children, initialRegion = DEFAULT_REGION }: { children: React.ReactNode; initialRegion?: RegionCode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [region, setRegionState] = useState<RegionCode>(initialRegion);

  useEffect(() => {
    const fromPath = getRegionFromPath(pathname);
    const fromCookie = readCookieRegion();
    const fromStorage = normalizeRegionCode(localStorage.getItem(STORAGE_KEY));
    const nextRegion = fromPath ?? fromCookie ?? fromStorage ?? DEFAULT_REGION;

    if (nextRegion !== region) {
      setRegionState(nextRegion);
    }
  }, [pathname, region]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, region);
    setPreferredRegionCookie(region);
  }, [region]);

  const setRegion = useCallback(
    (nextRegion: RegionCode) => {
      if (nextRegion === region) return;
      setRegionState(nextRegion);
      localStorage.setItem(STORAGE_KEY, nextRegion);
      setPreferredRegionCookie(nextRegion);

      const nextPath = withRegionPrefix(pathname, nextRegion);
      router.push(nextPath);
      router.refresh();
    },
    [pathname, region, router]
  );

  const value = useMemo(() => ({ region, config: REGION_CONFIG[region], setRegion }), [region, setRegion]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) throw new Error('useRegion must be used within RegionProvider');
  return context;
}
