const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BASE_URL = 'https://www.financesphere.io';
const lastMod = new Date().toISOString().split('T')[0];
const blogDir = path.join(__dirname, 'content', 'blog');

const corePages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/calculators', changefreq: 'weekly', priority: '0.95' },
  { path: '/comparison', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools', changefreq: 'monthly', priority: '0.8' },
  { path: '/learn/investing', changefreq: 'weekly', priority: '0.8' },
  { path: '/learn/loans', changefreq: 'weekly', priority: '0.8' },
  { path: '/learn/credit-cards', changefreq: 'weekly', priority: '0.8' },
  { path: '/compare/mortgage-rate-comparison', changefreq: 'weekly', priority: '0.8' },
  { path: '/best-investment-apps', changefreq: 'weekly', priority: '0.8' },
  { path: '/best-savings-accounts-usa', changefreq: 'weekly', priority: '0.8' },
  { path: '/best-credit-cards-2026', changefreq: 'weekly', priority: '0.8' },
  { path: '/in', changefreq: 'weekly', priority: '0.9' },
  { path: '/in/blog', changefreq: 'weekly', priority: '0.82' },
  { path: '/in/blog/sip-vs-fd', changefreq: 'monthly', priority: '0.78' },
  { path: '/in/blog/ppf-vs-elss', changefreq: 'monthly', priority: '0.78' },
  { path: '/in/calculators/emi-calculator', changefreq: 'weekly', priority: '0.84' },
  { path: '/in/calculators/sip-calculator', changefreq: 'weekly', priority: '0.82' }
];

const calculatorPages = [
  'mortgage-calculator',
  'loan-calculator',
  'compound-interest-calculator',
  'retirement-calculator',
  'fire-calculator',
  'net-worth-calculator',
  'investment-growth-calculator',
  'savings-goal-calculator',
  'debt-payoff-calculator',
  'debt-snowball-calculator',
  'debt-avalanche-calculator',
  'credit-card-payoff-calculator',
  'student-loan-calculator',
  'auto-loan-calculator',
  'salary-after-tax-calculator',
  'budget-planner'
].map((slug) => ({
  path: `/calculators/${slug}`,
  changefreq: 'weekly',
  priority: '0.85'
}));

function getBlogPages() {
  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const { data } = matter(raw);
      if (!data.slug || !data.date || data.slug.startsWith('seo-')) return null;

      return {
        path: `/blog/${data.slug}`,
        changefreq: 'monthly',
        priority: '0.72',
        lastmod: (data.updatedAt ?? data.date).toString().slice(0, 10)
      };
    })
    .filter(Boolean);
}

const pages = [
  ...corePages,
  ...calculatorPages,
  ...getBlogPages()
];

function canonicalUrl(pagePath) {
  if (pagePath === '/') return `${BASE_URL}/`;
  return `${BASE_URL}${pagePath.replace(/\/+$/, '')}`;
}

const xmlUrls = pages
  .map(
    ({ path: pagePath, changefreq, priority, lastmod: entryLastMod }) =>
      `  <url>\n    <loc>${canonicalUrl(pagePath)}</loc>\n    <lastmod>${entryLastMod ?? lastMod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls}\n</urlset>\n`;

const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log(`Sitemap generated at ${outputPath}`);
