/**
 * Centralised, validated runtime configuration.
 *
 * Every environment variable documented in `.env.example` is read here and
 * exposed as a typed, frozen object. Defaults are safe for local stdio dev.
 * `loadConfig` never throws for missing optional vars — it fills defaults and
 * only fails loudly (via the schema-drift guard elsewhere) when a value is
 * structurally invalid.
 */

export type TransportMode = 'stdio' | 'http';

export interface AppConfig {
  transport: TransportMode;
  http: { port: number; host: string; sessionTtlSeconds: number };
  tradeops: { backendUrl: string; apiKey: string };
  ledger: { backendUrl: string; schemaVersion: string };
  iot: {
    webhookPort: number;
    rateLimitDefault: number;
    idempotencyTtlSeconds: number;
    replayWindowSeconds: number;
    payloadCapBytes: number;
  };
  oauth: { issuer: string; jwksUrl: string; audience: string };
  logging: { level: string; pretty: boolean };
  env: 'development' | 'test' | 'production';
}

function bool(v: string | undefined, fallback: boolean): boolean {
  if (v == null || v === '') return fallback;
  return /^(1|true|yes|on)$/i.test(v);
}

function int(v: string | undefined, fallback: number): number {
  const n = v == null || v === '' ? NaN : Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

/** Read the raw process environment (injectable for tests). */
function src(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const transport = (env.MCP_TRANSPORT ?? 'stdio').toLowerCase() === 'http'
    ? 'http'
    : 'stdio';
  const nodeEnv = (env.NODE_ENV ?? 'development').toLowerCase();
  const envName: AppConfig['env'] =
    nodeEnv === 'production'
      ? 'production'
      : nodeEnv === 'test'
        ? 'test'
        : 'development';

  return {
    transport,
    http: {
      port: int(env.MCP_HTTP_PORT, 8787),
      host: env.MCP_HTTP_HOST ?? '127.0.0.1',
      sessionTtlSeconds: int(env.MCP_SESSION_TTL, 3600),
    },
    tradeops: {
      backendUrl: (env.TRADEOPS_BACKEND_URL ?? 'http://localhost:4000').replace(
        /\/+$/,
        '',
      ),
      apiKey: env.TRADEOPS_API_KEY ?? '',
    },
    ledger: {
      backendUrl: (env.LEDGER_BACKEND_URL ?? env.TRADEOPS_BACKEND_URL ?? 'http://localhost:4000').replace(/\/+$/, ''),
      schemaVersion: env.LEDGER_SCHEMA_VERSION ?? '1.0.0',
    },
    iot: {
      webhookPort: int(env.IOT_WEBHOOK_PORT, 8788),
      rateLimitDefault: int(env.IOT_RATE_LIMIT_DEFAULT, 60),
      idempotencyTtlSeconds: int(env.IOT_IDEMPOTENCY_TTL, 86400),
      replayWindowSeconds: int(env.IOT_REPLAY_WINDOW_SECONDS, 300),
      payloadCapBytes: int(env.IOT_PAYLOAD_CAP_BYTES, 65536),
    },
    oauth: {
      issuer: env.OAUTH_ISSUER ?? '',
      jwksUrl: env.OAUTH_JWKS_URL ?? '',
      audience: env.OAUTH_AUDIENCE ?? '',
    },
    logging: {
      level: env.LOG_LEVEL ?? (envName === 'production' ? 'info' : 'debug'),
      pretty: bool(env.LOG_PRETTY, envName !== 'production'),
    },
    env: envName,
  };
}

/** Build the application config from `process.env` (or an override). */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return src(env);
}

export const config: AppConfig = loadConfig();
