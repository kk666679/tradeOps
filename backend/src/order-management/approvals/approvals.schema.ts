import { z } from 'zod';
export const ApprovalsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ApprovalsUpdate = ApprovalsCreate.partial();
export const ApprovalsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ApprovalsCreate = z.infer<typeof ApprovalsCreate>;
export type ApprovalsUpdate = z.infer<typeof ApprovalsUpdate>;
