const BASE_URL = process.env.SITEMAP_VALIDATION_BASE_URL ?? 'https://www.financesphere.io';
const ROOT_SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const EXPECTED_CHILD_SITEMAPS = new Set([`${BASE_URL}/sitemap-us.xml`, `${BASE_URL}/sitemap-in.xml`]);

const XML_LINK_REGEX = /<loc>([^<]+)<\/loc>/g;
const CANONICAL_REGEX = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i;
const META_ROBOTS_NOINDEX_REGEX = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i;
const X_ROBOTS_NOINDEX_REGEX = /(^|,|\s)noindex(\s|,|$)/i;
const PREVIEW_HOST_REGEX = /(vercel\.app|preview|staging)/i;

function fail(message) {
  throw new Error(message);
}

function ensureAbsoluteHttps(url) {
  if (!url.startsWith('https://')) fail(`Non-https URL found in sitemap: ${url}`);
  if (url.includes('?') || url.includes('#')) fail(`Query/hash URL found in sitemap: ${url}`);
  if (PREVIEW_HOST_REGEX.test(url)) fail(`Preview/staging URL found in sitemap: ${url}`);
}


function normalizeComparableUrl(value) {
  const url = new URL(value);
  const pathname = url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '/';
  return `${url.origin}${pathname}`;
}

function extractLocs(xml) {
  return [...xml.matchAll(XML_LINK_REGEX)].map((match) => match[1].trim());
}

async function fetchStrict(url) {
  const response = await fetch(url, { redirect: 'manual' });

  if (response.status >= 300 && response.status < 400) {
    fail(`Redirect detected for URL: ${url} -> ${response.headers.get('location')}`);
  }

  if (response.status !== 200) {
    fail(`Expected 200 for URL: ${url}, got ${response.status}`);
  }

  return response;
}

async function validatePageUrl(url) {
  ensureAbsoluteHttps(url);

  const response = await fetchStrict(url);
  const xRobotsTag = response.headers.get('x-robots-tag') ?? '';

  if (X_ROBOTS_NOINDEX_REGEX.test(xRobotsTag)) {
    fail(`X-Robots-Tag has noindex for URL: ${url}`);
  }

  const html = await response.text();
  if (META_ROBOTS_NOINDEX_REGEX.test(html)) {
    fail(`Meta robots noindex detected for URL: ${url}`);
  }

  const canonical = html.match(CANONICAL_REGEX)?.[1];
  if (!canonical) {
    fail(`Missing canonical tag for URL: ${url}`);
  }

  if (normalizeComparableUrl(canonical) !== normalizeComparableUrl(url)) {
    fail(`Canonical mismatch for URL: ${url}, canonical is ${canonical}`);
  }
}

async function run() {
  const rootResponse = await fetchStrict(ROOT_SITEMAP_URL);
  const rootXml = await rootResponse.text();

  if (!rootXml.includes('<sitemapindex')) {
    fail('/sitemap.xml is not a sitemap index document.');
  }

  if (rootXml.includes('<urlset')) {
    fail('/sitemap.xml must not contain a urlset payload.');
  }

  const childSitemapUrls = extractLocs(rootXml);

  if (childSitemapUrls.length === 0) {
    fail('No child sitemap URLs found in /sitemap.xml.');
  }

  if (new Set(childSitemapUrls).size !== childSitemapUrls.length) {
    fail('Duplicate child sitemap URLs found in /sitemap.xml.');
  }

  for (const child of childSitemapUrls) {
    if (!EXPECTED_CHILD_SITEMAPS.has(child)) {
      fail(`Unexpected child sitemap URL in index: ${child}`);
    }
  }

  if (childSitemapUrls.length !== EXPECTED_CHILD_SITEMAPS.size) {
    fail('Sitemap index must include only sitemap-us.xml and sitemap-in.xml.');
  }

  const pageUrls = [];

  for (const childUrl of childSitemapUrls) {
    ensureAbsoluteHttps(childUrl);

    const childResponse = await fetchStrict(childUrl);
    const childXml = await childResponse.text();

    if (!childXml.includes('<urlset')) {
      fail(`Child sitemap is not a urlset document: ${childUrl}`);
    }

    const childPageUrls = extractLocs(childXml);
    if (childPageUrls.length === 0) {
      fail(`Child sitemap has no URLs: ${childUrl}`);
    }

    for (const pageUrl of childPageUrls) {
      if (pageUrls.includes(pageUrl)) {
        fail(`Duplicate page URL found across child sitemaps: ${pageUrl}`);
      }

      pageUrls.push(pageUrl);
    }
  }

  for (const pageUrl of pageUrls) {
    await validatePageUrl(pageUrl);
  }

  console.log(`✅ Sitemap validation passed for ${ROOT_SITEMAP_URL}`);
  console.log(`✅ Child sitemaps checked: ${childSitemapUrls.length}`);
  console.log(`✅ Page URLs checked: ${pageUrls.length}`);
}

run().catch((error) => {
  const allowNetworkFailure = process.env.SITEMAP_VALIDATION_ALLOW_NETWORK_FAILURE === '1';
  if (allowNetworkFailure && /fetch failed/i.test(error.message)) {
    console.warn(`⚠️ ${error.message} (skipped due to SITEMAP_VALIDATION_ALLOW_NETWORK_FAILURE=1)`);
    process.exit(0);
    return;
  }

  console.error(`❌ ${error.message}`);
  process.exit(1);
});
