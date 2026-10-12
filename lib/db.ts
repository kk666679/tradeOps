/**
 * Prisma client singleton with safe fallback.
 *
 * When @prisma/client is installed and `prisma generate` has run:
 *   The real client is used. Full type safety, real queries.
 *
 * When it's not installed:
 *   A no-op Proxy is returned. Every query resolves to null. The app
 *   compiles and boots without errors.
 *
 * Upgrade path:
 *   npm i @prisma/client
 *   npx prisma generate
 *   npx prisma migrate dev
 *
 * No source changes needed — this file detects and uses the real client
 * automatically.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type PrismaClientLike = any;

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClientLike | undefined;
}

function makePrismaStub(): PrismaClientLike {
  // Model proxy: any property is a model; any method on it is async → null
  const modelProxy = new Proxy({} as any, {
    get: () => async () => null,
  });

  const topProxy = new Proxy({} as any, {
    get(target, prop) {
      // Prisma lifecycle methods
      if (prop === "$connect") return async () => {};
      if (prop === "$disconnect") return async () => {};
      if (prop === "$on") return () => {};
      if (prop === "$transaction") return async (fn: any) => {
        if (typeof fn === "function") return fn(topProxy);
        return [];
      };
      if (prop === "$queryRaw") return async () => [];
      if (prop === "$executeRaw") return async () => 0;
      if (prop === "$extends") return () => topProxy;
      if (prop === "then") return undefined; // not a thenable

      // Any other prop is a model
      return modelProxy;
    },
  });

  return topProxy;
}

function getPrisma(): PrismaClientLike {
  if (globalThis.__prisma__) return globalThis.__prisma__;

  let client: PrismaClientLike;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@prisma/client");
    if (mod?.PrismaClient) {
      client = new mod.PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["warn", "error"]
            : ["error"],
      });
    } else {
      client = makePrismaStub();
    }
  } catch {
    client = makePrismaStub();
  }

  if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma__ = client;
  }

  return client;
}

export const db: PrismaClientLike = getPrisma();
export const prisma: PrismaClientLike = db;
export default db;
