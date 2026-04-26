export type RegionCode = 'US' | 'IN';

type TaxRules = {
  model: 'federal-progressive' | 'india-regime';
  defaultRateHint: number;
};

export type RegionConfig = {
  code: RegionCode;
  label: string;
  locale: string;
  currency: 'USD' | 'INR';
  symbol: '$' | '₹';
  taxRules: TaxRules;
};

export const REGION_CONFIG: Record<RegionCode, RegionConfig> = {
  US: {
    code: 'US',
    label: 'United States',
    locale: 'en-US',
    currency: 'USD',
    symbol: '$',
    taxRules: { model: 'federal-progressive', defaultRateHint: 0.24 }
  },
  IN: {
    code: 'IN',
    label: 'India',
    locale: 'en-IN',
    currency: 'INR',
    symbol: '₹',
    taxRules: { model: 'india-regime', defaultRateHint: 0.2 }
  }
};

export function normalizeRegionCode(region?: string | null): RegionCode {
  if (!region) return 'US';
  const normalized = region.trim().toUpperCase();
  return normalized === 'IN' ? 'IN' : 'US';
}

export function getRegionFromPath(pathname: string): RegionCode {
  return pathname === '/in' || pathname.startsWith('/in/') ? 'IN' : 'US';
}

export function formatCurrency(value: number, region: RegionCode, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(REGION_CONFIG[region].locale, {
    style: 'currency',
    currency: REGION_CONFIG[region].currency,
    maximumFractionDigits
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatCurrencyByRegion(value: number, region: RegionCode, maximumFractionDigits = 0): string {
  return formatCurrency(value, region, maximumFractionDigits);
}

export function getPageData<TPage extends string, TData>(
  page: TPage,
  region: RegionCode,
  data: Record<RegionCode, Record<TPage, TData>>
): TData {
  return data[region][page];
}
