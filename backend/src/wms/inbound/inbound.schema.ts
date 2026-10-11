import { z } from 'zod';
export const InboundCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const InboundUpdate = InboundCreate.partial();
export const InboundFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type InboundCreate = z.infer<typeof InboundCreate>;
export type InboundUpdate = z.infer<typeof InboundUpdate>;
