/** Simple in-memory response cache with 10-minute TTL. */
const cache = new Map<string, unknown>();

/**
 * Build a cache key from the raw question and freeform context strings.
 * Keep the function simple; callers that need collision-resistance should
 * hash the result themselves (see ai-client.ts).
 */
export const getCacheKey = (question: string, context: string): string =>
  `${question}-${context}`;

/** Return a cached value, or `undefined` if the key is not present. */
export const getCached = (key: string): unknown | undefined => cache.get(key);

/**
 * Store a value in the cache and schedule its removal after 10 minutes.
 * Using `setTimeout` for TTL cleanup keeps the implementation dependency-free;
 * a Redis adapter can replace this module in production without changing callers.
 */
export const setCache = (key: string, value: unknown): void => {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), 1000 * 60 * 10); // 10 min TTL
};
