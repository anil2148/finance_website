import { absoluteUrl } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/seo-locale-routes';
import type { SitemapEntry } from '@/lib/sitemap-routes';

const XML_HEADERS = { 'Content-Type': 'application/xml; charset=utf-8' };

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function createSitemapIndexXml(sitemaps: string[]): string {
  const generatedAt = new Date().toISOString();
  const items = sitemaps
    .map((pathname) => `  <sitemap>\n    <loc>${escapeXml(absoluteUrl(pathname))}</loc>\n    <lastmod>${generatedAt}</lastmod>\n  </sitemap>`)
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items,
    '</sitemapindex>'
  ].join('\n');
}

export function createUrlSetXml(entries: SitemapEntry[]): string {
  const items = entries
    .map((entry) => {
      const alternates = getAlternateUrls(entry.pathname);
      const alternateLinks = Object.entries(alternates)
        .map(([lang, path]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(absoluteUrl(path))}" />`)
        .join('\n');

      return [
        '  <url>',
        `    <loc>${escapeXml(absoluteUrl(entry.pathname))}</loc>`,
        `    <lastmod>${entry.lastModified.toISOString()}</lastmod>`,
        alternateLinks,
        '  </url>'
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    items,
    '</urlset>'
  ].join('\n');
}

export function sitemapXmlResponse(xml: string) {
  return new Response(xml, { headers: XML_HEADERS });
}
