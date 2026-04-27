export type RegionCode = 'US' | 'IN' | 'EU';

type TaxRules = {
  model: 'federal-progressive' | 'india-regime' | 'eu-progressive';
  defaultRateHint: number;
};

export type RegionConfig = {
  code: RegionCode;
  label: string;
  locale: string;
  currency: 'USD' | 'INR' | 'EUR';
  symbol: '$' | '₹' | '€';
  basePath: '/us' | '/india' | '/eu';
  taxRules: TaxRules;
};

export const REGION_CONFIG: Record<RegionCode, RegionConfig> = {
  US: {
    code: 'US',
    label: 'United States',
    locale: 'en-US',
    currency: 'USD',
    symbol: '$',
    basePath: '/us',
    taxRules: { model: 'federal-progressive', defaultRateHint: 0.24 }
  },
  IN: {
    code: 'IN',
    label: 'India',
    locale: 'en-IN',
    currency: 'INR',
    symbol: '₹',
    basePath: '/india',
    taxRules: { model: 'india-regime', defaultRateHint: 0.2 }
  },
  EU: {
    code: 'EU',
    label: 'Europe',
    locale: 'en-IE',
    currency: 'EUR',
    symbol: '€',
    basePath: '/eu',
    taxRules: { model: 'eu-progressive', defaultRateHint: 0.22 }
  }
};

export const DEFAULT_REGION: RegionCode = 'US';

export function normalizeRegionCode(region?: string | null): RegionCode {
  if (!region) return DEFAULT_REGION;
  const normalized = region.trim().toUpperCase();
  if (normalized === 'IN') return 'IN';
  if (normalized === 'EU') return 'EU';
  return 'US';
}

export function getRegionFromPath(pathname: string): RegionCode {
  if (pathname === '/india' || pathname.startsWith('/india/')) return 'IN';
  if (pathname === '/in' || pathname.startsWith('/in/')) return 'IN';
  if (pathname === '/eu' || pathname.startsWith('/eu/')) return 'EU';
  if (pathname === '/us' || pathname.startsWith('/us/')) return 'US';
  return DEFAULT_REGION;
}

export function stripRegionPrefix(pathname: string): string {
  if (pathname === '/us' || pathname === '/india' || pathname === '/in' || pathname === '/eu') return '/';
  if (pathname.startsWith('/us/')) return pathname.slice(3);
  if (pathname.startsWith('/india/')) return pathname.slice(6);
  if (pathname.startsWith('/in/')) return pathname.slice(3);
  if (pathname.startsWith('/eu/')) return pathname.slice(3);
  return pathname;
}

export function withRegionPrefix(pathname: string, region: RegionCode): string {
  const basePath = REGION_CONFIG[region].basePath;
  const stripped = stripRegionPrefix(pathname);
  return stripped === '/' ? basePath : `${basePath}${stripped.startsWith('/') ? stripped : `/${stripped}`}`;
}

export function formatCurrency(value: number, region: RegionCode, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(REGION_CONFIG[region].locale, {
    style: 'currency',
    currency: REGION_CONFIG[region].currency,
    maximumFractionDigits
  }).format(Number.isFinite(value) ? value : 0);
}

export function getPageData<TPage extends string, TData>(
  page: TPage,
  region: RegionCode,
  data: Record<RegionCode, Record<TPage, TData>>
): TData {
  return data[region][page] ?? data[DEFAULT_REGION][page];
}
