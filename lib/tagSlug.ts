import { decodeRouteSegmentOnce } from '@/lib/routeSlug';

export function normalizeTag(tag: string) {
  return decodeRouteSegmentOnce(tag).trim().toLowerCase();
}

export function slugifyTag(tag: string): string {
  return normalizeTag(tag)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
