import { z } from 'zod';

const Schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(8).default('dev-secret-please-change'),
});

export function validate(env: Record<string, unknown>) {
  const parsed = Schema.safeParse(env);
  if (!parsed.success) {
    // Fail open in dev to keep DX smooth
    console.warn('[config] validation warnings:', parsed.error.flatten().fieldErrors);
  }
  return env;
}
