import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { redirectForSlug } from '../lib/blogCleanup';
import { getFinancialProductById, validateFinancialProducts } from '../lib/financialProducts';

function readBlogSlugs() {
  const blogDir = path.join(process.cwd(), 'content/blog');
  return new Set(
    fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
        const { data } = matter(raw);
        return String(data.slug || '');
      })
      .filter(Boolean)
  );
}

export function runLinkIntegrityTests() {
  const slugs = readBlogSlugs();

  const legacyRedirect = redirectForSlug('seo-how-to-compare-personal-loan-apr');
  assert.equal(legacyRedirect?.destination, '/blog/personal-loan-comparison-for-bad-month-resilience', 'legacy personal-loan slug should resolve to canonical article');
  assert.ok(slugs.has('personal-loan-comparison-for-bad-month-resilience'), 'canonical personal-loan slug must be present in live blog content');

  const redirectMap = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/audit/blog-redirect-map.json'), 'utf8')) as Array<{ source: string; destination: string }>;
  const bySource = new Map(redirectMap.map((entry) => [entry.source, entry.destination]));

  for (const [source] of bySource.entries()) {
    const seen = new Set([source]);
    let current = bySource.get(source);

    while (current && bySource.has(current)) {
      assert.ok(!seen.has(current), `redirect loop detected from ${source}`);
      seen.add(current);
      current = bySource.get(current);
    }
  }

  const productValidation = validateFinancialProducts();
  assert.equal(productValidation.valid, true, `financial product mapping has invalid entries: ${productValidation.errors.join('; ')}`);
  assert.equal(getFinancialProductById('cc-aurora-cashback'), undefined, 'legacy fictional product ids should not remain in production data');
}
