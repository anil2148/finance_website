import type { SupportedCurrency } from '@/lib/api/currency';

export type MarketCountryCode = 'US' | 'IN' | 'GB' | 'CA';
export type AppCountry = 'US' | 'India' | 'UK' | 'Canada';

export type MarketConfig = {
  country: AppCountry;
  code: MarketCountryCode;
  label: string;
  basePath: '/' | '/in' | '/uk' | '/ca';
  locale: string;
  ogLocale: string;
  defaultCurrency: SupportedCurrency;
};

export const MARKET_CONFIG: Record<AppCountry, MarketConfig> = {
  US: {
    country: 'US',
    code: 'US',
    label: 'United States',
    basePath: '/',
    locale: 'en-US',
    ogLocale: 'en_US',
    defaultCurrency: 'USD'
  },
  India: {
    country: 'India',
    code: 'IN',
    label: 'India',
    basePath: '/in',
    locale: 'en-IN',
    ogLocale: 'en_IN',
    defaultCurrency: 'INR'
  },
  UK: {
    country: 'UK',
    code: 'GB',
    label: 'United Kingdom',
    basePath: '/uk',
    locale: 'en-GB',
    ogLocale: 'en_GB',
    defaultCurrency: 'GBP'
  },
  Canada: {
    country: 'Canada',
    code: 'CA',
    label: 'Canada',
    basePath: '/ca',
    locale: 'en-CA',
    ogLocale: 'en_CA',
    defaultCurrency: 'CAD'
  }
};

export const SUPPORTED_COUNTRIES = ['US', 'India', 'UK', 'Canada'] as const;
export type AppCurrency = 'USD' | 'INR' | 'GBP' | 'CAD';

const INDIA_ROUTE_EQUIVALENTS: Record<string, string> = {
  '/': '/in',
  '/blog': '/in/blog',
  '/calculators/loan-calculator': '/in/calculators/emi-calculator',
  '/calculators/compound-interest-calculator': '/in/calculators/sip-calculator'
};

const US_ROUTE_EQUIVALENTS: Record<string, string> = {
  '/in': '/',
  '/in/blog': '/blog',
  '/in/blog/sip-vs-fd': '/blog',
  '/in/blog/ppf-vs-elss': '/blog',
  '/in/calculators/emi-calculator': '/calculators/loan-calculator',
  '/in/calculators/sip-calculator': '/calculators/compound-interest-calculator'
};

export function getMarketConfig(country: AppCountry): MarketConfig {
  return MARKET_CONFIG[country];
}

export function getDefaultCurrencyForCountry(country: AppCountry): AppCurrency {
  return MARKET_CONFIG[country].defaultCurrency as AppCurrency;
}

export function normalizeCountry(country?: string): AppCountry {
  if (!country) return 'US';
  if (country === 'India' || country.toUpperCase() === 'IN') return 'India';
  if (country === 'UK' || country.toUpperCase() === 'GB') return 'UK';
  if (country === 'Canada' || country.toUpperCase() === 'CA') return 'Canada';
  return 'US';
}

export function getCountryForPath(pathname: string): AppCountry {
  if (pathname === '/us' || pathname.startsWith('/us/')) return 'US';
  if (pathname === '/in' || pathname.startsWith('/in/')) return 'India';
  if (pathname === '/uk' || pathname.startsWith('/uk/')) return 'UK';
  if (pathname === '/ca' || pathname.startsWith('/ca/')) return 'Canada';
  return 'US';
}

/**
 * Returns the correct path for a base route given the current country context.
 * US stays on the base path; India routes are prefixed with /in when an
 * equivalent exists, otherwise the base path is returned unchanged.
 *
 * Examples:
 *   getCountryAwarePath('/blog', 'India')  → '/in/blog'
 *   getCountryAwarePath('/blog', 'US')     → '/blog'
 *   getCountryAwarePath('/about', 'India') → '/about'
 */
export function getCountryAwarePath(basePath: string, country: AppCountry): string {
  if (country !== 'India') return basePath;
  return INDIA_ROUTE_EQUIVALENTS[basePath] ?? basePath;
}

export function getCountrySwitchPath(pathname: string, targetCountry: AppCountry): string {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  if (targetCountry === 'India') {
    return INDIA_ROUTE_EQUIVALENTS[cleanPath] ?? '/in';
  }

  if (targetCountry === 'US') {
    return US_ROUTE_EQUIVALENTS[cleanPath] ?? (cleanPath.startsWith('/in/') ? '/' : cleanPath);
  }

  return targetCountry === 'UK' || targetCountry === 'Canada' ? '/' : getMarketConfig(targetCountry).basePath;
}
