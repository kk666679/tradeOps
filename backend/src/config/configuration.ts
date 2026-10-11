export const configuration = () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-please-change',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  },
  db: { url: process.env.DATABASE_URL },
  redis: { url: process.env.REDIS_URL },
  weaviate: {
    host: process.env.WEAVIATE_HOST ?? 'localhost:8080',
    scheme: process.env.WEAVIATE_SCHEME ?? 'http',
    apiKey: process.env.WEAVIATE_API_KEY ?? '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
    model: process.env.OPENAI_MODEL ?? 'gpt-4o',
  },
  guardrails: {
    mode: process.env.AUTOCLAW_MODE ?? 'guarded',
    maxSpendUsd: Number(process.env.AUTOCLAW_MAX_SPEND_USD ?? 250),
    requireHitlAboveUsd: Number(process.env.AUTOCLAW_REQUIRE_HITL_ABOVE_USD ?? 10000),
  },
});
export type AppConfig = ReturnType<typeof configuration>;
