import { z } from 'zod';
export const DeclarationsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const DeclarationsUpdate = DeclarationsCreate.partial();
export const DeclarationsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type DeclarationsCreate = z.infer<typeof DeclarationsCreate>;
export type DeclarationsUpdate = z.infer<typeof DeclarationsUpdate>;
