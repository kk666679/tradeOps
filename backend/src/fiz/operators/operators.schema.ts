import { z } from 'zod';
export const OperatorsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const OperatorsUpdate = OperatorsCreate.partial();
export const OperatorsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type OperatorsCreate = z.infer<typeof OperatorsCreate>;
export type OperatorsUpdate = z.infer<typeof OperatorsUpdate>;
