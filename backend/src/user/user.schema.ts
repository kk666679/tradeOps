import { z } from 'zod';
export const GlobalRole = z.enum([
  'SUPER_ADMIN',
  'ADMIN',
  'OPS_MANAGER',
  'WAREHOUSE_STAFF',
  'CUSTOMER',
  'AGENT',
  'AUDITOR',
]);
export const CreateUserInput = z.object({ email: z.string().email(), role: GlobalRole.default('WAREHOUSE_STAFF') });
export type CreateUserInput = z.infer<typeof CreateUserInput>;
export const UpdateUserInput = z.object({ role: GlobalRole.optional(), name: z.string().optional() });
export type UpdateUserInput = z.infer<typeof UpdateUserInput>;
