# TradeOps MCP Registry

The **registry** is the declarative source of truth for a TradeOps MCP
deployment. A governance gateway reads it at boot to enforce:

1. **Tool-level access control** — which servers and tools a client may call.
2. **Capability drift detection** — when a server's `server.discover` output
   diverges from the declared `capabilities` or the tool-signature baseline,
   the gateway alerts and (in `regulated-enterprise`) blocks the new tools.
3. **Extension gating** — tools marked `requiresExtensions` are hidden unless
   the client declared support and the active profile enabled the extension.
4. **Policy enforcement** — every tool call is evaluated against the active
   policy bundle before the handler runs.

## Layout

```
registry/
├── server.json                 Root registry manifest
├── servers/                    One manifest per server
├── extensions/                 Tasks, Apps, Skills manifests
├── profiles/                   Deployment profiles
├── capabilities/               Capability catalogs by domain
├── policies/                   Policy bundles
├── auth/                       Auth provider manifests
├── transports/                 Transport binding manifests
├── tool-signatures/            Tool signature baselines for drift detection
├── tenants/                    Example tenant bindings
├── schemas/                    Schema references (vendored for air-gapped)
└── docs/                       This directory
```

## Profiles

| Profile | Transport | Auth | Governance |
|---|---|---|---|
| `stdio-local` | stdio | none | in-process |
| `edge-http` | stateless Streamable HTTP | OIDC + CIMD + S256 PKCE + RFC 8707 | gateway + OTLP |
| `enterprise-managed` | stateless Streamable HTTP | Entra ID / Okta + SCIM | gateway + OTLP + drift monitoring |
| `hybrid-onprem` | stateless Streamable HTTP + mTLS tunnel | OIDC + CIMD | gateway + OTLP |
| `air-gapped` | stdio | none | in-process, vendored rule sets |

## Extensions

- **`io.modelcontextprotocol/tasks`** — long-running operations with
  `tasks/get` / `tasks/update` / `tasks/cancel` and `input-required`
  resumption.
- **`io.modelcontextprotocol/ui`** — interactive tool results rendered in a
  sandboxed iframe with CSP allowlists.
- **`io.modelcontextprotocol/skills`** — discoverable workflow instruction
  packages served via `skill://` URIs.

## Adding a server

1. Write `servers/<name>.json` with its tools, resources, scopes, and
   capability requirements.
2. Reference it from `server.json` under `servers`.
3. Add it to the profiles you want it deployed in.
4. If it introduces a new tool signature, capture a baseline under
   `tool-signatures/<name>.v<version>.json` for drift detection.
5. If it requires a new extension, add a manifest under `extensions/` and
   declare it in `server.json` under `extensions`.

## Adding a policy rule

1. Edit `policies/tradeops-default.json` or
   `policies/regulated-enterprise.json`.
2. Match tools by name, by `readOnly`, or by `agentId` presence.
3. `decision` is one of `allow`, `deny`, or `require_approval`.
4. `unless` clauses express exceptions (e.g. delegated agent write).

## Adding a tenant binding

1. Create `tenants/<tenantId>.json`.
2. Choose a `tenancyModel` (`pool`, `silo`, `cellular`) and a `profile`.
3. List the enabled servers and any explicitly disabled tools.
4. Configure the auth provider and allowed scopes.
5. Set request-rate and concurrent-task limits.

## Protocol version

Every manifest targets **`2026-07-28`**. The stateless core means the
gateway does not rely on any session state; all protocol-version and
identity information arrives per request via `params._meta`.
