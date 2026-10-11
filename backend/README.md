# TradeOps CFS Backend — NestJS API

Backend for the **Container Freight Station (CFS)** platform. Handles customs, WMS, trade-ops, order-management, digital-twin simulation, AI agent orchestration, and integrations. Exposes both a REST surface and a **tRPC** router consumed by the Next.js frontend.

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js 20+ |
| Framework | NestJS 10 |
| Language | TypeScript 5 (strict) |
| API | REST controllers + tRPC (`@trpc/server`) |
| ORM | Prisma |
| Database | PostgreSQL 15 |
| Cache / Queue | Redis + BullMQ |
| Realtime | Socket.IO gateways |
| Auth | JWT (`passport-jwt`) + passkeys + NextAuth session bridge |
| Validation | `zod` (shared with frontend) |
| Rules engine | Custom, loaded from `src/rules/packs/*` |
| Testing | Jest + Supertest |

---

## Directory layout

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
│
├── ai/                    # LLM, RAG, embeddings, vector, memory, forecasting
├── auth/                  # JWT strategy, passkeys, auth router + schema
├── autoclaw/              # Autonomous agent runtime (skills, hooks, guardrails, workflows)
├── cargo/                 # Cargo domain
│   ├── bulk/              # Dry / liquid / containerized
│   ├── fcz/               # Free Commercial Zone cargo
│   ├── fiz/               # Free Industrial Zone cargo
│   └── hazmat/
├── common/                # Cross-cutting
│   ├── decorators/        # @CurrentUser, @Roles, @Tenant, @Audit, @Guardrail, @Public
│   ├── filters/           # HTTP, Prisma, tRPC exception filters
│   ├── guards/            # JWT, Roles, Tenant, Agent, Guardrail
│   ├── interceptors/      # Audit, Logging, Tenant, Timeout
│   ├── middleware/        # Rate limit, Request ID, Tenant
│   └── pipes/             # zod-validation.pipe.ts
├── config/                # ConfigModule + zod-validated env
├── custom-agents/         # Builder, registry, orchestration, supervision, evals, memory
│   └── customs-agents/    # Domain-specific agents (customs, doc, forecast, inventory, ops, risk, zone)
├── dashboard/             # Aggregated KPIs + gateway
├── digital-twin/          # Simulator, scenarios, clock, twin gateway
├── events/                # In-process event bus + handlers
├── fcz/                   # Break-bulk, entrepot, reexport, trading-houses, transhipment
├── fiz/                   # Machinery, operators, production, subcontract, wastage
├── health/                # Liveness + readiness
├── integration/           # Agent mesh, customs, EDI, ERP, FIZ-FCZ, TMS, webhooks, WMS-ext
├── inventory/
├── logistics/             # Shipment tracking + gateway
├── modules/task/          # Generic task queue
├── order-management/      # Approvals, customs, fulfilment, manufacturing, purchase, trading, transhipment
├── prisma/                # PrismaModule + PrismaService
├── queues/                # BullMQ processors: agent, embedding, forecast, llm, twin
├── repositories/          # 70+ Prisma-backed repositories (one per domain)
├── rules/                 # Rule engine + packs (ASEAN-ATIGA, RCEP, WCO-HS-2022, ...)
├── tenant/
├── trade-ops/             # Analytics, clearance, compliance, declarations, documents, duty, HS, permits, trade-finance
├── trpc/                  # Router, context, middleware, CRUD factory
├── user/
├── wms/                   # Bonded, exemption, forecasting, gate, inbound, inventory, movement, outbound, slotting
└── workers/               # Standalone BullMQ workers (agent, embedding, forecast, llm, twin)
```

Prisma schema lives in `prisma/`. Migrations in `prisma/migrations/`. Seed in `prisma/seed.ts`.

---

## Quick start

### Prerequisites

- Node.js 20+
- pnpm 9+ (or npm 10+)
- PostgreSQL 15
- Redis 7

### Local

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env
# edit DATABASE_URL, REDIS_URL, NEXTAUTH_SECRET, CORS_ORIGINS

# 3. Bring up Postgres + Redis (if using compose)
docker compose up -d postgres redis

# 4. Migrate + seed
pnpm prisma migrate dev
pnpm prisma db seed

# 5. Start
pnpm start:dev
# HTTP      http://localhost:3001
# tRPC      http://localhost:3001/trpc
# Swagger   http://localhost:3001/api/docs  (non-prod)
# Metrics   http://localhost:3001/metrics   (guarded in prod)
```

### Docker

```bash
docker compose up --build
```

---

## Environment variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `NODE_ENV` | yes | `development` | `development` / `test` / `production` |
| `PORT` | no | `3001` | |
| `DATABASE_URL` | yes | — | `postgresql://user:pass@host:5432/cfs` |
| `REDIS_URL` | yes | — | `redis://localhost:6379` |
| `NEXTAUTH_SECRET` | yes | — | shared with the Next.js frontend |
| `NEXTAUTH_URL` | yes | — | frontend origin |
| `CORS_ORIGINS` | yes | — | comma-separated allowlist |
| `JWT_ACCESS_TTL` | no | `15m` | |
| `JWT_REFRESH_TTL` | no | `30d` | |
| `LOG_LEVEL` | no | `info` | |
| `TRPC_PREFIX` | no | `/trpc` | mount path |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | no | — | OpenTelemetry |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GOOGLE_API_KEY` / `GROQ_API_KEY` / … | no | — | AI providers, read by `src/ai/llm.service.ts` |
| `VECTOR_DB_URL` | no | — | pgvector or external vector store |
| `AWS_REGION` / `AWS_S3_BUCKET` | no | — | document storage |
| `WORKER_ONLY` | no | `false` | run only the BullMQ workers, no HTTP |

All validated at boot via `src/config/validation.ts` (zod). Missing required vars crash the process.

---

## Scripts

```bash
pnpm start:dev        # watch mode
pnpm start:debug      # watch + inspector on :9229
pnpm build            # nest build → dist/
pnpm start:prod       # node dist/main.js
pnpm lint
pnpm test             # unit
pnpm test:watch
pnpm test:cov
pnpm test:e2e         # Supertest (requires Postgres + Redis)
```

---

## Database

```bash
pnpm prisma migrate dev --name <name>
pnpm prisma migrate deploy
pnpm prisma generate
pnpm prisma studio      # :5555
pnpm prisma db seed
pnpm prisma migrate reset   # ⚠️ drops + recreates
```

### Multi-tenancy

Every domain table has `tenantId`. The Prisma middleware in `src/prisma/prisma.service.ts` injects `where: { tenantId }` from the request context (`TenantMiddleware` → `TrpcCtx.tenantId`). Never call `prisma.$queryRaw` with user-supplied input.

Compound uniques:

```prisma
model HsCode {
  id       String @id
  tenantId String
  code     String
  @@unique([tenantId, code])   // → tenantId_code
}
```

```ts
await prisma.hsCode.findUnique({
  where: { tenantId_code: { tenantId, code } },
});
```

---

## tRPC

The router is composed in `src/trpc/trpc.router.ts`. Each domain contributes a `<domain>.router.ts` colocated with its service and schema.

### Context

```ts
// src/trpc/trpc.context.ts
export interface TrpcCtx {
  req: Request;
  res: Response;
  session: Session | null;
  tenantId: string;
  user?: { id: string; roles: string[] };
  db: PrismaService;
  redis: Redis;
  events: EventBusService;
  ai: AiService;
  queues: QueueService;
}
```

Populated by `trpc.middleware.ts` — reads the Authorization header / session cookie, resolves the tenant, attaches services.

### Procedures

```ts
// src/trpc/trpc.service.ts
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.context<TrpcCtx>().create({ transformer: superjson });

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, session: ctx.session } });
});
export const router = t.router;
```

### Registering a module

```ts
// src/cargo/bulk/bulk-cargo.router.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc/trpc.service';
import { BulkCargoService } from './bulk-cargo.service';

export const bulkCargoRouter = router({
  list: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      type: z.enum(['dry', 'liquid', 'bulk']).optional(),
      status: z.string().optional(),
      cursor: z.string().optional(),
      take: z.number().int().min(1).max(100).default(20),
    }))
    .query(({ ctx, input }) => ctx.bulkCargo.list(ctx.tenantId, input)),

  optimize: protectedProcedure
    .input(z.object({ query: z.string(), optimizationId: z.string().optional() }))
    .mutation(({ ctx, input }) => ctx.bulkCargo.optimize(ctx.tenantId, input)),
});
```

Mount in the root router:

```ts
// src/trpc/trpc.router.ts
export const appRouter = router({
  auth: authRouter,
  cargo: router({
    main: cargoRouter,
    bulk: bulkCargoRouter,
    fcz: fczCargoRouter,
    fiz: fizCargoRouter,
    hazmat: hazmatRouter,
  }),
  wms: wmsRouter,
  tradeOps: tradeOpsRouter,
  orderManagement: orderManagementRouter,
  digitalTwin: digitalTwinRouter,
  customAgents: customAgentsRouter,
  integration: integrationRouter,
  // ...
});

export type AppRouter = typeof appRouter;
```

### CRUD factory

`src/trpc/createCrudRouter.ts` generates standard list / byId / create / update / delete procedures from a service + zod schema, so most domain routers stay 5–10 lines.

### Client

```ts
// frontend app/_trpc/client.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/backend/src/trpc/trpc.router';

export const trpc = createTRPCReact<AppRouter>();
```

**tRPC v11**: `transformer` lives on the link, not the client root:

```ts
createTRPCClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
      headers: () => ({ authorization: `Bearer ${token}` }),
    }),
  ],
});
```

---

## REST endpoints

Legacy compat, webhooks, file uploads, health, and metrics live under `/api` / `/`:

- `GET  /api/health` — liveness (`health.controller.ts`)
- `GET  /api/health/ready` — readiness (DB + Redis + queue depth)
- `POST /api/auth/session` — exchange credentials → JWT
- `POST /api/auth/passkey/{register,login}` — WebAuthn
- `POST /api/webhooks/:provider` — Stripe, customs EDI, etc.
- `POST /api/documents/upload` — S3 multipart
- `GET  /metrics` — Prometheus

Swagger UI at `/api/docs` in non-prod.

---

## Realtime

Socket.IO gateways emit live updates:

| Gateway | Channel prefix |
|---|---|
| `DashboardGateway` | `dashboard:*` |
| `DigitalTwinGateway` | `twin:*` |
| `LogisticsGateway` | `logistics:*` |
| `GateGateway` | `gate:*` |
| `ClearanceGateway` | `clearance:*` |
| `AgentMeshGateway` | `mesh:*` |
| `MonitoringGateway` | `monitoring:*` |

All namespaces require an authenticated session; tenant is enforced at join time.

---

## Events

`EventBusService` in `src/events/` dispatches in-process events to handlers:

- `cargo.created`
- `declaration.submitted`
- `gate-pass.issued`
- `exception.raised`
- `agent-run.completed`

Handlers live in `src/events/handlers/`. Add new ones by exporting from the handlers barrel.

---

## Background jobs

BullMQ queues are declared in `src/queues/`. Processors live there and are also exposed as standalone workers under `src/workers/` (`agent`, `embedding`, `forecast`, `llm`, `twin`). Run workers in-process by default; set `WORKER_ONLY=true` for a dedicated worker node.

```ts
await this.queue.add('forecast.rebuild', { tenantId, horizonDays: 30 }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
  removeOnComplete: 100,
});
```

---

## AI

`src/ai/` centralises LLM access and supporting primitives:

- `llm.service.ts` — provider-agnostic completion / streaming, backed by `providers/*`
- `embeddings.service.ts` — batch embed
- `vector.service.ts` — vector store abstraction (pgvector or external)
- `rag.service.ts` — retrieve-then-generate over knowledge bases
- `memory.service.ts` — agent long/short-term memory
- `forecasting.service.ts` — demand forecast model wrapper

Provider config lives in `providers/`. Each provider exports a `ProviderInfo` and `ModelDefinition[]`.

---

## Rules engine

`src/rules/` loads statutory and trade rule packs from `src/rules/packs/*`:

- `asean-atiga.rule.ts`
- `rcep-origin.rule.ts`
- `wco-hs-2022.rule.ts`
- `customs-act-1967.rule.ts`
- `sales-tax-2018.rule.ts`
- `bonded-warehouse.rule.ts`
- `fiz-fcz-regulations.rule.ts`

`RuleEngineService` evaluates declared inputs against loaded packs; `RuleLoaderService` hot-reloads changes from disk in dev.

---

## Error handling

`TrpcExceptionFilter` (and `HttpExceptionFilter`, `PrismaExceptionFilter`) map domain errors:

| Domain error | HTTP | tRPC code |
|---|---|---|
| `NotFoundError` | 404 | `NOT_FOUND` |
| `ValidationError` | 400 | `BAD_REQUEST` |
| `UnauthorizedError` | 401 | `UNAUTHORIZED` |
| `ForbiddenError` | 403 | `FORBIDDEN` |
| `ConflictError` | 409 | `CONFLICT` |
| `RateLimitError` | 429 | `TOO_MANY_REQUESTS` |
| Prisma `P2002` | 409 | `CONFLICT` |
| Prisma `P2025` | 404 | `NOT_FOUND` |
| anything else | 500 | `INTERNAL_SERVER_ERROR` |

Throw domain errors from services; the filters normalise the wire format. Never surface raw Prisma errors.

---

## Observability

- **Logs**: structured JSON via `common/logging.ts`. Request ID (`request-id.middleware.ts`) propagates through tRPC ctx.
- **Metrics**: Prometheus at `/metrics`, tenant-labelled.
- **Tracing**: OpenTelemetry OTLP; set `OTEL_EXPORTER_OTLP_ENDPOINT`.
- **Health**: `/api/health` (liveness) and `/api/health/ready` (DB + Redis + queues).

---

## Security

- Passwords hashed with bcrypt (12 rounds) via `bcryptjs`.
- Access tokens 15 min; refresh tokens rotate.
- Roles + zone scoping (`FIZ`, `FCZ`, `BONDED`) enforced in services, not controllers.
- All tRPC inputs validated with zod. `strict` TS everywhere.
- CORS allowlist from `CORS_ORIGINS`.
- Per-tenant rate limit on `/api/*` and `/trpc/*` (Redis-backed, `rate-limit.middleware.ts`).
- Agent + guardrail guards (`agent.guard.ts`, `guardrail.guard.ts`) gate AI-driven mutations.

---

## Migrations checklist

Before merging a schema change:

1. `pnpm prisma migrate dev --name <descriptive>`
2. Review `prisma/migrations/<ts>/migration.sql`
3. New columns: nullable or with defaults (avoid table locks)
4. Add index for new FK or hot filter columns
5. Update `prisma/seed.ts` if fixtures change
6. Add e2e test under `test/e2e/`

---

## Deployment

```bash
pnpm install --frozen-lockfile
pnpm prisma generate
pnpm build
NODE_ENV=production node dist/main.js
```

Run `pnpm prisma migrate deploy` **before** rolling new pods. The Docker entrypoint does this when `RUN_MIGRATIONS=true`.

Health check: `GET /api/health/ready` must return `{ "status": "ok" }` within 5 s.

---

## Troubleshooting

**`PrismaClientInitializationError P1001`** — cannot reach DB. Check `DATABASE_URL` and that Postgres is up.

**`TRPCError: UNAUTHORIZED` on every call** — session cookie isn't reaching the backend. Confirm CORS allowlist includes the frontend origin and client uses `credentials: 'include'`.

**`The transformer property has moved to httpLink/httpBatchLink/wsLink`** — tRPC v11. Move `transformer: superjson` from the client root into `httpBatchLink({...})`; keep `initTRPC.context(...).create({ transformer: superjson })` on the server.

**`Property 'X' does not exist on type 'DecorateRouterRecord<...>'`** — a procedure isn't registered. Add it under the correct namespace in `trpc.router.ts` and reload the editor (tRPC types cache in tsserver).

**Migration lock** — `SELECT * FROM pg_stat_activity WHERE state = 'active';` then `pg_terminate_backend(pid);`.

**Forecast / agent jobs stuck** — check Redis and the queue depth: `redis-cli LLEN bull:forecast.rebuild:wait`.

---

## Contributing

1. Branch from `main`: `git checkout -b feat/<topic>`
2. `pnpm lint && pnpm test` before committing
3. Conventional Commits (`feat:`, `fix:`, `chore:`)
4. PR runs lint, unit, e2e, and `prisma migrate diff` against a shadow DB
5. Two approvals required for schema changes

---

## License

LICENSED — internal.