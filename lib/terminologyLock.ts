import type { BlogRegion } from '@/lib/financialTerms';

export type LockedRegion = Extract<BlogRegion, 'US' | 'INDIA'>;

export const US_ALLOWED_TERMS = ['Mortgage', '401(k)', 'IRA', 'IRS', 'Stocks', 'Sales Tax'] as const;
export const INDIA_ALLOWED_TERMS = ['Home Loan', 'EPF', 'NPS', 'Income Tax Department', 'Shares', 'GST'] as const;

const US_ONLY_PATTERNS = [/\bmortgage\b/i, /\b401\(k\)\b/i, /\bIRA\b/i, /\bIRS\b/i, /\bstocks\b/i, /\bsales tax\b/i];
const INDIA_ONLY_PATTERNS = [/\bhome loan\b/i, /\bEPF\b/i, /\bNPS\b/i, /\bincome tax department\b/i, /\bshares\b/i, /\bGST\b/i];

const INDIA_TO_US_AUTO_FIX: Array<[RegExp, string]> = [
  [/\bhome loan\b/gi, 'Mortgage'],
  [/\bEPF\b/gi, 'IRA'],
  [/\bNPS\b/gi, '401(k)'],
  [/\bincome tax department\b/gi, 'IRS'],
  [/\bshares\b/gi, 'Stocks'],
  [/\bGST\b/gi, 'Sales Tax']
];

const US_TO_INDIA_AUTO_FIX: Array<[RegExp, string]> = [
  [/\bmortgage\b/gi, 'Home Loan'],
  [/\b401\(k\)\b/gi, 'NPS'],
  [/\bIRA\b/gi, 'EPF'],
  [/\bIRS\b/gi, 'Income Tax Department'],
  [/\bstocks\b/gi, 'Shares'],
  [/\bsales tax\b/gi, 'GST']
];

export type TerminologyViolation = {
  term: string;
  index: number;
};

export function findForeignRegionTerms(content: string, region: LockedRegion): TerminologyViolation[] {
  const forbiddenPatterns = region === 'US' ? INDIA_ONLY_PATTERNS : US_ONLY_PATTERNS;

  return forbiddenPatterns
    .map((pattern) => {
      const match = pattern.exec(content);
      pattern.lastIndex = 0;
      return match ? { term: match[0], index: match.index } : null;
    })
    .filter((item): item is TerminologyViolation => item !== null);
}

export function applyTerminologyAutocorrect(content: string, region: LockedRegion): string {
  const replacements = region === 'US' ? INDIA_TO_US_AUTO_FIX : US_TO_INDIA_AUTO_FIX;
  return replacements.reduce((acc, [regex, replacement]) => acc.replace(regex, replacement), content);
}

export function enforceTerminologyLock(content: string, region: LockedRegion, mode: 'throw' | 'autocorrect' = 'throw'): string {
  const normalized = mode === 'autocorrect' ? applyTerminologyAutocorrect(content, region) : content;
  const violations = findForeignRegionTerms(normalized, region);

  if (violations.length > 0) {
    const details = violations.map((item) => `"${item.term}"@${item.index}`).join(', ');
    throw new Error(`[terminology-lock] ${region} content contains foreign terms: ${details}`);
  }

  return normalized;
}
