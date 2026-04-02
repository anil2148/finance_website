export type CountryCode = 'US' | 'IN';

export type CountryConfig = {
  code: CountryCode;
  name: string;
  pathPrefix: '' | '/in';
  locale: string;
  ogLocale: string;
  currency: string;
  contentCountries: string[];
};

export const countryConfigs: Record<CountryCode, CountryConfig> = {
  US: {
    code: 'US',
    name: 'United States',
    pathPrefix: '',
    locale: 'en-US',
    ogLocale: 'en_US',
    currency: 'USD',
    contentCountries: ['US', 'global']
  },
  IN: {
    code: 'IN',
    name: 'India',
    pathPrefix: '/in',
    locale: 'en-IN',
    ogLocale: 'en_IN',
    currency: 'INR',
    contentCountries: ['India']
  }
};

export function localizeHref(href: string, country: CountryCode): string {
  if (!href.startsWith('/')) return href;
  if (href.startsWith('/api') || href.startsWith('/_next')) return href;
  if (country === 'US') return href;
  if (href === '/') return '/in';
  return href.startsWith('/in') ? href : `/in${href}`;
}

export function stripCountryPrefix(pathname: string): string {
  if (pathname === '/in') return '/';
  if (pathname.startsWith('/in/')) return pathname.replace('/in', '');
  return pathname;
}

export function countryFromPathname(pathname: string): CountryCode {
  return pathname === '/in' || pathname.startsWith('/in/') ? 'IN' : 'US';
}
