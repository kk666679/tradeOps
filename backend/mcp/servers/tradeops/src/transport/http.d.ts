import type { Express } from "express";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export declare function installHttpTransport(app: Express, server: McpServer): void;
