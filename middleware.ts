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
// Hosts that must always redirect to PRIMARY_HOST regardless of protocol.
// PRIMARY_HOST itself is excluded here; its HTTP→HTTPS redirect is handled explicitly below.
const NON_WWW_HOSTS = new Set(['financesphere.io']);

const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  '/about-us': '/about',
  '/about-us/': '/about',
  '/mortgage-calculator': '/calculators/mortgage-calculator',
  '/loan-calculator': '/calculators/loan-calculator',
  '/compound-interest-calculator': '/calculators/compound-interest-calculator',
  '/retirement-calculator': '/calculators/retirement-calculator',
  '/debt-payoff-calculator': '/calculators/debt-payoff-calculator'
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
  if (pathname !== '/') {
    return { action: 'next' };
  }

  if (preferredRegion === 'in') {
    return { action: 'redirect', region: 'in' };
  }

  if (preferredRegion === 'us') {
    return { action: 'next' };
  }

  if (isBotUserAgent(userAgent)) {
    return { action: 'next' };
  }

  const detectedRegion = detectRegionFromCountry(countryCode);
  if (detectedRegion === 'in') {
    return { action: 'redirect', region: 'in' };
  }

  return { action: 'next' };
}

function redirectToRegionHomepage(request: NextRequest, region: PreferredRegion) {
  const url = request.nextUrl.clone();
  url.pathname = region === 'in' ? '/in' : '/';
  return NextResponse.redirect(url, 307);
}

export function middleware(request: NextRequest) {
  const { nextUrl, headers } = request;
  const pathname = nextUrl.pathname;
  const host = headers.get('host')?.toLowerCase() ?? '';
  const forwardedProto = headers.get('x-forwarded-proto')?.toLowerCase() ?? nextUrl.protocol.replace(':', '');

  if (NON_WWW_HOSTS.has(host) || (host === PRIMARY_HOST && forwardedProto !== 'https')) {
    const redirectUrl = new URL(nextUrl.pathname + nextUrl.search, `https://${PRIMARY_HOST}`);
    return NextResponse.redirect(redirectUrl, 308);
  }

  const legacyRedirectTarget = LEGACY_ROUTE_REDIRECTS[pathname];
  if (legacyRedirectTarget) {
    const redirectUrl = nextUrl.clone();
    redirectUrl.pathname = legacyRedirectTarget;
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (pathname.startsWith('/tag/') || pathname.startsWith('/topic/')) {
    const rawTag = pathname.replace(/^\/(?:tag|topic)\//, '').split('/')[0];
    const canonicalTag = slugifyTag(rawTag);
    if (canonicalTag) {
      const redirectUrl = nextUrl.clone();
      redirectUrl.pathname = `/blog/tag/${canonicalTag}`;
      return NextResponse.redirect(redirectUrl, 301);
    }
  }

  if (pathname.startsWith('/blog/tag/')) {
    const rawTagSegment = pathname.slice('/blog/tag/'.length);
    const hasNestedPath = rawTagSegment.includes('/');
    if (!hasNestedPath && rawTagSegment) {
      const canonicalTag = slugifyTag(rawTagSegment);
      if (canonicalTag && rawTagSegment !== canonicalTag) {
        const redirectUrl = nextUrl.clone();
        redirectUrl.pathname = `/blog/tag/${canonicalTag}`;
        return NextResponse.redirect(redirectUrl, 301);
      }
    }
  }

  const decision = getHomepageRoutingDecision({
    pathname,
    preferredRegion: parsePreferredRegion(request.cookies.get(PREFERRED_REGION_COOKIE)?.value),
    userAgent: headers.get('user-agent'),
    countryCode: headers.get('x-vercel-ip-country') ?? headers.get('cf-ipcountry')
  });

  if (decision.action === 'redirect') {
    return redirectToRegionHomepage(request, decision.region);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|sitemap-us.xml|sitemap-in.xml|.*\\.(?:css|js|map|json|png|jpg|jpeg|gif|svg|webp|ico|txt|xml|woff|woff2|ttf)$).*)'
  ]
};
