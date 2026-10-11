"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTracer = initTracer;
exports.withToolSpan = withToolSpan;
const api_1 = require("@opentelemetry/api");
let tracer = null;
function initTracer(serviceName) {
    tracer = api_1.trace.getTracer(serviceName);
}
async function withToolSpan(attrs, fn) {
    if (!tracer)
        return fn();
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
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            return result;
        }
        catch (err) {
            span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: err.message });
            throw err;
        }
        finally {
            span.end();
        }
    });
}
//# sourceMappingURL=otel.js.map