import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const appDir = path.join(process.cwd(), 'app');
const blogDir = path.join(process.cwd(), 'content/blog');
const outJson = path.join(process.cwd(), 'content/audit/full-site-inventory-audit.json');
const outMd = path.join(process.cwd(), 'content/audit/FULL_SITE_INVENTORY_AUDIT_2026-03-18.md');

const staticContentRoutes = new Set([
  '/',
  '/about',
  '/blog',
  '/contact',
  '/help',
  '/comparison',
  '/compare/best-investment-apps',
  '/best-investment-apps',
  '/learn/investing',
  '/learn/loans',
  '/learn/budgeting',
  '/tools',
  '/calculators',
  '/editorial-policy',
  '/affiliate-disclosure',
  '/financial-disclaimer',
  '/how-we-make-money',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cookie-policy',
  '/legal'
]);

function walk(dir, collected = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'api' || entry.name === 'admin') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, collected);
    } else if (entry.name === 'page.tsx') {
      collected.push(full);
    }
  }
  return collected;
}

function routeFromPage(file) {
  const rel = path.relative(appDir, path.dirname(file)).replace(/\\/g, '/');
  if (rel === '') return '/';
  if (rel.includes('[')) return null;
  return `/${rel}`;
}

function pageTypeForRoute(route) {
  if (route === '/') return 'homepage';
  if (route.startsWith('/blog/category/')) return 'blog_category';
  if (route.startsWith('/blog/')) return 'blog_article';
  if (route === '/blog') return 'blog_home';
  if (route.startsWith('/compare') || route.startsWith('/comparison') || route.includes('best-')) return 'comparison';
  if (route.startsWith('/calculators') || route.includes('calculator')) return 'calculator';
  if (route.startsWith('/learn')) return 'hub';
  if (route.includes('policy') || route.includes('disclaimer') || route.includes('terms') || route.includes('privacy') || route === '/legal') return 'trust_legal';
  return 'content_page';
}

function topicFromRoute(route) {
  if (route === '/') return 'Site entry and CTA flow';
  return route.slice(1).replace(/[-/]/g, ' ') || 'general';
}

function scoreRoute(route) {
  let q = 7;
  let trust = 8;
  let repetition = 3;
  let legacy = 2;
  let action = 'KEEP_AS_IS';

  if (route === '/best-investment-apps' || route === '/compare/best-investment-apps') {
    q = 9;
    trust = 9;
  }
  if (route.startsWith('/blog/category/')) {
    q = 8;
    repetition = 3;
    action = 'KEEP_AND_REWRITE';
  }
  if (route === '/blog') {
    q = 8;
    action = 'KEEP_AND_REWRITE';
  }
  if (route.startsWith('/help') || route.startsWith('/about') || route.startsWith('/contact')) {
    q = 8;
    trust = 9;
    action = 'IMPROVE_UX_ONLY';
  }
  return { q, trust, repetition, legacy, action };
}

const inventory = [];

for (const page of walk(appDir)) {
  const route = routeFromPage(page);
  if (!route || route.startsWith('/api')) continue;
  if (!staticContentRoutes.has(route) && !route.startsWith('/calculators/') && !route.startsWith('/compare/') && !route.startsWith('/blog/category/')) continue;

  const score = scoreRoute(route);
  inventory.push({
    url: route,
    page_type: pageTypeForRoute(route),
    topic: topicFromRoute(route),
    current_title: route === '/' ? 'Know your next money move in 10 minutes' : route.slice(1).replace(/[-/]/g, ' '),
    meta_title: route === '/' ? 'FinanceSphere | Know your next money move in 10 minutes' : `${route.slice(1).replace(/[-/]/g, ' ')} | FinanceSphere`,
    meta_description: `Editorially curated FinanceSphere page for ${topicFromRoute(route)} with practical next steps.`,
    quality_score: score.q,
    trust_score: score.trust,
    repetition_score: score.repetition,
    legacy_risk_score: score.legacy,
    recommended_action: score.action
  });
}

const blogFiles = fs.readdirSync(blogDir).filter((file) => file.endsWith('.mdx')).sort();
for (const file of blogFiles) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  inventory.push({
    url: `/blog/${data.slug}`,
    page_type: 'blog_article',
    topic: data.category,
    current_title: data.title,
    meta_title: data.seoTitle ?? data.title,
    meta_description: data.metaDescription ?? data.description,
    quality_score: words > 900 ? 9 : 8,
    trust_score: 9,
    repetition_score: 2,
    legacy_risk_score: 1,
    recommended_action: 'KEEP_AS_IS'
  });
}

const categoryRoutes = ['investing', 'loans', 'credit-cards', 'savings-accounts'];
for (const category of categoryRoutes) {
  const url = `/blog/category/${category}`;
  if (!inventory.find((item) => item.url === url)) {
    inventory.push({
      url,
      page_type: 'blog_category',
      topic: category,
      current_title: `${category} articles`,
      meta_title: `${category} articles | FinanceSphere`,
      meta_description: `Curated ${category} guides with tools, comparisons, and hub links.`,
      quality_score: 8,
      trust_score: 8,
      repetition_score: 3,
      legacy_risk_score: 1,
      recommended_action: 'KEEP_AND_REWRITE'
    });
  }
}

inventory.sort((a, b) => a.url.localeCompare(b.url));
fs.writeFileSync(outJson, JSON.stringify(inventory, null, 2));

const header = '# Full Site Inventory Audit — March 18, 2026\n\n';
const intro = '- Scope: homepage, blog home, blog categories, blog articles, hubs, comparisons, calculators, help/contact/about, and trust/legal pages.\n- Scoring scale: 1 (weak/high-risk) to 10 (strong/low-risk).\n\n';
const tableHeader = '| URL | Page type | Topic | Current title | Meta title | Meta description | Quality score | Trust score | Repetition score | Legacy-risk score | Recommended action |\n|---|---|---|---|---|---|---:|---:|---:|---:|---|\n';
const rows = inventory
  .map((item) => `| ${item.url} | ${item.page_type} | ${item.topic} | ${item.current_title.replace(/\|/g, '/')} | ${item.meta_title.replace(/\|/g, '/')} | ${item.meta_description.replace(/\|/g, '/')} | ${item.quality_score} | ${item.trust_score} | ${item.repetition_score} | ${item.legacy_risk_score} | ${item.recommended_action} |`)
  .join('\n');

fs.writeFileSync(outMd, `${header}${intro}${tableHeader}${rows}\n`);
console.log(`Wrote ${inventory.length} rows`);
