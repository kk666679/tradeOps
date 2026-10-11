import { z } from 'zod';
export const MovementCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const MovementUpdate = MovementCreate.partial();
export const MovementFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type MovementCreate = z.infer<typeof MovementCreate>;
export type MovementUpdate = z.infer<typeof MovementUpdate>;
