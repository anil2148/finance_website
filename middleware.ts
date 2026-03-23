import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIMARY_HOST = 'www.financesphere.io';
const LEGACY_HOSTS = new Set(['financesphere.io', 'www.financesphere.io']);

export function middleware(request: NextRequest) {
  const { nextUrl, headers } = request;
  const host = headers.get('host')?.toLowerCase() ?? '';
  const forwardedProto = headers.get('x-forwarded-proto')?.toLowerCase() ?? nextUrl.protocol.replace(':', '');

  if (LEGACY_HOSTS.has(host) && (host !== PRIMARY_HOST || forwardedProto !== 'https')) {
    const redirectUrl = new URL(nextUrl.pathname + nextUrl.search, `https://${PRIMARY_HOST}`);
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)']
};
