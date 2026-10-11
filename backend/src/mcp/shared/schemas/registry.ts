// shared/schemas/registry.ts
// Server manifest types for the MCP registry (2026).

export type ServerTier = "Official" | "Verified" | "Community" | "Experimental";
export type ServerStatus = "active" | "deprecated" | "suspended";

export interface ServerToolSummary {
  name: string;
  description: string;
  requiresExtensions?: string[];
}

export interface ServerManifest {
  $schema: "https://modelcontextprotocol.io/schemas/2026-07-28/server.json";
  name: string;
  title: string;
  description: string;
  version: string;
  protocolVersion: "2026-07-28";
  tier: ServerTier;
  status: ServerStatus;
  transport: "stdio" | "streamable-http" | "both" | Array<"stdio" | "streamable-http">;
  stateless: boolean;
  tools: ServerToolSummary[];
  capabilities: {
    "io.modelcontextprotocol/tasks"?: boolean;
    "io.modelcontextprotocol/ui"?: boolean;
    "io.modelcontextprotocol/skills"?: boolean;
  };
  homepage?: string;
  repository?: string;
  license?: string;
}
