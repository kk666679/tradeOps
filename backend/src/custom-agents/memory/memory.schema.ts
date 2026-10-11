import { z } from 'zod';
export const MemoryCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const MemoryUpdate = MemoryCreate.partial();
export const MemoryFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type MemoryCreate = z.infer<typeof MemoryCreate>;
export type MemoryUpdate = z.infer<typeof MemoryUpdate>;
