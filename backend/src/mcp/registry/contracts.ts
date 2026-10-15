// src/mcp/registry/contracts.ts
// Canonical zod schemas for the TradeOps MCP registry documents.
//
// The JSON files under backend/mcp/registry/ are the authoring source of
// truth. A generation step (scripts/mcp-registry-generate.ts) validates them
// against these schemas and emits the derived runtime artifact under
// generated/. Never edit the generated file by hand.

import { z } from "zod";

/** Protocol version this backend implements and accepts. */
export const SUPPORTED_PROTOCOL_VERSION = "2026-07-28";

const protocolVersion = z.literal(SUPPORTED_PROTOCOL_VERSION);

const schemaUrl = z.string().url();

// ---------------------------------------------------------------------------
// Server manifest tool contract
// ---------------------------------------------------------------------------

export const ToolPermissions = z
  .object({
    /** OAuth scopes that satisfy this tool. Empty means "no scope requirement
     *  beyond an authenticated tenant principal" (legacy internal tokens). */
    scopes: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const ToolBackendMapping = z
  .object({
    /**
     * - in-process-prisma: handler runs inside the NestJS backend against Prisma.
     * - builtin: protocol plumbing owned by the MCP server itself (discover, tasks).
     * - http-adapter: handler delegates to a backend HTTP endpoint (future).
     */
    type: z.enum(["in-process-prisma", "builtin", "http-adapter"]),
    module: z.string().min(1).optional(),
    handler: z.string().min(1).optional(),
    operation: z.string().min(1).optional(),
  })
  .strict();

export const RegistryTool = z
  .object({
    /** Stable namespaced id: <serverName>/<toolName>. */
    id: z.string().min(3),
    name: z
      .string()
      .min(1)
      .regex(/^[a-z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)+$/, "tool names must be dot-namespaced"),
    description: z.string().min(1),
    readOnly: z.boolean(),
    highStakes: z.boolean().default(false),
    risk: z.enum(["low", "medium", "high"]),
    permissions: ToolPermissions,
    /** Every tool on the backend-hosted servers is tenant-scoped. */
    tenantScoped: z.literal(true),
    audit: z.enum(["required", "none"]),
    idempotency: z.enum(["none", "supported"]),
    timeoutMs: z.number().int().positive().max(300_000),
    backend: ToolBackendMapping,
    requiresExtensions: z.array(z.string().min(1)).optional(),
    mrtr: z.array(z.string().min(1)).optional(),
    deprecated: z.boolean().optional(),
  })
  .strict();

export type RegistryToolContract = z.infer<typeof RegistryTool>;

export const RegistryResource = z
  .object({
    name: z.string().min(1),
    uriTemplate: z.string().min(1),
    ttlSeconds: z.number().int().positive().optional(),
    mimeType: z.string().min(1).optional(),
  })
  .strict();

export const ServerTier = z.enum(["Official", "Verified", "Community", "Experimental"]);
export const ServerStatus = z.enum(["active", "planned", "deprecated", "suspended"]);

export const RegistryServer = z
  .object({
    $schema: schemaUrl,
    name: z
      .string()
      .regex(/^io\.tradeops\.mcp\.[a-z][a-z0-9-]*$/, "server name must be namespaced io.tradeops.mcp.*"),
    title: z.string().min(1),
    description: z.string().min(1),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, "version must be semver"),
    protocolVersion,
    tier: ServerTier,
    status: ServerStatus,
    transport: z.array(z.enum(["stdio", "streamable-http", "subscriptions-listen"])).min(1),
    stateless: z.boolean(),
    canonicalResource: z.string().url(),
    tools: z.array(RegistryTool).min(1),
    resources: z.array(RegistryResource).default([]),
    skills: z
      .array(z.object({ id: z.string().min(1), description: z.string().min(1) }).strict())
      .optional(),
    capabilities: z
      .object({
        "io.modelcontextprotocol/tasks": z.boolean(),
        "io.modelcontextprotocol/ui": z.boolean(),
        "io.modelcontextprotocol/skills": z.boolean(),
      })
      .strict(),
    scopes: z.array(z.string().min(1)).default([]),
    subscriptions: z
      .object({
        listen: z.boolean(),
        kinds: z.array(z.string().min(1)),
      })
      .strict()
      .optional(),
    featureFlags: z.record(z.string(), z.boolean()).optional(),
    externalDependencies: z
      .array(
        z
          .object({
            id: z.string().min(1),
            description: z.string().min(1),
            auth: z.string().min(1),
          })
          .strict(),
      )
      .optional(),
    warnings: z.array(z.string().min(1)).optional(),
    homepage: z.string().url().optional(),
    license: z.string().min(1).optional(),
  })
  .strict();

export type RegistryServerManifest = z.infer<typeof RegistryServer>;

// ---------------------------------------------------------------------------
// Root registry manifest
// ---------------------------------------------------------------------------

export const RegistryRoot = z
  .object({
    $schema: schemaUrl,
    registryId: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    protocolVersion,
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    updatedAt: z.string().min(1),
    maintainer: z
      .object({
        name: z.string().min(1),
        contact: z.string().min(1),
        repository: z.string().url().optional(),
      })
      .strict(),
    servers: z
      .array(
        z
          .object({
            name: z.string().min(1),
            manifest: z.string().min(1),
            tier: ServerTier,
            status: ServerStatus,
          })
          .strict(),
      )
      .min(1),
    extensions: z.record(
      z.string(),
      z.object({ manifest: z.string().min(1), version: z.string().min(1) }).strict(),
    ),
    profiles: z
      .array(z.object({ id: z.string().min(1), manifest: z.string().min(1) }).strict())
      .min(1),
    capabilityCatalogs: z
      .array(z.object({ id: z.string().min(1), manifest: z.string().min(1) }).strict())
      .min(1),
    policyBundles: z
      .array(z.object({ id: z.string().min(1), manifest: z.string().min(1) }).strict())
      .min(1),
    authProviders: z
      .array(z.object({ id: z.string().min(1), manifest: z.string().min(1) }).strict())
      .min(1),
    transports: z
      .array(z.object({ id: z.string().min(1), manifest: z.string().min(1) }).strict())
      .min(1),
  })
  .strict();

export type RegistryRootManifest = z.infer<typeof RegistryRoot>;


