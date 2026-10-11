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
export declare const config: ServerConfig;
