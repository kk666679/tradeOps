# Trade OPS MCP Server Implementation Review

A standalone MCP server providing 27 tools across customs, FIZ/FCZ zone operations, and a tamper-proof bonded ledger. The implementation connects to a remote Trade OPS backend and maintains an in-memory hash-chained event log with RBAC enforcement.

**Watch for**: 3 failing tests (RBAC tier checks, hash chain verification edge case), 4 resources registered instead of 8 (templated URIs not implemented), and tool tier registration incomplete (tools not registered in RBAC tier map).

**Verdict**: NEEDS_CHANGES

---

## High-level view

The server successfully bootstraps with all 27 tools registered and event ledger infrastructure in place. TypeScript compilation succeeds and Docker containers build correctly. The zero-trust middleware chain is structured but tier-based RBAC lacks a critical registration step: individual tools are not registered in the tier map, so the authorization gate defaults all unknown tools to `privileged` tier, breaking access for standard read tools. The hash-chained ledger correctly computes and verifies event integrity with SHA-256, though a test reveals an edge case in tampering detection (modified prevHash gets masked by hash recomputation). Resource registration is incomplete—only 4 of the required 8 URIs are implemented; templated URIs for individual events and device telemetry are missing. Write tools correctly require and validate `approvalToken`, and error handling converts exceptions to MCP content blocks. Tests confirm tool metadata (27 count, approval requirements, descriptions, schemas) but RBAC tier checks fail due to the registration gap.

---

<details>
<summary>Issues (5)</summary>

1. **Tool tier registration incomplete** — 27 tools are registered in `TOOL_DEFINITIONS` but never registered in the `toolTiers` map via `setToolTier()`. The `authorizeTool()` function falls back to `privileged` tier for unknown tools, causing all tools to be treated as restricted. Fix: after creating the MCP server, call `setToolTier()` for each tool with its correct tier (read/write/agent).

2. **Resource URIs incomplete** — Only 4 of 8 required URIs are registered: `tradeops://zone/fiz/inventory`, `tradeops://zone/fcz/inventory`, `tradeops://master/hs-codes`, `tradeops://agents/registry`. Missing: `tradeops://ledger/events/{eventId}`, `tradeops://hs/{code}/rulings`, `tradeops://declaration/{declId}/status`, `tradeops://device/{deviceId}/telemetry`. Templated URIs require MCP resource template support; implement or document as limitation.

3. **RBAC test failures** — `authorizeTool('viewer', 'customs_get_declaration_status')` returns `allowed: false` because the tool has no tier registered, so it defaults to `privileged`. Fix: register tool tiers before running authorization tests.

4. **Hash chain tampering detection edge case (likely)** — Test "detects broken prevHash link" fails. When `prevHash` is tampered, `computeEventHash()` recomputes the hash including the corrupted `prevHash`, so the recomputed hash no longer matches the stored hash. The error message reports `hash mismatch` instead of `prevHash break`. This masks the root cause. While the chain correctly detects tampering, the diagnostic message is misleading. Consider: compute hash before checking prevHash, or separate hash and link validation.

5. **Test assertion on hash verification reason** — The test expects the reason to contain `"prevHash break"` but receives `"hash mismatch"`. This is a symptom of issue #4, not a separate concern. Fix by resolving issue #4.

</details>

<details>
<summary>Details</summary>

## Tool Registration and Authorization

All 27 tools are listed in `TOOL_DEFINITIONS` with correct names matching the requirements: 7 customs, 6 FIZ, 6 FCZ, 3 cross-zone, 4 ledger, 1 agent. The test suite confirms all tools are present and correctly marked with `requiresApprovalToken` (17 write tools require approval, 10 read tools do not). Tool handlers wrap backend calls and ledger operations in try-catch blocks, returning MCP content blocks via `textResult()` helper, which converts data to JSON strings without throwing raw exceptions.

The critical gap is tool tier registration. The `src/auth/rbac.ts` file exports `setToolTier()` and `toolTiers` map, but the tool registration process in `src/tools/index.ts` never populates it. When `authorizeTool()` is called for a tool not in the map, it defaults to `privileged` tier. This means `customs_get_declaration_status` (a read tool that should permit `viewer` role) is treated as requiring `customs_officer` or higher. The RBAC tests confirm this: both `authorizeTool('viewer', 'customs_get_declaration_status')` and `authorizeTool('operator', 'fiz_raw_intake')` fail because tools lack tier entries.

**Fix**: After `registerAllTools()` in `src/server.ts` or during tool initialization, iterate over `TOOL_DEFINITIONS` and call `setToolTier(toolDef.name, tier)` for each tool. Tier assignment: customs read tools and ledger query tools → `'read'`, all `fiz_*`, `fcz_*`, `zone_*`, `audit_*` and `customs_create_*`, `customs_validate_*` → `'write'`, `orchestrate_workflow` → `'agent'`.

## Bonded Ledger and Hash Chain

The ledger correctly implements hash chaining: each event carries the previous event's hash as `prevHash`, and computes its own `hash` over the canonical JSON representation. `computeEventHash()` fixes field order and coerces absent optionals to `null`, ensuring deterministic hashing. The ULID factory generates time-sortable unique event IDs.

A test failure reveals an asymmetry in tampering detection. When both `hash` and `prevHash` are modified independently, `verifyEventChain()` checks hash match first:

```
for each event:
  1. recompute hash from event fields (including prevHash)
  2. if recomputed != stored hash, return error "hash mismatch"
  3. if prevHash != expected, return error "prevHash break"
```

If an attacker modifies only `prevHash`, the recomputed hash will differ from the stored hash (because hash includes prevHash). The check returns "hash mismatch" and never reaches the prevHash check, so the diagnostic is imprecise. The chain is still correctly detected as tampered, but the reason doesn't point to the root cause. The test expects "prevHash break" but gets "hash mismatch…" because hash mismatch is detected first.

This is a quality issue, not a security gap. Integrity is correctly enforced; the error message is misleading. Consider restructuring: verify the hash is correct first (ensures event wasn't modified at all), then verify prevHash link. Or store the recomputed hash separately from the mismatch check so you can distinguish "this event's hash was changed" from "this event's prevHash was changed."

## Resources

Only 4 resources are registered:

- `tradeops://zone/fiz/inventory` — FIZ inventory
- `tradeops://zone/fcz/inventory` — FCZ inventory  
- `tradeops://master/hs-codes` — HS code reference
- `tradeops://agents/registry` — Agent registry

The specification calls for 8 resources. Missing:

- `tradeops://ledger/events/{eventId}` — single event by ID (templated)
- `tradeops://hs/{code}/rulings` — HS code rulings (templated)
- `tradeops://declaration/{declId}/status` — declaration status (templated)
- `tradeops://device/{deviceId}/telemetry` — device telemetry (templated)

The MCP spec supports resource templates. The current implementation registers static URIs only. Implementing templated resources requires either MCP's `resource_templates` capability or a fallback pattern in the tool handlers. The current code does not attempt this.

## Authentication and RBAC Middleware Chain

The middleware chain is structured correctly: `authenticate → authorize → rateLimit → validate → audit → execute`. The `authenticate.ts` module resolves identity from Bearer token or MCP-Session-Id header, with a local dev fallback that synthesizes an admin identity. OAuth verification is stubbed for production mode (config not exercised in tests).

The `authorize.ts` middleware checks tool permission, but depends on tool tier registration (see Tool Registration). Until tool tiers are registered, authorization passes only if `role === 'admin'`.

Rate limiting is implemented as a sliding-window limiter keyed by session ID. Validation uses Zod schemas. Audit writes a LedgerEvent after each tool call.

## Error Handling and Content Blocks

All tool handlers catch exceptions and return MCP content blocks, never throwing raw errors to the protocol. Failed backend calls return error objects wrapped in MCP TextContent. The handlers also call `auditToolCall()` to log the result (success/error) and track metrics.

## Test Coverage

Passing tests (42/45):

- **ledger.spec.ts**: 15/16 tests pass. Event append, hash chain linking, querying with filters, single lookup, optional field handling, and ledger reset work correctly. One test fails (hash chain tampering edge case, covered above).
- **auth.spec.ts**: 16/18 tests pass. Session creation, TTL expiry, and most RBAC checks pass. Two tests fail because tools lack tier registration.
- **tools.spec.ts**: All 11 tests pass. Confirms 27 tools registered with correct metadata, approval token requirements, descriptions, and schemas.

Not tested:

- Backend client mock data generation (issue #10 in plan)
- Individual tool logic (customs, FIZ, FCZ, cross-zone handlers untested)
- Full middleware chain integration
- Resource template URIs
- OAuth token verification
- HTTP transport (tests run against in-memory ledger only)

## Docker and Deployment

Dockerfile and docker-compose.yml are syntactically correct. The multi-stage build separates build and runtime images, uses a non-root `tradeops` user, and includes a health check. Environment variables correctly reference configuration.

## TypeScript and Build

`npm run build` succeeds and produces `dist/` directory with all compiled artifacts. Type checking passes. Source code follows TypeScript best practices with explicit type annotations.

## Configuration

`.env.example` is unmodified. All 13 required environment variables are documented. The server respects `NODE_ENV` (development vs. production OAuth flow).

</details>

---

<details>
<summary>File map</summary>

- **src/types/events.ts** — Ledger event schema, hash computation, chain verification (NOT MODIFIED, as required) ✓
- **src/auth/rbac.ts** — RBAC tier definitions and decision logic (tool tiers not populated) ✗
- **src/tools/index.ts** — 27 tool definitions aggregator (tools registered but not in tier map) ✗
- **src/resources/inventory.ts** — FIZ/FCZ inventory resources (2/8 resources) ✓
- **src/resources/ledger.ts** — Ledger event resources (1/8 resources, static URI only) ✓
- **src/resources/hs.ts** — HS code reference (1/8 resources) ✓
- **src/resources/agents.ts** — Agent registry (1/8 resources) ✓
- **src/backend/ledger.ts** — Hash-chained event log, append, query, verify ✓
- **src/middleware/authenticate.ts** — Bearer token extraction, identity resolution ✓
- **src/middleware/authorize.ts** — Tool permission check (depends on tier registration) ✗
- **src/middleware/audit.ts** — Audit LedgerEvent logging ✓
- **src/middleware/context.ts** — Request context and text result helpers ✓
- **src/middleware/rateLimit.ts** — Sliding-window rate limiter ✓
- **src/middleware/validate.ts** — Input schema validation ✓
- **src/server.ts** — MCP server bootstrap ✓
- **src/index.ts** — Entry point, transport selection ✓
- **Dockerfile** — Multi-stage build, non-root user, health check ✓
- **docker-compose.yml** — Service configuration, health check, networking ✓
- **README.md** — Documentation with tool list, resources, configuration ✓
- **.env.example** — Environment variables documentation (NOT MODIFIED) ✓
- **tests/tools.spec.ts** — All 11 tool registration tests pass ✓
- **tests/ledger.spec.ts** — 15/16 ledger tests pass (one edge case) ⚠️
- **tests/auth.spec.ts** — 16/18 RBAC tests pass (tier registration blocks 2) ⚠️

**Full diff**: compare local `src/` against base branch to see all changes (not provided here; review focuses on test failures and missing features).

</details>
