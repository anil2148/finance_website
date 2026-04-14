import { normalizePathname, type RegionCode } from '@/lib/seo-urls';

const EXCLUDED_ROUTE_PREFIXES = ['/api', '/admin', '/blog/tag', '/blog/category'];
const EXCLUDED_EXACT_PATHS = new Set<string>([
  '/us',
  '/hello',
  '/about-us',
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
  '/compare/best-credit-cards-2026',
  '/compare/best-investment-apps',
  '/compare/best-savings-accounts-usa',
  '/compare/high-yield-savings-accounts',
  '/dashboard',
  '/help',
  '/legal'
]);


const LEGACY_CANONICAL_PATHS: Record<string, string> = {
  '/about-us': '/about',
  '/mortgage-calculator': '/calculators/mortgage-calculator',
  '/loan-calculator': '/calculators/loan-calculator',
  '/compound-interest-calculator': '/calculators/compound-interest-calculator',
  '/retirement-calculator': '/calculators/retirement-calculator',
  '/debt-payoff-calculator': '/calculators/debt-payoff-calculator'
};

const CROSS_REGION_EQUIVALENCE: Record<string, string> = {
  '/': '/in',
  '/blog': '/in/blog',
  '/calculators': '/in/calculators',
  '/loans': '/in/loans',
  '/calculators/loan-calculator': '/in/calculators/emi-calculator',
  '/calculators/compound-interest-calculator': '/in/calculators/sip-calculator',
  '/best-credit-cards-2026': '/in/best-credit-cards-india',
  '/best-investment-apps': '/in/best-investment-apps-india',
  '/best-savings-accounts-usa': '/in/best-savings-accounts-india'
};

export function isIndexableRoute(pathname: string): boolean {
  const normalized = normalizePathname(pathname);

  if (normalized.includes('[') || normalized.includes(']')) return false;
  if (EXCLUDED_EXACT_PATHS.has(normalized)) return false;
  if (EXCLUDED_ROUTE_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) return false;

  return true;
}

function resolveEquivalentPath(pathname: string): { us: string | null; india: string | null } {
  const normalized = normalizePathname(pathname);

  const explicitIndia = CROSS_REGION_EQUIVALENCE[normalized];
  if (explicitIndia) {
    return { us: normalized, india: explicitIndia };
  }

  const explicitUs = Object.entries(CROSS_REGION_EQUIVALENCE).find(([, indiaPath]) => indiaPath === normalized)?.[0];
  if (explicitUs) {
    return { us: explicitUs, india: normalized };
  }

  return { us: null, india: null };
}

export function getCanonicalUrl(pathname: string, region?: RegionCode): string {
  const normalized = LEGACY_CANONICAL_PATHS[normalizePathname(pathname)] ?? normalizePathname(pathname);

  if (!region) return normalized;
  const mapped = resolveEquivalentPath(normalized);
  if (region === 'in') return mapped.india ?? normalized;
  return mapped.us ?? normalized;
}

export function getAlternateUrls(pathname: string): { 'en-US'?: string; 'en-IN'?: string; 'x-default'?: string } {
  const { us, india } = resolveEquivalentPath(pathname);

  if (!us && !india) return {};

  return {
    ...(us ? { 'en-US': us } : {}),
    ...(india ? { 'en-IN': india } : {}),
    'x-default': us ?? '/'
  };
}
