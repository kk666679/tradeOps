import { z } from 'zod';
export const CargoCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const CargoUpdate = CargoCreate.partial();
export const CargoFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type CargoCreate = z.infer<typeof CargoCreate>;
export type CargoUpdate = z.infer<typeof CargoUpdate>;
