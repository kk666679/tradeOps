import { z } from 'zod';
export const TaskCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const TaskUpdate = TaskCreate.partial();
export const TaskFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type TaskCreate = z.infer<typeof TaskCreate>;
export type TaskUpdate = z.infer<typeof TaskUpdate>;
