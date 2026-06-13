import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';
import { getAllIndexableRoutes, type SitemapEntry } from '@/lib/sitemap-routes';

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

const REQUIRED_PUBLIC_PATHS = ['/', '/stock-analyzer', '/stock-opportunity'];

function getChangeFrequency(pathname: string): ChangeFrequency {
  if (pathname === '/') return 'weekly';
  if (pathname.startsWith('/blog/')) return 'monthly';
  if (pathname.startsWith('/calculators/') || pathname.startsWith('/in/calculators/')) return 'monthly';
  return 'weekly';
}

function getPriority(pathname: string) {
  if (pathname === '/') return 1;
  if (pathname === '/stock-analyzer') return 0.9;
  if (pathname === '/stock-opportunity') return 0.8;
  if (pathname === '/calculators' || pathname === '/in') return 0.8;
  if (pathname.startsWith('/blog/')) return 0.6;
  return 0.7;
}

function getSingleSitemapEntries(): SitemapEntry[] {
  const now = new Date();
  const entriesByPath = new Map(getAllIndexableRoutes().map((entry) => [entry.pathname, entry]));

  for (const pathname of REQUIRED_PUBLIC_PATHS) {
    if (!entriesByPath.has(pathname)) {
      entriesByPath.set(pathname, { pathname, lastModified: now });
    }
  }

  return [...entriesByPath.values()].sort((a, b) => a.pathname.localeCompare(b.pathname));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return getSingleSitemapEntries().map((entry) => ({
    url: absoluteUrl(entry.pathname),
    lastModified: entry.lastModified,
    changeFrequency: getChangeFrequency(entry.pathname),
    priority: getPriority(entry.pathname),
  }));
}
