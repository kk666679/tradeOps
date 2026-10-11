import { z } from 'zod';
export const RegistryCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const RegistryUpdate = RegistryCreate.partial();
export const RegistryFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type RegistryCreate = z.infer<typeof RegistryCreate>;
export type RegistryUpdate = z.infer<typeof RegistryUpdate>;
