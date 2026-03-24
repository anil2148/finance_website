import { NextRequest, NextResponse } from 'next/server';
import { appendOfferClick } from '@/lib/offerTracking';
import { getFinancialProductById, isValidAbsoluteUrl } from '@/lib/financialProducts';

function safeComparisonRedirect(request: NextRequest, reason: string) {
  const fallback = new URL('/comparison', request.url);
  fallback.searchParams.set('offer', reason);
  return NextResponse.redirect(fallback, 307);
}

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  const product = getFinancialProductById(params.productId);

  if (!product) {
    return safeComparisonRedirect(request, 'not-found');
  }

  if (!isValidAbsoluteUrl(product.affiliate_url)) {
    return safeComparisonRedirect(request, 'unavailable');
  }

  try {
    appendOfferClick({
      product_id: product.id,
      timestamp: new Date().toISOString(),
      user_agent: request.headers.get('user-agent') ?? 'unknown',
      referrer: request.headers.get('referer') ?? 'direct'
    });
  } catch {
    // Never hard-fail user redirect if tracking write fails in read-only/runtime environments.
  }

  return NextResponse.redirect(product.affiliate_url, 307);
}
