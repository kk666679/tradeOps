// shared/transport/streamable-http.ts
// Stateless Streamable HTTP binding for MCP 2026-07-28.

import type { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRequestMeta, assertProtocolVersion, type RequestMeta } from "../schemas/meta";

const SUPPORTED_VERSIONS = ["2026-07-28"];

export interface StreamableHttpOptions {
  resourceUri: string;
  allowedOrigins?: string[];
}

export interface EnrichedRequest extends Request {
  mcpMeta: RequestMeta;
}

export function createStreamableHttpHandler(
  server: McpServer,
  options: StreamableHttpOptions,
) {
  return async function handle(req: Request, res: Response): Promise<void> {
    const body = req.body as { params?: { _meta?: Record<string, unknown> } };
    const meta = extractRequestMeta(body?.params?._meta);
    try {
      assertProtocolVersion(meta, SUPPORTED_VERSIONS);
    } catch (err) {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32600, message: (err as Error).message },
        id: null,
      });
      return;
    }
    const aud = String(req.headers["x-mcp-resource"] ?? "");
    if (aud && aud !== options.resourceUri) {
      res.status(403).json({
        jsonrpc: "2.0",
        error: { code: -32001, message: "resource indicator mismatch" },
        id: null,
      });
      return;
    }
    (req as EnrichedRequest).mcpMeta = meta;

    const transport = new StreamableHTTPServerTransport({
      enableJsonResponse: true,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  };
}
