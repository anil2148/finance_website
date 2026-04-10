export type RouteMeta = {
  noindex?: boolean;
  canonical?: string;
  status?: 'published' | 'draft';
  seoQuality?: 'strong' | 'weak';
  sitemap?: boolean;
};

const EXCLUDED_PREFIXES = [
  '/blog/tag/',
  '/auth',
  '/dashboard',
  '/internal',
  '/preview',
  '/staging',
  '/dev'
];

const EXCLUDED_EXACT = new Set([
  '/media-kit',
  '/tools'
]);

const INCLUDED_STATIC = new Set([
  '/',
  '/about',
  '/contact',
  '/affiliate-disclosure',
  '/editorial-policy',
  '/financial-disclaimer',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
  '/how-we-make-money',
  '/best-credit-cards-2026',
  '/best-credit-cards-everyday-spending',
  '/best-investment-apps',
  '/best-savings-accounts-usa',
  '/credit-cards',
  '/savings',
  '/loans',
  '/comparison',
  '/calculators',
  '/ai-money-copilot',
  '/in'
]);

const OPTIONAL_HUBS = new Set([
  '/learn',
  '/learn/budgeting',
  '/learn/credit-cards',
  '/learn/investing',
  '/learn/loans',
  '/learn/passive-income',
  '/blog/category/budgeting',
  '/blog/category/credit-cards',
  '/blog/category/debt',
  '/blog/category/investing',
  '/blog/category/loans',
  '/blog/category/mortgage',
  '/blog/category/retirement',
  '/blog/category/retirement-planning',
  '/blog/category/saving-money',
  '/blog/category/savings',
  '/blog/category/savings-accounts',
  '/blog/category/tax',
  '/in/learn',
  '/in/learn/budgeting',
  '/in/learn/credit-cards',
  '/in/learn/investing',
  '/in/learn/loans',
  '/in/learn/passive-income',
  '/in/blog/category/budgeting',
  '/in/blog/category/credit-cards',
  '/in/blog/category/debt',
  '/in/blog/category/investing',
  '/in/blog/category/loans',
  '/in/blog/category/mortgage',
  '/in/blog/category/retirement',
  '/in/blog/category/retirement-planning',
  '/in/blog/category/saving-money',
  '/in/blog/category/savings',
  '/in/blog/category/savings-accounts',
  '/in/blog/category/tax'
]);

export function normalizePath(pathname: string): string {
  if (!pathname) return '';

  let p = pathname.trim();
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.endsWith('/') && p !== '/') p = p.slice(0, -1);

  return p;
}

export function isAlwaysExcluded(pathname: string): boolean {
  const p = normalizePath(pathname);

  if (!p) return true;
  if (EXCLUDED_EXACT.has(p)) return true;
  if (EXCLUDED_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))) return true;
  if (p.includes('?') || p.includes('#')) return true;
  if (p.startsWith('/api/')) return true;
  if (p === '/404' || p === '/500') return true;

  return false;
}

export function isIncludedStaticPage(pathname: string): boolean {
  return INCLUDED_STATIC.has(normalizePath(pathname));
}

export function isBlogArticle(pathname: string): boolean {
  const p = normalizePath(pathname);
  const withoutRegion = p.startsWith('/in/') ? p.replace('/in', '') : p;

  return withoutRegion.startsWith('/blog/')
    && !withoutRegion.startsWith('/blog/tag/')
    && !withoutRegion.startsWith('/blog/category/');
}

export function isCalculatorPage(pathname: string): boolean {
  const p = normalizePath(pathname);
  const withoutRegion = p.startsWith('/in/') ? p.replace('/in', '') : p;

  return withoutRegion === '/calculators' || withoutRegion.startsWith('/calculators/');
}

export function isComparePage(pathname: string): boolean {
  const p = normalizePath(pathname);
  const withoutRegion = p.startsWith('/in/') ? p.replace('/in', '') : p;

  return withoutRegion === '/comparison' || withoutRegion.startsWith('/compare/');
}

export function isWhitelistedHubPage(pathname: string, meta?: RouteMeta): boolean {
  const p = normalizePath(pathname);
  if (!OPTIONAL_HUBS.has(p)) return false;

  if (meta?.sitemap === true) return true;
  return meta?.seoQuality === 'strong';
}

export function isCanonicalMatch(pathname: string, canonical?: string): boolean {
  if (!canonical) return true;

  try {
    const url = new URL(canonical);
    return normalizePath(url.pathname) === normalizePath(pathname);
  } catch {
    return canonical.endsWith(normalizePath(pathname));
  }
}

export function shouldIncludeInSitemap(pathname: string, meta?: RouteMeta): boolean {
  const p = normalizePath(pathname);

  if (!p) return false;
  if (isAlwaysExcluded(p)) return false;
  if (meta?.noindex) return false;
  if (meta?.status === 'draft') return false;
  if (!isCanonicalMatch(p, meta?.canonical)) return false;

  if (isIncludedStaticPage(p)) return true;
  if (isBlogArticle(p)) return true;
  if (isCalculatorPage(p)) return true;
  if (isComparePage(p)) return true;
  if (isWhitelistedHubPage(p, meta)) return true;

  return false;
}
