import type { Metadata } from 'next';

type ArticleSchemaArgs = {
  title: string;
  description: string;
  slug: string;
  publishedTime?: string;
  modifiedTime?: string;
};

export const SITE_ORIGIN = 'https://www.financesphere.io';

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized.replace(/\/+$/, '') || '/';
}

export function normalizeCanonicalPath(pathname: string): string {
  return normalizePathname(pathname);
}

export function buildSiteUrl(pathname: string): string {
  const normalizedPath = normalizeCanonicalPath(pathname);
  return normalizedPath === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalizedPath}`;
}

export function createCanonicalUrl(pathname: string): string {
  return buildSiteUrl(pathname);
}

export function absoluteUrl(pathname: string): string {
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

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title,
      description,
      type,
      url: createCanonicalUrl(canonicalPath)
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export function articleSchema({ title, description, slug, publishedTime, modifiedTime }: ArticleSchemaArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(`/blog/${slug}`),
    author: {
      '@type': 'Person',
      name: 'Anil Chowdhary',
      jobTitle: 'Founder, FinanceSphere',
      description: 'Full Stack Developer | Personal Finance Tools Builder'
    },
    reviewedBy: {
      '@type': 'Organization',
      name: 'FinanceSphere Editorial Team'
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
