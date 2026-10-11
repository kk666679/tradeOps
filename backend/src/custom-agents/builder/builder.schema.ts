import { z } from 'zod';
export const BuilderCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const BuilderUpdate = BuilderCreate.partial();
export const BuilderFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type BuilderCreate = z.infer<typeof BuilderCreate>;
export type BuilderUpdate = z.infer<typeof BuilderUpdate>;
