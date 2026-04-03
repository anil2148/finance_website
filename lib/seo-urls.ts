export const SITE_ORIGIN = 'https://www.financesphere.io';

export type RegionCode = 'us' | 'in';

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized.replace(/\/+$/, '') || '/';
}

export function buildSiteUrl(pathname: string): string {
  const normalizedPath = normalizePathname(pathname);
  return normalizedPath === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalizedPath}`;
}

export function absoluteUrl(pathname: string): string {
  return buildSiteUrl(pathname);
}
