# TradeOps CFS WMS - Digital Twin + IoT Webhook Integration Audit Report

## Executive Summary

### Technology Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend:** NestJS + tRPC v11 API, Express middleware  
- **Database:** PostgreSQL 16 + Prisma ORM (pool tenancy model)
- **Cache/Queue:** Redis 7 + BullMQ
- **Auth:** JWT + Argon2, WebAuthn, SSO/SCIM
- **Real-time:** Socket.io WebSockets

### Architecture Highlights
- **Single API entry point:** tRPC v11 serves frontend and backend
- **Modular backend:** NestJS modules for auth, cargo, trade-ops, fiz, fcz, wms, digital-twin, agents
- **Tenant isolation:** Mandatory tenantId filtering enforced by Prisma extension on all tenant-scoped queries
- **Middleware auth:** tRPC middleware (requireAuth, requireTenant, requireRole) runs before every handler
- **Background jobs:** BullMQ workers for async processing (embedding, LLM, forecasting, agents, twin)

### Key Constraints
- **Tenant isolation is mandatory:** Cross-tenant data access forbidden; enforced at query level
- **Webhook layer is placeholder:** Existing endpoints echo only; no real auth, validation, or processing
- **Digital Twin is experimental:** Minimal implementation (WebSocket gateway + basic CRUD)
- **Rate limiting:** Redis-based per IP/user/tenant
- **Audit log:** Append-only; DB role prevents UPDATE/DELETE

## Existing Digital Twin & IoT State

### Current Models
- TwinScenario, TwinRun, TwinNode, TwinEdge, TwinMetric (defined in schema)
- DigitalTwinService (basic CRUD only)
- DigitalTwinGateway (WebSocket with ping/pong only)
- Webhook model (CRUD stub, no processing)
- Integration model (configuration stubs)

### What's Missing
- **No device registry:** No IoT device management, provisioning, credentials
- **No telemetry ingestion:** No schema validation, deduplication, processing pipeline
- **No twin synchronization:** No logic to map device data → twin state
- **No health tracking:** No device heartbeat, offline detection, stale device alerts
- **No outbound commands:** No capability to send directives back to devices
- **No UI dashboards:** No device health views, telemetry charts, alert center
- **No protocol adapters:** No vendor-specific payload mapping

## Database Schema Summary

### Core Models (Existing)
- Tenant (multi-tenant: POOL|SILO|CELLULAR)
- User, Role, Permission (RBAC)
- Zone (FIZ|FCZ|BONDED|FTZ|SEZ)
- Cargo, CargoLine, HazmatProfile
- Declaration, DeclarationLine, DutyCalculation
- Permit, ClearanceRecord, ComplianceFinding
- Inventory, InventoryMovement, Hold, Slot, SlotAllocation
- Order* (Inbound, Outbound, Purchase, Manufacturing, Trading, Transhipment, Fulfillment)
- Movement, GatePass, GateEvent
- Integration, IntegrationLog, Webhook, WebhookDelivery, EdiMapping, SyncJob
- Agent*, AgentRun, AgentMemory, AgentApproval, AgentEscalation
- TwinScenario, TwinRun, TwinNode, TwinEdge, TwinMetric

### Tenant Isolation Enforcement
- Every tenant-scoped model carries tenantId field
- Prisma client extension adds mandatory WHERE { tenantId } to queries
- Throws error if query omits tenantId
- All background jobs carry tenantId on payload

### What Must Be Added (Phase 1)
- IoTDevice (registry, protocol, status, metadata)
- IoTCredential (encrypted keys, rotation history)
- IoTIntegration (provisioning endpoint config)
- Telemetry (measurements, schema version)
- TelemetryRaw (raw payload audit trail)
- TelemetryEvent (business events: online, offline, command_acked)
- TelemetryDeduplication (idempotency: tenantId+deviceId+eventId)
- Command (outbound directives)
- CommandDelivery (attempt tracking)
- CommandAck (device acknowledgments)
- DeviceHealth (online/offline snapshots)
- DeviceHealthHistory (time-series)
- DeviceTwin (many-to-many device ↔ twin links)

## Authentication & Authorization

### Auth Flow
- JWT (15 min access + rotating refresh)
- Hashing: Argon2id (bcryptjs)
- MFA: TOTP optional
- Passkeys: WebAuthn supported
- SSO/SCIM: For enterprise tenants

### Roles (GlobalRole)
- SUPER_ADMIN, ADMIN, OPS_MANAGER, WAREHOUSE_STAFF, CUSTOMER, AGENT, AUDITOR

### Authorization Model
**Three-layer check:** Role + Attribute + Scope
1. **Role:** What principal can do in general
2. **Attribute:** Tenant, zone, commodity sensitivity, cargo value
3. **Scope:** For agents, explicit list of tRPC procedures they may call

All enforced in tRPC middleware before handler runs.

### Tenant Resolution
- Parsed from JWT (user.tenantId)
- Fallback to x-tenant-id header
- Anonymous context: user=null, tenantId=null

## Tenant Isolation Mechanism

### Pool Model (Current)
- Shared PostgreSQL database
- tenantId column on every tenant-scoped model
- Isolation via SQL WHERE clause
- Runtime validation via Prisma extension

### Silo & Cellular Models (Supported but Not Yet Deployed)
- Silo: Dedicated database per tenant
- Cellular: Isolated data plane per cell; shared control plane

### Enforcement Points
1. Prisma query extension (throws if tenantId omitted)
2. tRPC middleware (requireTenant check)
3. Worker jobs (tenantId on payload)
4. API gateway (X-Tenant-Id header validation)

## Reusable Patterns & Components

### Backend Patterns
1. **CRUD Router Generator:** createCrudRouter(trpc, modelName)
   - Generates list, byId, create, update, delete with tenant filtering
2. **Base Repository:** BaseRepository<T>
   - findMany(tenantId, args), findById(tenantId, id), create, update, remove
   - All enforce tenantId in WHERE
3. **Middleware Stack:** Composable auth checks
   - requireAuth, requireTenant, requireRole(roles)
4. **Zod Validation:** Input schemas for all endpoints

### Frontend Patterns
- React Server Components (RSC) for data-heavy pages
- React Query + tRPC hooks
- Shadcn/ui pre-built components
- Recharts for data visualization
- TailwindCSS utility styling

### API Route Handlers
- tRPC adapter at `/app/api/trpc/[trpc]/route.ts`
- Placeholder webhooks at `/app/api/webhooks/{service}/route.ts`

## Missing Dependencies

### Already Present (Good!)
- crypto (built-in)
- zod (validation)
- bullmq (queue)
- ioredis (cache)
- nanoid (IDs)
- socket.io (WebSocket)

### To Add (Low Risk)
- None strictly required; can use existing stack
- Optional: pino (structured logging if not already included)

## Risk Factors & Constraints

### High-Priority Risks
1. **Tenant isolation must be bulletproof:** Webhook receives untrusted input; must resolve tenant from auth, never payload
2. **Device credentials exposure:** Secrets must never appear in API responses, logs, or source control
3. **Replay attacks:** Webhook timestamp + signature must be validated together
4. **Duplicate events:** Idempotency keys + deduplication required
5. **State divergence:** Telemetry must not independently modify customs declarations/bonded balances
6. **Audit trail completeness:** Every webhook operation logged immutably

### Medium-Priority Risks
1. **Rate limiting:** Buggy device can flood system
2. **Backpressure:** Telemetry processing queue can grow unbounded
3. **Data freshness:** Stale heartbeats can trigger false offline alerts
4. **Vendor fragmentation:** Multiple manufacturer payloads = maintenance burden
5. **Concurrency:** Twin state updates from parallel webhooks can race

### Architectural Constraints
1. Must preserve existing WMS/FIZ/FCZ workflows
2. Tenant isolation non-negotiable
3. Database migrations must be forward-compatible
4. Append-only audit log (enforced by DB role)
5. No placeholder functionality; implement real integrations

## Verification Framework

### Build & Test Commands
```bash
npm run build:backend        # NestJS build
npm test                     # Unit + integration (vitest)
npm test:e2e                 # Playwright E2E
npm run prisma generate      # Prisma client
npm run prisma migrate dev   # Migrations
npm run prisma db seed       # Demo data
```

### Key Test Suites (Existing)
- Tariff engine (rates validated against fixtures)
- Tenant isolation (adversarial cross-tenant tests)
- Authorization (every procedure tested with every role)
- Agent scopes (scope enforcement verified)
- Idempotency (worker jobs run twice, same result)

### What New Tests Must Cover
- Webhook HMAC signature validation
- Timestamp expiry & replay detection
- Device registration & credential rotation
- Telemetry schema validation & deduplication
- Twin state sync from telemetry
- Offline device detection
- Tenant isolation (webhook from tenant A cannot access tenant B devices)
- Rate limiting (per-device, per-integration, per-tenant)
- Error recovery (failed webhook requeue, dead-letter queue)
- Full E2E flow (device → webhook → twin → UI)

## Conclusion

TradeOps CFS WMS is well-architected for Digital Twin + IoT integration:

**Strengths**
- Strong tenant isolation enforcement (Prisma extension + middleware)
- Modular backend architecture (NestJS + tRPC)
- Rich domain models (Cargo, Inventory, Declaration, etc.)
- Existing webhook infrastructure (placeholder routes ready)
- Background job framework (BullMQ + Redis)
- Comprehensive audit logging
- Type-safe API (tRPC + Zod)

**Work Ahead**
- Build IoT device registry + credential management
- Implement secure webhook gateway (HMAC + replay protection)
- Design telemetry processing pipeline
- Create device-to-twin synchronization
- Build device health monitoring
- Develop outbound command framework
- Add UI dashboards and visualizations
- Comprehensive security testing
- Non-disruptive integration with WMS workflows

**No Blockers**
- All infrastructure exists (DB, cache, queue, auth)
- Can reuse existing patterns
- Tenant isolation solid and battle-tested
- Build/test framework in place

**Recommendation:** Proceed with phased implementation (6 phases; ~8-12 weeks total). Start with Phase 1 (database schema) → Phase 2 (IoT backend) → Phase 3 (background processing), then parallelize UI/commands with backend work.

