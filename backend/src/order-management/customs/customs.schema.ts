import { z } from 'zod';
export const CustomsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const CustomsUpdate = CustomsCreate.partial();
export const CustomsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type CustomsCreate = z.infer<typeof CustomsCreate>;
export type CustomsUpdate = z.infer<typeof CustomsUpdate>;
