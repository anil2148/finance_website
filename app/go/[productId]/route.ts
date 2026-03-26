import { NextRequest, NextResponse } from 'next/server';

function safeComparisonRedirect(request: NextRequest, reason: string) {
  const fallback = new URL('/comparison', request.url);
  fallback.searchParams.set('offer', reason);
  return NextResponse.redirect(fallback, 307);
}

export async function GET(request: NextRequest) {
  return safeComparisonRedirect(request, 'live-offers-not-published');
}
