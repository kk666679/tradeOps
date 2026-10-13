// backend/src/integrations/jkdm/index.ts

import type { JkdmAdapter } from "./types";
import { resolveJkdmConfig, type JkdmConfig } from "./config";
import { createProdAdapter, createDevAdapter, createManualAdapter } from "./adapters";
import type { AuditSink } from "./audit/audit-events";
import { logOnlyAuditSink } from "./audit/audit-events";

export * from "./types";
export { resolveJkdmConfig } from "./config";
export type { JkdmConfig } from "./config";
export * from "./audit/audit-events";
export * from "./state/declaration-state";
export { JkdmService } from "./jkdm.service";
export type {
  JkdmCapabilitySnapshot,
  SubmitDeclarationArgs,
  RecordManualArgs,
} from "./jkdm.service";
export { JkdmRouter } from "./jkdm.router";

let cached: JkdmAdapter | null = null;
let cachedConfig: JkdmConfig | null = null;

export function resolveJkdmAdapter(audit: AuditSink = logOnlyAuditSink): JkdmAdapter {
  if (cached) return cached;
  const config = resolveJkdmConfig();
  cachedConfig = config;
  switch (config.mode) {
    case "production":  cached = createProdAdapter(config, audit); break;
    case "development": cached = createDevAdapter(audit); break;
    case "manual":      cached = createManualAdapter(audit); break;
  }
  return cached;
}

export function getJkdmConfig(): JkdmConfig {
  if (!cachedConfig) cachedConfig = resolveJkdmConfig();
  return cachedConfig;
}

export function __resetJkdmAdapterForTests(): void {
  cached = null;
  cachedConfig = null;
}
