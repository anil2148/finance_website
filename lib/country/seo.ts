import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { COUNTRY_CONFIG, type CountryCode, withCountryBasePath } from '@/lib/country/config';

type CountryMetadataArgs = {
  country: CountryCode;
  pathname: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
  equivalentPaths?: Partial<Record<CountryCode, string>>;
};

export function createCountryMetadata({ country, pathname, title, description, type = 'website', equivalentPaths = {} }: CountryMetadataArgs): Metadata {
  const countryPath = withCountryBasePath(country, pathname);
  const languages: Record<string, string> = { 'x-default': '/' };

  for (const [code, config] of Object.entries(COUNTRY_CONFIG) as Array<[CountryCode, (typeof COUNTRY_CONFIG)[CountryCode]]>) {
    const path = equivalentPaths[code];
    if (path) languages[config.locale] = withCountryBasePath(code, path);
  }

  return {
    title,
    description,
    alternates: {
      canonical: countryPath,
      languages
    },
    openGraph: {
      title,
      description,
      type,
      url: absoluteUrl(countryPath),
      locale: COUNTRY_CONFIG[country].ogLocale
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}
