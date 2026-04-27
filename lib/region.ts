import { DEFAULT_REGION, getRegionFromPath, withRegionPrefix, type RegionCode } from '@/lib/region-config';
import { PREFERRED_REGION_COOKIE, parsePreferredRegion, setPreferredRegionCookie } from '@/lib/region-preference';

export type Region = 'us' | 'in';

export type RegionDefaults = {
  salary: number;
  homePrice: number;
  monthlyDebt: number;
  emergencyFundMonths: number;
  promptPrefix: string;
};

function toRegion(value: RegionCode | null | undefined): Region {
  return value === 'IN' ? 'in' : 'us';
}

function fromRegion(value: Region): RegionCode {
  return value === 'in' ? 'IN' : 'US';
}

function parseCookieValue(raw?: string | null): Region | null {
  const parsed = parsePreferredRegion(raw);
  return parsed ? toRegion(parsed) : null;
}

function hasExplicitRegionPrefix(pathname: string): boolean {
  return pathname === '/us' || pathname.startsWith('/us/') || pathname === '/in' || pathname.startsWith('/in/') || pathname === '/india' || pathname.startsWith('/india/');
}

export function getRegion(requestContext?: { pathname?: string; cookieValue?: string | null; language?: string | null }): Region {
  const fromCookie = parseCookieValue(requestContext?.cookieValue);
  if (fromCookie) return fromCookie;

  if (requestContext?.pathname && hasExplicitRegionPrefix(requestContext.pathname)) {
    return toRegion(getRegionFromPath(requestContext.pathname));
  }

  if (typeof window !== 'undefined') {
    const cookieMatch = document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${PREFERRED_REGION_COOKIE}=`));

    const clientCookie = parseCookieValue(cookieMatch?.split('=')[1] ?? null);
    if (clientCookie) return clientCookie;

    if (hasExplicitRegionPrefix(window.location.pathname)) {
      return toRegion(getRegionFromPath(window.location.pathname));
    }

    const language = navigator.language.toLowerCase();
    if (language.includes('-in') || language.startsWith('hi')) return 'in';
  }

  const hintedLanguage = requestContext?.language?.toLowerCase();
  if (hintedLanguage && (hintedLanguage.includes('-in') || hintedLanguage.startsWith('hi'))) return 'in';

  return toRegion(DEFAULT_REGION);
}

const GLOBAL_ROUTES = new Set(['/ai-money-copilot']);

function isGlobalRoute(pathname: string): boolean {
  return pathname === '/ai-money-copilot' || pathname.startsWith('/ai-money-copilot/');
}

export function setRegion(region: Region): void {
  if (typeof window === 'undefined') return;

  const regionCode = fromRegion(region);
  setPreferredRegionCookie(regionCode);

  const { pathname, search, hash } = window.location;
  const nextPath = isGlobalRoute(pathname) || GLOBAL_ROUTES.has(pathname)
    ? pathname
    : withRegionPrefix(pathname, regionCode);

  const nextHref = `${nextPath}${search}${hash}`;
  const currentHref = `${pathname}${search}${hash}`;

  if (nextHref !== currentHref) {
    window.location.assign(nextHref);
  }
}

export function regionCurrency(region: Region): 'USD' | 'INR' {
  return region === 'in' ? 'INR' : 'USD';
}

export function regionDefaults(region: Region): RegionDefaults {
  if (region === 'in') {
    return {
      salary: 1800000,
      homePrice: 7500000,
      monthlyDebt: 25000,
      emergencyFundMonths: 6,
      promptPrefix: 'Use Indian context (₹, CTC, EMI, Indian tax norms).'
    };
  }

  return {
    salary: 95000,
    homePrice: 450000,
    monthlyDebt: 900,
    emergencyFundMonths: 6,
    promptPrefix: 'Use US context ($, gross salary, APR, federal/state tax norms).'
  };
}
