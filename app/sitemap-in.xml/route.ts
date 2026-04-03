import { getAllIndexableRoutes } from '@/lib/sitemap-routes';
import { createUrlSetXml, sitemapXmlResponse } from '@/lib/sitemap-xml';

export function GET() {
  const entries = getAllIndexableRoutes().filter((entry) => entry.pathname === '/in' || entry.pathname.startsWith('/in/'));
  return sitemapXmlResponse(createUrlSetXml(entries));
}
