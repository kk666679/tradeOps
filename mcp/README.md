# MCP — TradeOps 2026

Modular MCP servers for a Container Freight Station / Free Zone customs platform.
Targets the MCP **2026-07-28** specification:

- **Stateless core** — no `initialize` handshake, no `Mcp-Session-Id`.
  Every request self-describes via `_meta`.
- **Multi Round-Trip Requests (MRTR)** — server-initiated input is a
  `resultType: "input_required"` response; the client retries with
  `inputResponses`.
- **Official extensions** — Tasks, Apps, Skills.

## Layout

```
servers/                One isolated MCP server per domain
  tradeops-core/        Deterministic WMS + bonded ledger engine
shared/                 Cross-cutting protocol machinery
  schemas/              _meta, MRTR, registry contracts
  transport/            stdio, stateless HTTP, subscriptions/listen
  auth/                 CIMD, RFC 8707, PKCE S256
  extensions/           Tasks, Apps, Skills primitives
  governance/           Audit chain, policy gate, OpenTelemetry
registry/               MCP registry manifests
```

## Run tradeops-core

```bash
cd servers/tradeops-core
pnpm install
pnpm build
pnpm start            # stdio server
pnpm test             # vitest
```

## Protocol rules

1. No session state lives in the transport. If cross-call state is needed,
   the server mints an explicit handle and passes it as a tool argument.
2. All long-running work returns a Task handle, never blocks.
3. All human-in-the-loop decisions use MRTR.
4. Every tool result carries `resultType: "complete"`.
5. Every tool call emits an OTel span and an audit-chain entry.
