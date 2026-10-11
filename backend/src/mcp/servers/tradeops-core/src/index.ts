// servers/tradeops-core/src/index.ts
// TradeOps Core MCP server hosted by the NestJS backend.

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { PrismaService } from "../../../../prisma/prisma.service";
import { extractRequestMeta, assertProtocolVersion, type RequestMeta } from "../../../shared/schemas/meta";
import { isInputRequired, type ToolResult } from "../../../shared/schemas/mrtr";
import { AuditChain, hashToolInput } from "../../../shared/governance/audit-chain";
import { PolicyEngine, HighValueRequiresApproval, AgentCannotMoveBonded } from "../../../shared/governance/policy-enforcement";
import { initTracer, withToolSpan } from "../../../shared/governance/otel";
import {
  GateInInput, GateOutInput, handleGateIn, handleGateOut, persistGateEvent,
  AllocateInput, QueryInput, handleAllocate, handleQuery,
  LedgerEntryInput, ReconcileInput, handleLedgerEntry,
} from "./tools";
import {
  YARD_URI,
  YARD_URI_TEMPLATE,
  buildYardSnapshot,
  yardResourceDescriptor,
} from "./resources";
import {
  assertTaskOwner,
  startReconciliation,
  reconciliationRegistry,
} from "./tasks/bulk-reconciliation";

const SUPPORTED_VERSIONS = ["2026-07-28"];
const SERVER_NAME = "io.tradeops.mcp.tradeops-core";
type AuthenticatedMeta = RequestMeta & { tenantId: string; actorId: string };
export const TRADEOPS_TOOL_NAMES = [
  "server.discover",
  "gate.in",
  "gate.out",
  "inventory.allocate",
  "inventory.query",
  "ledger.entry",
  "ledger.reconcile",
  "yard.status",
  "tasks.get",
  "tasks.update",
  "tasks.cancel",
] as const;

initTracer(SERVER_NAME);
const audit = new AuditChain();
const policy = new PolicyEngine([HighValueRequiresApproval, AgentCannotMoveBonded]);

function toMcpToolResult<T>(result: ToolResult<T>): CallToolResult {
  const text = isInputRequired(result)
    ? result.message ?? "Additional input is required."
    : JSON.stringify(result.data);
  return {
    ...result,
    content: [{ type: "text", text }],
  };
}

export function createTradeOpsMcpServer(prisma: PrismaService): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: "0.1.0" },
    { capabilities: {} },
  );

  // server/discover
  server.tool(
    "server.discover",
    "Return protocol versions, capabilities, and a tool-list signature.",
    {},
    async () => {
      const tools = [...TRADEOPS_TOOL_NAMES].sort();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            server: SERVER_NAME,
            protocolVersions: SUPPORTED_VERSIONS,
            transport: ["streamable-http"],
            extensions: ["io.modelcontextprotocol/tasks"],
            toolSignature: tools.join("|"),
            tools,
          }),
        }],
      };
    },
  );

  // guarded tool wrapper
  async function guardedTool(
    toolName: string,
    rawParams: unknown,
    handler: (meta: AuthenticatedMeta) => Promise<CallToolResult>,
    policyContext: { valueMYR?: number; zone?: "CFS" | "FIZ" | "FCZ" },
    requestMeta?: Record<string, unknown>,
  ): Promise<CallToolResult> {
    const meta = extractRequestMeta(requestMeta);
    if (!meta.tenantId || !meta.actorId) {
      throw new Error("authenticated tenant and actor metadata are required");
    }
    const authenticatedMeta: AuthenticatedMeta = {
      ...meta,
      tenantId: meta.tenantId,
      actorId: meta.actorId,
    };
    const tenantId = (rawParams as { tenantId?: unknown } | null)?.tenantId;
    if (typeof tenantId === "string" && tenantId !== authenticatedMeta.tenantId) {
      throw new Error("tool tenant does not match the authenticated tenant");
    }
    assertProtocolVersion(authenticatedMeta, SUPPORTED_VERSIONS);

    policy.enforce({
      tenantId: authenticatedMeta.tenantId,
      actorId: authenticatedMeta.actorId,
      agentId: authenticatedMeta.agentId,
      tool: toolName,
      valueMYR: policyContext.valueMYR,
      zone: policyContext.zone,
    });

    return withToolSpan(
      {
        tenantId: authenticatedMeta.tenantId,
        actorId: authenticatedMeta.actorId,
        agentId: authenticatedMeta.agentId,
        tool: toolName,
        extension: toolName.startsWith("tasks.") ? "tasks" : undefined,
      },
      async () => {
        const result = await handler(authenticatedMeta);
        audit.append({
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          actor: authenticatedMeta.actorId,
          agentId: authenticatedMeta.agentId,
          tenantId: authenticatedMeta.tenantId,
          tool: toolName,
          inputHash: hashToolInput(rawParams),
          outputSummary: isInputRequired(result) ? "input_required" : "complete",
        });
        return result;
      },
    );
  }

  // gate tools
  server.tool("gate.in", "Record a container gate-in.", GateInInput.shape, async (raw, extra) =>
    guardedTool(
      "gate.in",
      raw,
      async (meta) => {
        const result = await handleGateIn(raw);
        if (isInputRequired(result)) return toMcpToolResult(result);
        return toMcpToolResult({
          ...result,
          data: await persistGateEvent(prisma, raw, result.data, meta.actorId),
        });
      },
      {},
      extra._meta,
    )
  );

  server.tool("gate.out", "Record a container gate-out.", GateOutInput.shape, async (raw, extra) =>
    guardedTool(
      "gate.out",
      raw,
      async (meta) => {
        const result = await handleGateOut(raw);
        if (isInputRequired(result)) return toMcpToolResult(result);
        return toMcpToolResult({
          ...result,
          data: await persistGateEvent(prisma, raw, result.data, meta.actorId),
        });
      },
      {},
      extra._meta,
    )
  );

  // inventory tools
  server.tool("inventory.allocate", "Allocate a yard slot.", AllocateInput.shape, async (raw, extra) =>
    guardedTool(
      "inventory.allocate",
      raw,
      () => handleAllocate(raw, prisma).then(toMcpToolResult),
      { zone: raw.zone },
      extra._meta,
    )
  );

  server.tool("inventory.query", "Query inventory by lot / batch / serial.", QueryInput.shape, async (raw, extra) =>
    guardedTool(
      "inventory.query",
      raw,
      () => handleQuery(raw, prisma).then(toMcpToolResult),
      {},
      extra._meta,
    )
  );

  // ledger tools
  server.tool("ledger.entry", "Post a bonded-ledger entry.", LedgerEntryInput.shape, async (raw, extra) =>
    guardedTool(
      "ledger.entry",
      raw,
      (meta) => handleLedgerEntry(raw, prisma, meta.actorId).then(toMcpToolResult),
      {},
      extra._meta,
    )
  );

  server.tool("ledger.reconcile", "Bulk reconciliation — returns a Task handle.", ReconcileInput.shape, async (raw, extra) =>
    guardedTool("ledger.reconcile", raw, async (meta) => {
      const params = ReconcileInput.parse(raw);
      const task = startReconciliation(params, prisma, {
        tenantId: meta.tenantId,
        actorId: meta.actorId,
      });
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
    }, {}, extra._meta)
  );

  // tasks extension
  server.tool("tasks.get", "Poll a reconciliation task by ID.", { taskId: z.string() }, async ({ taskId }, extra) =>
    guardedTool("tasks.get", { taskId }, async (meta) => {
      assertTaskOwner(taskId, meta.tenantId, meta.actorId);
      const t = reconciliationRegistry.get(taskId);
      if (!t) throw new Error(`unknown task ${taskId}`);
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
    }, {}, extra._meta)
  );

  server.tool("tasks.update", "Provide input to a task waiting on client.", {
    taskId: z.string(),
    input: z.unknown(),
  }, async ({ taskId, input }, extra) =>
    guardedTool("tasks.update", { taskId, input }, async (meta) => {
      assertTaskOwner(taskId, meta.tenantId, meta.actorId);
      await reconciliationRegistry.update(taskId, input);
      return { content: [{ type: "text", text: JSON.stringify({ ok: true }) }] };
    }, {}, extra._meta)
  );

  server.tool("tasks.cancel", "Cancel a running task.", { taskId: z.string() }, async ({ taskId }, extra) =>
    guardedTool("tasks.cancel", { taskId }, async (meta) => {
      assertTaskOwner(taskId, meta.tenantId, meta.actorId);
      await reconciliationRegistry.cancel(taskId);
      return { content: [{ type: "text", text: JSON.stringify({ ok: true }) }] };
    }, {}, extra._meta)
  );

  // yard status
  server.tool("yard.status", "Read the current yard occupancy snapshot.", { tenantId: z.string() }, async ({ tenantId }, extra) => {
    return guardedTool(
      "yard.status",
      { tenantId },
      async () => ({ content: [{ type: "text", text: JSON.stringify(await buildYardSnapshot(prisma, tenantId)) }] }),
      {},
      extra._meta,
    );
  });

  // yard resource
  server.resource(
    "yard",
    new ResourceTemplate(YARD_URI_TEMPLATE, { list: undefined }),
    yardResourceDescriptor(),
    async (uri, _variables, extra) => {
      const tenantId = decodeURIComponent(uri.pathname.replace(/^\/+/, ""));
      const meta = extractRequestMeta(extra._meta);
      if (!meta.tenantId || !meta.actorId) {
        throw new Error("authenticated tenant and actor metadata are required");
      }
      if (tenantId !== meta.tenantId) {
        throw new Error("resource tenant does not match the authenticated tenant");
      }
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(await buildYardSnapshot(prisma, tenantId)),
        }],
      };
    },
  );

  return server;
}
