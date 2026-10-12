/**
 * In-memory rate limiter. Swap for Redis/Upstash in production multi-instance.
 *
 * Usage:
 *   await rateLimit({ key: "resend:user@x.com", limit: 3, window: 60_000 });
 *   await rateLimit("resend:user@x.com", 3, 60_000);
 */

export interface RateLimitOptions {
  key: string;
  limit?: number;
  window?: number;
  windowSeconds?: number;
}

export interface RateLimitResult {
  ok: boolean;
  success?: boolean;
  remaining?: number;
  reset?: number;
  resetAt?: number;
  limit?: number;
}

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();

if (typeof setInterval !== "undefined") {
  const CLEANUP_INTERVAL = 5 * 60_000;
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.reset <= now) buckets.delete(key);
    }
  }, CLEANUP_INTERVAL);
  if (typeof timer === "object" && timer !== null && "unref" in timer) {
    (timer as { unref?: () => void }).unref?.();
  }
}

export async function rateLimit(
  optionsOrKey: RateLimitOptions | string,
  limitArg?: number,
  windowArg?: number
): Promise<RateLimitResult> {
  const opts: RateLimitOptions =
    typeof optionsOrKey === "string"
      ? { key: optionsOrKey, limit: limitArg, window: windowArg }
      : optionsOrKey;

  const limit = opts.limit ?? 10;
  const windowMs = opts.window ?? 60_000;
  const now = Date.now();
  const existing = buckets.get(opts.key);

  if (!existing || existing.reset <= now) {
    const reset = now + windowMs;
    buckets.set(opts.key, { count: 1, reset });
    return { success: true, ok: true, remaining: limit - 1, reset, limit };
  }

  if (existing.count >= limit) {
    return { success: false, ok: false, remaining: 0, reset: existing.reset, limit };
  }

  existing.count += 1;
  return {
    success: true, ok: true,
    remaining: limit - existing.count,
    reset: existing.reset,
    limit,
  };
}

export const checkRateLimit = rateLimit;

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

export function resetAllRateLimits(): void {
  buckets.clear();
}
