import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  detectRegionFromCountry,
  isBotUserAgent,
  parsePreferredRegion,
  PREFERRED_REGION_COOKIE,
  type PreferredRegion
} from '@/lib/region-preference';
import { slugifyTag } from '@/lib/tagSlug';

const PRIMARY_HOST = 'www.financesphere.io';
const NON_PRIMARY_HOSTS = new Set(['financesphere.io']);

const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  '/about-us': '/about',
  '/mortgage-calculator': '/calculators/mortgage-calculator',
  '/loan-calculator': '/calculators/loan-calculator',
  '/compound-interest-calculator': '/calculators/compound-interest-calculator',
  '/retirement-calculator': '/calculators/retirement-calculator',
  '/debt-payoff-calculator': '/calculators/debt-payoff-calculator',
  '/mortgage-rate-comparison': '/compare/mortgage-rate-comparison'
};

type HomepageRoutingDecision =
  | { action: 'next' }
  | { action: 'redirect'; region: PreferredRegion };

type HomepageRoutingInput = {
  pathname: string;
  preferredRegion: PreferredRegion | null;
  userAgent: string | null;
  countryCode: string | null;
};

export function getHomepageRoutingDecision({ pathname, preferredRegion, userAgent, countryCode }: HomepageRoutingInput): HomepageRoutingDecision {
  if (pathname !== '/') return { action: 'next' };
  if (preferredRegion === 'in') return { action: 'redirect', region: 'in' };
  if (preferredRegion === 'us') return { action: 'next' };
  if (isBotUserAgent(userAgent)) return { action: 'next' };

  const detectedRegion = detectRegionFromCountry(countryCode);
  if (detectedRegion === 'in') return { action: 'redirect', region: 'in' };

  return { action: 'next' };
}

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

  if (nextPath.startsWith('/tag/') || nextPath.startsWith('/topic/')) {
    const rawTag = nextPath.replace(/^\/(?:tag|topic)\//, '').split('/')[0];
    const canonicalTag = slugifyTag(rawTag);
    if (canonicalTag) return `/blog/tag/${canonicalTag}`;
  }

  if (nextPath.startsWith('/blog/tag/')) {
    const rawTagSegment = nextPath.slice('/blog/tag/'.length);
    const hasNestedPath = rawTagSegment.includes('/');
    if (!hasNestedPath && rawTagSegment) {
      const canonicalTag = slugifyTag(rawTagSegment);
      if (canonicalTag) return `/blog/tag/${canonicalTag}`;
    }
  }

  return nextPath;
}

function redirectToCanonical(request: NextRequest, pathname: string, permanent = true) {
  const redirectUrl = new URL(request.url);
  redirectUrl.protocol = 'https:';
  redirectUrl.host = PRIMARY_HOST;
  redirectUrl.pathname = pathname;
  return NextResponse.redirect(redirectUrl, permanent ? 308 : 307);
}

export function middleware(request: NextRequest) {
  const { nextUrl, headers } = request;
  const pathname = nextUrl.pathname;
  const host = headers.get('host')?.toLowerCase() ?? '';
  const forwardedProto = headers.get('x-forwarded-proto')?.toLowerCase() ?? nextUrl.protocol.replace(':', '');


  const requestedRegion = parsePreferredRegion(nextUrl.searchParams.get('region'));
  if (requestedRegion) {
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete('region');
    const response = NextResponse.redirect(cleanUrl, 307);
    response.cookies.set(PREFERRED_REGION_COOKIE, requestedRegion, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production'
    });
    return response;
  }

  const canonicalPathname = getCanonicalPathname(pathname);
  const shouldCanonicalizeOrigin = NON_PRIMARY_HOSTS.has(host) || host !== PRIMARY_HOST || forwardedProto !== 'https';
  const shouldCanonicalizePath = canonicalPathname !== pathname;

  if (shouldCanonicalizeOrigin || shouldCanonicalizePath) {
    return redirectToCanonical(request, canonicalPathname, true);
  }

  const decision = getHomepageRoutingDecision({
    pathname,
    preferredRegion: parsePreferredRegion(request.cookies.get(PREFERRED_REGION_COOKIE)?.value),
    userAgent: headers.get('user-agent'),
    countryCode: headers.get('x-vercel-ip-country') ?? headers.get('cf-ipcountry')
  });

  if (decision.action === 'redirect') {
    return redirectToCanonical(request, decision.region === 'in' ? '/in' : '/', false);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|sitemap-us.xml|sitemap-in.xml|.*\\.(?:css|js|map|json|png|jpg|jpeg|gif|svg|webp|ico|txt|xml|woff|woff2|ttf)$).*)'
  ]
};
