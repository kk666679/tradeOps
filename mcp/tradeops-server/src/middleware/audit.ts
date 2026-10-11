/**
 * Middleware gate 5 — audit.
 *
 * Every tool call writes a first-class ledger event (`audit.tool.called`) that
 * is a real entry in the bonded hash chain, not a side log. The event carries
 * the full audit record required by the spec:
 *
 *   request_id, tool_name, user_id, tenant_id, timestamp, latency_ms,
 *   status, sanitized_params, output_size_bytes
 *
 * Params are deep-sanitized (secrets redacted) before they touch the ledger.
 */

import type { BondedLedger } from '../backend/ledger.js';
import type { RequestContext } from '../middleware/context.js';
import { byteLength, sanitizeParams } from './sanitize.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'audit' });

export interface AuditRecord {
  requestId: string;
  toolName: string;
  userId: string;
  tenantId: string;
  timestamp: string;
  latencyMs: number;
  status: 'ok' | 'error' | 'rejected';
  sanitizedParams: Record<string, unknown>;
  outputSizeBytes: number;
  refs?: string[];
}

export interface AuditInput {
  ctx: RequestContext;
  toolName: string;
  status: 'ok' | 'error' | 'rejected';
  params: Record<string, unknown>;
  output: unknown;
  refs?: string[];
}

/** Build the audit record from a completed (or rejected) call. */
export function buildAuditRecord(input: AuditInput): AuditRecord {
  return {
    requestId: input.ctx.requestId,
    toolName: input.toolName,
    userId: input.ctx.identity.userId,
    tenantId: input.ctx.tenantId,
    timestamp: new Date().toISOString(),
    latencyMs: Math.round(performance.now() - input.ctx.startedAt),
    status: input.status,
    sanitizedParams: sanitizeParams(input.params),
    outputSizeBytes: byteLength(input.output),
    ...(input.refs ? { refs: input.refs } : {}),
  };
}

/**
 * Append the audit event to the bonded ledger. Failures are logged but never
 * propagate — an audit-write failure must not mask the tool's own result.
 */
export async function writeAuditEvent(
  ledger: BondedLedger,
  input: AuditInput,
): Promise<void> {
  try {
    const record = buildAuditRecord(input);
    await ledger.append({
      eventType: 'audit.tool.called',
      zone: 'CONTROL',
      actor: input.ctx.identity.userId,
      agent: 'mcp-server',
      refs: record.refs ?? [],
      payload: record as unknown as Record<string, unknown>,
    });
  } catch (err) {
    log.warn(
      { toolName: input.toolName, userId: input.ctx.identity.userId, err: String(err) },
      'audit append failed',
    );
  }
}

/** Convenience wrapper for tools to audit their calls. */
export async function auditToolCall(
  ledger: BondedLedger,
  ctx: RequestContext,
  toolName: string,
  result: 'success' | 'error',
  refs?: string[],
): Promise<void> {
  await writeAuditEvent(ledger, {
    ctx,
    toolName,
    status: result === 'success' ? 'ok' : 'error',
    params: {},
    output: { result },
    refs,
  });
}

