import { NextResponse } from 'next/server';
import { PREFERRED_REGION_COOKIE, parsePreferredRegion } from '@/lib/region-preference';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { region?: string } | null;
  const region = parsePreferredRegion(payload?.region);

  if (!region) {
    return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, region });
  response.cookies.set(PREFERRED_REGION_COOKIE, region, {
    path: '/',
    maxAge: ONE_YEAR_IN_SECONDS,
    sameSite: 'lax',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production'
  });

  return response;
}
