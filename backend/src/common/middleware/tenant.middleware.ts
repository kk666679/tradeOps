import { Injectable, NestMiddleware } from '@nestjs/common';
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    req.tenantId = req.user?.tenantId ?? req.headers['x-tenant-id'] ?? null;
    next();
  }
}
