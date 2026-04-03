export const PREFERRED_REGION_COOKIE = 'preferredRegion';

export type PreferredRegion = 'us' | 'in';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function parsePreferredRegion(value?: string | null): PreferredRegion | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized === 'us' || normalized === 'in') return normalized;
  return null;
}

export function detectRegionFromCountry(countryCode?: string | null): PreferredRegion {
  if (!countryCode) return 'us';
  return countryCode.toUpperCase() === 'IN' ? 'in' : 'us';
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
  document.cookie = `${PREFERRED_REGION_COOKIE}=${region}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secureFlag}`;
}
