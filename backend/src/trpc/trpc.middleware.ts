import { TRPCError } from '@trpc/server';
import type { TrpcCtx } from './trpc.context';

export const requireAuth = async ({ ctx, next }: { ctx: TrpcCtx; next: () => Promise<any> }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next();
};

export const requireTenant = async ({ ctx, next }: { ctx: TrpcCtx; next: () => Promise<any> }) => {
  if (!ctx.tenantId) throw new TRPCError({ code: 'FORBIDDEN', message: 'No tenant' });
  return next();
};

export const requireRole = (roles: string[]) => async ({ ctx, next }: { ctx: TrpcCtx; next: () => Promise<any> }) => {
  if (!ctx.user || !roles.includes(ctx.user.role)) throw new TRPCError({ code: 'FORBIDDEN' });
  return next();
};
