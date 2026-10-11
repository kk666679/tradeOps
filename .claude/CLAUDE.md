# TradeOps — Claude project memory

TradeOps is the **CFS / FIZ / FCZ customs brokerage platform**: a
multi-tenant warehouse and customs system built on:

- Next.js 16 (App Router)
- tRPC v11
- Prisma 6 + PostgreSQL 16
- Redis 7 + BullMQ
- Optional AI layer (LangChain, OpenAI-compatible LLMs)

## What matters

- **Regulatory accuracy is security.** Duty, SST, and excise figures
  produced by this system are **indicative**. Every rate resolves through
  `src/hs-code-data.ts`, and every rate row carries a `source` and a
  `retrievedAt` field. A rate without a source is a bug.
- **Not a filing system.** Declarations are prepared, validated, and
  audited here; submission to JKDM is a separate integration.
- **Multi-tenant by default.** Every tenant-scoped Prisma model carries
  `tenantId`. The client extension in `lib/db.ts` throws if a tenant-scoped
  query omits the filter. Never bypass it.
- **High-stakes actions require human approval.** Anything that files,
  amends, or cancels a declaration; anything that moves bonded goods;
  anything above the tenant value threshold.

## Layers

| Layer | Location | Responsibility |
|---|---|---|
| Operations | `app/(app)/*`, `server/trpc/routers/*` | Warehouse, gate, inventory, ledger |
| Regulatory | `src/hs-code-data.ts`, `backend/src/mcp/shared/` | Tariff, controls, evidence |
| Authorization | `server/auth/*`, MCP registry policies | RBAC / ABAC, delegation, audit |

## MCP integration

The TradeOps Core MCP server is hosted by the NestJS backend at `/api/mcp`.
Runtime code lives under `backend/src/mcp/`; registry manifests live under
`backend/mcp/registry/`:

- Authenticated Streamable HTTP sessions use backend JWTs.
- Tenant and actor context are derived from the authenticated request.
- MRTR for every human-in-the-loop decision.
- Official extensions: Tasks, Apps, Skills.

The MCP config points to the backend endpoint. Set `TRADEOPS_JWT` to a valid
backend access token.

## Non-negotiable rules

1. Never invent a tariff rate; look it up in `hs-code-data.ts`.
2. Never skip the tenant filter on a tenant-scoped model.
3. Never submit a declaration without human approval.
4. Never allow an agent to call a tool outside its declared scope.
5. Never treat AI recommendations as official customs decisions.
6. Every rate change ships with a source and a `CHANGELOG-tariff.md` entry.
