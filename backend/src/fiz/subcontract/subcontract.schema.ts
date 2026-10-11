import { z } from 'zod';
export const SubcontractCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const SubcontractUpdate = SubcontractCreate.partial();
export const SubcontractFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type SubcontractCreate = z.infer<typeof SubcontractCreate>;
export type SubcontractUpdate = z.infer<typeof SubcontractUpdate>;
