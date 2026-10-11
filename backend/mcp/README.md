# TradeOps MCP

The MCP server is hosted by the NestJS backend at `/api/mcp`. The protocol
runtime and registry share the backend's dependency graph and deployment.

## Layout

```
../src/mcp/       MCP transport, protocol helpers, and TradeOps tools
registry/         MCP registry manifests and deployment profiles
```

## Run

```bash
cd backend
npm install
npm run start:dev
npm run test:mcp
```

Configure clients to connect to `http://localhost:3001/api/mcp` and send a
backend JWT bearer token. The endpoint uses Streamable HTTP sessions, scoped to
the authenticated tenant. Sessions end when the client closes them or the
backend process restarts.

## TradeOps Core data behavior

The active TradeOps Core tools use the backend Prisma models; they do not
provide in-memory sample inventory or a synthetic yard snapshot.

- Gate-in resolves an active tenant `Zone` by its exact `code` (`CFS`, `FIZ`,
  or `FCZ`) and persists a `GateEvent` only after any required MRTR approval.
  Gate-out resolves the container's tenant-scoped `Cargo` and records the event
  against that cargo's zone.
- Slot allocation resolves the tenant's active zone and container record,
  claims an available `Slot` transactionally, and creates a `SlotAllocation`.
  Reefer requests match `Slot.slotType = REEFER`; priority and source details
  are retained as allocation metadata.
- Inventory query filters `Inventory.metadata` on `lotId`, `batchId`, and
  `serial`, and returns nullable lot, HS-code, and location values when the
  stored record does not include them.
- Ledger debit/credit maps to `BondedLedger` ENTRY/WITHDRAWAL. CIF value is
  stored in the ledger's value and running-balance fields; duty-suspended value
  and unit are retained in metadata. Credit cannot exceed the recorded CIF
  balance for the tenant, zone, and HS code.
- Reconciliation checks persisted ledger balance arithmetic and continuity
  within the requested period. It is not an ERP reconciliation; an ERP source
  is not currently connected to this server. Tasks are scoped to the tenant
  and actor that started them.
- Yard capacity and occupancy come from active tenant zones and slots. Dwell
  percentiles use matching gate-in/gate-out events from the most recent 90 days;
  they are `null` where there are no completed observations.

Tool calls are tenant- and actor-bound, policy-checked, and emit an
OpenTelemetry span and audit-chain entry.
