import type { CountryCode } from '@/lib/country/config';
import { countryFromPathname, removeCountryPrefix, withCountryBasePath } from '@/lib/country/config';

const localizedEquivalents: Record<'blog' | 'calculator', Partial<Record<CountryCode, Set<string>>>> = {
  blog: {
    in: new Set(['sip-vs-fd', 'ppf-vs-elss', 'home-loan-vs-rent-india'])
  },
  calculator: {
    in: new Set(['emi-calculator', 'sip-calculator'])
  }
};

function hasEquivalent(type: 'blog' | 'calculator', slug: string, country: CountryCode) {
  return localizedEquivalents[type][country]?.has(slug) ?? false;
}

export function localizeHref(href: string, country: CountryCode): string {
  if (country === 'us') return href;
  if (!href.startsWith('/')) return href;
  if (href.startsWith('/in')) return href;
  return withCountryBasePath(country, href);
}

export function switchCountryPath(pathname: string, targetCountry: CountryCode): string {
  const currentCountry = countryFromPathname(pathname);
  const localPath = removeCountryPrefix(pathname);

  if (localPath === '/' || localPath === '/blog') return withCountryBasePath(targetCountry, localPath);

  const blogMatch = localPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    if (hasEquivalent('blog', slug, targetCountry)) return withCountryBasePath(targetCountry, `/blog/${slug}`);
    return withCountryBasePath(targetCountry, '/');
  }

  const calculatorMatch = localPath.match(/^\/calculators\/([^/]+)$/);
  if (calculatorMatch) {
    const slug = calculatorMatch[1];
    if (hasEquivalent('calculator', slug, targetCountry)) return withCountryBasePath(targetCountry, `/calculators/${slug}`);
    return withCountryBasePath(targetCountry, '/');
  }

  if (currentCountry !== targetCountry) return withCountryBasePath(targetCountry, '/');

  return pathname;
}
