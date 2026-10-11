# Registry

The registry is the declarative source of truth for the TradeOps MCP
deployment. Start with `docs/README.md` for the full guide.

Quick map:

- `server.json` — the root registry manifest
- `servers/` — one manifest per MCP server
- `extensions/` — Tasks, Apps, Skills manifests
- `profiles/` — deployment profiles
- `capabilities/` — capability catalogs by domain
- `policies/` — policy bundles enforced by the gateway
- `auth/` — auth provider manifests
- `transports/` — transport binding manifests
- `tool-signatures/` — baselines for capability drift detection
- `tenants/` — example tenant bindings
- `schemas/` — schema references (vendored for air-gapped)
- `docs/` — full documentation
