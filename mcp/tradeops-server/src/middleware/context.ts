/**
 * Shared request context and the zero-trust middleware pipeline.
 *
 * EVERY MCP tool call and EVERY IoT webhook request flows through the same
 * ordered chain:
 *
 *   authenticate → authorize → rateLimit → validate → audit → execute
 *
 * No handler may run without passing all five gates. The pipeline is expressed
 * as a single `runToolCall` function so the ordering is enforced in exactly one
 * place and cannot be bypassed by an individual tool.
 */

import type { CallerIdentity } from '../auth/oauth.js';
import type { Role } from '../auth/rbac.js';
import type { ToolTier } from '../auth/rbac.js';

export interface RequestContext {
  requestId: string;
  /** Resolved caller (post-authenticate). */
  identity: CallerIdentity;
  role: Role;
  tenantId: string;
  /** Wall-clock start (ms) for latency accounting. */
  startedAt: number;
}

export interface ToolMeta {
  name: string;
  tier: ToolTier;
  /** True when the tool mutates state and requires an approval token. */
  requiresApproval: boolean;
}

export interface ToolCallRequest {
  tool: string;
  params: Record<string, unknown>;
  /** Approval token for write tools (required when `requiresApproval`). */
  approvalToken?: string;
  /** Identity hint resolved before the chain (e.g. from a session). */
  identity: CallerIdentity;
}

export type ToolStatus = 'ok' | 'error' | 'rejected';

/** Structured error surfaced to the MCP client — never a raw exception. */
export interface StructuredError {
  code: string;
  message: string;
  details?: unknown;
}

/** Result of executing a tool through the pipeline. */
export interface ToolExecutionResult {
  status: ToolStatus;
  /** MCP content blocks returned to the client. */
  content: { type: 'text'; text: string }[];
  isError: boolean;
  /** The gate that rejected the call, when applicable. */
  rejectedBy?: 'authenticate' | 'authorize' | 'rateLimit' | 'validate' | 'audit' | 'approval';
  error?: StructuredError;
  latencyMs: number;
}

/** An MCP tool content result (text-only, per the failure contract). */
export function textResult(payload: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(payload, null, 2) }];
}

export function errorResult(
  code: string,
  message: string,
  details?: unknown,
): { content: { type: 'text'; text: string }[]; isError: boolean; error: StructuredError } {
  const error: StructuredError = { code, message, ...(details !== undefined ? { details } : {}) };
  return {
    content: [{ type: 'text', text: JSON.stringify({ error }, null, 2) }],
    isError: true,
    error,
  };
}
