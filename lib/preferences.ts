import type { SupportedCurrency } from '@/lib/api/currency';

export const SUPPORTED_COUNTRIES = ['US', 'India'] as const;
export type AppCountry = (typeof SUPPORTED_COUNTRIES)[number];

export const COUNTRY_DEFAULT_CURRENCY: Record<AppCountry, SupportedCurrency> = {
  US: 'USD',
  India: 'INR'
};

export const SUPPORTED_APP_CURRENCIES = ['USD', 'INR'] as const;
export type AppCurrency = (typeof SUPPORTED_APP_CURRENCIES)[number];

export function getDefaultCurrencyForCountry(country: AppCountry): AppCurrency {
  return COUNTRY_DEFAULT_CURRENCY[country] as AppCurrency;
}

export function normalizeCountry(country?: string): AppCountry {
  return country === 'India' ? 'India' : 'US';
}

export function normalizeCurrency(currency?: string, fallback: AppCountry = 'US'): AppCurrency {
  if (currency === 'INR' || currency === 'USD') return currency;
  return getDefaultCurrencyForCountry(fallback);
}

export function getCountryForPath(pathname: string): AppCountry {
  return pathname === '/in' || pathname.startsWith('/in/') ? 'India' : 'US';
}
