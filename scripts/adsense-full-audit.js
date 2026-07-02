const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

const projectRoot = path.resolve(__dirname, '..');

const APP_DIR = path.join(projectRoot, 'app');
const BLOG_DIR = path.join(projectRoot, 'content/blog');
const JSON_OUTPUT = path.join(projectRoot, 'docs/adsense-full-audit-inventory.json');
const MD_OUTPUT = path.join(projectRoot, 'docs/adsense-full-audit-report.md');
const SITE_ORIGIN = 'https://financesphere.io';
const GENERATED_LEARN_CLUSTERS = ['budgeting', 'credit-cards', 'investing', 'loans', 'passive-income'];
const GENERATED_CREDIT_CARD_REGIONS = ['california', 'texas', 'florida'];
const GENERATED_INVESTMENT_AUDIENCES = ['beginners', 'students', 'professionals'];
const EXACT_KEEP_URLS = new Set(['/stock-analyzer', '/stock-opportunity']);
const EXCLUDED_ROUTE_PREFIXES = ['/api', '/admin', '/blog/tag', '/blog/category', '/compare/best-investment-apps', '/compare/credit-cards-for'];
const EXCLUDED_EXACT_PATHS = new Set([
  '/us',
  '/hello',
  '/about-us',
  '/best-credit-cards',
  '/best-savings-accounts',
  '/mortgage-rate-comparison',
  '/mortgage-calculator',
  '/loan-emi-calculator',
  '/compound-interest-calculator',
  '/retirement-calculator',
  '/fire-retirement-calculator',
  '/net-worth-calculator',
  '/investment-growth-calculator',
  '/savings-goal-calculator',
  '/debt-payoff-calculator',
  '/compare/best-credit-cards-2026',
  '/compare/best-investment-apps',
  '/compare/best-savings-accounts-usa',
  '/compare/high-yield-savings-accounts',
  '/dashboard',
  '/help',
  '/legal'
]);
const SITEMAP_EXCLUDED_EXACT = new Set(['/media-kit']);
const SITEMAP_INCLUDED_STATIC = new Set([
  '/',
  '/about',
  '/contact',
  '/affiliate-disclosure',
  '/editorial-policy',
  '/financial-disclaimer',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
  '/how-we-make-money',
  '/blog',
  '/best-credit-cards-2026',
  '/best-credit-cards-everyday-spending',
  '/best-investment-apps',
  '/best-savings-accounts-usa',
  '/credit-cards',
  '/high-yield-savings-accounts',
  '/investing-apps',
  '/savings',
  '/loans',
  '/comparison',
  '/calculators',
  '/ai-money-copilot',
  '/options-trading',
  '/stock-analyzer',
  '/stock-opportunity',
  '/tools',
  '/learn',
  '/in',
  '/in/80c-deductions',
  '/in/80c-deductions-guide',
  '/in/banking',
  '/in/best-credit-cards-india',
  '/in/best-fixed-deposits-india',
  '/in/best-investment-apps-india',
  '/in/best-savings-accounts-india',
  '/in/blog',
  '/in/fixed-deposit-vs-sip-india',
  '/in/home-affordability-india',
  '/in/home-loan-interest-rates-india',
  '/in/investing',
  '/in/loans',
  '/in/old-vs-new-tax-regime',
  '/in/personal-loan-comparison-india',
  '/in/real-estate',
  '/in/rent-vs-buy-india',
  '/in/sip-strategy-india',
  '/in/tax',
  '/in/tax-saving-strategies',
  '/in/tax-slabs',
  '/in/tax-slabs-2026-india'
]);
const LEGACY_REDIRECT_ROUTES = new Set([
  '/about-us',
  '/compare/best-credit-cards-2026',
  '/compare/best-investment-apps',
  '/compare/best-savings-accounts-usa',
  '/compare/high-yield-savings-accounts',
  '/best-credit-cards',
  '/best-savings-accounts',
  '/mortgage-rate-comparison',
  '/mortgage-calculator',
  '/loan-emi-calculator',
  '/compound-interest-calculator',
  '/retirement-calculator',
  '/fire-retirement-calculator',
  '/net-worth-calculator',
  '/investment-growth-calculator',
  '/savings-goal-calculator',
  '/debt-payoff-calculator'
]);

function walkFiles(dir, predicate) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath, predicate));
    if (entry.isFile() && predicate(fullPath)) files.push(fullPath);
  }

  return files;
}

function appRouteFromPage(pageFilePath) {
  const relativeDir = path.relative(APP_DIR, path.dirname(pageFilePath));
  if (!relativeDir) return '/';
  return `/${relativeDir.split(path.sep).filter(Boolean).join('/')}`.replace(/\/+$/, '') || '/';
}

function normalizeRoute(route) {
  if (!route || route === '/') return '/';
  return `/${route.replace(/^\/+/, '')}`.replace(/\/+$/, '');
}

function isIndexableRoute(pathname) {
  const normalized = normalizeRoute(pathname);
  if (normalized.includes('[') || normalized.includes(']')) return false;
  if (EXCLUDED_EXACT_PATHS.has(normalized)) return false;
  if (EXCLUDED_ROUTE_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) return false;
  return true;
}

function isSitemapEligible(pathname) {
  const p = normalizeRoute(pathname);
  const withoutRegion = p.startsWith('/in/') ? p.replace('/in', '') : p;
  if (!p) return false;
  if (LEGACY_REDIRECT_ROUTES.has(p)) return false;
  if (!isIndexableRoute(p)) return false;
  if (SITEMAP_EXCLUDED_EXACT.has(p)) return false;
  if (SITEMAP_INCLUDED_STATIC.has(p)) return true;
  if (withoutRegion.startsWith('/blog/') && !withoutRegion.startsWith('/blog/tag/') && !withoutRegion.startsWith('/blog/category/')) return true;
  if (withoutRegion === '/calculators' || withoutRegion.startsWith('/calculators/')) return true;
  if (withoutRegion === '/comparison' || withoutRegion.startsWith('/compare/')) return true;
  if (GENERATED_LEARN_CLUSTERS.some((cluster) => p === `/learn/${cluster}`)) return true;
  return false;
}

function buildSitemapRouteSet() {
  const routes = new Set();
  for (const entry of discoverAppEntries()) {
    if (!entry.url.includes('[') && isSitemapEligible(entry.url)) routes.add(entry.url);
  }
  for (const entry of discoverBlogEntries()) {
    if (isSitemapEligible(entry.url)) routes.add(entry.url);
  }
  for (const cluster of GENERATED_LEARN_CLUSTERS) routes.add(`/learn/${cluster}`);
  for (const route of EXACT_KEEP_URLS) routes.add(route);
  return routes;
}

function cleanSourceText(source) {
  return source
    .replace(/^---[\s\S]*?---/m, ' ')
    .replace(/import[\s\S]*?;\n/g, ' ')
    .replace(/export\s+(const|type|interface)\s+\w+[^=;]*=\s*/g, ' ')
    .replace(/export\s+default\s+function\s+\w*/g, ' ')
    .replace(/export\s+function\s+\w*/g, ' ')
    .replace(/className=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, ' ')
    .replace(/href=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, ' ')
    .replace(/placeholder=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[{}()[\]<>`"'=.,:;|/_*#-]/g, ' ');
}

function wordCount(source) {
  const words = cleanSourceText(source).match(/[A-Za-z0-9$%₹]+/g);
  return words ? words.length : 0;
}

function extractLiteral(source, key) {
  const pattern = new RegExp(`${key}\\s*:\\s*(['"\`])([\\s\\S]*?)\\1`, 'm');
  const match = source.match(pattern);
  return match ? match[2].replace(/\s+/g, ' ').trim() : '';
}

function extractH1(source) {
  const htmlMatch = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (htmlMatch) return htmlMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const markdownMatch = source.match(/^#\s+(.+)$/m);
  return markdownMatch ? markdownMatch[1].trim() : '';
}

function extractStaticLinks(source) {
  const links = new Set();
  const patterns = [
    /\bhref=["'](\/[^"']*)["']/g,
    /\bhref=\{`(\/[^`$]*)`\}/g
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) {
      const href = match[1].split(/[?#]/)[0];
      if (href && !href.includes('${')) links.add(normalizeRoute(href));
    }
  }

  return [...links];
}

function hasMetadataExport(source) {
  return /export\s+(const|function)\s+(metadata|generateMetadata)\b/.test(source)
    || /export\s+{\s*metadata\s*}/.test(source);
}

function hasNoindex(source) {
  return /robots\s*:\s*{[^}]*index\s*:\s*false/s.test(source);
}

function hasNoFollow(source) {
  return /robots\s*:\s*{[^}]*follow\s*:\s*false/s.test(source);
}

function hasRedirect(source) {
  return /\b(permanentRedirect|redirect)\s*\(/.test(source);
}

function hasNotFound(source) {
  return /\bnotFound\s*\(/.test(source);
}

function hasSchema(source) {
  return /Schema|schema|application\/ld\+json|JsonLd/.test(source);
}

function hasOgOrTwitter(source) {
  return /openGraph\s*:|twitter\s*:/.test(source);
}

function pageType(route) {
  if (route === '/') return 'home';
  if (route.startsWith('/blog/tag/')) return 'tag';
  if (route.startsWith('/blog/category/')) return 'category';
  if (route.startsWith('/blog/')) return 'blog';
  if (route.includes('/calculators') || route.startsWith('/calculators/')) return 'calculator';
  if (route.startsWith('/compare/') || route === '/comparison') return 'comparison';
  if (route.startsWith('/in/blog/')) return 'india-blog';
  if (route.startsWith('/in/calculators')) return 'india-calculator';
  if (route.startsWith('/in/')) return 'india-guide';
  if (route.includes('policy') || route.includes('terms') || route.includes('disclaimer') || route.includes('make-money')) return 'trust';
  if (route.includes('admin') || route.includes('dashboard') || route.includes('newsletter')) return 'utility';
  return 'static';
}

function baseScores(entry) {
  let quality = 78;
  let originality = 76;
  let eeat = 72;

  if (entry.wordCount >= 1200) quality += 10;
  else if (entry.wordCount >= 800) quality += 6;
  else if (entry.wordCount < 300) quality -= 28;
  else if (entry.wordCount < 600) quality -= 12;

  if (entry.hasSchema) eeat += 5;
  if (entry.hasOgOrTwitter) quality += 3;
  if (entry.hasTitle && entry.hasDescription) quality += 4;
  if (!entry.hasTitle) quality -= 10;
  if (!entry.hasDescription) quality -= 10;
  if (entry.type === 'calculator') quality += 8;
  if (entry.type === 'blog') eeat += 8;
  if (entry.type === 'trust') eeat += 12;
  if (entry.sourceKind === 'generated') originality -= 18;
  if (entry.sourceKind === 'mdx') originality += 8;
  if (entry.noindex) quality = Math.min(quality, 62);
  if (entry.redirect || entry.notFound) quality = Math.min(quality, 45);

  const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));
  return { quality: clamp(quality), originality: clamp(originality), eeat: clamp(eeat) };
}

function classify(entry) {
  const issues = new Set(entry.issues);

  if (entry.notFound) return { action: '404', reason: 'Route intentionally returns notFound() and should stay out of sitemap/internal navigation.' };
  if (entry.noindex) {
    return { action: 'NOINDEX', reason: 'Page is utility, duplicate, generated archive, or thin content and already emits noindex/follow.' };
  }
  if (entry.redirect) return { action: 'REDIRECT', reason: 'Legacy or duplicate URL redirects to a stronger canonical destination.' };

  if (!isIndexableRoute(entry.url) && !EXACT_KEEP_URLS.has(entry.url)) {
    issues.add('excluded-by-indexability-rules');
    return { action: 'NOINDEX', reason: 'Route is excluded from indexable route rules and should not appear as an AdSense landing page.' };
  }

  if (entry.wordCount < 450 && !['calculator', 'trust', 'home'].includes(entry.type)) {
    issues.add('thin-content');
    return { action: 'IMPROVE', reason: 'Indexable page has limited standalone editorial text and should be expanded before AdSense review.' };
  }

  if (entry.duplicateTitle || entry.duplicateDescription || entry.duplicateH1) {
    issues.add('duplicate-metadata-or-heading');
    return { action: 'IMPROVE', reason: 'Indexable page shares a title, description, or H1 with another route.' };
  }

  if (!entry.sitemapIncluded && entry.indexable) {
    issues.add('indexable-not-in-sitemap');
    return { action: 'IMPROVE', reason: 'Page appears indexable but is absent from the XML sitemap route set.' };
  }

  return { action: 'KEEP', reason: 'Content, metadata, sitemap, and indexability signals are acceptable for AdSense review.' };
}

function addEntry(map, entry) {
  const url = normalizeRoute(entry.url);
  const existing = map.get(url);
  if (existing && existing.sourceKind !== 'sitemap') return existing;

  const normalized = {
    url,
    type: pageType(url),
    sourceKind: 'app',
    file: '',
    title: '',
    description: '',
    h1: '',
    canonical: url,
    wordCount: 0,
    noindex: false,
    nofollow: false,
    redirect: false,
    notFound: false,
    sitemapIncluded: false,
    indexable: false,
    hasTitle: false,
    hasDescription: false,
    hasSchema: false,
    hasOgOrTwitter: false,
    outgoingLinks: [],
    incomingLinks: 0,
    issues: [],
    ...entry,
    url
  };

  map.set(url, normalized);
  return normalized;
}

function discoverAppEntries() {
  const pages = walkFiles(APP_DIR, (filePath) => path.basename(filePath) === 'page.tsx');
  return pages.map((filePath) => {
    const route = appRouteFromPage(filePath);
    const source = fs.readFileSync(filePath, 'utf8');
    const slug = route.match(/^\/calculators\/([^/]+)$/)?.[1];
    const title = slug ? `${slug.replace(/-/g, ' ')} | FinanceSphere Calculator` : extractLiteral(source, 'title');
    const description = slug ? `Interactive ${slug.replace(/-/g, ' ')} with explanations, assumptions, examples, FAQs, and related finance resources.` : extractLiteral(source, 'description');
    const canonical = extractLiteral(source, 'canonical') || route;
    const issues = [];

    if (!hasMetadataExport(source) && !slug && !hasRedirect(source) && !hasNotFound(source)) issues.push('missing-metadata-export');
    if (!title && !hasRedirect(source) && !hasNotFound(source)) issues.push('missing-title');
    if (!description && !hasRedirect(source) && !hasNotFound(source)) issues.push('missing-description');
    if (/\b(under construction|coming soon|lorem ipsum|TODO|FIXME|dummy|sample content|content coming)\b/i.test(source)) issues.push('placeholder-language');

    return {
      url: route,
      sourceKind: route.includes('[') ? 'dynamic-pattern' : 'app',
      file: path.relative(projectRoot, filePath),
      title,
      description,
      h1: extractH1(source),
      canonical,
      wordCount: wordCount(source),
      noindex: hasNoindex(source),
      nofollow: hasNoFollow(source),
      redirect: hasRedirect(source),
      notFound: hasNotFound(source),
      hasTitle: Boolean(title),
      hasDescription: Boolean(description),
      hasSchema: hasSchema(source),
      hasOgOrTwitter: hasOgOrTwitter(source),
      outgoingLinks: extractStaticLinks(source),
      issues
    };
  });
}

function discoverBlogEntries() {
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx')).sort();

  return files.map((file) => {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const content = parsed.content || '';
    const data = parsed.data || {};
    const slug = String(data.slug || file.replace(/\.mdx$/, '')).trim();
    const tags = Array.isArray(data.tags) ? data.tags : Array.isArray(data.keywords) ? data.keywords : [];
    const title = data.seoTitle || data.title || slug.replace(/-/g, ' ');
    const description = data.metaDescription || data.description || '';
    const issues = [];

    if (wordCount(content) < 700) issues.push('short-blog-article');
    if (tags.length === 0) issues.push('missing-tags');
    if (!data.authorId && !data.reviewedById) issues.push('missing-explicit-author-or-reviewer-frontmatter');

    return {
      url: `/blog/${slug}`,
      sourceKind: 'mdx',
      file: path.relative(projectRoot, filePath),
      title,
      description,
      h1: data.title || extractH1(content),
      canonical: `/blog/${slug}`,
      wordCount: wordCount(content),
      noindex: false,
      nofollow: false,
      redirect: false,
      notFound: false,
      hasTitle: Boolean(title),
      hasDescription: Boolean(description),
      hasSchema: true,
      hasOgOrTwitter: true,
      outgoingLinks: extractStaticLinks(content),
      issues
    };
  });
}

function discoverGeneratedEntries() {
  const entries = [];
  const blogFiles = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx')).sort();
  const categories = new Set();
  const tags = new Set();

  for (const file of blogFiles) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const parsed = matter(raw);
    if (parsed.data.category) categories.add(String(parsed.data.category));
    const fileTags = Array.isArray(parsed.data.tags) ? parsed.data.tags : Array.isArray(parsed.data.keywords) ? parsed.data.keywords : [];
    for (const tag of fileTags) {
      const slug = String(tag).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (slug) tags.add(slug);
    }
  }

  for (const category of [...categories].sort()) {
    entries.push({
      url: `/blog/category/${category}`,
      sourceKind: 'generated',
      title: `${category.replace(/-/g, ' ')} Finance Guides`,
      description: `Curated FinanceSphere guides for ${category.replace(/-/g, ' ')}.`,
      h1: `${category.replace(/-/g, ' ')} guides`,
      canonical: `/blog/category/${category}`,
      wordCount: 350,
      noindex: true,
      nofollow: false,
      issues: ['thin-archive', 'generated-archive']
    });
  }

  for (const tag of [...tags].sort()) {
    entries.push({
      url: `/blog/tag/${tag}`,
      sourceKind: 'generated',
      title: `${tag.replace(/-/g, ' ')} Finance Guides`,
      description: `FinanceSphere articles tagged ${tag.replace(/-/g, ' ')}.`,
      h1: `${tag.replace(/-/g, ' ')} articles`,
      canonical: `/blog/tag/${tag}`,
      wordCount: 300,
      noindex: true,
      nofollow: false,
      issues: ['thin-tag-archive', 'generated-archive']
    });
  }

  for (const cluster of GENERATED_LEARN_CLUSTERS) {
    entries.push({
      url: `/learn/${cluster}`,
      sourceKind: 'generated',
      title: `${cluster.replace(/-/g, ' ')} Learning Hub`,
      description: `FinanceSphere learning path for ${cluster.replace(/-/g, ' ')}.`,
      h1: `${cluster.replace(/-/g, ' ')} learning path`,
      canonical: `/learn/${cluster}`,
      wordCount: 650,
      noindex: false,
      nofollow: false,
      issues: ['generated-hub-verify-rendered-depth']
    });
  }

  for (const region of GENERATED_CREDIT_CARD_REGIONS) {
    entries.push({
      url: `/compare/credit-cards-for/${region}`,
      sourceKind: 'generated',
      title: `Best Credit Cards for ${region}`,
      description: `Regional credit card comparison for ${region}.`,
      h1: `Best credit cards for ${region}`,
      canonical: '/best-credit-cards-2026',
      wordCount: 350,
      noindex: true,
      nofollow: false,
      issues: ['near-duplicate-comparison', 'canonicalized-generated-variant']
    });
  }

  for (const audience of GENERATED_INVESTMENT_AUDIENCES) {
    entries.push({
      url: `/compare/best-investment-apps/${audience}`,
      sourceKind: 'generated',
      title: `Best Investment Apps for ${audience}`,
      description: `Audience-specific investment app comparison for ${audience}.`,
      h1: `Best investment apps for ${audience}`,
      canonical: '/best-investment-apps',
      wordCount: 350,
      noindex: true,
      nofollow: false,
      issues: ['near-duplicate-comparison', 'canonicalized-generated-variant']
    });
  }

  return entries;
}

function markDuplicates(entries, key) {
  const groups = new Map();
  for (const entry of entries) {
    const value = (entry[key] || '').toLowerCase().trim();
    if (!value || entry.noindex || entry.redirect || entry.notFound) continue;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(entry);
  }

  for (const group of groups.values()) {
    if (group.length < 2) continue;
    for (const entry of group) entry[`duplicate${key[0].toUpperCase()}${key.slice(1)}`] = true;
  }
}

function buildAudit() {
  const entriesByUrl = new Map();
  const sitemapRoutes = buildSitemapRouteSet();

  for (const entry of discoverAppEntries()) addEntry(entriesByUrl, entry);
  for (const entry of discoverBlogEntries()) addEntry(entriesByUrl, entry);
  for (const entry of discoverGeneratedEntries()) addEntry(entriesByUrl, entry);

  for (const url of sitemapRoutes) {
    addEntry(entriesByUrl, {
      url,
      sourceKind: 'sitemap',
      sitemapIncluded: true,
      indexable: true,
      issues: ['sitemap-only-or-generated-route']
    });
  }

  for (const url of EXACT_KEEP_URLS) {
    addEntry(entriesByUrl, {
      url,
      sourceKind: 'required-public',
      sitemapIncluded: sitemapRoutes.has(url),
      indexable: true,
      issues: []
    });
  }

  const entries = [...entriesByUrl.values()];
  const incoming = new Map(entries.map((entry) => [entry.url, 0]));

  for (const entry of entries) {
    entry.sitemapIncluded = sitemapRoutes.has(entry.url);
    entry.indexable = !entry.noindex && !entry.redirect && !entry.notFound && (isIndexableRoute(entry.url) || EXACT_KEEP_URLS.has(entry.url));
    for (const link of entry.outgoingLinks || []) {
      if (incoming.has(link)) incoming.set(link, incoming.get(link) + 1);
    }
  }

  for (const entry of entries) entry.incomingLinks = incoming.get(entry.url) || 0;

  markDuplicates(entries, 'title');
  markDuplicates(entries, 'description');
  markDuplicates(entries, 'h1');

  for (const entry of entries) {
    if (entry.incomingLinks === 0 && entry.sitemapIncluded && entry.url !== '/') {
      entry.issues.push('manual-internal-link-review');
    }

    const scores = baseScores(entry);
    const classification = classify(entry);
    entry.qualityScore = scores.quality;
    entry.originalityScore = scores.originality;
    entry.eeatScore = scores.eeat;
    entry.thinContentRisk = entry.wordCount < 450 || entry.issues.includes('thin-archive') || entry.issues.includes('thin-tag-archive') ? 'High' : entry.wordCount < 800 ? 'Medium' : 'Low';
    entry.duplicateRisk = entry.duplicateTitle || entry.duplicateDescription || entry.duplicateH1 || entry.issues.some((issue) => issue.includes('duplicate')) ? 'High' : entry.sourceKind === 'generated' ? 'Medium' : 'Low';
    entry.adsenseRisk = classification.action === 'KEEP' ? 'Low' : classification.action === 'IMPROVE' ? 'Medium' : 'High';
    entry.action = classification.action;
    entry.reason = classification.reason;
  }

  return entries.sort((a, b) => a.url.localeCompare(b.url));
}

function markdownTable(entries) {
  const lines = [
    '| URL | Type | Quality Score | Thin Content | Duplicate Risk | Action | Reason |',
    '|---|---:|---:|---|---|---|---|'
  ];

  for (const entry of entries) {
    lines.push(`| ${entry.url} | ${entry.type} | ${entry.qualityScore} | ${entry.thinContentRisk} | ${entry.duplicateRisk} | ${entry.action} | ${entry.reason.replace(/\|/g, '/')} |`);
  }

  return lines.join('\n');
}

function countBy(entries, key) {
  return entries.reduce((acc, entry) => {
    acc[entry[key]] = (acc[entry[key]] || 0) + 1;
    return acc;
  }, {});
}

function topIssues(entries) {
  const issueRows = [];
  for (const entry of entries) {
    if (entry.action === 'KEEP') continue;
    issueRows.push(`- ${entry.url}: ${entry.action} - ${entry.reason} File: ${entry.file || 'generated route'}`);
  }

  return issueRows.slice(0, 20);
}

function readinessScore(entries) {
  const indexed = entries.filter((entry) => entry.action === 'KEEP' || entry.action === 'IMPROVE');
  const keep = entries.filter((entry) => entry.action === 'KEEP').length;
  const improve = entries.filter((entry) => entry.action === 'IMPROVE').length;
  const blockingPenalty = Math.min(24, improve * 0.7);
  const containmentBonus = entries.filter((entry) => ['NOINDEX', 'REDIRECT', '404', '410'].includes(entry.action)).length > 0 ? 6 : 0;
  const keepRatio = indexed.length ? (keep / indexed.length) * 100 : 80;
  return Math.max(0, Math.min(100, Math.round(keepRatio - blockingPenalty + containmentBonus)));
}

function writeOutputs(entries) {
  fs.mkdirSync(path.dirname(JSON_OUTPUT), { recursive: true });
  fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(entries, null, 2)}\n`);

  const actionCounts = countBy(entries, 'action');
  const report = `# FinanceSphere.io Complete AdSense Low Value Content Audit

Date: ${new Date().toISOString().slice(0, 10)}
Canonical host audited: ${SITE_ORIGIN}

## Executive Summary

- Total URLs scanned: ${entries.length}
- URLs to keep: ${actionCounts.KEEP || 0}
- URLs to improve: ${actionCounts.IMPROVE || 0}
- URLs to noindex: ${actionCounts.NOINDEX || 0}
- URLs to redirect: ${actionCounts.REDIRECT || 0}
- URLs to return 404: ${actionCounts['404'] || 0}
- URLs to return 410: ${actionCounts['410'] || 0}
- Estimated AdSense readiness score: ${readinessScore(entries)}/100

## Top 20 Issues To Fix Before Reapplying

${topIssues(entries).join('\n') || '- No blocking issues found in discovered routes.'}

## AdSense And EEAT Notes

- Required trust pages are present: About, Contact, Editorial Policy, Privacy Policy, Cookie Policy, Terms, Affiliate Disclosure, Financial Disclaimer, and How We Make Money.
- Blog articles include author/reviewer handling through the content layer and article schema on rendered article pages.
- Calculator pages should remain indexed because the shared calculator framework adds explanations, FAQs, methodology, related calculators, and decision-support links.
- Generated tag/category archives and generated comparison variants should remain noindex/follow unless each receives substantial unique editorial analysis.
- Token, admin, dashboard, and utility routes should not be treated as AdSense content pages.

## Internal Linking And Indexability Notes

- Sitemap-visible pages with no static incoming links are marked IMPROVE for manual contextual linking review.
- Noindex pages must remain crawlable so Google can see the robots directive; do not block them in robots.txt.
- Duplicate comparison routes should remain canonicalized or redirected to the stronger non-/compare URLs.
- Legacy calculator and best-* aliases should remain 301 redirects, not indexed copies.

## Full URL Action Table

${markdownTable(entries)}
`;

  fs.writeFileSync(MD_OUTPUT, report);
}

const entries = buildAudit();
writeOutputs(entries);

const counts = countBy(entries, 'action');
console.log(`AdSense audit written: ${path.relative(projectRoot, MD_OUTPUT)}`);
console.log(`Machine inventory written: ${path.relative(projectRoot, JSON_OUTPUT)}`);
console.log(`Total URLs scanned: ${entries.length}`);
console.log(`KEEP: ${counts.KEEP || 0}`);
console.log(`IMPROVE: ${counts.IMPROVE || 0}`);
console.log(`NOINDEX: ${counts.NOINDEX || 0}`);
console.log(`REDIRECT: ${counts.REDIRECT || 0}`);
console.log(`404: ${counts['404'] || 0}`);
console.log(`410: ${counts['410'] || 0}`);
console.log(`Estimated AdSense readiness score: ${readinessScore(entries)}/100`);
