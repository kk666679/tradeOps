// servers/tradeops-core/src/index.ts
// TradeOps Core MCP server — 2026-07-28 stateless core.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { startStdio } from "../../../shared/transport/stdio";
import { extractRequestMeta, assertProtocolVersion } from "../../../shared/schemas/meta";
import { isInputRequired } from "../../../shared/schemas/mrtr";
import { AuditChain, hashToolInput } from "../../../shared/governance/audit-chain";
import { PolicyEngine, HighValueRequiresApproval, AgentCannotMoveBonded } from "../../../shared/governance/policy-enforcement";
import { initTracer, withToolSpan } from "../../../shared/governance/otel";
import {
  GateInInput, GateOutInput, handleGateIn, handleGateOut,
  AllocateInput, QueryInput, handleAllocate, handleQuery,
  LedgerEntryInput, ReconcileInput, handleLedgerEntry,
} from "./tools";
import { YARD_URI, buildYardSnapshot, yardResourceDescriptor } from "./resources";
import { startReconciliation, reconciliationRegistry } from "./tasks/bulk-reconciliation";

const SUPPORTED_VERSIONS = ["2026-07-28"];
const SERVER_NAME = "io.tradeops.mcp.tradeops-core";

initTracer(SERVER_NAME);
const audit = new AuditChain();
const policy = new PolicyEngine([HighValueRequiresApproval, AgentCannotMoveBonded]);

const server = new McpServer(
  { name: SERVER_NAME, version: "0.1.0" },
  { capabilities: {} },
);

/* server/discover --------------------------------------------------------- */
server.tool(
  "server.discover",
  "Return protocol versions, capabilities, and a tool-list signature.",
  {},
  async () => {
    const tools = [
      "server.discover",
      "gate.in", "gate.out",
      "inventory.allocate", "inventory.query",
      "ledger.entry", "ledger.reconcile",
      "yard.status",
      "tasks/get", "tasks/update", "tasks/cancel",
    ].sort();
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          server: SERVER_NAME,
          protocolVersions: SUPPORTED_VERSIONS,
          transport: ["stdio", "streamable-http"],
          extensions: ["io.modelcontextprotocol/tasks"],
          toolSignature: tools.join("|"),
          tools,
        }),
      }],
    };
  },
);

/* guarded tool wrapper ---------------------------------------------------- */
async function guardedTool<T>(
  toolName: string,
  rawParams: unknown,
  handler: () => Promise<T>,
  policyContext: { valueMYR?: number; zone?: "CFS" | "FIZ" | "FCZ" },
): Promise<T> {
  const params = rawParams as { _meta?: Record<string, unknown> };
  const meta = extractRequestMeta(params?._meta);
  assertProtocolVersion(meta, SUPPORTED_VERSIONS);

  policy.enforce({
    tenantId: meta.tenantId ?? "unknown",
    actorId: meta.actorId ?? "unknown",
    agentId: meta.agentId,
    tool: toolName,
    valueMYR: policyContext.valueMYR,
    zone: policyContext.zone,
  });

  return withToolSpan(
    {
      tenantId: meta.tenantId ?? "unknown",
      actorId: meta.actorId ?? "unknown",
      agentId: meta.agentId,
      tool: toolName,
      extension: toolName.startsWith("tasks/") ? "tasks" : undefined,
    },
    async () => {
      const result = await handler();
      audit.append({
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        actor: meta.actorId ?? "unknown",
        agentId: meta.agentId,
        tenantId: meta.tenantId ?? "unknown",
        tool: toolName,
        inputHash: hashToolInput(params),
        outputSummary: isInputRequired(result) ? "input_required" : "complete",
      });
      return result;
    },
  );
}

/* gate tools -------------------------------------------------------------- */
server.tool("gate.in", "Record a container gate-in.", GateInInput.shape, async (raw) =>
  guardedTool("gate.in", raw, () => handleGateIn(raw as z.infer<typeof GateInInput>), {})
);

server.tool("gate.out", "Record a container gate-out.", GateOutInput.shape, async (raw) =>
  guardedTool("gate.out", raw, () => handleGateOut(raw as z.infer<typeof GateOutInput>), {})
);

/* inventory tools --------------------------------------------------------- */
server.tool("inventory.allocate", "Allocate a yard slot.", AllocateInput.shape, async (raw) =>
  guardedTool("inventory.allocate", raw, () => handleAllocate(raw as z.infer<typeof AllocateInput>), {})
);

server.tool("inventory.query", "Query inventory by lot / batch / serial.", QueryInput.shape, async (raw) =>
  guardedTool("inventory.query", raw, () => handleQuery(raw as z.infer<typeof QueryInput>), {})
);

/* ledger tools ------------------------------------------------------------ */
server.tool("ledger.entry", "Post a bonded-ledger entry.", LedgerEntryInput.shape, async (raw) =>
  guardedTool("ledger.entry", raw, () => handleLedgerEntry(raw as z.infer<typeof LedgerEntryInput>), {})
);

server.tool("ledger.reconcile", "Bulk reconciliation — returns a Task handle.", ReconcileInput.shape, async (raw) =>
  guardedTool("ledger.reconcile", raw, async () => {
    const params = raw as z.infer<typeof ReconcileInput>;
    const task = startReconciliation(params);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          taskId: task.taskId,
          status: task.status,
          pollIntervalMs: task.pollIntervalMs,
        }),
      }],
    };
  }, {})
);

/* tasks extension --------------------------------------------------------- */
server.tool("tasks/get", "Poll a task by ID.", { taskId: z.string() }, async ({ taskId }) => {
  const t = reconciliationRegistry.get(taskId);
  if (!t) return { content: [{ type: "text", text: JSON.stringify({ error: "unknown task" }) }] };
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        taskId: t.taskId,
        status: t.status,
        progress: t.progress,
        result: t.result,
        error: t.error,
        inputRequest: t.inputRequest,
      }),
    }],
  };
});

server.tool("tasks/update", "Provide input to a task waiting on client.", {
  taskId: z.string(),
  input: z.unknown(),
}, async ({ taskId, input }) => {
  await reconciliationRegistry.update(taskId, input as never);
  return { content: [{ type: "text", text: JSON.stringify({ ok: true }) }] };
});

server.tool("tasks/cancel", "Cancel a running task.", { taskId: z.string() }, async ({ taskId }) => {
  await reconciliationRegistry.cancel(taskId);
  return { content: [{ type: "text", text: JSON.stringify({ ok: true }) }] };
});

/* yard status ------------------------------------------------------------- */
server.tool("yard.status", "Read the current yard occupancy snapshot.", { tenantId: z.string() }, async ({ tenantId }) => {
  return {
    content: [{ type: "text", text: JSON.stringify(buildYardSnapshot(tenantId)) }],
  };
});

/* yard resource ----------------------------------------------------------- */
server.resource(
  "yard",
  YARD_URI("{tenantId}"),
  yardResourceDescriptor(),
  async (uri) => {
    const tenantId = uri.pathname.replace(/^\/+/, "").replace(/\//g, "");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(buildYardSnapshot(tenantId)),
      }],
    };
  },
);

/* boot -------------------------------------------------------------------- */
async function main(): Promise<void> {
  await startStdio(server);
}

main().catch((err) => {
  process.stderr.write(`fatal: ${(err as Error).stack ?? err}\n`);
  process.exit(1);
});
