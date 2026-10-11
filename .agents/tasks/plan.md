# Implementation Plan: Trade OPS MCP Server (Part A)

## Project Context
- **Type**: Standalone MCP (Model Context Protocol) server in TypeScript
- **Build**: `npm run build` (tsc) → `dist/`
- **Test**: `npm test` (vitest run, tests/**/*.spec.ts)
- **Dev**: `npm run dev:stdio` or `npm run dev:http`
- **Key note**: `src/types/events.ts` is a pre-defined schema and must NOT be modified. The file has DutyStatusSchema declared after it's used in LedgerEventSchema, but this is valid TypeScript due to module-level hoisting of const/type declarations at parse time.

## Implementation Plan

- [ ] 1. Create src/types/index.ts — export types and utility functions from events.ts plus new types.
      Re-export: LedgerEvent, LedgerEventHashInput, LedgerZone, DutyStatus, computeEventHash, sealEvent, GENESIS_HASH, verifyEventChain, parseLedgerEvent, safeParseLedgerEvent, LEDGER_ZONES, LEDGER_SCHEMA_VERSION, DUTY_STATUSES.
      New types: McpContext (session, roles, email), SessionData (sessionId, userId, roles, createdAt, lastActivity), RbacRole ('viewer'|'operator'|'admin'), ApprovalToken (tokenId, approverRole, expiresAt, scope).
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/types/index.ts
      Verify: `npm run typecheck` — no TypeScript errors.

- [ ] 2. Create src/auth/session.ts — in-memory session store with TTL-based cleanup.
      SessionStore class: create(sessionId, data), get(sessionId), touch(sessionId), delete(sessionId), all(), _cleanup().
      Export: SessionStore, generateSessionId() → uuid-like string.
      Instantiate and export default singleton `sessionStore`.
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/auth/session.ts
      Verify: `npm run typecheck` — no errors.

- [ ] 3. Create src/auth/oauth.ts — JWT verification against OIDC provider.
      verifyToken(token: string, logger): Promise<{sub, roles, email?}>.
      When OAUTH_ISSUER and OAUTH_JWKS_URL are set: fetch JWKS, verify JWT signature, check iss/aud/exp.
      Dev mode fallback: if empty, accept any non-empty token and return {sub: token.slice(0, 8), roles: ['admin']}.
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/auth/oauth.ts
      Verify: `npm run typecheck` — no errors.

- [ ] 4. Create src/auth/rbac.ts — RBAC policy enforcer.
      Export RBAC_MAP: Record<toolName, string[]> mapping all 27 tools to required roles.
      Read tools (viewer|operator|admin): customs_get_declaration_status, customs_query_declaration_list, hs_validate_code, hs_classify_product, customs_query_tariff, fiz_raw_intake (data read), fcz_inbound_receive (data read).
      Write/state-changing tools (operator|admin): fiz_*, fcz_*, zone_*, audit_* (all other tools).
      checkPermission(roles: string[], tool: string): boolean — check if roles satisfy RBAC_MAP[tool].
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/auth/rbac.ts
      Verify: `npm run typecheck` — no errors.

- [ ] 5. Create src/middleware/authenticate.ts — Express middleware + standalone checker.
      authenticateRequest(req: Request, res: Response, next: NextFunction).
      Extract Bearer token from Authorization header or MCP-Session-Id header.
      Call oauth.verifyToken(), lookup session, populate McpContext on res.locals.
      Export standalone: parseAuthorization(header): {type, token} | null.
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/middleware/authenticate.ts
      Verify: `npm run typecheck` — no errors.

- [ ] 6. Create src/middleware/authorize.ts — RBAC middleware.
      authorizeForTool(toolName: string) → Express middleware.
      Check RBAC_MAP[toolName] against McpContext.roles.
      Return MCP error block if unauthorized.
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/middleware/authorize.ts
      Verify: `npm run typecheck` — no errors.

- [ ] 7. Create src/middleware/rateLimit.ts — sliding-window rate limiter.
      RateLimiter class: constructor(defaultLimit: number, windowMs: number).
      check(key: string): {allowed: boolean, remaining: number, resetAt: number}.
      Middleware: rateLimitMiddleware(limiter: RateLimiter) → Express middleware.
      Use session ID as rate-limit key. Default 100 req/min.
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/middleware/rateLimit.ts
      Verify: `npm run typecheck` — no errors.

- [ ] 8. Create src/middleware/validate.ts — Zod schema validation for tool inputs.
      validateInput(schema: ZodSchema) → Express middleware or standalone checker.
      Parse req.body or req.query, return MCP error on validation failure.
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/middleware/validate.ts
      Verify: `npm run typecheck` — no errors.

- [ ] 9. Create src/middleware/audit.ts — audit logger middleware.
      Middleware writes an audit LedgerEvent (eventType: 'audit.tool.called') after tool execution.
      Captures tool name, actor, roles, parameters (redacted if sensitive), result status.
      Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/middleware/audit.ts
      Verify: `npm run typecheck` — no errors.

- [ ] 10. Create src/backend/client.ts helper: Mock response generation for dev mode.
       Extend BackendClient with a static method or helper: mockResponse<T>(method: string, path: string): T.
       Returns typed mock data when backend is unreachable or in dev mode.
       For the following methods, implement realistic mock responses:
       - getDeclarationStatus: returns {declarationId, status, entries: [{hs, qty}]}
       - queryDeclarationList: returns {declarations: [{id, status, date}]}
       - createDraftDeclaration: returns {declarationId, poId}
       - validateEntry: returns {valid: true, errors: []}
       - classifyProduct: returns {hsCode, confidence}
       - validateHsCode: returns {valid: true}
       - queryTariff: returns {rate, dutyCurrency}
       - getFizInventory: returns {items: [{sku, qty, location}]}
       - getFczInventory: returns {items: [{sku, qty, zone}]}
       - getHsRulings: returns {rulings: [{id, ruling}]}
       - getDeclarationStatusDoc: returns {url, format}
       - getAgentRegistry: returns {agents: [{id, role, active}]}
       All methods should handle network errors gracefully and return mock data in dev mode.
       Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/backend/client.ts (extend existing file)
       Verify: Read the extended file, verify mock methods are type-safe, `npm run typecheck` passes.

- [ ] 11. Create src/tools/customs.ts — 7 customs/HS tools.
       Tools: customs_get_declaration_status, customs_query_declaration_list, customs_create_draft_declaration, customs_validate_entry, hs_classify_product, hs_validate_code, customs_query_tariff.
       Each: call backend client method, return MCP content blocks (TextContent or JSONContent).
       Include input validation schemas (zod).
       Append audit LedgerEvent for each call.
       No approvalToken required for read tools; write tools validate approvalToken parameter.
       Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/tools/customs.ts
       Verify: `npm run typecheck` — no errors.

- [ ] 12. Create src/tools/fiz.ts — 6 FIZ tools.
        Tools: fiz_raw_intake, fiz_machinery_approve, fiz_production_consume, fiz_scrap_excise, fiz_fg_produce, fiz_export_confirm.
        Each: emit corresponding LedgerEvent (fiz.raw.received, fiz.machinery.approved, fiz.production.consumed, fiz.scrap.excised, fiz.fg.produced, fiz.export.confirmed).
        All require approvalToken parameter (validate against RBAC_MAP).
        Each returns MCP content block confirming event appended.
        Append audit LedgerEvent for each call.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/tools/fiz.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 13. Create src/tools/fcz.ts — 6 FCZ tools.
        Tools: fcz_inbound_receive, fcz_transhipment_complete, fcz_breakbulk_split, fcz_repack_value_add, fcz_reexport_confirm, fcz_entrepot_match.
        Each: emit corresponding LedgerEvent (fcz.inbound.received, fcz.transhipment.completed, fcz.breakbulk.split, fcz.repack.value_added, fcz.reexport.confirmed, fcz.entrepot.matched).
        All require approvalToken parameter.
        Each returns MCP content block confirming event appended.
        Append audit LedgerEvent for each call.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/tools/fcz.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 14. Create src/tools/crossZone.ts — 3 cross-zone tools.
        Tools: zone_transfer_fiz_fcz, ledger_duty_reconcile, audit_period_close.
        Emit: zone.transfer.fiz_fcz, ledger.duty.reconciled, audit.period.closed.
        All require approvalToken parameter.
        Each returns MCP content block.
        Append audit LedgerEvent for each call.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/tools/crossZone.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 15. Create src/tools/ledger.ts — 4 ledger query/inspection tools.
        Tools: ledger_append_event, ledger_query_events, ledger_get_event, ledger_verify_hash_chain.
        All return MCP content blocks (TextContent with formatted output or JSONContent).
        No approvalToken required (read-only, but audit each call separately).
        Append audit LedgerEvent for each call.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/tools/ledger.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 16. Create src/tools/agents.ts — 1 agent mesh stub tool.
        Tool: orchestrate_workflow.
        Accept workflow definition, return {workflowId, status}.
        Append audit LedgerEvent (eventType: 'audit.tool.called' with workflow scope).
        Return MCP content block.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/tools/agents.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 17. Create src/tools/iot.ts — placeholder file for Part B.
        Export empty array: export const iotTools = [].
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/tools/iot.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 18. Create src/tools/index.ts — tool registration aggregator.
        Export registerAllTools(server: Server, ledger: BondedLedger, backend: BackendClient, rbac: typeof RBAC_MAP, limiter?: RateLimiter).
        Import and register all 27 tools from customs.ts, fiz.ts, fcz.ts, crossZone.ts, ledger.ts, agents.ts, iot.ts.
        Verify all 27 tool names are exact (case-sensitive).
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/tools/index.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 19. Create src/resources/inventory.ts — FIZ/FCZ inventory resources.
        Register resources: tradeops://zone/fiz/inventory, tradeops://zone/fcz/inventory.
        Each returns JSON content with inventory snapshot (mocked from backend or in-memory).
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/resources/inventory.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 20. Create src/resources/ledger.ts — ledger event resources and templates.
        Register resource template: tradeops://ledger/events/{eventId}.
        Returns JSON content for a single event (lookup by id from ledger).
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/resources/ledger.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 21. Create src/resources/hs.ts — HS code reference resources and templates.
        Register resources: tradeops://master/hs-codes.
        Register templates: tradeops://hs/{code}/rulings.
        Return JSON content with HS code data and rulings (mocked from backend).
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/resources/hs.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 22. Create src/resources/agents.ts — agent and workflow resources and templates.
        Register resource: tradeops://agents/registry.
        Register templates: tradeops://declaration/{declId}/status, tradeops://device/{deviceId}/telemetry.
        Return JSON content (registry of agents, declaration status, device telemetry).
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/resources/agents.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 23. Create src/resources/index.ts — resource registration aggregator.
        Export registerAllResources(server: Server, ledger: BondedLedger, backend: BackendClient).
        Import and register all 8 resources/templates.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/resources/index.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 24. Create src/prompts/preClearance.ts — pre-clearance guidance prompt.
        Export as MCP prompt: name "pre-clearance", description, arguments schema (optional contextual parameters).
        Template text for guiding users through a pre-clearance workflow.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/prompts/preClearance.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 25. Create src/prompts/exceptionInvestigation.ts — exception investigation guidance prompt.
        Export as MCP prompt: name "exception-investigation", description, arguments schema.
        Template text for investigating customs exceptions.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/prompts/exceptionInvestigation.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 26. Create src/prompts/entrepotReconciliation.ts — entrepot reconciliation guidance prompt.
        Export as MCP prompt: name "entrepot-reconciliation", description, arguments schema.
        Template text for reconciling entrepot transfers and duty statuses.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/prompts/entrepotReconciliation.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 27. Create src/prompts/index.ts — prompt registration aggregator.
        Export registerAllPrompts(server: Server).
        Import and register all 3 prompts.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/prompts/index.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 28. Create src/transport/stdio.ts — StdioServerTransport wrapper.
        Export function createStdioTransport(server: Server): StdioServerTransport.
        Wraps @modelcontextprotocol/sdk StdioServerTransport.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/transport/stdio.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 29. Create src/transport/http.ts — Express HTTP server with Streamable HTTP + SSE.
        Export function createHttpTransport(server: Server, config: AppConfig, ledger: BondedLedger): Express app.
        Endpoints:
          POST /mcp — tool invocation
          GET /mcp — SSE stream for subscriptions
          DELETE /mcp — session termination
          GET /health — readiness probe
          GET /ready — full readiness check (schema drift, backend connectivity)
          GET /metrics — Prometheus text exposition
        Middleware: authentication, authorization, rate limiting, audit.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/transport/http.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 30. Create src/server.ts — MCP server bootstrap.
        Export function createServer(ledger: BondedLedger, backend: BackendClient): Server.
        Call registerAllTools, registerAllResources, registerAllPrompts.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/server.ts
        Verify: `npm run typecheck` — no errors.

- [ ] 31. Create src/index.ts — application entrypoint.
        Read config.transport.
        If 'stdio': create stdio transport, call transport.connect().
        If 'http': create Express app via createHttpTransport, bind to config.http.port, listen.
        Error handling: log startup errors, exit with non-zero code.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/src/index.ts
        Verify: `npm run build && npm run start` — server starts and serves /health and /ready endpoints.

- [ ] 32. Create tests/tools.spec.ts — tool registration unit tests.
        Verify: tools/list returns exactly 27 tools with correct names.
        Verify: resources/list returns exactly 8 resources with correct URIs.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/tests/tools.spec.ts
        Verify: `npm test` — tests/tools.spec.ts passes.

- [ ] 33. Create tests/auth.spec.ts — session and RBAC unit tests.
        Test session creation, get, touch, delete, TTL cleanup.
        Test RBAC: viewer can read, operator can write, admin can do both.
        Test checkPermission for all 27 tools.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/tests/auth.spec.ts
        Verify: `npm test` — tests/auth.spec.ts passes.

- [ ] 34. Create tests/ledger.spec.ts — ledger integration test.
        Spin up server in stdio mode.
        Call fiz_raw_intake tool with valid params and approvalToken.
        Verify fiz.raw.received LedgerEvent appears in ledger.
        Query events with ledger_query_events.
        Call ledger_verify_hash_chain.
        Assert chain is valid.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/tests/ledger.spec.ts
        Verify: `npm test` — tests/ledger.spec.ts passes, server handles tool calls and appends events correctly.

- [ ] 35. Create Dockerfile — multi-stage production image.
        Stage 1 (builder): node:20-alpine, npm install + npm run build → dist/
        Stage 2 (runtime): node:20-alpine, copy dist/ + node_modules, expose 8787 (HTTP) and 8788 (IoT), ENTRYPOINT ["node", "dist/index.js"].
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/Dockerfile
        Verify: `docker build -t tradeops-mcp . && docker run tradeops-mcp` — container starts successfully.

- [ ] 36. Create docker-compose.yml — single-service compose file.
        Service tradeops-mcp: build from current directory, ports 8787:8787 (HTTP), 8788:8788 (IoT), environment vars from .env.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/docker-compose.yml
        Verify: `docker-compose up` — service starts and is ready.

- [ ] 37. Create README.md — installation, usage, and setup guide.
        Sections: Overview, Install, Running stdio (dev), Running HTTP (production/remote), Authentication (OAuth setup), Example mcp.json for Claude Desktop.
        Include troubleshooting and schema-drift guard explanation.
        Files: c:\Users\kurni\OneDrive\Desktop\cfs-main/mcp/tradeops-server/README.md
        Verify: File exists and is readable.

- [ ] 38. Full integration test: build and typecheck.
        Run `npm run build` — TypeScript compilation succeeds with no errors.
        Run `npm run typecheck` — strict type checking passes.
        Run `npm test` — all test suites pass (tools.spec, auth.spec, ledger.spec).
        Verify: No errors, all tests green.

- [ ] 39. Full build and artifact verification.
        Run `npm run build` → dist/ contains all transpiled files.
        Verify dist/index.js, dist/server.ts, dist/tools/index.js, dist/backend/ledger.js, dist/types/index.d.ts are present and readable.
        Verify: Build output is complete and ready for packaging or deployment.

