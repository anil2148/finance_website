export type CountryCode = 'us' | 'in';

export type CountryConfig = {
  code: CountryCode;
  label: string;
  locale: string;
  currency: string;
  basePath: '' | `/${string}`;
  ogLocale: string;
  market: string;
};

export const COUNTRY_CONFIG: Record<CountryCode, CountryConfig> = {
  us: {
    code: 'us',
    label: 'United States',
    locale: 'en-US',
    currency: 'USD',
    basePath: '',
    ogLocale: 'en_US',
    market: 'United States'
  },
  in: {
    code: 'in',
    label: 'India',
    locale: 'en-IN',
    currency: 'INR',
    basePath: '/in',
    ogLocale: 'en_IN',
    market: 'India'
  }
};

export const SUPPORTED_COUNTRIES = Object.values(COUNTRY_CONFIG);
export const DEFAULT_COUNTRY: CountryCode = 'us';

export function withCountryBasePath(country: CountryCode, pathname: string): string {
  const normalized = pathname === '/' ? '' : pathname.startsWith('/') ? pathname : `/${pathname}`;
  const basePath = COUNTRY_CONFIG[country].basePath;
  if (!basePath) return normalized || '/';
  return `${basePath}${normalized}` || basePath;
}

export function countryFromPathname(pathname: string): CountryCode {
  return pathname === '/in' || pathname.startsWith('/in/') ? 'in' : 'us';
}

export function removeCountryPrefix(pathname: string): string {
  if (pathname === '/in') return '/';
  if (pathname.startsWith('/in/')) return pathname.replace('/in', '') || '/';
  return pathname;
}
