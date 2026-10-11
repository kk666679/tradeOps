import { z } from 'zod';
export const DocumentsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const DocumentsUpdate = DocumentsCreate.partial();
export const DocumentsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type DocumentsCreate = z.infer<typeof DocumentsCreate>;
export type DocumentsUpdate = z.infer<typeof DocumentsUpdate>;
