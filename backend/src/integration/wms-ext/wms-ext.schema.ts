import { z } from 'zod';
export const WmsExtCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const WmsExtUpdate = WmsExtCreate.partial();
export const WmsExtFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type WmsExtCreate = z.infer<typeof WmsExtCreate>;
export type WmsExtUpdate = z.infer<typeof WmsExtUpdate>;
