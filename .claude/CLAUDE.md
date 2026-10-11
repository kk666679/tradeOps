# CLAUDE.md

Guidance for Claude Code and other AI coding agents working in this
repository. Read this before making changes. It is intentionally short;
the authoritative detail lives in the linked documents.

---

## Project

**CFS-WMS** — a multi-tenant Container Freight Station and Free Zone
warehouse management platform with an optional AI layer for document
extraction, HS classification assistance, forecasting, and agent-assisted
trade operations.

- **Stack:** Next.js 16 (App Router), TypeScript (strict), tRPC v11, Prisma,
  PostgreSQL 16, Redis 7, BullMQ, Weaviate.
- **AI (optional):** LangChain, OpenAI-compatible LLMs, `@xenova/transformers`,
  TensorFlow.js, ONNX Runtime, MCP.
- **Runtime:** Node 20 LTS or newer. Package manager: pnpm 9+.

Full context: [`README.md`](./README.md).

---

## Commands

```bash
# Development
pnpm dev                 # Next.js dev server on :3000
pnpm workers             # all BullMQ workers concurrently
pnpm agents:dev          # agent mesh (requires FF_AGENTS=true)

# Build and check
pnpm build
pnpm lint                # eslint + prettier
pnpm typecheck           # tsc --noEmit
pnpm verify              # lint + typecheck + test (run before pushing)

# Tests
pnpm test                # unit + integration (vitest)
pnpm test:tariff         # tariff provenance and integrity
pnpm test:isolation      # cross-tenant negative tests
pnpm test:auth           # authorisation matrix
pnpm test:agents         # scope, guardrails, prompt injection
pnpm test:rag            # RAG golden set and isolation
pnpm test:e2e            # playwright
pnpm test:coverage

# Database
pnpm prisma migrate dev --name <name>
pnpm prisma db seed
pnpm prisma studio

# Release
pnpm changeset           # add a changeset for API or data changes
```

Local services (Postgres, Redis, Weaviate):

```bash
docker compose up -d
```

---

## Layout

```
app/                  Next.js App Router
  (marketing)/        Public: landing, login, register, MFA
  (app)/              Authenticated shell (dashboard, cargo, wms, fiz, fcz, …)
  api/                tRPC handler, webhooks, upload, cron, agents
server/
  trpc/               Context, middleware, routers
  auth/               JWT, RBAC, passkeys, SSO
  agents/             Agent mesh, base, per-agent modules, skills/
src/hs-code-data.ts   Tariff dataset (authoritative for all customs math)
lib/                  db, redis, queue, weaviate, ai/ pipelines
workers/              BullMQ workers
prisma/               schema.prisma, seed.ts
test/                 isolation/, auth/, agents/, tariff/, rag/, fixtures/
```

---

## The three golden rules

Violating any of these will get a PR rejected. See
[`CONTRIBUTING.md`](./CONTRIBUTING.md#the-golden-rules).

### 1. Source every tariff figure

Any change to a duty rate, sales tax rate, excise rate, or control flag in
`src/hs-code-data.ts` must cite a **primary source** in the commit body:

- Federal Gazette instrument (`P.U.(A) 114/2022`, `P.U.(A) 349/2025`, …)
- JKDM HS Explorer (URL + retrieval date)
- Agency control list (MAQIS, SIRIM, MITI, MDA, Drug Control Authority)
- MITI FTA schedule (note the HS version — ATIGA uses HS2017, RCEP uses
  HS2022, CPTPP uses HS2012)

Every rate row needs `source` and `retrievedAt`. A rate without a source
fails `pnpm test:tariff`. Never guess a rate. If you don't know it, leave
the code out and open an issue.

### 2. Never let the model select a procedure

LLM output is data, never instruction. Procedures are invoked because the
orchestrator's FSM or middleware decided to invoke them — never because a
model returned a function name. If you find yourself parsing a model
response to pick a tool, stop. This rule exists because of prompt injection
and is the framework's most important invariant.

Agent scopes are enforced in `server/trpc/middleware.ts` (`agentProcedure`),
not in prompts. An agent cannot call a procedure outside `agent.scopes`.

### 3. Test every isolation and authorisation path

- Router changes: add a row to `test/auth/matrix.test.ts`.
- Anything reading or writing tenant-scoped data: add a cross-tenant
  negative test in `test/isolation/`.
- Agent changes: add a scope test in `test/agents/scope.test.ts` and, if the
  skill consumes user-controlled text, a prompt-injection test.

---

## Conventions

### Routers

- Never call `prisma` directly. Use `ctx.db` (the tenant-scoped client). A
  lint rule enforces this.
- Every input is validated with Zod.
- Every mutating procedure writes an audit record via the `withAudit`
  helper. Do not hand-roll.
- No raw SQL without a documented reason and a test in
  `test/security/raw-queries.test.ts`.

Procedure types: `publicProcedure`, `protectedProcedure`,
`roleProcedure(...roles)`, `tenantProcedure`, `agentProcedure`.

### Rate units

- Ad valorem rates are **fractions**, not percentages. `0.05` is 5%.
- `0` means "not scheduled / exempt", not "unknown".
- Specific (non-ad-valorem) duties go in `exciseSpecific`, e.g.
  `{ value: 0.42, unit: 'per stick' }`. The value is MYR. Never put a
  percentage here.

### Migrations

- Forward-only. Backward-compatible with the previous release (rolling
  deploys run both versions).
- Additive first: add nullable → backfill → migrate readers → drop old
  column in a later release.
- Large-table index changes: `CREATE INDEX CONCURRENTLY`.
- New tenant-scoped models must include `tenantId` and update the Prisma
  extension in `lib/db.ts`.

### Agents and skills

- New skills live under `server/agents/skills/<name>/`.
- Declare the exhaustive list of procedures the skill may call.
- Declare guardrails (which actions need human approval).
- Route anything that files, amends, or cancels a declaration; moves bonded
  goods; or exceeds the configured value threshold through the human-approval
  guardrail in `server/agents/guardrails.ts`. Do not reimplement per-skill.

### Commits

[Conventional Commits](https://www.conventionalcommits.org/). Sign off
every commit (`git commit -s`).

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `data`, `agent`, `refactor`, `perf`, `test`, `docs`,
`chore`, `security`.

Scopes name the component: `ch24`, `auth`, `tenancy`, `rag`, `agents`,
`router:cargo`, `worker:forecast`, etc.

Example with the required source line for tariff changes:

```
data(ch24): correct cigarette excise to RM0.42/stick

Source: P.U.(A) 349/2025, First Schedule, HS 2402.20.9000, column (5)
Retrieved: 2026-10-09
```

---

## Gotchas

- **`String[]` in `schema.prisma` is PostgreSQL-only.** Intentional. If you
  port to another database, replace it with a join table.
- **Feature flags default to `false`.** `FF_RAG`, `FF_AGENTS`, `FF_TWIN`,
  `FF_FEDERATED`, `FF_QUANTUM`. Do not enable `FF_TWIN`, `FF_FEDERATED`, or
  `FF_QUANTUM` in a production tenant — they are experimental.
- **Cellular tenants bind the Prisma client at context creation** to a
  cell-specific connection string. Do not create a bare `new PrismaClient()`
  anywhere in request-scoped code.
- **The audit log is append-only by database role permission.** No
  application code may issue `UPDATE` or `DELETE` against it.
- **LLM model versions are pinned.** If a provider deprecates a pinned
  version, run `pnpm agents:eval` before promoting the replacement and update
  the baseline in `test/agents/baselines/`.
- **Do not paste real tenant data into tests, fixtures, or commit messages.**
  Generate synthetic fixtures with `pnpm fixtures:generate`.
- **Never log secrets.** The logger redacts a configured key set; if you add
  a secret-bearing field, add it to the redaction list in `lib/logging.ts`.

---

## Documentation map

| Topic | File |
| ----- | ---- |
| Product overview, architecture, deployment | [`README.md`](./README.md) |
| Security policy, threat model, severity classification | [`SECURITY.md`](./SECURITY.md) |
| Contribution process, review criteria, tariff/agent/migration rules | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| Community standards | [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) |
| License scope, tariff provenance, disclaimers | [`LICENSE`](./LICENSE) |
| Tariff changelog | `CHANGELOG-tariff.md` |

---

## When in doubt

- About a tariff figure: check `src/hs-code-data.ts` for the existing source
  string, then verify against the JKDM HS Explorer
  (http://mysstext.customs.gov.my/tariff/) before changing anything.
- About tenant isolation: read the Prisma extension in `lib/db.ts` and the
  tests in `test/isolation/` before writing a query.
- About agent behaviour: read `server/agents/mesh.ts` and
  `server/trpc/middleware.ts` before adding a skill.
- About anything security-relevant: **do not open a public issue.** See
  [`SECURITY.md`](./SECURITY.md).

Ask rather than guess. A wrong tariff rate or a missed tenant filter is far
more expensive than a clarifying question.
```

---

### Notes on this file

**Why it's short.** `CLAUDE.md` is loaded into the context window on every
agent invocation. A thousand-line file competes with the code the agent is
trying to read. This one fits in roughly two screens and defers detail to the
existing docs rather than repeating it.

**What it prioritises.** Commands first (an agent needs to run things before
it needs philosophy), then layout, then the three invariants that cause the
most damage when violated, then conventions specific to this codebase, then a
gotchas list drawn from the defects we've already identified — the
PostgreSQL-only `String[]`, the experimental flags, the cellular Prisma
binding, the append-only audit log.

**What it deliberately omits.** No restatement of the architecture, no
threat model, no full severity classification. Those live in `README.md` and
`SECURITY.md`, which the file links to. Duplicating them here would create
drift: when one copy is updated and the other isn't, the agent reads the
stale one.

**Companion files you may want.** If you also use Cursor, the same content
works as `.cursor/rules/cfs-wms.mdc` with a small frontmatter block. For
GitHub Copilot, `.github/copilot-instructions.md` takes the same text. Keep
them in sync or, better, keep only `CLAUDE.md` and symlink the others to it.