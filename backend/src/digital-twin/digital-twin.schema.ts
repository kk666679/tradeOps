import { z } from 'zod';
export const DigitalTwinCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const DigitalTwinUpdate = DigitalTwinCreate.partial();
export const DigitalTwinFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type DigitalTwinCreate = z.infer<typeof DigitalTwinCreate>;
export type DigitalTwinUpdate = z.infer<typeof DigitalTwinUpdate>;
