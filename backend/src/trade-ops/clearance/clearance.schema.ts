import { z } from 'zod';
export const ClearanceCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ClearanceUpdate = ClearanceCreate.partial();
export const ClearanceFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ClearanceCreate = z.infer<typeof ClearanceCreate>;
export type ClearanceUpdate = z.infer<typeof ClearanceUpdate>;
