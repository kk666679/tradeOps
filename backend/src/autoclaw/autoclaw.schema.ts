import { z } from 'zod';
export const AutoclawCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const AutoclawUpdate = AutoclawCreate.partial();
export const AutoclawFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type AutoclawCreate = z.infer<typeof AutoclawCreate>;
export type AutoclawUpdate = z.infer<typeof AutoclawUpdate>;
