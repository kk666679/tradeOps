import { z } from 'zod';
export const TenantCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const TenantUpdate = TenantCreate.partial();
export const TenantFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type TenantCreate = z.infer<typeof TenantCreate>;
export type TenantUpdate = z.infer<typeof TenantUpdate>;
