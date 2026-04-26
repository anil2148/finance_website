import type { AppCurrency } from '@/lib/preferences';

export type RegionCode = 'us' | 'in';

type TaxRules = {
  model: 'federal-progressive' | 'india-regime';
  defaultRateHint: number;
};

export type RegionConfig = {
  code: RegionCode;
  label: string;
  locale: string;
  currency: AppCurrency;
  taxRules: TaxRules;
};

export const REGION_CONFIG: Record<RegionCode, RegionConfig> = {
  us: {
    code: 'us',
    label: 'United States',
    locale: 'en-US',
    currency: 'USD',
    taxRules: { model: 'federal-progressive', defaultRateHint: 0.24 }
  },
  in: {
    code: 'in',
    label: 'India',
    locale: 'en-IN',
    currency: 'INR',
    taxRules: { model: 'india-regime', defaultRateHint: 0.2 }
  }
};

export function getRegionFromPath(pathname: string): RegionCode {
  return pathname === '/in' || pathname.startsWith('/in/') ? 'in' : 'us';
}

export function formatCurrencyByRegion(value: number, region: RegionCode, maximumFractionDigits = 0): string {
  const config = REGION_CONFIG[region];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits
  }).format(Number.isFinite(value) ? value : 0);
}
