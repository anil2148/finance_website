import fs from 'fs';
import path from 'path';
import { getCategories, getPosts, getTags, normalizeTag } from '@/lib/markdown';
import { isIndexableRoute } from '@/lib/seo-locale-routes';

import { generateStaticParams as generateLearnStaticParams } from '@/app/learn/[cluster]/page';
import { generateStaticParams as generateCreditCardRegionParams } from '@/app/compare/credit-cards-for/[region]/page';
import { generateStaticParams as generateInvestmentAudienceParams } from '@/app/compare/best-investment-apps/[audience]/page';

export type SitemapEntry = {
  pathname: string;
  lastModified: Date;
};

const APP_DIR = path.join(process.cwd(), 'app');
const BLOG_DIR = path.join(process.cwd(), 'content/blog');

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

function getStaticIndexableRoutes(): SitemapEntry[] {
  const now = new Date();
  return walkAppPages(APP_DIR)
    .map((pagePath) => filePathToRoute(pagePath) || '/')
    .filter((route) => isIndexableRoute(route))
    .map((pathname) => ({ pathname, lastModified: now }));
}

function getLastModifiedForBlogSlug(slug: string, fallbackDate: string): Date {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    return fs.statSync(filePath).mtime;
  }

  return new Date(fallbackDate);
}

function getDynamicIndexableRoutes(): SitemapEntry[] {
  const posts = getPosts();

  const blogPostEntries = posts.map((post) => ({
    pathname: `/blog/${post.slug}`,
    lastModified: getLastModifiedForBlogSlug(post.slug, post.updatedAt ?? post.date)
  }));

  const blogCategoryEntries = getCategories().map((category) => ({
    pathname: `/blog/category/${category}`,
    lastModified: new Date()
  }));

  const blogTagEntries = getTags().map((tag) => ({
    pathname: `/blog/tag/${encodeURIComponent(normalizeTag(tag))}`,
    lastModified: new Date()
  }));

  const learnEntries = generateLearnStaticParams().map(({ cluster }) => ({
    pathname: `/learn/${cluster}`,
    lastModified: new Date('2026-03-18')
  }));

  const regionEntries = generateCreditCardRegionParams().map(({ region }) => ({
    pathname: `/compare/credit-cards-for/${region}`,
    lastModified: new Date('2026-03-18')
  }));

  const audienceEntries = generateInvestmentAudienceParams().map(({ audience }) => ({
    pathname: `/compare/best-investment-apps/${audience}`,
    lastModified: new Date('2026-03-18')
  }));

  return [
    ...blogPostEntries,
    ...blogCategoryEntries,
    ...blogTagEntries,
    ...learnEntries,
    ...regionEntries,
    ...audienceEntries
  ].filter((entry) => isIndexableRoute(entry.pathname));
}

export function getAllIndexableRoutes(): SitemapEntry[] {
  const allEntries = [...getStaticIndexableRoutes(), ...getDynamicIndexableRoutes()];
  const deduped = new Map<string, SitemapEntry>();

  for (const entry of allEntries) deduped.set(entry.pathname, entry);

  return [...deduped.values()].sort((a, b) => a.pathname.localeCompare(b.pathname));
}
