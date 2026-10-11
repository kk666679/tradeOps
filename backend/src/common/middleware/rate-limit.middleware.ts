import { Injectable, NestMiddleware } from '@nestjs/common';
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private hits = new Map<string, { n: number; t: number }>();
  use(req: any, res: any, next: () => void) {
    const key = req.ip ?? 'anon';
    const now = Date.now();
    const b = this.hits.get(key) ?? { n: 0, t: now };
    if (now - b.t > 60_000) { b.n = 0; b.t = now; }
    b.n++;
    this.hits.set(key, b);
    if (b.n > 600) { res.status(429).json({ ok: false, message: 'rate limited' }); return; }
    next();
  }
}
