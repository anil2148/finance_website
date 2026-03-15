const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://financesphere.io';
const lastMod = new Date().toISOString().split('T')[0];

const pages = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/calculators', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools', changefreq: 'monthly', priority: '0.8' },
  { path: '/dashboard', changefreq: 'monthly', priority: '0.8' },
  { path: '/comparison', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'monthly', priority: '0.8' },
  { path: '/mortgage-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/loan-emi-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/compound-interest-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/retirement-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/fire-retirement-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/net-worth-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/investment-growth-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/savings-goal-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/debt-payoff-calculator', changefreq: 'weekly', priority: '0.9' },
];

const xmlUrls = pages
  .map(
    ({ path: pagePath, changefreq, priority }) => `  <url>\n    <loc>${BASE_URL}${pagePath}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls}\n</urlset>\n`;

const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log(`Sitemap generated at ${outputPath}`);
