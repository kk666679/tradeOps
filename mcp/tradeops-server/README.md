# Trade OPS MCP Server

A standalone MCP (Model Context Protocol) server exposing FIZ/FCZ bonded-ledger and customs capabilities to any MCP-compatible AI host.

## Overview

The Trade OPS MCP Server provides:

- **27 Tools** across 7 categories (Customs, FIZ, FCZ, Cross-Zone, Ledger, Agents, IoT)
- **8 Resources** with static and templated URIs for inventory, ledger events, HS codes, and agent registry
- **3 Guided Prompts** for pre-clearance, exception investigation, and entrepot reconciliation
- **Hash-Chained Audit Ledger** for tamper-proof event traceability
- **Role-Based Access Control** (RBAC) for tools and resources
- **OAuth 2.1 + JWT** authentication support

## Installation

```bash
# Clone and install
npm install

# Build TypeScript
npm run build

# Run tests
npm test
```

## Running

### Stdio Mode (for Claude Desktop and CLI)

```bash
# Development
MCP_TRANSPORT=stdio npm run dev:stdio

# Production
MCP_TRANSPORT=stdio node dist/index.js
```

### HTTP Mode (for remote or containerized deployment)

```bash
# Development
MCP_TRANSPORT=http npm run dev:http

# Production
MCP_TRANSPORT=http node dist/index.js
```

The HTTP server listens on `http://127.0.0.1:8787` by default. Endpoints:

- `GET /health` — readiness probe
- `GET /ready` — full readiness check
- `GET /metrics` — Prometheus text exposition format
- `POST /mcp` — MCP tool invocations
- `GET /mcp` — SSE stream for subscriptions
- `DELETE /mcp` — session termination

## Docker

```bash
# Build
docker build -t tradeops-mcp:latest .

# Run
docker run -p 8787:8787 -e MCP_TRANSPORT=http tradeops-mcp:latest

# Compose
docker-compose up
```

## Authentication

### Development Mode

Set `NODE_ENV=development` (default). Any non-empty bearer token grants `admin` roles:

```bash
curl -H 'Authorization: Bearer dev-token' http://localhost:8787/mcp
```

### Production Mode with OAuth

Set `NODE_ENV=production` and configure:

```bash
export OAUTH_ISSUER=https://auth.example.com
export OAUTH_JWKS_URL=https://auth.example.com/.well-known/jwks.json
export OAUTH_AUDIENCE=tradeops-mcp
```

The server validates JWT tokens and extracts roles from `claims.roles` (array) or `claims.role` (string).

### API Key (Internal/Development)

```bash
export TRADEOPS_API_KEY=your-api-key
```

Use as bearer token:

```bash
curl -H 'Authorization: Bearer your-api-key' http://localhost:8787/mcp
```

## Configuration

All settings are environment variables (see `.env.example`):

| Variable | Default | Description |
|---|---|---|
| `MCP_TRANSPORT` | `stdio` | `stdio` or `http` |
| `MCP_HTTP_PORT` | `8787` | HTTP server port |
| `MCP_HTTP_HOST` | `127.0.0.1` | HTTP server host |
| `MCP_SESSION_TTL` | `3600` | Session TTL in seconds |
| `TRADEOPS_BACKEND_URL` | `http://localhost:4000` | Backend API |
| `TRADEOPS_API_KEY` | `` | Backend API key |
| `LEDGER_BACKEND_URL` | `$TRADEOPS_BACKEND_URL` | Ledger fanout backend |
| `LEDGER_SCHEMA_VERSION` | `1.0.0` | Expected ledger schema version |
| `OAUTH_ISSUER` | `` | OIDC issuer (production) |
| `OAUTH_JWKS_URL` | `` | OIDC JWKS endpoint |
| `OAUTH_AUDIENCE` | `` | JWT audience |
| `LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error` |
| `NODE_ENV` | `development` | `development`, `test`, `production` |

## Integration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tradeops": {
      "command": "node",
      "args": ["/path/to/mcp/tradeops-server/dist/index.js"],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "NODE_ENV": "production",
        "OAUTH_ISSUER": "https://auth.example.com",
        "OAUTH_JWKS_URL": "https://auth.example.com/.well-known/jwks.json",
        "OAUTH_AUDIENCE": "tradeops-mcp"
      }
    }
  }
}
```

### API Clients

Connect via HTTP:

```bash
curl -X POST http://localhost:8787/mcp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "customs_get_declaration_status",
      "arguments": { "declId": "DECL-001" }
    },
    "id": 1
  }'
```

## Tools

### Customs (7 tools)

- `customs_get_declaration_status` — Get customs declaration status
- `customs_query_declaration_list` — Query customs declarations
- `customs_create_draft_declaration` — Create draft declaration (requires approval)
- `customs_validate_entry` — Validate customs entry (requires approval)
- `hs_classify_product` — Classify product by HS code
- `hs_validate_code` — Validate HS code
- `customs_query_tariff` — Query tariff by HS code

### FIZ (6 tools)

- `fiz_raw_intake` — Record raw materials intake (requires approval)
- `fiz_machinery_approve` — Approve machinery (requires approval)
- `fiz_production_consume` — Record production consumption (requires approval)
- `fiz_scrap_excise` — Record scrap excise (requires approval)
- `fiz_fg_produce` — Record finished goods production (requires approval)
- `fiz_export_confirm` — Confirm export (requires approval)

### FCZ (6 tools)

- `fcz_inbound_receive` — Record inbound receipt (requires approval)
- `fcz_transhipment_complete` — Complete transhipment (requires approval)
- `fcz_breakbulk_split` — Split breakbulk (requires approval)
- `fcz_repack_value_add` — Add value to repack (requires approval)
- `fcz_reexport_confirm` — Confirm re-export (requires approval)
- `fcz_entrepot_match` — Match entrepot transfers (requires approval)

### Cross-Zone (3 tools)

- `zone_transfer_fiz_fcz` — Transfer goods between zones (requires approval)
- `ledger_duty_reconcile` — Reconcile duties (requires approval)
- `audit_period_close` — Close audit period (requires approval)

### Ledger (4 tools)

- `ledger_append_event` — Append event to ledger
- `ledger_query_events` — Query ledger events
- `ledger_get_event` — Get single ledger event
- `ledger_verify_hash_chain` — Verify ledger integrity

### Agent (1 tool)

- `orchestrate_workflow` — Orchestrate workflow execution

## Resources

- `tradeops://zone/fiz/inventory` — FIZ inventory snapshot
- `tradeops://zone/fcz/inventory` — FCZ inventory snapshot
- `tradeops://ledger/events/{eventId}` — Single ledger event
- `tradeops://master/hs-codes` — HS code reference list
- `tradeops://hs/{code}/rulings` — HS code rulings
- `tradeops://agents/registry` — Agent registry
- `tradeops://declaration/{declId}/status` — Declaration status
- `tradeops://device/{deviceId}/telemetry` — Device telemetry

## Prompts

- `pre-clearance` — Pre-clearance workflow guidance
- `exception-investigation` — Exception investigation workflow
- `entrepot-reconciliation` — Entrepot reconciliation workflow

## Development

```bash
# Watch mode
npm run dev:stdio
npm run dev:http

# Type checking
npm run typecheck

# Testing
npm test
npm run test:watch

# Inspect with MCP Inspector
npm run inspect
```

## Schema Drift Guard

On startup, the server compares its `LEDGER_SCHEMA_VERSION` against the backend's reported version. If they differ, startup is refused and logs an error. This ensures the event envelope stays in sync between the MCP server (Part A) and the IoT webhook layer (Part B).

## Troubleshooting

### "Authorization: Bearer X is invalid"

- Verify token is non-empty
- In development mode, any non-empty token is accepted
- In production, verify OAUTH_ISSUER, OAUTH_JWKS_URL, and token claims

### "Backend connection refused"

- Ensure TRADEOPS_BACKEND_URL is reachable
- Check backend logs for errors
- In development, the server degrades gracefully (ledger stays local)

### "Rate limit exceeded"

- Default: 100 requests/minute per session
- Adjust `MCP_RATE_LIMIT_DEFAULT` (not yet implemented in HTTP transport)

### "Approval token required"

- Write tools require a non-empty `approvalToken` parameter
- Obtain approval through your workflow authorization system

## License

MIT
