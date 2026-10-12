// backend/src/integrations/jkdm/config.ts

import type { JkdmMode } from "./types";

export interface JkdmConfig {
  mode: JkdmMode;
  endpoint: string | null;
  clientCertPath: string | null;
  clientCertPassphrase: string | null;
  brokerCode: string | null;
  /** Explicit operator confirmation that the transport is verified. */
  productionEnabled: boolean;
  connectionTimeoutMs: number;
  requestTimeoutMs: number;
  maxRetries: number;
  devAdapterEnabled: boolean;
}

/**
 * Resolution rules (fail-closed):
 *
 *  production  ← every credential AND JKDM_PRODUCTION_ENABLED=true
 *                AND JKDM_TRANSPORT_VERIFIED=true
 *  development ← NODE_ENV !== production AND JKDM_DEV_ADAPTER=true
 *  manual      ← otherwise
 *
 * Environment variables alone never enable production. An operator must
 * flip two explicit flags to confirm the transport and authentication have
 * been verified against official JKDM documentation.
 */
export function resolveJkdmConfig(env: NodeJS.ProcessEnv = process.env): JkdmConfig {
  const endpoint = env.JKDM_ENDPOINT?.trim() || null;
  const clientCertPath = env.JKDM_CLIENT_CERT?.trim() || null;
  const clientCertPassphrase = env.JKDM_CERT_PASSPHRASE?.trim() || null;
  const brokerCode = env.JKDM_BROKER_CODE?.trim() || null;

  const productionEnabled = env.JKDM_PRODUCTION_ENABLED === "true";
  const transportVerified = env.JKDM_TRANSPORT_VERIFIED === "true";

  const credsPresent = Boolean(endpoint && clientCertPath && brokerCode);

  const base: Omit<JkdmConfig, "mode" | "devAdapterEnabled"> = {
    endpoint,
    clientCertPath,
    clientCertPassphrase,
    brokerCode,
    productionEnabled,
    connectionTimeoutMs: Number(env.JKDM_CONNECT_TIMEOUT_MS ?? 10_000),
    requestTimeoutMs: Number(env.JKDM_REQUEST_TIMEOUT_MS ?? 30_000),
    maxRetries: Number(env.JKDM_MAX_RETRIES ?? 1),
  };

  if (credsPresent && productionEnabled && transportVerified) {
    return { ...base, mode: "production", devAdapterEnabled: false };
  }

  if (env.NODE_ENV !== "production" && env.JKDM_DEV_ADAPTER === "true") {
    return { ...base, mode: "development", devAdapterEnabled: true };
  }

  return { ...base, mode: "manual", devAdapterEnabled: false };
}
