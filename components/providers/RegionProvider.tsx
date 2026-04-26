'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getRegionFromPath, normalizeRegionCode, REGION_CONFIG, type RegionCode } from '@/lib/region-config';
import { getPreferredRegionCookieValue, PREFERRED_REGION_COOKIE, parsePreferredRegion, setPreferredRegionCookie } from '@/lib/region-preference';

const STORAGE_KEY = 'finance-site-region';

type RegionContextValue = {
  region: RegionCode;
  config: (typeof REGION_CONFIG)[RegionCode];
  setRegion: (region: RegionCode) => void;
  mounted: boolean;
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

export function RegionProvider({ children, initialRegion = 'US' }: { children: React.ReactNode; initialRegion?: RegionCode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [region, setRegionState] = useState<RegionCode>(initialRegion);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fromStorage = normalizeRegionCode(localStorage.getItem(STORAGE_KEY));
    const fromCookie = readCookieRegion();
    const fromPath = getRegionFromPath(pathname);
    const nextRegion = fromCookie ?? fromStorage ?? fromPath;

    setRegionState(nextRegion);
  }, [mounted, pathname]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, region);
    setPreferredRegionCookie(region);
  }, [mounted, region]);

  const setRegion = useCallback((nextRegion: RegionCode) => {
    setRegionState(nextRegion);
    localStorage.setItem(STORAGE_KEY, nextRegion);
    document.cookie = `${PREFERRED_REGION_COOKIE}=${getPreferredRegionCookieValue(nextRegion)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ region, config: REGION_CONFIG[region], setRegion, mounted }),
    [region, mounted, setRegion]
  );

  if (!mounted) return null;

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) throw new Error('useRegion must be used within RegionProvider');
  return context;
}
