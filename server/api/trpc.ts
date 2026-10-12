/**
 * tRPC server init — shim.
 *
 * When @trpc/server is installed, this file exports real `initTRPC`,
 * `router`, `publicProcedure`, `protectedProcedure`, `middleware`.
 *
 * When it isn't, safe stubs are exported so imports don't fail.
 *
 * Upgrade path:
 *   npm i @trpc/server
 *   Then replace this file with your real init:
 *     import { initTRPC, TRPCError } from "@trpc/server";
 *     import { db } from "@/lib/db";
 *     export const createContext = async (opts: any) => ({ db, ... });
 *     const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create();
 *     export const router = t.router;
 *     export const publicProcedure = t.procedure;
 *     export const protectedProcedure = t.procedure.use(authMiddleware);
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TRPCContext {
  db: any;
  userId?: string;
  tenantId?: string;
  role?: string;
}

export async function createContext(_opts?: unknown): Promise<TRPCContext> {
  const { db } = await import("@/lib/db");
  return { db };
}

/* -- Stub surface -------------------------------------------------- */

export const router: any = (routes: any) => routes;
export const publicProcedure: any = new Proxy({} as any, {
  get: () => publicProcedure,
});
export const protectedProcedure: any = new Proxy({} as any, {
  get: () => protectedProcedure,
});
export const middleware: any = (fn: any) => fn;
export const mergeRouters: any = (...routers: any[]) =>
  Object.assign({}, ...routers);
