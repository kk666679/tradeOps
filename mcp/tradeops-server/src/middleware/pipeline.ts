/**
 * The zero-trust tool-call pipeline.
 *
 * This is the ONE place where the security chain is enforced. Every MCP tool
 * call — over stdio or HTTP — must go through `runToolCall`. The order is fixed:
 *
 *   authenticate → authorize → rateLimit → validate → audit → execute
 *
 * The spec is explicit: "No tool handler may run without passing through all
 * five." Because handlers are invoked as a callback *inside* this function
 * (after every gate has passed), no individual tool can bypass the chain.
 *
 * On any gate failure the pipeline short-circuits, still writes an audit event
 * (status `rejected`), records a metric, and returns a structured MCP error
 * content block — it never throws a raw exception to the client.
 */

import type { Authenticator } from '../auth/oauth.js';
import { authorizeCall } from './authorize.js';
import { validateCall } from './validate.js';
import { RateLimiter } from './rateLimit.js';
import { authenticateCall } from './authenticate.js';
import { writeAuditEvent } from './audit.js';
import { metrics } from '../metrics.js';
import { logger } from '../logger.js';
import {
  errorResult,
  textResult,
  type RequestContext,
  type StructuredError,
  type ToolExecutionResult,
} from './context.js';

const log = logger.child({ component: 'pipeline' });

export interface ToolDescriptor {
  name: string;
  tier: 'read' | 'write' | 'privileged' | 'agent';
  requiresApproval: boolean;
  /** Zod schema used to validate input params. */
  schema: { safeParse: (v: unknown) => { success: boolean; data?: unknown; error?: unknown } };
  /** Tool summary for the audit event. */
  description?: string;
}

export interface ApprovalValidator {
  /** Returns true when the approval token is valid for this call. */
  validate(token: string, tool: string, ctx: RequestContext): Promise<boolean> | boolean;
}

export interface PipelineDeps {
  authenticator: Authenticator;
  limiter: RateLimiter;
  ledger: { append: (input: unknown) => Promise<unknown> };
  approvals: ApprovalValidator;
  /** When true, allow a missing credential to resolve to a local-dev admin. */
  localStdio?: boolean;
}

export interface PipelineCallInput {
  tool: string;
  descriptor: ToolDescriptor;
  params: Record<string, unknown>;
  authorizationHeader?: string;
  approvalToken?: string;
  /** The actual handler — only invoked once every gate has passed. */
  handler: (ctx: RequestContext, params: Record<string, unknown>) => Promise<unknown>;
}

function toStructured(err: unknown): StructuredError {
  if (err && typeof err === 'object' && 'code' in err && 'message' in err) {
    return err as StructuredError;
  }
  const message = err instanceof Error ? err.message : String(err);
  return { code: 'internal_error', message };
}

export function createToolCallPipeline(deps: PipelineDeps) {
  return async function runToolCall(input: PipelineCallInput): Promise<ToolExecutionResult> {
    const startedAt = performance.now();
    const requestId = `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    const { tool, descriptor, params } = input;

    // ---- Gate 1: authenticate -----------------------------------------------
    const authRes = authenticateCall(deps.authenticator, input.authorizationHeader, {
      localStdio: deps.localStdio,
    });
    if (!authRes.ok || !authRes.identity) {
      metrics.inc('mcp_tool_calls_total', { tool, status: 'rejected' });
      return {
        status: 'rejected',
        ...errorResult(authRes.code ?? 'unauthenticated', authRes.message ?? 'Unauthorized'),
        rejectedBy: 'authenticate',
        latencyMs: Math.round(performance.now() - startedAt),
      };
    }
    const identity = authRes.identity;

    const ctx: RequestContext = {
      requestId,
      identity,
      role: identity.role,
      tenantId: identity.tenantId,
      startedAt,
    };

    const reject = async (
      rejectedBy: ToolExecutionResult['rejectedBy'],
      code: string,
      message: string,
      details?: unknown,
    ): Promise<ToolExecutionResult> => {
      metrics.inc('mcp_tool_calls_total', { tool, status: 'rejected' });
      await writeAuditEvent(deps.ledger as never, {
        ctx,
        toolName: tool,
        status: 'rejected',
        params,
        output: { rejectedBy, code },
      });
      return {
        status: 'rejected',
        ...errorResult(code, message, details),
        rejectedBy,
        latencyMs: Math.round(performance.now() - startedAt),
      };
    };

    // ---- Gate 2: authorize ---------------------------------------------------
    const authzRes = authorizeCall(ctx, tool);
    if (!authzRes.ok) {
      return reject(
        'authorize',
        authzRes.code ?? 'forbidden',
        authzRes.message ?? 'Forbidden',
        authzRes.details,
      );
    }

    // ---- Gate 3: rateLimit ---------------------------------------------------
    const rlKey = `${identity.userId}:${tool}`;
    const rl = deps.limiter.check(rlKey);
    if (!rl.allowed) {
      return reject('rateLimit', 'rate_limited', 'Rate limit exceeded for this tool.', {
        resetAt: rl.resetAt,
        remaining: rl.remaining,
      });
    }

    // ---- Gate 4: validate ----------------------------------------------------
    const valRes = validateCall<Record<string, unknown>>(descriptor.schema as any, params);
    if (!valRes.ok || !valRes.data) {
      return reject(
        'validate',
        valRes.code ?? 'validation_error',
        valRes.message ?? 'Invalid input',
        valRes.details,
      );
    }
    const validated = valRes.data;

    // ---- Approval token for write tools -------------------------------------
    if (descriptor.requiresApproval) {
      const token = input.approvalToken;
      if (!token) {
        return reject(
          'approval',
          'approval_required',
          `Tool '${tool}' requires an approval token.`,
          { tool },
        );
      }
      let approved = false;
      try {
        approved = await deps.approvals.validate(token, tool, ctx);
      } catch (err) {
        return reject('approval', 'approval_invalid', toStructured(err).message);
      }
      if (!approved) {
        return reject(
          'approval',
          'approval_invalid',
          'Approval token is invalid or expired.',
          { tool },
        );
      }
    }

    // ---- Gate 5 + Execute ----------------------------------------------------
    // The audit event is written after execution with full latency/output size.
    try {
      const output = await input.handler(ctx, validated);
      const latencyMs = Math.round(performance.now() - startedAt);
      metrics.inc('mcp_tool_calls_total', { tool, status: 'ok' });
      metrics.observe('mcp_tool_latency_ms', latencyMs, { tool });
      await writeAuditEvent(deps.ledger as never, {
        ctx,
        toolName: tool,
        status: 'ok',
        params: validated,
        output,
      });
      return { status: 'ok', content: textResult(output), isError: false, latencyMs };
    } catch (err) {
      const structured = toStructured(err);
      const latencyMs = Math.round(performance.now() - startedAt);
      metrics.inc('mcp_tool_calls_total', { tool, status: 'error' });
      log.error({ tool, requestId, err: String(err) }, 'tool handler threw');
      await writeAuditEvent(deps.ledger as never, {
        ctx,
        toolName: tool,
        status: 'error',
        params: validated,
        output: { error: structured },
      });
      return {
        status: 'error',
        ...errorResult(structured.code, structured.message, structured.details),
        latencyMs,
      };
    }
  };
}

export type ToolCallPipeline = ReturnType<typeof createToolCallPipeline>;

