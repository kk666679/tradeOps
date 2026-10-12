/**
 * AppRouter root — shim.
 *
 * Registers routers as you build them. Currently empty.
 * When a real tRPC setup exists, this file becomes:
 *   export const appRouter = router({ ... });
 *   export type AppRouter = typeof appRouter;
 *
 * The client shim in lib/trpc/react.ts doesn't need AppRouter to
 * exist yet. But exporting it now means the upgrade is a one-line
 * change on the client side.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { mergeRouters } from "./trpc";

/**
 * Placeholder — replace with your real routers.
 * Example:
 *   import { orderManagementRouter } from "./routers/order-management";
 *   import { fizRouter } from "./routers/fiz";
 *   export const appRouter = router({
 *     orderManagement: orderManagementRouter,
 *     fiz: fizRouter,
 *   });
 */
export const appRouter: any = mergeRouters({
  // Empty for now. Add routers as you build them.
});

export type AppRouter = typeof appRouter;

export default appRouter;
