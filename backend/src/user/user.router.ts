import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../trpc/trpc.service';
import { requireAuth, requireRole, requireTenant } from '../trpc/trpc.middleware';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './user.schema';

/** User management — admin-only, tenant-scoped (ported from the former REST controller). */
@Injectable()
export class UserRouter {
  constructor(private trpc: TrpcService, private svc: UserService) {}
  get router() {
    const admin = () =>
      this.trpc.procedure.use(requireAuth).use(requireTenant).use(requireRole(['ADMIN', 'SUPER_ADMIN']));

    return this.trpc.router({
      list: this.trpc.procedure
        .use(requireAuth)
        .use(requireTenant)
        .query(({ ctx }) => this.svc.list(ctx.tenantId!)),
      create: admin()
        .input(CreateUserInput)
        .mutation(({ ctx, input }) => this.svc.create(ctx.tenantId!, input)),
      update: admin()
        .input(UpdateUserInput.extend({ id: z.string() }))
        .mutation(({ ctx, input }) => {
          const { id, ...data } = input;
          return this.svc.update(ctx.tenantId!, id, data);
        }),
      remove: admin()
        .input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => this.svc.remove(ctx.tenantId!, input.id)),
    });
  }
}
