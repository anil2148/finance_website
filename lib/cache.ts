/** Simple in-memory response cache with 10-minute TTL. */

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const TTL_MS = 1000 * 60 * 10; // 10 min

const cache = new Map<string, CacheEntry>();

/**
 * Build a cache key from the raw question and freeform context strings.
 * Keep the function simple; callers that need collision-resistance should
 * hash the result themselves (see ai-client.ts).
 */
export const getCacheKey = (question: string, context: string): string =>
  `${question}-${context}`;

/**
 * Return a cached value, or `undefined` if the key is absent or expired.
 * Expired entries are lazily evicted on read to avoid per-entry timer overhead.
 */
export const getCached = (key: string): unknown | undefined => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
};

/**
 * Store a value in the cache with a 10-minute TTL.
 * Expiration is checked lazily on the next read; no per-entry timers are used.
 * A Redis adapter can replace this module in production without changing callers.
 */
export const setCache = (key: string, value: unknown): void => {
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS });
};
