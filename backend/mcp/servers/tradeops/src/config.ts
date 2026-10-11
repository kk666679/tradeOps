// backend/mcp/servers/tradeops/src/config.ts

export interface ServerConfig {
  serverName: string;
  serverVersion: string;
  protocolVersion: string;
  supportedProtocolVersions: string[];
  transport: "stdio" | "streamable-http";
  httpPort: number;
  canonicalResource: string;
  databaseUrl?: string;
  redisUrl?: string;
  weaviateUrl?: string;
  jwtSecret?: string;
  otelEndpoint?: string;
  featureFlags: {
    ffTasks: boolean;
    ffApps: boolean;
    ffSkills: boolean;
    ffRag: boolean;
    ffTwin: boolean;
  };
}

export const config: ServerConfig = {
  serverName: "io.tradeops.mcp.tradeops",
  serverVersion: "0.2.0",
  protocolVersion: "2026-07-28",
  supportedProtocolVersions: ["2026-07-28"],
  transport: (process.env.MCP_TRANSPORT as ServerConfig["transport"]) ?? "stdio",
  httpPort: Number(process.env.MCP_HTTP_PORT ?? 8794),
  canonicalResource: process.env.MCP_RESOURCE ?? "https://tradeops.local/mcp/tradeops",
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  weaviateUrl: process.env.WEAVIATE_URL,
  jwtSecret: process.env.JWT_SECRET,
  otelEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  featureFlags: {
    ffTasks:  process.env.FF_TASKS  === "true",
    ffApps:   process.env.FF_APPS   === "true",
    ffSkills: process.env.FF_SKILLS === "true",
    ffRag:    process.env.FF_RAG    === "true",
    ffTwin:   process.env.FF_TWIN   === "true",
  },
};
