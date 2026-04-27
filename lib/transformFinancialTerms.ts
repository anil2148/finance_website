import { financialTerms, financialTermPatterns, type BlogRegion } from '@/lib/financialTerms';

const PROTECTED_BLOCK_PATTERNS = [
  /```[\s\S]*?```/g, // fenced code blocks
  /`[^`\n]+`/g, // inline code
  /<[^>]+>/g, // HTML tags
  /https?:\/\/[^\s)\]"'<>]+/g // URLs
];

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function transformFinancialTerms(content: string, region: BlogRegion): string {
  if (!content?.trim()) return content;

  const protectedSegments: string[] = [];
  let working = content;

  const protect = (segment: string) => {
    const index = protectedSegments.push(segment) - 1;
    return `__FS_PROTECTED_${index}__`;
  };

  for (const pattern of PROTECTED_BLOCK_PATTERNS) {
    working = working.replace(pattern, protect);
  }

  for (const { key, variants } of financialTermPatterns) {
    const replacement = financialTerms[key][region];
    const variantPattern = variants
      .sort((a, b) => b.length - a.length)
      .map((variant) => escapeRegex(variant))
      .join('|');

    const regex = new RegExp(`(^|[^\\p{L}\\p{N}])(${variantPattern})(?=$|[^\\p{L}\\p{N}])`, 'giu');

    working = working.replace(regex, (full, prefix) => `${prefix}${replacement}`);
  }

  return working.replace(/__FS_PROTECTED_(\d+)__/g, (_, rawIndex) => {
    const index = Number(rawIndex);
    return protectedSegments[index] ?? '';
  });
}
