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
  return normalized.replace(/\/+$/, '');
}

export function absoluteUrl(pathname: string): string {
  const normalizedPath = normalizePathname(pathname);
  return normalizedPath === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalizedPath}`;
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
