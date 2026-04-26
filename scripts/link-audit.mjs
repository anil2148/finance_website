import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const blogDir = path.join(root, 'content/blog');
const redirectMap = JSON.parse(fs.readFileSync(path.join(root, 'content/audit/blog-redirect-map.json'), 'utf8'));
const financialProducts = JSON.parse(fs.readFileSync(path.join(root, 'data/financial-products.json'), 'utf8'));
const sitemapPath = path.join(root, 'public/sitemap.xml');

const codeExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.md', '.mdx', '.json']);
const ignoredDirs = new Set(['.git', '.next', 'node_modules']);
const ignoredFiles = new Set([
  'content/audit/blog-redirect-map.json',
  'content/audit/full-site-inventory-audit.json',
  'public/angular_16_plus.html',
  'public/docker_kubernetes_guide.html'
]);
const knownLearnClusters = new Set(['budgeting', 'credit-cards', 'investing', 'loans', 'passive-income', 'strategy-playbooks']);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function getAppStaticRoutes() {
  const appDir = path.join(root, 'app');
  const files = walk(appDir).filter((file) => file.endsWith('page.tsx') || file.endsWith('route.ts'));
  const routes = new Set(['/']);

  for (const file of files) {
    let rel = path.relative(appDir, file).replace(/\\/g, '/');
    rel = rel.replace(/\/page\.tsx$/, '').replace(/\/route\.ts$/, '');

    if (!rel) {
      routes.add('/');
      continue;
    }

    routes.add(`/${rel}`);
  }

  return [...routes].filter((route) => !/\[[^/]+\]/.test(route));
}

function getLiveBlogSlugs() {
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const { data } = matter(raw);
      return data.slug;
    })
    .filter(Boolean);
}

function getInternalLinks(file, source) {
  const links = [];
  const hrefRegex = /href\s*[:=]\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;
  const markdownRegex = /\]\((\/[^)\s]+)\)/g;

  let match;
  while ((match = hrefRegex.exec(source))) {
    const value = match[1] || match[2] || match[3];
    if (value?.startsWith('/')) links.push(value);
  }

  while ((match = markdownRegex.exec(source))) {
    const value = match[1];
    if (value?.startsWith('/')) links.push(value);
  }

  return links.map((href) => ({ file, href }));
}

function normalizeInternalPath(href) {
  const [withoutHash] = href.split('#');
  const [withoutQuery] = withoutHash.split('?');
  return withoutQuery.length > 1 ? withoutQuery.replace(/\/+$/, '') : withoutQuery;
}

function isKnownRoute(pathname, knownRoutes) {
  if (knownRoutes.has(pathname)) return true;

  if (pathname.startsWith('/learn/')) {
    const segment = pathname.slice('/learn/'.length).split('/')[0];
    return Boolean(segment) && knownLearnClusters.has(segment);
  }

  return (
    pathname.startsWith('/blog/') ||
    pathname.startsWith('/go/') ||
    pathname.startsWith('/blog/category/') ||
    pathname.startsWith('/blog/tag/') ||
    pathname.startsWith('/compare/credit-cards-for/') ||
    pathname.startsWith('/newsletter/confirm/')
  );
}

function hasRedirectLoop(entries) {
  const sourceToDestination = new Map(entries.map((entry) => [entry.source, entry.destination]));

  for (const [source] of sourceToDestination) {
    const seen = new Set([source]);
    let current = sourceToDestination.get(source);

    while (current && sourceToDestination.has(current)) {
      if (seen.has(current)) return true;
      seen.add(current);
      current = sourceToDestination.get(current);
    }
  }

  return false;
}

const staticRoutes = new Set(getAppStaticRoutes());
const liveBlogSlugs = new Set(getLiveBlogSlugs());
const redirectSources = new Set(redirectMap.map((entry) => entry.source));

const allFiles = walk(root)
  .filter((file) => codeExtensions.has(path.extname(file)))
  .map((file) => path.relative(root, file))
  .filter((file) => !ignoredFiles.has(file));

const placeholderPatterns = [
  /https?:\/\/(?:www\.)?example\.com\//i,
  /https?:\/\/(?:www\.)?placeholder\.com\//i,
  /javascript:void\(0\)/i,
  /href\s*=\s*['"]#['"]/i,
  /href\s*=\s*['"]\s*['"]/i
];

const placeholderIssues = [];
const linkIssues = [];

for (const file of allFiles) {
  const fullPath = path.join(root, file);
  const source = fs.readFileSync(fullPath, 'utf8');

  if (!file.includes('Newsletter') && !file.includes('ContactPageContent') && !file.includes('NewsletterSignup') && file !== 'public/js/offers-widget.js') {
    for (const pattern of placeholderPatterns) {
      if (pattern.test(source)) placeholderIssues.push(`${file} matches ${pattern}`);
    }
  }

  for (const { href } of getInternalLinks(file, source)) {
    if (href.includes('${')) continue;

    const normalized = normalizeInternalPath(href);

    if (!isKnownRoute(normalized, staticRoutes)) {
      linkIssues.push(`${file} -> ${href} (missing route)`);
      continue;
    }

    if (redirectSources.has(normalized)) {
      linkIssues.push(`${file} -> ${href} (links to redirect source; use canonical destination)`);
    }

    if (normalized.startsWith('/blog/')) {
      const slug = normalized.slice('/blog/'.length);
      if (slug && !slug.includes('/') && !liveBlogSlugs.has(slug) && !redirectSources.has(normalized)) {
        linkIssues.push(`${file} -> ${href} (blog slug missing)`);
      }
    }
  }
}

const goErrors = [];
const goIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

for (const product of financialProducts) {
  if (!goIdPattern.test(product.id)) {
    goErrors.push(`Invalid /go product id: ${product.id}`);
  }

  try {
    const url = new URL(product.affiliate_url);
    if (!['http:', 'https:'].includes(url.protocol)) {
      goErrors.push(`Invalid protocol for ${product.id}: ${product.affiliate_url}`);
    }
  } catch {
    goErrors.push(`Invalid affiliate_url for ${product.id}: ${product.affiliate_url}`);
  }
}

const knownRequiredSlugs = [
  'cc-aurora-cashback',
  'cc-voyager-rewards',
  'sav-evergreen-yield',
  'sav-horizon-plus',
  'mort-nova-fixed-30',
  'mort-metro-refi-15',
  'inv-wealthpilot-core',
  'inv-alphatrade-max'
];

for (const slug of knownRequiredSlugs) {
  if (!financialProducts.some((product) => product.id === slug)) {
    goErrors.push(`Missing required /go slug mapping: ${slug}`);
  }
}

const sitemapErrors = [];
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  for (const loc of locMatches) {
    const url = new URL(loc);
    const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;

    if (redirectSources.has(pathname)) {
      sitemapErrors.push(`Sitemap includes redirected URL: ${pathname}`);
    }

    if (pathname.startsWith('/blog/')) {
      const slug = pathname.slice('/blog/'.length);
      if (slug && !liveBlogSlugs.has(slug)) {
        sitemapErrors.push(`Sitemap includes non-live blog slug: ${pathname}`);
      }
    }
  }
}

const loopDetected = hasRedirectLoop(redirectMap);

if (loopDetected) {
  console.error('FAIL: redirect loop detected in blog redirect map');
  process.exitCode = 1;
}

if (placeholderIssues.length > 0) {
  console.error('FAIL: placeholder links found');
  for (const issue of placeholderIssues.slice(0, 50)) console.error(` - ${issue}`);
  process.exitCode = 1;
}

if (linkIssues.length > 0) {
  console.error('FAIL: broken/internal non-canonical links found');
  for (const issue of linkIssues.slice(0, 80)) console.error(` - ${issue}`);
  process.exitCode = 1;
}

if (goErrors.length > 0) {
  console.error('FAIL: /go mapping validation failed');
  for (const issue of goErrors) console.error(` - ${issue}`);
  process.exitCode = 1;
}

if (sitemapErrors.length > 0) {
  console.error('FAIL: sitemap validation failed');
  for (const issue of sitemapErrors.slice(0, 80)) console.error(` - ${issue}`);
  process.exitCode = 1;
}

if (!process.exitCode) {
  console.log('PASS: link audit complete (internal routes, placeholders, redirects, /go mappings, sitemap)');
}
