import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  detectRegionFromCountry,
  parsePreferredRegion,
  PREFERRED_REGION_COOKIE,
  type PreferredRegion,
  getPreferredRegionCookieValue
} from '@/lib/region-preference';
import { DEFAULT_REGION, getRegionFromPath, stripRegionPrefix, withRegionPrefix } from '@/lib/region-config';
import { slugifyTag } from '@/lib/tagSlug';


type HomepageRoutingDecision =
  | { action: 'next' }
  | { action: 'redirect'; region: PreferredRegion };

type HomepageRoutingInput = {
  pathname: string;
  preferredRegion: PreferredRegion | null;
  userAgent: string | null;
  countryCode: string | null;
};

export function getHomepageRoutingDecision({ pathname, preferredRegion, countryCode }: HomepageRoutingInput): HomepageRoutingDecision {
  if (pathname !== '/') return { action: 'next' };
  const resolved = preferredRegion ?? detectRegionFromCountry(countryCode);
  return resolved === 'US' ? { action: 'next' } : { action: 'redirect', region: resolved };
}

const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  '/about-us': '/about',
  '/mortgage-calculator': '/calculators/mortgage-calculator',
  '/loan-calculator': '/calculators/loan-calculator',
  '/compound-interest-calculator': '/calculators/compound-interest-calculator',
  '/retirement-calculator': '/calculators/retirement-calculator',
  '/debt-payoff-calculator': '/calculators/debt-payoff-calculator',
  '/mortgage-rate-comparison': '/compare/mortgage-rate-comparison'
};

function normalizePathname(pathname: string): string {
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '') || '/';
  }
  return pathname;
}

function getCanonicalPathname(pathname: string): string {
  let nextPath = normalizePathname(pathname);

  const legacyRedirectTarget = LEGACY_ROUTE_REDIRECTS[nextPath];
  if (legacyRedirectTarget) {
    nextPath = legacyRedirectTarget;
  }

  if (nextPath.startsWith('/blog/category/')) {
    const rawCategory = nextPath.slice('/blog/category/'.length);
    if (rawCategory && !rawCategory.includes('/')) {
      const canonicalTag = slugifyTag(rawCategory);
      if (canonicalTag) return `/blog/tag/${canonicalTag}`;
    }
  }

  return nextPath;
}

function getPreferredRegion(request: NextRequest): PreferredRegion {
  const cookieRegion = parsePreferredRegion(request.cookies.get(PREFERRED_REGION_COOKIE)?.value);
  if (cookieRegion) return cookieRegion;

  const pathRegion = getRegionFromPath(request.nextUrl.pathname);
  if (pathRegion) return pathRegion;

  return detectRegionFromCountry(request.headers.get('x-vercel-ip-country') ?? request.headers.get('cf-ipcountry'));
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const requestedRegion = parsePreferredRegion(nextUrl.searchParams.get('region'));

  if (requestedRegion) {
    const targetPath = withRegionPrefix(nextUrl.pathname, requestedRegion);
    const cleanUrl = new URL(request.url);
    cleanUrl.pathname = targetPath;
    cleanUrl.searchParams.delete('region');

    const response = NextResponse.redirect(cleanUrl, 307);
    response.cookies.set(PREFERRED_REGION_COOKIE, getPreferredRegionCookieValue(requestedRegion), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production'
    });
    return response;
  }

  const canonicalRawPathname = getCanonicalPathname(nextUrl.pathname);
  const preferredRegion = getPreferredRegion(request);
  const canonicalPathname = withRegionPrefix(stripRegionPrefix(canonicalRawPathname), preferredRegion);

  if (canonicalPathname !== nextUrl.pathname) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = canonicalPathname;
    return NextResponse.redirect(redirectUrl, 307);
  }

  const response = NextResponse.next();
  response.cookies.set(PREFERRED_REGION_COOKIE, getPreferredRegionCookieValue(preferredRegion ?? DEFAULT_REGION), {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production'
  });

  if (preferredRegion === 'US' || preferredRegion === 'EU') {
    const rewriteUrl = nextUrl.clone();
    rewriteUrl.pathname = stripRegionPrefix(nextUrl.pathname);
    return NextResponse.rewrite(rewriteUrl, response);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|sitemap-us.xml|sitemap-in.xml|.*\\.(?:css|js|map|json|png|jpg|jpeg|gif|svg|webp|ico|txt|xml|woff|woff2|ttf)$).*)'
  ]
};
