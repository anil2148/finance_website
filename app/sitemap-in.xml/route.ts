import { getSitemapRoutesByRegion } from '@/lib/sitemap-routes';
import { createUrlSetXml, sitemapXmlResponse } from '@/lib/sitemap-xml';

export function GET() {
  return sitemapXmlResponse(createUrlSetXml(getSitemapRoutesByRegion('in')));
}
