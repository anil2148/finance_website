import fs from 'fs';
import path from 'path';
import redirectMap from '@/content/audit/blog-redirect-map.json';
import { getCategories, getPosts, getTags, normalizeTag } from '@/lib/markdown';
import { isIndexableRoute } from '@/lib/seo-locale-routes';
import { shouldIncludeInSitemap, type RouteMeta } from '@/lib/seo/sitemap-filter';

import { generateStaticParams as generateLearnStaticParams } from '@/app/learn/[cluster]/page';
import { generateStaticParams as generateCreditCardRegionParams } from '@/app/compare/credit-cards-for/[region]/page';
import { generateStaticParams as generateInvestmentAudienceParams } from '@/app/compare/best-investment-apps/[audience]/page';

export type SitemapEntry = {
  pathname: string;
  lastModified: Date;
};

export type SitemapRegion = 'us' | 'in';

const APP_DIR = path.join(process.cwd(), 'app');
const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const BUILD_TIMESTAMP = new Date();

const LEGACY_REDIRECT_ROUTES = new Set<string>([
  '/compare/best-credit-cards-2026',
  '/compare/best-investment-apps',
  '/compare/best-savings-accounts-usa',
  '/compare/high-yield-savings-accounts',
  '/best-credit-cards',
  '/best-savings-accounts',
  '/mortgage-rate-comparison',
  '/mortgage-calculator',
  '/loan-emi-calculator',
  '/compound-interest-calculator',
  '/retirement-calculator',
  '/fire-retirement-calculator',
  '/net-worth-calculator',
  '/investment-growth-calculator',
  '/savings-goal-calculator',
  '/debt-payoff-calculator',
  ...redirectMap.map((entry) => entry.source)
]);

function walkAppPages(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pages: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      pages.push(...walkAppPages(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name === 'page.tsx') pages.push(fullPath);
  }

  return pages;
}

function filePathToRoute(pageFilePath: string): string {
  const relativeDir = path.relative(APP_DIR, path.dirname(pageFilePath));
  if (!relativeDir) return '/';

  const segments = relativeDir
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !segment.startsWith('(') && !segment.endsWith(')'));

  return `/${segments.join('/')}`.replace(/\/+$/, '');
}

function isLegacyRedirectRoute(pathname: string): boolean {
  return LEGACY_REDIRECT_ROUTES.has(pathname);
}

function isRegionMatch(pathname: string, region: SitemapRegion): boolean {
  if (region === 'in') return pathname === '/in' || pathname.startsWith('/in/');
  return pathname !== '/in' && !pathname.startsWith('/in/');
}

function isSitemapEligible(pathname: string, meta?: RouteMeta): boolean {
  if (isLegacyRedirectRoute(pathname)) return false;
  if (!isIndexableRoute(pathname)) return false;
  return shouldIncludeInSitemap(pathname, meta);
}

function getStaticIndexableRoutes(): SitemapEntry[] {
  return walkAppPages(APP_DIR)
    .map((pagePath) => filePathToRoute(pagePath) || '/')
    .filter((route) => isSitemapEligible(route))
    .map((pathname) => ({ pathname, lastModified: BUILD_TIMESTAMP }));
}

function getLastModifiedForBlogSlug(slug: string, fallbackDate?: string): Date {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    return fs.statSync(filePath).mtime;
  }

  if (fallbackDate) return new Date(fallbackDate);
  return BUILD_TIMESTAMP;
}

function getDynamicIndexableRoutes(): SitemapEntry[] {
  const posts = getPosts();

  const blogPostEntries = posts
    .map((post) => ({
      pathname: `/blog/${post.slug}`,
      lastModified: getLastModifiedForBlogSlug(post.slug, post.updatedAt ?? post.date),
      meta: {
        status: 'published' as const,
        canonical: `/blog/${post.slug}`
      }
    }))
    .filter((entry) => isSitemapEligible(entry.pathname, entry.meta));

  const blogCategoryEntries = getCategories()
    .map((category) => ({
      pathname: `/blog/category/${category}`,
      lastModified: BUILD_TIMESTAMP,
      meta: {
        seoQuality: 'weak' as const
      }
    }))
    .filter((entry) => isSitemapEligible(entry.pathname, entry.meta));

  const blogTagEntries = getTags()
    .map((tag) => ({
      pathname: `/blog/tag/${encodeURIComponent(normalizeTag(tag))}`,
      lastModified: BUILD_TIMESTAMP
    }))
    .filter((entry) => isSitemapEligible(entry.pathname));

  const learnEntries = generateLearnStaticParams()
    .map(({ cluster }) => ({
      pathname: `/learn/${cluster}`,
      lastModified: BUILD_TIMESTAMP,
      meta: {
        seoQuality: 'weak' as const
      }
    }))
    .filter((entry) => isSitemapEligible(entry.pathname, entry.meta));

  const regionEntries = generateCreditCardRegionParams()
    .map(({ region }) => ({
      pathname: `/compare/credit-cards-for/${region}`,
      lastModified: BUILD_TIMESTAMP
    }))
    .filter((entry) => isSitemapEligible(entry.pathname));

  const audienceEntries = generateInvestmentAudienceParams()
    .map(({ audience }) => ({
      pathname: `/compare/best-investment-apps/${audience}`,
      lastModified: BUILD_TIMESTAMP
    }))
    .filter((entry) => isSitemapEligible(entry.pathname));

  return [
    ...blogPostEntries,
    ...blogCategoryEntries,
    ...blogTagEntries,
    ...learnEntries,
    ...regionEntries,
    ...audienceEntries
  ].map(({ pathname, lastModified }) => ({ pathname, lastModified }));
}

export function getAllIndexableRoutes(): SitemapEntry[] {
  const allEntries = [...getStaticIndexableRoutes(), ...getDynamicIndexableRoutes()];
  const deduped = new Map<string, SitemapEntry>();

  for (const entry of allEntries) {
    const existing = deduped.get(entry.pathname);

    if (!existing || existing.lastModified < entry.lastModified) {
      deduped.set(entry.pathname, entry);
    }
  }

  return [...deduped.values()].sort((a, b) => a.pathname.localeCompare(b.pathname));
}

export function getSitemapRoutesByRegion(region: SitemapRegion): SitemapEntry[] {
  return getAllIndexableRoutes().filter((entry) => isRegionMatch(entry.pathname, region));
}
