function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function decodeRouteSegmentOnce(value: string): string {
  return safeDecodeURIComponent(value);
}

export function normalizeRouteSlug(value: string): string {
  return decodeRouteSegmentOnce(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isCanonicalRouteSlug(raw: string, normalized: string): boolean {
  return decodeRouteSegmentOnce(raw) === normalized;
}
