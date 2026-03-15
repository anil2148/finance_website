import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const blogDir = path.join(process.cwd(), 'content', 'blog');

function regenerateSitemap() {
  // SEO ops: auto-refresh sitemap whenever blog content changes locally.
  const child = spawn('node', ['generate-sitemap.js'], { stdio: 'inherit' });
  child.on('error', (error) => {
    console.error('Unable to regenerate sitemap:', error);
  });
}

console.log('Watching blog content for sitemap refresh...');
regenerateSitemap();

fs.watch(blogDir, { recursive: true }, (_eventType, filename) => {
  if (!filename || !filename.endsWith('.mdx')) return;
  console.log(`Detected change in ${filename}; regenerating sitemap...`);
  regenerateSitemap();
});
