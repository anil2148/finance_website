import { DEFAULT_REGION, normalizeRegionCode, type RegionCode } from '@/lib/region-config';

export const PREFERRED_REGION_COOKIE = 'preferredRegion';

export type PreferredRegion = RegionCode;

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function toCookieValue(region: RegionCode): 'us' | 'in' | 'eu' {
  if (region === 'IN') return 'in';
  if (region === 'EU') return 'eu';
  return 'us';
}

export function parsePreferredRegion(value?: string | null): PreferredRegion | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized === 'us') return 'US';
  if (normalized === 'in') return 'IN';
  if (normalized === 'eu') return 'EU';
  return null;
}

export function detectRegionFromCountry(countryCode?: string | null): PreferredRegion {
  if (!countryCode) return DEFAULT_REGION;
  return normalizeRegionCode(countryCode);
}

export function isBotUserAgent(userAgent?: string | null): boolean {
  if (!userAgent) return false;

  return /bot|crawler|spider|crawling|google|bing|yandex|duckduck|baidu|slurp|facebookexternalhit|linkedinbot|twitterbot/i.test(
    userAgent
  );
}

export function setPreferredRegionCookie(region: PreferredRegion) {
  if (typeof document === 'undefined') return;
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${PREFERRED_REGION_COOKIE}=${toCookieValue(region)}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secureFlag}`;
}

export function getPreferredRegionCookieValue(region: PreferredRegion): 'us' | 'in' | 'eu' {
  return toCookieValue(region);
}
