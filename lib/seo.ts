import type { Metadata } from 'next';
import { getCountryForPath, getMarketConfig } from '@/lib/preferences';
import { getAlternateUrls } from '@/lib/seo-locale-routes';
import { SITE_ORIGIN, absoluteUrl, buildSiteUrl, normalizePathname } from '@/lib/seo-urls';

type ArticleSchemaArgs = {
  title: string;
  description: string;
  slug: string;
  authorName?: string;
  authorRole?: string;
  reviewerName?: string;
  publishedTime?: string;
  modifiedTime?: string;
};

export { SITE_ORIGIN, absoluteUrl, buildSiteUrl, normalizePathname };

export function normalizeCanonicalPath(pathname: string): string {
  return normalizePathname(pathname);
}

export function createCanonicalUrl(pathname: string): string {
  return buildSiteUrl(pathname);
}

type CreatePageMetadataArgs = {
  title: string;
  description: string;
  pathname: string;
  type?: 'website' | 'article';
};

export function createPageMetadata({ title, description, pathname, type = 'website' }: CreatePageMetadataArgs): Metadata {
  const canonicalPath = normalizeCanonicalPath(pathname);
  const market = getMarketConfig(getCountryForPath(canonicalPath));
  const languageAlternates = getAlternateUrls(canonicalPath);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: Object.keys(languageAlternates).length > 0 ? languageAlternates : undefined
    },
    openGraph: {
      title,
      description,
      type,
      locale: market.ogLocale,
      url: createCanonicalUrl(canonicalPath)
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export function articleSchema({
  title,
  description,
  slug,
  authorName = 'FinanceSphere Editorial Team',
  authorRole = 'FinanceSphere Editorial Team',
  reviewerName = 'FinanceSphere Editorial Team',
  publishedTime,
  modifiedTime
}: ArticleSchemaArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(`/blog/${slug}`),
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorRole
    },
    reviewedBy: {
      '@type': 'Person',
      name: reviewerName
    },
    publisher: {
      '@type': 'Organization',
      name: 'FinanceSphere'
    },
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'FinanceSphere',
    url: `${SITE_ORIGIN}/`,
    logo: buildSiteUrl('/favicon.png')
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: 'FinanceSphere',
    url: `${SITE_ORIGIN}/`,
    publisher: {
      '@id': `${SITE_ORIGIN}/#organization`
    }
  };
}

export function webpageSchema({ pathname, name, description }: { pathname: string; name: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': absoluteUrl(pathname),
    url: absoluteUrl(pathname),
    name,
    description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    about: { '@id': `${SITE_ORIGIN}/#organization` }
  };
}

export function breadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.item)
    }))
  };
}
