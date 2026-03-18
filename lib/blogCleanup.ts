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

const fallbackLegacyPatternRedirects: Array<{ pattern: RegExp; destination: string; reason: RedirectItem['reason'] }> = [
  { pattern: /^beginner-investing-guides-\d+$/, destination: '/blog/seo-investing-for-beginners-roadmap', reason: 'REDIRECT' },
  { pattern: /^tax-saving-strategies-\d+$/, destination: '/blog/seo-tax-efficient-investing-tips', reason: 'REDIRECT' },
  { pattern: /^how-to-save-500-month-\d+$/, destination: '/blog/seo-emergency-fund-3-to-6-months', reason: 'REDIRECT' },
  { pattern: /^best-investment-apps-guide-\d+$/, destination: '/compare/best-investment-apps', reason: 'MERGE' },
  { pattern: /^best-savings-accounts-guide-\d+$/, destination: '/best-savings-accounts-usa', reason: 'MERGE' },
  { pattern: /^budgeting-guide-\d+$/, destination: '/blog/seo-50-30-20-rule-for-saving', reason: 'MERGE' },
  { pattern: /^best-travel-credit-cards-guide-\d+$/, destination: '/best-credit-cards-2026', reason: 'MERGE' }
];

function fallbackLegacyRedirect(slug: string): RedirectItem | undefined {
  const matched = fallbackLegacyPatternRedirects.find((item) => item.pattern.test(slug));
  if (matched) {
    return {
      source: `/blog/${slug}`,
      destination: matched.destination,
      permanent: true,
      reason: matched.reason
    };
  }

  if (/(?:^|[-])(guide|tips|strategies)-\d+$/.test(slug)) {
    return {
      source: `/blog/${slug}`,
      destination: '/blog',
      permanent: true,
      reason: 'REDIRECT'
    };
  }

  return undefined;
}

export function getCleanupItem(slug: string) {
  return bySlug.get(slug);
}

export function shouldDisplayPost(slug: string) {
  const item = bySlug.get(slug);
  if (!item) return true;
  return item.action === 'KEEP_IMPROVE';
}

export function redirectForSlug(slug: string) {
  return redirectsBySource.get(`/blog/${slug}`) ?? fallbackLegacyRedirect(slug);
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
