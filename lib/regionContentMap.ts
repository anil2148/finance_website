export type RegionOwnership = 'US' | 'INDIA' | 'BOTH_ALLOWED' | 'EXCLUSIVE_US' | 'EXCLUSIVE_INDIA';

export type RegionContentEntry = {
  slug: string;
  region: RegionOwnership;
  counterpartSlug?: string;
  notes?: string;
};

const REGION_CONTENT_MAP: RegionContentEntry[] = [
  { slug: '/', region: 'BOTH_ALLOWED', counterpartSlug: '/' },
  { slug: '/blog', region: 'BOTH_ALLOWED', counterpartSlug: '/blog' },
  { slug: '/blog/:slug', region: 'BOTH_ALLOWED', counterpartSlug: '/blog/:slug', notes: 'Must be terminology-localized per region.' },
  { slug: '/ai-money-copilot', region: 'BOTH_ALLOWED', notes: 'Global route. Region-prefixed variants must redirect to this path.' },
  { slug: '/calculators', region: 'EXCLUSIVE_US' },
  { slug: '/calculators/:slug', region: 'EXCLUSIVE_US' },
  { slug: '/tax', region: 'EXCLUSIVE_INDIA' },
  { slug: '/banking', region: 'EXCLUSIVE_INDIA' },
  { slug: '/investing', region: 'EXCLUSIVE_INDIA' },
  { slug: '/loans', region: 'BOTH_ALLOWED', counterpartSlug: '/loans' },
  { slug: '/best-credit-cards-2026', region: 'EXCLUSIVE_US' },
  { slug: '/best-investment-apps', region: 'EXCLUSIVE_US' },
  { slug: '/best-savings-accounts-usa', region: 'EXCLUSIVE_US' },
  { slug: '/best-credit-cards-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/best-investment-apps-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/best-savings-accounts-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/best-fixed-deposits-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/home-loan-interest-rates-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/tax-slabs', region: 'EXCLUSIVE_INDIA' },
  { slug: '/tax-slabs-2026-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/old-vs-new-tax-regime', region: 'EXCLUSIVE_INDIA' },
  { slug: '/80c-deductions', region: 'EXCLUSIVE_INDIA' },
  { slug: '/80c-deductions-guide', region: 'EXCLUSIVE_INDIA' },
  { slug: '/fixed-deposit-vs-sip-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/rent-vs-buy-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/home-affordability-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/personal-loan-comparison-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/sip-strategy-india', region: 'EXCLUSIVE_INDIA' },
  { slug: '/real-estate', region: 'EXCLUSIVE_INDIA' },
  { slug: '/calculators/sip-calculator', region: 'EXCLUSIVE_INDIA' },
  { slug: '/calculators/emi-calculator', region: 'EXCLUSIVE_INDIA' }
];

const TEMPLATE_REPLACER = /:[^/]+/g;

type SupportedRegionPrefix = 'US' | 'INDIA';

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function toMatcher(slug: string): RegExp {
  const pattern = normalizePath(slug)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(TEMPLATE_REPLACER, '[^/]+');

  return new RegExp(`^${pattern}$`);
}

const REGION_CONTENT_INDEX = REGION_CONTENT_MAP.map((entry) => ({
  ...entry,
  matcher: toMatcher(entry.slug)
}));

export function getRegionContentMap(): RegionContentEntry[] {
  return REGION_CONTENT_MAP;
}

export function resolveRegionContentEntry(pathname: string): RegionContentEntry | null {
  const normalized = normalizePath(pathname);
  const match = REGION_CONTENT_INDEX.find((entry) => entry.matcher.test(normalized));
  if (!match) return null;
  const { matcher: _matcher, ...entry } = match;
  return entry;
}

export function assertRegionOwnership(pathname: string, regionPrefix: SupportedRegionPrefix): { allowed: boolean; reason?: string } {
  const normalized = normalizePath(pathname);
  const entry = resolveRegionContentEntry(normalized);

  if (!entry) {
    return { allowed: false, reason: `No region ownership mapping exists for ${normalized}.` };
  }

  if (regionPrefix === 'US') {
    const allowed = entry.region === 'US' || entry.region === 'EXCLUSIVE_US' || entry.region === 'BOTH_ALLOWED';
    return allowed ? { allowed: true } : { allowed: false, reason: `${normalized} is India-owned (${entry.region}).` };
  }

  const allowed = entry.region === 'INDIA' || entry.region === 'EXCLUSIVE_INDIA' || entry.region === 'BOTH_ALLOWED';
  return allowed ? { allowed: true } : { allowed: false, reason: `${normalized} is US-owned (${entry.region}).` };
}


export type RouteRegionMetadata = {
  slug: string;
  region: 'us' | 'in' | 'global';
};

export function getRouteRegionMetadata(pathname: string): RouteRegionMetadata | null {
  const entry = resolveRegionContentEntry(pathname);
  if (!entry) return null;

  if (entry.region === 'EXCLUSIVE_US' || entry.region === 'US') {
    return { slug: entry.slug, region: 'us' };
  }

  if (entry.region === 'EXCLUSIVE_INDIA' || entry.region === 'INDIA') {
    return { slug: entry.slug, region: 'in' };
  }

  return { slug: entry.slug, region: 'global' };
}
