// backend/mcp/servers/src/governance/otel.ts

import { trace, SpanStatusCode, type Tracer } from "@opentelemetry/api";

let tracer: Tracer | null = null;

export function initTracer(serviceName: string): void {
  tracer = trace.getTracer(serviceName);
}

export interface ToolSpanAttributes {
  tenantId: string;
  actorId: string;
  agentId?: string;
  tool: string;
  ruleSetVersion?: string;
  extension?: "tasks" | "apps" | "skills";
}

export async function withToolSpan<T>(
  attrs: ToolSpanAttributes, fn: () => Promise<T>,
): Promise<T> {
  if (!tracer) return fn();
  return tracer.startActiveSpan(`mcp.tool.${attrs.tool}`, async (span) => {
    span.setAttributes({
      "mcp.tenant_id": attrs.tenantId,
      "mcp.actor_id": attrs.actorId,
      "mcp.agent_id": attrs.agentId ?? "",
      "mcp.tool": attrs.tool,
      "mcp.rule_set_version": attrs.ruleSetVersion ?? "",
      "mcp.extension": attrs.extension ?? "",
    });
    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error).message });
      throw err;
    } finally {
      span.end();
    }
  });
}
