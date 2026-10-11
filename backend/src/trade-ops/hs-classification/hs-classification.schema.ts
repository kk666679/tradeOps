import { z } from 'zod';
export const HsClassificationCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const HsClassificationUpdate = HsClassificationCreate.partial();
export const HsClassificationFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type HsClassificationCreate = z.infer<typeof HsClassificationCreate>;
export type HsClassificationUpdate = z.infer<typeof HsClassificationUpdate>;
