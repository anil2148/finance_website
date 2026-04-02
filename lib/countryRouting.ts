export type CountryCode = 'US' | 'IN';

const INDIA_PREFIX = '/in';

const exactPathMappings: Record<string, string> = {
  '/': '/in',
  '/in': '/',
  '/calculators/loan-calculator': '/in/calculators/emi-calculator',
  '/in/calculators/emi-calculator': '/calculators/loan-calculator'
};

const blogMappings: Record<string, string> = {
  '/blog': '/in',
  '/in/blog/sip-vs-fd': '/blog',
  '/in/blog/ppf-vs-elss': '/blog'
};

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const path = pathname.split('?')[0].split('#')[0];
  if (path === '/') return '/';
  return path.replace(/\/+$/, '') || '/';
}

export function isIndiaPath(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  return normalized === INDIA_PREFIX || normalized.startsWith(`${INDIA_PREFIX}/`);
}

export function localizePath(pathname: string, country: CountryCode): string {
  const normalized = normalizePath(pathname);
  if (country === 'IN') {
    if (normalized === '/') return INDIA_PREFIX;
    if (normalized.startsWith(INDIA_PREFIX)) return normalized;
    return `${INDIA_PREFIX}${normalized}`;
  }

  if (!normalized.startsWith(INDIA_PREFIX)) return normalized;
  const withoutPrefix = normalized.slice(INDIA_PREFIX.length);
  return withoutPrefix || '/';
}

export function getCountrySwitchPath(pathname: string, targetCountry: CountryCode): string {
  const normalized = normalizePath(pathname);
  const mapped = exactPathMappings[normalized] ?? blogMappings[normalized];

  if (mapped) {
    return targetCountry === 'IN'
      ? (mapped.startsWith(INDIA_PREFIX) ? mapped : localizePath(mapped, 'IN'))
      : (mapped.startsWith(INDIA_PREFIX) ? localizePath(mapped, 'US') : mapped);
  }

  if (targetCountry === 'IN') {
    return '/in';
  }

  return '/';
}
