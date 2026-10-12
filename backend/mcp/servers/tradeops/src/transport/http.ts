// backend/mcp/servers/tradeops/src/transport/http.ts
// Stateless Streamable HTTP binding (2026-07-28).

import type { Express, Request, Response } from "express";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from "../config.js";
import { extractRequestMeta } from "./headers.js";

export function installHttpTransport(app: Express, server: McpServer): void {
  app.post("/mcp", async (req: Request, res: Response) => {
    const body = req.body as { params?: { _meta?: Record<string, unknown> } };
    const meta = extractRequestMeta(body?.params?._meta);
    if (!config.supportedProtocolVersions.includes(meta.protocolVersion)) {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32600, message: `Unsupported protocolVersion=${meta.protocolVersion}` },
        id: null,
      });
      return;
    }
    const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/health", (_req: Request, res: Response) => res.status(200).json({ ok: true }));
}
