import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  detectRegionFromCountry,
  isBotUserAgent,
  parsePreferredRegion,
  PREFERRED_REGION_COOKIE
} from '@/lib/region-preference';

const PRIMARY_HOST = 'www.financesphere.io';
const LEGACY_HOSTS = new Set(['financesphere.io', 'www.financesphere.io']);

function redirectToIndiaHomepage(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/in';
  return NextResponse.redirect(url, 307);
}

export function middleware(request: NextRequest) {
  const { nextUrl, headers } = request;
  const host = headers.get('host')?.toLowerCase() ?? '';
  const forwardedProto = headers.get('x-forwarded-proto')?.toLowerCase() ?? nextUrl.protocol.replace(':', '');

  if (LEGACY_HOSTS.has(host) && (host !== PRIMARY_HOST || forwardedProto !== 'https')) {
    const redirectUrl = new URL(nextUrl.pathname + nextUrl.search, `https://${PRIMARY_HOST}`);
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  const preferredRegion = parsePreferredRegion(request.cookies.get(PREFERRED_REGION_COOKIE)?.value);

  if (preferredRegion === 'in') {
    return redirectToIndiaHomepage(request);
  }

  if (preferredRegion === 'us') {
    return NextResponse.next();
  }

  if (isBotUserAgent(headers.get('user-agent'))) {
    return NextResponse.next();
  }

  const countryCode = headers.get('x-vercel-ip-country') ?? null;
  const detectedRegion = detectRegionFromCountry(countryCode);

  if (detectedRegion === 'in') {
    return redirectToIndiaHomepage(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|sitemap-us.xml|sitemap-in.xml|.*\\.(?:css|js|map|json|png|jpg|jpeg|gif|svg|webp|ico|txt|xml|woff|woff2|ttf)$).*)'
  ]
};
