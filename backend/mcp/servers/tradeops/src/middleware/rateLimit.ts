// backend/mcp/servers/tradeops/src/middleware/rateLimit.ts

interface Bucket { tokens: number; refilledAt: number; }

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  key: string;
  perMinute: number;
}

export function rateLimit({ key, perMinute }: RateLimitOptions): void {
  const now = Date.now();
  const refillRate = perMinute / 60_000;
  let b = buckets.get(key);
  if (!b) {
    b = { tokens: perMinute, refilledAt: now };
    buckets.set(key, b);
  }
  const elapsed = now - b.refilledAt;
  b.tokens = Math.min(perMinute, b.tokens + elapsed * refillRate);
  b.refilledAt = now;
  if (b.tokens < 1) throw new Error(`rate limit exceeded for ${key}`);
  b.tokens -= 1;
}
