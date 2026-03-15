import { NextRequest, NextResponse } from 'next/server';
import { appendOfferClick } from '@/lib/offerTracking';
import { getFinancialProducts } from '@/lib/financialProducts';

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  const products = getFinancialProducts();
  const product = products.find((item) => item.id === params.productId);

  if (!product) {
    return NextResponse.redirect(new URL('/comparison', request.url));
  }

  appendOfferClick({
    product_id: product.id,
    timestamp: new Date().toISOString(),
    user_agent: request.headers.get('user-agent') ?? 'unknown',
    referrer: request.headers.get('referer') ?? 'direct'
  });

  return NextResponse.redirect(product.affiliate_url);
}
