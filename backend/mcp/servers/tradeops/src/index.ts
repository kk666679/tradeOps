// backend/mcp/servers/tradeops/src/index.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { config } from "./config";
import { logger } from "./logger";
import { metrics } from "./metrics";
import { installHttpTransport, handleSubscriptionsListen, extractRequestMeta } from "./transport";
import { authenticate } from "./middleware/authenticate";
import { enrichContext } from "./middleware/context";
import { recordAudit, hashInput } from "./middleware/audit";
import { rateLimit } from "./middleware/rateLimit";
import { sanitizeStrings } from "./middleware/sanitize";
import { ulid } from "./util/ulid";

// Tool handlers
import {
  ListAgentsInput, handleListAgents,
  RagSearchInput, handleRagSearch, ForecastInput, handleForecast,
  CrossZoneMoveInput, handleCrossZoneMove,
  ClassifyInput, handleClassify, DutyInput, handleDuty,
  FczTradeInput, handleFczTrade, FizManufactureInput, handleFizManufacture,
  DeviceStatusInput, handleDeviceStatus, ZoneGraphInput, handleZoneGraph,
  LedgerEntryInput, handleLedgerEntry, LedgerSummaryInput, handleLedgerSummary,
} from "./tools";

import { handleIotWebhook } from "./iot/webhookHandler";

const server = new McpServer(
  { name: config.serverName, version: config.serverVersion },
  { capabilities: {} },
);

// --- server/discover -----------------------------------------------------
server.tool(
  "server.discover",
  "Return protocol versions, capabilities, and a tool-list signature.",
  {},
  async () => {
    const tools = [
      "server.discover",
      "agents.list",
      "ai.rag.search", "ai.forecast.predict",
      "crossZone.move",
      "customs.classify", "customs.duty",
      "fcz.trade", "fiz.manufacture",
      "iot.device.status", "iot.zone.graph",
      "ledger.entry", "ledger.summary",
    ].sort();
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          server: config.serverName,
          protocolVersions: config.supportedProtocolVersions,
          transport: ["stdio", "streamable-http"],
          extensions: ["io.modelcontextprotocol/tasks"],
          featureFlags: config.featureFlags,
          toolSignature: tools.join("|"),
          tools,
        }),
      }],
    };
  },
);

// --- guarded wrapper -----------------------------------------------------
async function guarded<T>(
  toolName: string,
  rawParams: unknown,
  handler: () => Promise<T>,
): Promise<T> {
  const params = rawParams as { _meta?: Record<string, unknown> };
  const meta = enrichContext(params);
  authenticate(meta);
  rateLimit({ key: `tenant:${meta.tenantId}`, perMinute: 600 });

  const clean = sanitizeStrings(rawParams);
  const started = Date.now();
  try {
    const result = await handler();
    metrics.counter("mcp_tool_calls_total", "Total tool calls", { tool: toolName, outcome: "ok" });
    metrics.observe("mcp_tool_duration_seconds", "Tool duration", (Date.now() - started) / 1000);
    recordAudit({
      id: ulid(),
      at: new Date().toISOString(),
      tenantId: meta.tenantId!,
      actorId: meta.actorId!,
      agentId: meta.agentId,
      tool: toolName,
      inputHash: hashInput(clean),
      outputSummary: "ok",
    });
    return result;
  } catch (err) {
    metrics.counter("mcp_tool_calls_total", "Total tool calls", { tool: toolName, outcome: "error" });
    logger.error("tool.error", { tool: toolName, error: (err as Error).message });
    throw err;
  }
}

// --- Tool registrations --------------------------------------------------
server.tool("agents.list", "List agents available to a tenant.", ListAgentsInput.shape,
  async (raw) => guarded("agents.list", raw, () => handleListAgents(raw as never)));

server.tool("ai.rag.search", "Semantic search over cargo documents.", RagSearchInput.shape,
  async (raw) => guarded("ai.rag.search", raw, () => handleRagSearch(raw as never)));

server.tool("ai.forecast.predict", "Cargo volume forecast (Task-backed).", ForecastInput.shape,
  async (raw) => guarded("ai.forecast.predict", raw, () => handleForecast(raw as never)));

server.tool("crossZone.move", "Move a container between zones.", CrossZoneMoveInput.shape,
  async (raw) => guarded("crossZone.move", raw, () => handleCrossZoneMove(raw as never)));

server.tool("customs.classify", "HS/AHTN classification with confidence.", ClassifyInput.shape,
  async (raw) => guarded("customs.classify", raw, () => handleClassify(raw as never)));

server.tool("customs.duty", "Duty / SST / excise calculation.", DutyInput.shape,
  async (raw) => guarded("customs.duty", raw, () => handleDuty(raw as never)));

server.tool("fcz.trade", "FCZ trade operation.", FczTradeInput.shape,
  async (raw) => guarded("fcz.trade", raw, () => handleFczTrade(raw as never)));

server.tool("fiz.manufacture", "FIZ manufacturing work order.", FizManufactureInput.shape,
  async (raw) => guarded("fiz.manufacture", raw, () => handleFizManufacture(raw as never)));

server.tool("iot.device.status", "Device status for a tenant.", DeviceStatusInput.shape,
  async (raw) => guarded("iot.device.status", raw, () => handleDeviceStatus(raw as never)));

server.tool("iot.zone.graph", "Zone graph for a tenant.", ZoneGraphInput.shape,
  async (raw) => guarded("iot.zone.graph", raw, () => handleZoneGraph(raw as never)));

server.tool("ledger.entry", "Post a bonded-ledger entry.", LedgerEntryInput.shape,
  async (raw) => guarded("ledger.entry", raw, () => handleLedgerEntry(raw as never)));

server.tool("ledger.summary", "Bonded ledger summary for a tenant.", LedgerSummaryInput.shape,
  async (raw) => guarded("ledger.summary", raw, () => handleLedgerSummary(raw as never)));

// --- Boot ----------------------------------------------------------------
async function main(): Promise<void> {
  if (config.transport === "stdio") {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("stdio transport connected");
  } else {
    const app = express();
    app.use(express.json({ limit: "2mb" }));
    installHttpTransport(app, server);
    app.post("/subscriptions/listen", (req, res) => handleSubscriptionsListen(req, res));
    app.post("/iot/webhook", async (req, res) => {
      try { res.json(await handleIotWebhook(req.body)); }
      catch (e) { res.status(400).json({ error: (e as Error).message }); }
    });
    app.get("/metrics", (_req, res) => { res.type("text/plain").send(metrics.render()); });
    app.listen(config.httpPort, () => logger.info(`streamable-http listening on :${config.httpPort}`));
  }
}

main().catch((err) => {
  logger.error("fatal", { error: (err as Error).stack ?? String(err) });
  process.exit(1);
});
