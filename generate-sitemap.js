const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.financesphere.io';
const lastMod = new Date().toISOString();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${BASE_URL}/sitemap-us.xml</loc>\n    <lastmod>${lastMod}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${BASE_URL}/sitemap-in.xml</loc>\n    <lastmod>${lastMod}</lastmod>\n  </sitemap>\n</sitemapindex>\n`;

const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log(`Sitemap index generated at ${outputPath}`);
