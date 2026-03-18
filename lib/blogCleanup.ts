import cleanupInventory from '@/content/audit/blog-cleanup-inventory.json';
import redirectMap from '@/content/audit/blog-redirect-map.json';

export type CleanupAction = 'KEEP_IMPROVE' | 'MERGE' | 'REDIRECT' | 'DELETE_REMOVE' | 'CONVERT_HUB_SUPPORT';

export type CleanupItem = {
  slug: string;
  title: string;
  file: string;
  category: string;
  word_count: number;
  action: CleanupAction;
  destination: string;
  reason: string;
};

type RedirectItem = {
  source: string;
  destination: string;
  permanent: boolean;
  reason: 'MERGE' | 'REDIRECT' | 'CONVERT_HUB_SUPPORT';
};

const bySlug = new Map<string, CleanupItem>((cleanupInventory as CleanupItem[]).map((item) => [item.slug, item]));
const redirectsBySource = new Map<string, RedirectItem>((redirectMap as RedirectItem[]).map((item) => [item.source, item]));

const legacySlugFallbacks: Array<{ pattern: RegExp; destination: string; reason: RedirectItem['reason'] }> = [
  { pattern: /^beginner-investing-guides-\d+$/i, destination: '/blog/seo-investing-for-beginners-roadmap', reason: 'REDIRECT' },
  { pattern: /^tax-saving-strategies-\d+$/i, destination: '/blog/seo-tax-efficient-investing-tips', reason: 'REDIRECT' },
  { pattern: /^tax-optimization-guide-\d+$/i, destination: '/blog/seo-tax-efficient-investing-tips', reason: 'REDIRECT' },
  { pattern: /^budgeting-guide-\d+$/i, destination: '/blog/seo-50-30-20-rule-for-saving', reason: 'REDIRECT' },
  { pattern: /^best-savings-accounts-\d+$/i, destination: '/blog/seo-high-yield-savings-basics', reason: 'REDIRECT' },
  { pattern: /^best-investment-apps-\d+$/i, destination: '/blog/seo-investing-for-beginners-roadmap', reason: 'REDIRECT' },
  { pattern: /^best-travel-credit-cards-\d+$/i, destination: '/blog/seo-how-credit-utilization-works', reason: 'REDIRECT' },
  { pattern: /^how-to-save-500-month-\d+$/i, destination: '/blog/seo-emergency-fund-3-to-6-months', reason: 'REDIRECT' },
  { pattern: /^mortgage-tips-\d+$/i, destination: '/blog/seo-mortgage-preapproval-checklist', reason: 'REDIRECT' },
  { pattern: /^how-to-improve-credit-score-\d+$/i, destination: '/blog/seo-how-credit-utilization-works', reason: 'REDIRECT' }
];

export function getCleanupItem(slug: string) {
  return bySlug.get(slug);
}

export function shouldDisplayPost(slug: string) {
  const item = bySlug.get(slug);
  if (!item) return true;
  return item.action === 'KEEP_IMPROVE';
}

export function redirectForSlug(slug: string) {
  const source = `/blog/${slug}`;
  const exact = redirectsBySource.get(source);
  if (exact) return exact;

  const fallback = legacySlugFallbacks.find((entry) => entry.pattern.test(slug));
  if (!fallback) return undefined;

  return {
    source,
    destination: fallback.destination,
    permanent: true,
    reason: fallback.reason
  } satisfies RedirectItem;
}

export function cleanupSummary() {
  const summary = {
    KEEP_IMPROVE: 0,
    MERGE: 0,
    REDIRECT: 0,
    DELETE_REMOVE: 0,
    CONVERT_HUB_SUPPORT: 0
  } satisfies Record<CleanupAction, number>;

  for (const item of cleanupInventory as CleanupItem[]) {
    summary[item.action] += 1;
  }

  return summary;
}
