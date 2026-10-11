/**
 * Rate limiting middleware — sliding window per session.
 */

import type { Request, Response, NextFunction } from 'express';
import { logger } from '../logger.js';
import { errorResult } from '../middleware/context.js';

const log = logger.child({ component: 'rateLimit' });

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  requestsPerMinute?: number;
}

export class RateLimiter {
  private bucket = new Map<string, RateLimitEntry>();
  private readonly limit: number;
  private readonly windowMs: number = 60_000;

  constructor(opts: RateLimitOptions = {}) {
    this.limit = opts.requestsPerMinute ?? 100;
  }

  check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    let entry = this.bucket.get(key);

    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + this.windowMs };
      this.bucket.set(key, entry);
    }

    const allowed = entry.count < this.limit;
    const remaining = Math.max(0, this.limit - entry.count);

    if (allowed) {
      entry.count++;
    }

    return { allowed, remaining, resetAt: entry.resetAt };
  }

  reset(): void {
    this.bucket.clear();
  }
}

export function createRateLimitMiddleware(limiter: RateLimiter) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.ctx) {
      res.status(401).json(errorResult('unauthorized', 'No authentication context'));
      return;
    }

    const key = req.ctx.identity.userId || 'anonymous';
    const check = limiter.check(key);

    res.setHeader('x-ratelimit-limit', String(limiter['limit']));
    res.setHeader('x-ratelimit-remaining', String(check.remaining));
    res.setHeader('x-ratelimit-reset', String(check.resetAt));

    if (!check.allowed) {
      log.warn({ userId: key, resetAt: check.resetAt }, 'rate limit exceeded');
      res.status(429).json(
        errorResult('rate_limited', `Rate limit exceeded. Reset at ${new Date(check.resetAt).toISOString()}`, {
          resetAt: check.resetAt,
        }),
      );
      return;
    }

    next();
  };
}
