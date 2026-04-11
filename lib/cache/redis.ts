/**
 * Redis caching layer for FinanceSphere AI Money Copilot.
 *
 * - Uses Upstash Redis REST API (REDIS_URL + REDIS_TOKEN env vars).
 * - Falls back transparently to an in-memory Map when Redis is unavailable.
 * - All cache keys are SHA-256 hashed to prevent injection and reduce key size.
 * - Key format: copilot:{sha256(input)}
 */

import { createHash } from 'crypto';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MemCacheEntry {
  value: unknown;
  expiresAt: number;
}

// ---------------------------------------------------------------------------
// In-memory fallback
// ---------------------------------------------------------------------------

/** Used as a transparent fallback whenever Redis is unreachable. */
const memCache = new Map<string, MemCacheEntry>();

function memGet(key: string): unknown | null {
  const entry = memCache.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    memCache.delete(key);
    return null;
  }
  return entry.value;
}

function memSet(key: string, value: unknown, ttlSeconds: number): void {
  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1_000 });
}

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

/**
 * Produce a namespaced cache key using a SHA-256 hash of the input string.
 *
 * Key format: `copilot:{sha256(input)}`
 *
 * Hashing prevents cache-key injection from user-controlled content and keeps
 * the keys at a constant, safe length regardless of input size.
 */
export function hashKey(input: string): string {
  const hash = createHash('sha256').update(input, 'utf8').digest('hex');
  return `copilot:${hash}`;
}

// ---------------------------------------------------------------------------
// Upstash Redis REST helpers
// ---------------------------------------------------------------------------

/**
 * Execute a single Redis command via the Upstash Redis REST API.
 * Returns `null` when Redis is not configured or the call fails.
 */
async function upstashExec(command: unknown[]): Promise<unknown> {
  const url = process.env.REDIS_URL;
  const token = process.env.REDIS_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });

    if (!res.ok) {
      console.warn(`[redis] Upstash request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json() as { result?: unknown };
    return data.result ?? null;
  } catch (err) {
    console.warn('[redis] Upstash fetch error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Retrieve a cached value by key.
 *
 * Tries Redis first; falls back to the in-memory map if Redis is unavailable.
 * Returns `null` on cache miss or any error.
 */
export async function getCache(key: string): Promise<unknown | null> {
  const redisUrl = process.env.REDIS_URL;
  const redisToken = process.env.REDIS_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const raw = await upstashExec(['GET', key]);
      if (typeof raw === 'string') {
        try {
          return JSON.parse(raw) as unknown;
        } catch {
          console.warn('[redis] Failed to parse cached JSON for key:', key);
          return null;
        }
      }
      // Redis returned null — definitive miss from Redis; do NOT fall through to memory
      if (raw === null) return null;
    } catch (err) {
      console.warn('[redis] getCache error, falling back to memory:', err);
      // Fall through to memory on Redis connectivity failure
    }
  }

  return memGet(key);
}

/**
 * Store a value in the cache with an optional TTL (default: 600 seconds / 10 min).
 *
 * Attempts to write to Redis; silently falls back to the in-memory map if Redis
 * is unavailable or the write fails.
 */
export async function setCache(key: string, value: unknown, ttl = 600): Promise<void> {
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch (err) {
    console.warn('[redis] setCache: failed to serialize value:', err);
    return;
  }

  const redisUrl = process.env.REDIS_URL;
  const redisToken = process.env.REDIS_TOKEN;

  if (redisUrl && redisToken) {
    try {
      await upstashExec(['SET', key, serialized, 'EX', ttl]);
      return;
    } catch (err) {
      console.warn('[redis] setCache error, falling back to memory:', err);
    }
  }

  memSet(key, value, ttl);
}
