import { z } from 'zod';
export const OutboundCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const OutboundUpdate = OutboundCreate.partial();
export const OutboundFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type OutboundCreate = z.infer<typeof OutboundCreate>;
export type OutboundUpdate = z.infer<typeof OutboundUpdate>;
