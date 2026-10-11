// shared/transport/streamable-http.ts
// Session-managed Streamable HTTP binding for the backend-hosted MCP server.

import type { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRequestMeta, assertProtocolVersion, type RequestMeta } from "../schemas/meta";

const SUPPORTED_VERSIONS = ["2026-07-28"];
const sessions = new Map<
  string,
  {
    transport: StreamableHTTPServerTransport;
    actorId: string;
    tenantId: string;
  }
>();

export interface StreamableHttpOptions {
  resourceUri: string;
  actorId: string;
  tenantId: string;
  allowedOrigins?: string[];
}

export interface EnrichedRequest extends Request {
  mcpMeta: RequestMeta;
}

export function createStreamableHttpHandler(
  createServer: () => McpServer,
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

    const requestBody = req.body as { method?: string } | undefined;
    const requestedSessionId = req.headers["mcp-session-id"];
    const sessionId = Array.isArray(requestedSessionId) ? requestedSessionId[0] : requestedSessionId;

    if (sessionId) {
      const session = sessions.get(sessionId);
      if (!session) {
        res.status(404).json({
          jsonrpc: "2.0",
          error: { code: -32001, message: "unknown or expired MCP session" },
          id: null,
        });
        return;
      }
      if (session.actorId !== options.actorId || session.tenantId !== options.tenantId) {
        res.status(403).json({
          jsonrpc: "2.0",
          error: { code: -32001, message: "MCP session principal mismatch" },
          id: null,
        });
        return;
      }
      await session.transport.handleRequest(req, res, req.body);
      return;
    }

    if (requestBody?.method !== "initialize") {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "MCP session initialization is required" },
        id: null,
      });
      return;
    }

    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      enableJsonResponse: true,
    });
    transport.onclose = () => {
      const initializedSessionId = transport.sessionId;
      if (initializedSessionId) sessions.delete(initializedSessionId);
    };
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    const initializedSessionId = transport.sessionId;
    if (initializedSessionId) {
      sessions.set(initializedSessionId, {
        transport,
        actorId: options.actorId,
        tenantId: options.tenantId,
      });
    }
  };
}
