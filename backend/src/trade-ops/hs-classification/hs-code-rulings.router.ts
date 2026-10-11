import { Injectable } from '@nestjs/common';
import { TrpcService } from '../../trpc/trpc.service';
import { createCrudRouter } from '../../trpc/createCrudRouter';

/**
 * HS rulings router.
 *
 * Backed by the `hsCodeRuling` model, which carries an optional `tenantId`.
 * The generic CRUD router is tenant-aware but tolerates an undefined tenantId
 * (Prisma drops `undefined` from the `where` object), so rulings remain
 * queryable even before a tenant is bound.
 */
@Injectable()
export class HsCodeRulingsRouter {
  constructor(private trpc: TrpcService) {}
  get router() { return createCrudRouter(this.trpc, 'hsCodeRuling'); }
}