/**
 * Simple in-memory rate limiter.
 *
 * For production serverless deployments, replace with a Redis-backed implementation
 * (Upstash, Vercel KV, etc.) because the process may not be long-lived.
 */

interface RateLimitOptions {
  key: string;
  limit: number;
  windowSeconds: number;
}

interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

const store = new Map<string, number[]>();

export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = options;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  const entries = (store.get(key) ?? []).filter((t) => t > cutoff);

  if (entries.length >= limit) {
    store.set(key, entries);
    const oldest = entries[0];
    return {
      ok: false,
      remaining: 0,
      resetAt: oldest + windowMs,
    };
  }

  entries.push(now);
  store.set(key, entries);

  return {
    ok: true,
    remaining: limit - entries.length,
    resetAt: now + windowMs,
  };
}

export function clearRateLimit(key: string) {
  store.delete(key);
}