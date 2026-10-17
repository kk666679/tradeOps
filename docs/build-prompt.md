# TradeOps — Customized Build Prompt

> **Customization profile**
>
> | Question | Selection |
> |---|---|
> | Product model | **Multi-tenant SaaS** for multiple companies |
> | Development tool | **Cursor / Claude Code** (AI-agent-driven development in this repo) |
> | Initial priority | **All four modules in one platform** (sequenced delivery, single product) |
> | Target market | **Global trade** — global import/export operations |
>
> This prompt is a build-on-existing brief for the repository at
> `/workspaces/tradeops`. It keeps the master prompt's product spec, governance
> rules, and acceptance discipline, but re-profiles the stack, sequencing, and
> tariff strategy to match what actually exists in this codebase. Paste this
> whole document into a fresh Cursor / Claude Code session as the working brief.

---

## 1. Project overview

Build an enterprise-grade, AI-powered global trade operations platform that
streamlines international trade, customs compliance, product classification,
supply chain planning, and import/export documentation.

The platform is an **intelligence and orchestration layer on top of existing
ERP, TMS, WMS, procurement, and trade compliance systems** — not a replacement
for them. Transactional records stay in the system of record; authoritative
tariff data drives classification; and no consequential customs, compliance,
or financial action happens without human approval.

**Product vision:** a digital trade operations copilot that helps businesses
process trade documents faster, classify products more accurately, forecast
demand, identify compliance risks, and automate repetitive trade workflows
while keeping humans in control of high-impact decisions.

**Commercial shape:** multi-tenant SaaS. One deployment serves many companies
with hard data isolation, per-tenant configuration (jurisdictions, workflows,
approval policies), and per-tenant usage metering. Tenancy is not a later
feature — every table, query, job, cache key, vector record, and agent
execution is tenant-scoped from day one.

**Market shape:** global import/export operations. The product must not be
hard-wired to a single customs regime. Jurisdictions (WCO HS base + country
tariff extensions such as US HTS, EU CN/TARIC, Malaysia, ASEAN RTA schedules)
are pluggable, provenance-tracked data packs, not code branches.

---

## 2. Working context — the existing codebase (read before writing any code)

This is **not a greenfield build**. The repository already contains a
substantial platform. Your first job is to inventory, verify, and integrate —
not to rewrite or to duplicate.

### 2.1 What already exists

| Area | Location | State |
|---|---|---|
| Frontend | `app/`, `components/`, `lib/` — Next.js 16, tRPC v11, React 19, Tailwind 4, shadcn/Radix, Recharts, Zustand | Large surface; see `docs/component-inventory.md` for per-file status |
| Backend | `backend/` — NestJS 12, tRPC server, Prisma 7, class-validator, Socket.IO, JWT/passport | Modular: `ai/`, `auth/`, `queues/`, `repositories/`, `rules/`, `wms/`, `order-management/`, `custom-agents/`, `customs-agents/` |
| Database | PostgreSQL via Prisma, forward-only migrations | Multi-tenant models: pool / silo / cellular |
| Background jobs | BullMQ + Redis — `backend/src/queues/`; workers: `agent`, `embedding`, `forecast`, `llm`, `twin` | Replaces the master prompt's Celery/Temporal suggestion |
| Vector / search | Weaviate hybrid (BM25 + vector); embeddings via `@xenova/transformers` | RAG over cargo documents is Beta per README |
| Tariff backbone | `src/hs-code-data.ts` — HS/AHTN 2022, Malaysian MFN/SST/excise, ATIGA/ACFTA/RCEP/CPTPP/MJEPA/MCFTA rates, controlled-goods flags, per-row `source` + `retrievedAt` | Stable; **Malaysia-centric — this becomes the exemplar jurisdiction adapter, not the whole world** |
| Rules engine | `backend/src/rules/` — packs: ASEAN-ATIGA, RCEP, WCO-HS-2022, … | Extensible pack pattern already present |
| Agents | `backend/src/custom-agents/` (builder, registry, orchestration, supervision, evals), `backend/src/customs-agents/` (customs, doc, forecast, inventory, ops, risk, zone) + `.claude/agents/` | Beta; bounded-workflow pattern exists |
| Auth / tenancy | argon2id, WebAuthn passkeys, rotating JWT + Redis denylist, SSO/SCIM paths; RBAC + ABAC middleware | Stable per README |
| Docs | `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `docs/component-inventory.md` | `CONTRIBUTING.md` mandates source citations for tariff changes — keep honoring it |

### 2.2 Known gaps you are expected to close

1. **Component reality vs. README claims.** `docs/component-inventory.md`
   marks a large share of the 1,230 components as *needs-integration* or
   *needs-implementation* (including all of `components/trade-ops/documents/*`:
   `DocumentOcrUpload`, `DocumentDiffViewer`, `DocumentGenerator`,
   `PackingListView`, `TradeDocVault`). Treat that inventory as ground truth of
   what is scaffolded vs. working; treat the README Status table as a claim to
   verify, not as fact.
2. **Document intelligence is not end-to-end.** There is no verified pipeline
   from upload → OCR → typed extraction → confidence → human review →
   reconciliation. Module A is the critical path.
3. **Tariff coverage is single-jurisdiction.** Module B must generalize the
   `hs-code-data.ts` discipline (row-level source, effective date, retrieval
   timestamp) into multi-jurisdiction tariff sources without losing the
   Malaysian depth already achieved.
4. **No Python anywhere.** The master prompt suggested FastAPI/Celery/Temporal;
   this repo is a TypeScript monorepo. See §8 — we keep TypeScript and preserve
   the *adapter* philosophy instead.
5. **Forecasting exists as a service wrapper + BullMQ workers** but lacks the
   full Module C contract: backtesting, honest baselines, intervals, scenarios.

### 2.3 Ground rules for working in this repo

- Read `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, and
  `docs/component-inventory.md` before starting any task.
- Respect `.clinerules/`. Never weaken an invariant to make a test pass.
- Migrations are **forward-only** and backward-compatible; destructive changes
  need a two-release deprecation cycle.
- Any tariff data change must cite a primary source (official gazette, customs
  lookup, agency control list) with retrieval date — a CONTRIBUTING
  requirement, not a style preference.
- Routers never call `prisma` directly (existing lint rule); go through
  repositories and tRPC middleware for tenant/RBAC enforcement.
- Experimental features (digital twin GA, federated learning, quantum-hybrid
  spikes) stay feature-flagged and off by default for every tenant.

---

## 3. Core modules

All four modules ship in **one platform** (per the priority selection), but
they are delivered in the sequence given in §11 so each increment is a working
end-to-end slice, not four half-built silos.

### Module A — AI Document Extraction & Intelligence

An intelligent document processing engine accepting PDF files, scanned
documents, images, spreadsheets, and email attachments.

Supported document types: commercial invoices, packing lists, bills of lading,
air waybills, certificates of origin, purchase orders, sales orders, customs
declarations, import/export permits, product specification sheets, supplier
declarations, insurance certificates, letters of credit and supporting trade
documents.

Capabilities:

1. OCR and layout-aware document understanding (adapter-based: pluggable OCR
   provider behind an internal interface — never hard-code one vendor).
2. Automatic document type detection.
3. Extraction of structured fields, tables, line items, totals, currencies,
   dates, parties, addresses, quantities, weights, Incoterms, country of

### Module B — AI-Assisted HS Code Classification (global)

A product classification intelligence engine that recommends Harmonized
System codes using product descriptions, specifications, composition, function,
intended use, manufacturing details, and **country-specific tariff rules across
multiple jurisdictions**.

Required inputs: product name/description; material or composition; primary
function and intended use; product form and technical specifications;
manufacturing process when relevant; country of origin; importing and
exporting jurisdictions; existing HS codes if available; product images and
technical datasheets when useful.

Capabilities:

1. Normalize incomplete or inconsistent product descriptions (including ones
   extracted by Module A).
2. Identify missing product attributes that affect classification and run a
   **guided clarification workflow** — ask targeted questions instead of
   presenting an unsupported definitive classification.
3. Retrieve relevant official tariff schedules, nomenclature, explanatory
   notes, and classification rulings **only where legally available** through
   registered sources.
4. Generate ranked HS code recommendations with confidence scores.
5. Explain the reasoning behind each recommendation.
6. Show the relevant heading, subheading, section notes, chapter notes, and
   applicable legal rules.
7. Distinguish internationally harmonized HS levels (6-digit WCO) from
   country-specific extensions (8/10-digit HTS, CN, TARIC, MY headings).
8. Identify potential alternative classifications and explain the differences.
9. Compare classifications across target import markets (e.g. same product,
   US HTS vs EU CN vs Malaysian heading — duty/control implications differ).
10. Flag potentially outdated codes and nomenclature changes (HS revisions,
    annual tariff updates) with effective dates.
11. Maintain a versioned product classification database per tenant.
12. Learn from authorized human corrections **without** treating every
    correction as legally authoritative — corrections are training signal for
    ranking and a recorded decision, not a new law.

**Jurisdiction architecture (the global-trade core):**

- Define a `JurisdictionPack` interface: nomenclature version, heading tree,
  duty rates, preference schemes, control lists, provenance metadata
  (jurisdiction, publication date, effective date, retrieval timestamp,
  source URL, official vs. secondary flag).
- Ship `hs-code-data.ts` as the **Malaysia pack**, refactored behind that
  interface — this proves the contract with real, already-cited data.
- Add packs incrementally (initial target set: WCO HS base + Malaysia + one of
  US HTS or EU CN, chosen by first customer demand). Never invent a pack's
  contents; a pack exists only when populated from cited sources.
- Secondary commentary (rulings digests, broker blogs) is stored, flagged, and
  ranked below official sources — never blended silently.

For each recommendation, display: recommended code + nomenclature version;
product description used; classification rationale; supporting official sources
and effective dates; missing information and assumptions; confidence level and
competing codes; applicable jurisdiction; potential duty/tax/restriction/
licensing implications **only when supported by current pack data**; human
approval status.

**Hard rules:**

- Do not fabricate tariff codes, legal citations, duty rates, or regulatory

### Module C — AI Demand Forecasting & Supply Chain Intelligence

A forecasting engine that predicts product demand, procurement requirements,
shipment volumes, and potential supply chain disruptions.

Data inputs: historical sales and order data (CSV/XLSX import first, API sync
later); purchase orders and supplier lead times; inventory levels; stockout and
backorder history; pricing and promotions; seasonal and calendar patterns;
customer demand signals; shipment and logistics history; port delays and
transport lead times; exchange rates and economic indicators; tariff changes
and sourcing disruptions where applicable.

Capabilities:

1. SKU-level, product-category, customer-level, and regional forecasting.
2. Daily, weekly, monthly, and quarterly horizons.
3. Baseline statistical forecasting plus ML models (start with seasonal
   naive / Croston / ETS-class baselines in TypeScript; the adapter interface
   must allow an optional Python ML sidecar later — see §8).
4. Intermittent-demand handling for low-volume SKUs.
5. Forecast intervals and uncertainty estimates.
6. Scenario modeling: demand surges, supplier delays, price changes, tariff
   shocks, port delays, supplier unavailability (e.g. "demand +15%",
   "lead time +10 days").
7. Inventory replenishment recommendations; safety stock and reorder-point
   suggestions.
8. Stockout and excess-inventory risk detection with expected stockout dates.
9. Supplier lead-time variability analysis.
10. Forecast performance monitoring (MAPE/sMASE/wis as appropriate; document
    which metric, why, and its limits).
11. Explainable forecasts: major drivers and deltas vs. the previous forecast
    version.

Forecasting dashboard: actual vs. forecast; accuracy by SKU and category;
projected inventory; expected stockout dates; excess-stock exposure;
recommended purchase quantities; supplier lead-time risk; scenario comparison.

**Discipline:**

- Time-based backtesting only; candidate models compared against simple
  baselines; no data leakage (features must be computable at forecast time).
- Distinguish forecast accuracy from business outcomes.
- Reproducible forecasts from versioned input snapshots + model configs.
- Every scenario recommendation states expected impact, assumptions,
  uncertainty, and supporting evidence. Forecasts are advisory and never
  trigger purchases, staffing, or capacity actions automatically.

### Module D — AI Agent-Assisted Trade Operations

Six specialized agents on a central orchestration layer (extend the existing
`backend/src/custom-agents/` + `customs-agents/` runtime rather than adding a
second framework):

1. **Document Operations Agent** — monitors incoming documents, identifies
   types, extracts required information, detects missing documents/mismatches,
   creates review tasks, prepares validated records for downstream systems.
2. **HS Classification Agent** — collects product info, searches approved
   jurisdiction packs, recommends candidate codes, requests missing
   attributes, prepares an evidence package for approval.
3. **Customs Compliance Agent** — checks transaction data against configured
   regulatory requirements per tenant jurisdictions; flags missing permits,
   origin discrepancies, restricted-goods indicators; tracks authoritative
   rule changes; creates alerts and escalates unresolved cases.
4. **Shipment Coordination Agent** — monitors milestones, detects overdue
   events and missing documents, summarizes status, drafts follow-up emails to
   suppliers/brokers/logistics providers, recommends next actions.
5. **Demand Planning Agent** — reviews forecasts and inventory positions,
   detects stockouts/overstock, suggests replenishment, prepares **draft**
   purchase orders for approval.
6. **Trade Operations Copilot** — answers natural-language questions over
   authorized company data (RAG over documents + records via the existing
   Weaviate pipeline), retrieves sources, summarizes cases and shipment
   histories, explains alerts, generates operational reports.

Example requests the copilot must handle: "Extract all invoice line items and
reconcile against the packing list"; "Recommend HS codes for these 50 products
and flag the ones requiring manual review"; "Which shipments are missing
certificates of origin?"; "Forecast demand for the next 12 weeks and flag
potential stockouts"; "Find shipments delayed beyond expected arrival";
"Prepare a customs documentation checklist for this shipment"; "Draft an email
to the supplier requesting missing product specifications."

**Orchestration requirements:**

- Central orchestrator routes tasks to agents and tools; each agent has a
  clearly defined scope, explicit input/output schemas (zod), access only to
  authorized tools and tenant data, traceable reasoning summaries with
  evidence, task status and execution history, retry/failure handling,
  escalation rules, and cost/latency/quality monitoring.
- Bounded workflows only — no unrestricted autonomous loops.
- **Human confirmation required** before: submitting customs declarations,
  filing regulatory documents, sending external communications, issuing
  purchase orders, changing approved HS classifications, committing financial
  transactions, making binding compliance decisions.
- Read-only research, extraction, reconciliation, and draft preparation may be
  automated when configured and authorized.
- Non-idempotent tool executions require idempotency keys; duplicate execution
  must be prevented (existing BullMQ idempotency pattern).

---

## 4. Unified user experience

A modern enterprise SaaS interface — clean, professional, dense where experts
need density. Reuse the existing shadcn/Radix/Tailwind design system; do not
introduce a second component library.

Primary navigation: Executive Overview · Document Intelligence · HS
Classification · Demand Forecasting · Shipments & Trade Operations · AI Agents ·
Alerts & Exceptions · Reports & Analytics · Integrations · Administration.

Main dashboard: documents processed; classification cases awaiting approval;
high-risk compliance alerts; shipments requiring action; forecasted stockouts;
agent tasks in progress; automation success rate; estimated time/cost savings
(labeled as estimates with stated formulas).

Cross-cutting UX: global search, natural-language querying, filtering, saved
views, notifications, configurable dashboards.

Dedicated detail pages for documents, products, classifications, shipments,
forecasts, and agent tasks. **Every AI recommendation carries an evidence view
(source records/documents with page highlights), a confidence indicator, and a
clear next action** (approve / correct / escalate / dismiss). No naked AI
outputs anywhere in the UI.

Tenant context is always visible (which company/workspace am I acting in), and
impersonation or admin cross-tenant views are explicit, audited, and visually
distinct.

---

## 5. Data architecture

Four layers, mapped onto the infrastructure that already exists:

1. **Ingestion** — REST/tRPC endpoints, file uploads, batch CSV/XLSX imports,
   email ingestion (inbound parse → queue), webhooks, scheduled syncs, and
   connector adapters (ERP/procurement/TMS/WMS/brokers) behind normalized data
   contracts.
2. **Processing** — BullMQ pipelines: OCR/parse → normalize/entity-resolution →
   business rules & validation → classification retrieval & ranking →
   forecasting → event-driven workflow processing. Every job is idempotent,
   retried with backoff, and reconciled.
3. **AI intelligence** — provider-independent LLM adapters (OpenAI-compatible,
   local/Ollama, backend-hosted MCP — the adapter pattern already in
   `providers/`); RAG over approved trade + company knowledge (Weaviate
   hybrid); jurisdiction pack retrieval & ranking for classification;
   time-series models for forecasting; agent orchestration via the existing
   custom-agents runtime; confidence estimation and evaluation harnesses.
4. **Data** — PostgreSQL (operational records via Prisma), S3-compatible object
   storage for originals, Postgres full-text + Weaviate for search/semantic
   retrieval, analytics-ready historical tables for forecasting, and
   tamper-evident audit records (append-only audit events with hashes) for
   consequential actions.

Canonical entities: products, parties (suppliers/customers), documents,
shipments, purchase orders, classification decisions, tariff sources, forecasts,
agent tasks. Every one carries stable identifiers, tenant id, data lineage,
timestamps, provenance, and version history.

---

## 6. Security, governance & compliance

Enterprise-grade from the first commit — this is a multi-tenant SaaS handling
customs and commercially sensitive data:

- Tenant-aware RBAC + ABAC (exists — extend, never bypass; the middleware
  enforcement in tRPC is load-bearing).
- Least-privilege agent permissions with explicit scopes per agent instance.
- Encryption in transit and at rest; per-tenant encryption keys for silo/
  cellular tenants.
- Secret management via environment/secret manager — never in code, logs, or
  prompts.
- Document-level and field-level access restrictions where tenants require
  them.
- Audit logs for **every** human and AI action, append-only.
- Configurable data retention and deletion per tenant (with legal-hold
  overrides).
- Prompt-injection defenses for uploaded files, OCR output, and retrieved web
  pages: treat all of it as untrusted data, isolate it from instruction
  channels, and constrain tool execution to sandboxed allowlists.
- Human approval gates for consequential external actions (as in Module D).
- Model and prompt version tracking on every AI output.
- Monitoring for hallucinations, drift, and performance degradation; eval
  harnesses feed the existing `custom-agents` evals module.
- Trade compliance provenance: official legal sources vs. secondary
  commentary are distinguished and ranked; jurisdiction, publication date,
  effective date, retrieval timestamp, and source URL are stored per record.
- AI recommendations are never represented as legal advice or guaranteed
  customs outcomes — this wording appears in-product, not just in docs.

---

## 7. Integration strategy

API-first, adapter-based:

- ERP (SAP, Oracle, Microsoft Dynamics), procurement/inventory, TMS, WMS,
  customs brokers and compliance platforms, freight forwarders and tracking
  providers, email/collaboration, BI/reporting tools.
- Modular connectors with normalized data contracts, webhook events,
  idempotent processing, retries, and reconciliation logs.
- **Start with what is real today:** CSV/XLSX imports, document uploads, and
  the documented REST/tRPC APIs. Live connectors are added incrementally per
  customer, behind feature flags and credentials.
- Do not assume access to proprietary tariff databases, carrier APIs, or ERP
  environments. Use sandbox data and configurable adapters until credentials
  and permissions exist. Demo data and simulated workflows are clearly labeled
  as such in the UI and API responses.

---

## 8. Technical stack (customized — matches the repo, not the original template)

The master prompt recommended Python/FastAPI + Celery + Temporal. **This build
keeps the existing TypeScript stack** because it is already implemented,
tested, and deployed across this repository — introducing a second backend
stack now would double the operational surface for no MVP gain:

| Layer | Choice (as it exists) |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript strict, Tailwind 4 + shadcn/Radix, Recharts, Zustand, TanStack Query |
| API | tRPC v11 (typed end-to-end) + documented REST surface where external systems integrate |
| Backend | NestJS 12 (modular monolith), Socket.IO for live updates |
| Operational DB | PostgreSQL via Prisma 7, forward-only migrations |
| Object storage | S3-compatible (per-tenant prefixes + KMS keys) |
| Background jobs | BullMQ + Redis (replaces Celery); standalone workers via `WORKER_ONLY=true` (replaces Temporal for now) |
| Workflow orchestration | Deterministic FSM in the orchestrator; durable long-running flows modeled as explicit state machines with persisted state — evaluate Temporal-equivalent only when FSM persistence proves insufficient |
| Search | PostgreSQL full-text + Weaviate hybrid |
| Vector retrieval | Weaviate (existing); embeddings via `@xenova/transformers` with provider swap |
| ML / forecasting | TypeScript statistical baselines first; forecasting behind a `ForecastModel` adapter so an optional Python sidecar (scikit-learn/statsforecast) can be added per deployment without touching product code |
| AI integration | Provider-independent adapters in `providers/` (OpenAI-compatible, Ollama/local, backend-hosted MCP) |
| Auth | Existing JWT/passkeys stack; OIDC/SAML SSO + SCIM for enterprise tenants |
| Observability | Structured logs, OpenTelemetry traces, metrics, alerting |
| Deployment | Docker (`Dockerfile.web`, `Dockerfile.backend`, `docker-compose*.yml`), cloud-ready; workers deployed separately from the web tier |

Two deliberate deviations from the original prompt, both intentional:
Python is deferred (adapter-ready, not banned), and Temporal is replaced by
BullMQ + persisted FSM until proven insufficient.

---

## 9. Core database entities

Extend the existing Prisma schema; do not fork parallel tables. Coverage
required (most exist in some form — audit before creating):

- Organizations (tenants) & users; roles, permissions, agent scopes
- Suppliers and customers (parties, with tenant + external-system ids)
- Products and product attributes (per-tenant catalog, images/datasheets
  linked to document storage)
- Documents and document versions; extracted fields and line items (each field
  stores value, confidence, page/region bbox, model+prompt version)
- Validation results and reconciliation cases (invoice↔PO↔packing list)
- HS classification cases and candidate codes (ranked, with rationale,
  evidence refs, assumptions); classification approvals and decisions
  (approver, timestamp, nomenclature version, evidence snapshot)
- Jurisdictions and tariff sources / source versions (provenance: jurisdiction,
  publication date, effective date, retrieval timestamp, source URL,
  official-vs-secondary)
- Shipments and shipment milestones; purchase orders; inventory snapshots
- Demand forecasts and forecast evaluations; scenario simulations
  (input snapshot + config + result, reproducible)
- Agent definitions and executions; human approval requests (typed action
  payload, requester, approver, decision, reason)
- Alerts and exception cases; integration configurations & sync state
- Audit events (append-only, hash-chained)

Constraints and hygiene: tenant id on every tenant-scoped table with
composite indexes leading with `tenantId`; CHECK constraints for enums and
non-negative money/quantity; uniqueness on external-id-per-tenant; row-level
security where the pool tenancy model applies; per-table retention policy
metadata; soft-delete + purge workflow honoring tenant deletion requests.

---

## 10. API design

- **tRPC v11** for all first-party frontend↔backend calls: zod input/output
  schemas, cursor pagination, standardized error shapes, tenant context
  injected in middleware, rate limiting per tenant+principal.
- **REST** (versioned `/api/v1/...`) for external integrations and webhooks,
  with an OpenAPI spec generated from the same zod contracts, API-key or OIDC
  auth, idempotency keys on every non-GET, and webhook signature verification.
- Documented, versioned endpoints for: document upload/processing/retrieval;
  extracted-field review and correction; document reconciliation; product
  creation and attribute updates; HS recommendations and approvals; tariff
  source lookup (by jurisdiction + effective date); forecast creation and
  retrieval; scenario simulation; shipment tracking and exception management;
  agent task creation and status; approval workflows; reports and analytics;
  integration health and synchronization.
- Every list endpoint paginates; every write endpoint is tenant-scoped and
  audited; every AI-triggered endpoint returns evidence + confidence +
  model/prompt version alongside the result.

---

## 11. MVP delivery plan (all four modules, sequenced)

Sequencing follows the recommended build strategy — document intelligence
first (data foundation), then classification, forecasting, agents — but all
four land in the same platform within the phased plan below.

### Phase 1 — Working MVP (vertical slices, each demoable end-to-end)

1. Tenant onboarding + user auth + workspace (extend existing auth; seed a
   sandbox tenant).
2. Document upload → OCR (adapter) → invoice & packing-list extraction →
   field-level confidence → human review UI → standardized JSON records with
   audit trail. (Includes implementing the scaffolded
   `components/trade-ops/documents/*` components against real endpoints.)
3. Cross-document reconciliation: invoice ↔ packing list ↔ PO, with mismatch
   and arithmetic-discrepancy detection and a reconciliation case view.
4. HS classification MVP: refactor `hs-code-data.ts` behind the
   `JurisdictionPack` interface (Malaysia pack); candidate ranking over
   extracted product data; missing-attribute questions; evidence view; approval
   flow with history. "Requires expert review" path exercised by tests.
5. CSV/XLSX historical demand import + baseline forecasting (seasonal naive +
   one statistical model), intervals, basic accuracy report vs. baseline.
6. Copilot MVP: NL questions over the tenant's authorized records and documents
   (existing RAG pipeline), with source citations on every answer.
7. Agent task queue + approvals: Document Ops and HS Classification agents as
   bounded workflows with full execution history; human approval gate wired to
   the approvals UI; idempotency verified.
8. Audit trail view + operational dashboard (documents processed, cases
   awaiting approval, agent tasks in progress, alerts).

### Phase 2 — Operational intelligence

- Remaining document types (B/L, AWB, C/O, permits, LC documents) + expanded
  validation rules.
- Second jurisdiction pack (US HTS or EU CN — customer-driven) + cross-market
  comparison view; nomenclature-change flagging.
- Classification versioning and approval history at scale; correction
  learning loop (ranking feedback, not legal authority).
- Forecast backtesting harness, model-vs-baseline reports, scenario analysis
  (+15% demand, +10d lead time, tariff shock, port delay, supplier loss).
- Shipment monitoring + milestone exceptions; email draft generation with
  approval before send.
- Compliance agent + Shipment coordination agent live; alerts & exceptions
  queue with prioritization.
- ERP/logistics API integrations (first real connector, feature-flagged);
  inbound email ingestion.

### Phase 3 — Advanced automation

- Full six-agent orchestration with event triggers; Demand Planning agent
  drafting POs (approval-gated); Copilot report generation.
- Advanced forecasting (intermittent demand, hierarchical reconciliation,
  optional Python sidecar); inventory optimization.
- Multi-country tariff + compliance intelligence; agent performance
  evaluation dashboards; enterprise analytics; configurable tenant workflow
  automation.

### Prioritized Phase-1 backlog (build in this order)

| # | Item | Why first |
|---|---|---|
| P0 | Tenant-scoped context middleware audit + sandbox seed | Nothing is safe without it |
| P0 | Document upload → storage → job pipeline (BullMQ, idempotent) | Backbone for Modules A–D |
| P0 | Invoice/packing-list extraction schemas (zod) + LLM adapter with versioning | Defines the canonical record |
| P0 | Field confidence + source highlighting + review UI | Trust prerequisite |
| P1 | Reconciliation engine (invoice↔PL↔PO) | First "wow" workflow |
| P1 | JurisdictionPack interface + MY pack refactor | Unblocks global Module B |
| P1 | HS candidate ranking + evidence + approval | Second "wow" workflow |
| P1 | Copilot RAG over tenant records with citations | Cross-cutting value |
| P2 | CSV demand import + baseline forecast + accuracy report | Module C MVP |
| P2 | Agent runtime hardening: scopes, retries, escalation, execution history | Module D foundation |
| P2 | Document Ops + HS agents as bounded workflows | First agent showcase |
| P2 | Audit trail UI + ops dashboard + alerts queue | Management visibility |

---

## 12. Acceptance criteria

The platform is not complete until these measurable tests pass. Define
numerical targets only after evaluating representative (synthetic or
authorized) customer data; never claim production accuracy, regulatory
compliance, or financial savings without measured evidence.

**Document intelligence:** processes representative digital and scanned
documents; extracts supported fields with measured field-level precision and
recall (report the numbers and the labeled test set); identifies mismatches and
missing data; reviewers can trace every extracted field to its source region.

**HS classification:** evidence-backed candidate recommendations; identifies
missing attributes and competing classifications; jurisdiction-appropriate
nomenclature with effective dates; never invents citations; unverified results
render as "Requires expert review"; human approval and full classification
history are recorded and replayable.

**Demand forecasting:** historical imports and multiple horizons work;
time-based holdout evaluation against simple baselines; forecast error,
uncertainty, and data limitations are reported honestly; forecasts are
reproducible from versioned inputs and configs (rerun test asserts equality).

**Agent operations:** tasks execute through authorized, scoped tools; traceable
task/action histories; approval required for configured high-impact actions
(gate tests must prove the action cannot bypass approval); retries, failures,
and escalation work; duplicate execution of non-idempotent operations is
prevented (concurrency test).

**Security:** tenant isolation enforced and tested (cross-tenant access tests
for every new query path); sensitive documents and credentials protected;
critical operations appear in the audit history; prompt-injection canary
documents (embedded instructions in uploads/OCR) are neutralized in tests.

---

## 13. Instructions to the AI builder (Cursor / Claude Code working agreement)

**First, produce these seven artifacts into `docs/` before writing product
code** (each as a short, reviewed document — not a novel):

1. System architecture and component diagram (update the README diagram to
   reflect reality, including the Module A–D pipelines).
2. Prioritized MVP backlog (refine the §11 table with file-level targets from
   `docs/component-inventory.md`).
3. Relational database schema delta — which Prisma models are added/changed,
   with migration plan.
4. API contracts and core data models (zod schemas shared end-to-end).
5. User journey and dashboard wireframes for the top flows: document review,
   classification approval, forecast review, agent task + approval.
6. Security and permissions model (extend the existing RBAC/ABAC doc with
   agent scopes, field-level rules, and the approval matrix).
7. Testing strategy using synthetic or authorized sample data (see §14).

**Then implement in working increments.** For every increment:

- Ship a functional vertical slice: screen + endpoint + migration + job +
  tests, wired to real logic. **No static mockups, no fake data paths in
  production code** — demo/sandbox data is seeded and labeled.
- Run the affected test suites (`backend` Jest, frontend checks) and the
  build before declaring an increment done; paste the passing output.
- Keep migrations forward-only and backward-compatible.
- Update `docs/component-inventory.md` statuses for every file you touch.
- Record tariff-data changes with citations (jurisdiction, publication,
  effective date, retrieval timestamp, source URL).
- Commit in small, described increments; never mix a refactor of unrelated
  subsystems with a feature slice.
- If an existing "Stable"-claimed capability turns out to be scaffolded when
  you touch it, say so explicitly and either fix it within the slice or file a
  finding — do not paper over it.

**Definition of done for any feature:** works end-to-end in the sandbox tenant;
tenant-isolation test added; audit events emitted; approval gate enforced if
the action is consequential; evidence + confidence rendered if AI-generated;
tests green; docs updated.

---

## 14. Testing strategy

- **Fixtures:** a synthetic corpus of invoices, packing lists, POs, B/Ls, AWBs,
  and certificates of origin (generated, rights-clean), plus scanned/OCR
  variants and known adversarial documents (prompt-injection canaries,
  malformed tables, contradictory values).
- **Extraction:** labeled field-level gold set; precision/recall per field
  type reported in CI; regression gated against the gold set.
- **Reconciliation:** property-based tests on quantities/amounts/weights plus
  curated mismatch scenarios (missing line, price conflict, currency mismatch,
  arithmetic error).
- **Classification:** retrieval tests against the MY pack (known products →
  expected candidate sets); "insufficient evidence → Requires expert review"
  cases; cross-jurisdiction consistency checks; provenance completeness tests.
- **Forecasting:** time-based backtests with fixed seeds; baseline-comparison
  assertions; determinism test (same inputs + config ⇒ identical outputs).
- **Agents & approvals:** tool-scope violation tests; approval-bypass attempt
  tests; idempotency/concurrency tests; retry and escalation simulations.
- **Security:** cross-tenant access matrix tests for every new query path;
  injection canaries; secrets-scanning in CI; audit-chain integrity check.
- **E2E:** one happy-path Playwright (or equivalent) flow per Phase-1
  vertical slice, run against the seeded sandbox tenant.

All tests use synthetic or authorized data only.

---

## 15. Build strategy (recap)

Don't build all four capabilities at full scale simultaneously. One
end-to-end workflow at a time:

1. **Document intelligence** — establish the data foundation: extract invoice
   and packing-list data, validate fields, reconcile line items.
2. **HS classification assistance** — use extracted product data to recommend
   sourced codes, identify missing specifications, route uncertain cases to
   experts.
3. **Demand forecasting** — connect historical orders, inventory, and lead
   times; forecast demand; highlight stockout risk.
4. **Agent-assisted operations** — orchestrate the modules into workflows that
   detect exceptions, prepare recommendations, and request human approval.

## 16. The one important design decision

Treat the AI as an **intelligence and orchestration layer**, not a replacement
for existing systems. Keep transactional records in the ERP or the operational
system of record, use authoritative jurisdiction-pack tariff data for
classification, and require human approval before any consequential customs,
compliance, communications, or financial action. That approach is what makes
the platform easier to integrate, audit, and scale — and it is the reason a
multi-tenant SaaS serving global trade can be trusted at all.



- A testable API environment: seeded sandbox tenant with synthetic data,
  clearly labeled.



  requirements. If authoritative evidence is insufficient, return
  **"Requires expert review."**
- HS classification remains an **assistive recommendation** until an
  authorized trade compliance professional approves it. Approved
  classifications are recorded with approver, timestamp, evidence snapshot,
  and nomenclature version.
- Never present AI output as legal advice or a guaranteed customs outcome.

   origin.
4. Cross-document matching and validation (e.g. invoice vs. packing list).
5. Detection of missing fields, conflicting values, duplicate documents, and
   arithmetic discrepancies.
6. Confidence scoring for every extracted field.
7. Source highlighting linking each extracted value to its page and region.
8. Human review interface for correcting low-confidence fields.
9. Standardized JSON records for every document type (zod schemas, shared
   between backend and frontend via tRPC).
10. Document versioning, audit trails, searchable storage.

Document review dashboard: total documents processed, processing success rate,
fields requiring review, document mismatch alerts, average processing time,
estimated manual effort saved (label the last one as an estimate with its
stated formula — never present it as measured savings).

Every extraction result preserves source, confidence score, processing
timestamp, model/prompt version, and revision history.

**Untrusted-input rule:** document contents, OCR text, and email bodies are
data, never instructions. Strip/neutralize instruction-like content before any
LLM prompt; defend explicitly against prompt injection (see §7).

