import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import superjson from "superjson";

export interface TRPCContext {
  db: typeof db;
  userId?: string;
  tenantId?: string;
  role?: string;
}

export async function createContext(opts?: {
  headers?: Headers;
}): Promise<TRPCContext> {
  const userId = opts?.headers?.get("x-user-id") ?? undefined;
  const tenantId = opts?.headers?.get("x-tenant-id") ?? undefined;
  const role = opts?.headers?.get("x-user-role") ?? undefined;

  return {
    db,
    userId,
    tenantId,
    role,
  };
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const tenantProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.tenantId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Tenant context required",
    });
  }
  return next({ ctx: { ...ctx, tenantId: ctx.tenantId } });
});

export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

export function createCallerFactory<TRouter extends t.router>(router: TRouter) {
  return t.createCallerFactory(router);
}

export { TRPCError };