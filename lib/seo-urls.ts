export const SITE_ORIGIN = 'https://www.financesphere.io';

export type RegionCode = 'us' | 'in';

const LEGACY_PATH_REDIRECTS: Record<string, string> = {
  '/about-us': '/about',
  '/best-credit-cards': '/best-credit-cards-2026',
  '/best-savings-accounts': '/best-savings-accounts-usa',
  '/mortgage-calculator': '/calculators/mortgage-calculator',
  '/loan-calculator': '/calculators/loan-calculator',
  '/loan-emi-calculator': '/calculators/loan-calculator',
  '/compound-interest-calculator': '/calculators/compound-interest-calculator',
  '/retirement-calculator': '/calculators/retirement-calculator',
  '/fire-retirement-calculator': '/calculators/fire-calculator',
  '/net-worth-calculator': '/calculators/net-worth-calculator',
  '/investment-growth-calculator': '/calculators/investment-growth-calculator',
  '/savings-goal-calculator': '/calculators/savings-goal-calculator',
  '/debt-payoff-calculator': '/calculators/debt-payoff-calculator',
  '/compare/best-credit-cards-2026': '/best-credit-cards-2026',
  '/compare/best-investment-apps': '/best-investment-apps',
  '/compare/best-savings-accounts-usa': '/best-savings-accounts-usa',
  '/compare/high-yield-savings-accounts': '/high-yield-savings-accounts'
};

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized.replace(/\/+$/, '') || '/';
}

export function toCanonicalPathname(pathname: string): string {
  const [rawPath] = pathname.split(/[?#]/);
  const normalizedPath = normalizePathname(rawPath);
  return LEGACY_PATH_REDIRECTS[normalizedPath] ?? normalizedPath;
}

export function buildSiteUrl(pathname: string): string {
  const normalizedPath = toCanonicalPathname(pathname);
  return normalizedPath === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalizedPath}`;
}

export function absoluteUrl(pathname: string): string {
  return buildSiteUrl(pathname);
}

export function toCanonicalInternalHref(href: string): string {
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href;
  }

  return toCanonicalPathname(href);
}
