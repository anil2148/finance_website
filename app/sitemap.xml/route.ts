import { createSitemapIndexXml, sitemapXmlResponse } from '@/lib/sitemap-xml';

export function GET() {
  const xml = createSitemapIndexXml(['/sitemap-us.xml', '/sitemap-in.xml']);
  return sitemapXmlResponse(xml);
}
