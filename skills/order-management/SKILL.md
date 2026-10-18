---
name: order-management
description: >
  Validate, prioritise, allocate, and orchestrate fulfilment for sales,
  purchase, transfer, and work orders in a Container Freight Station or Free
  Zone warehouse. Handles backorders, split shipments, exception routing, and
  cross-agent handoffs. Does not file declarations or move bonded goods.
version: 1.0.0
agent_kinds:
  - ops
  - customs
  - zone
  - risk
scopes:
  - order.get
  - order.upsertDraft
  - order.updateStatus
  - order.validateLines
  - consignment.get
  - consignment.statusHistory
  - tariff.get
  - customer.get
  - customer.creditStatus
  - inventory.findAvailable
  - inventory.reserveStock
  - slot.findAvailable
  - zone.getCapacity
  - zone.isBonded
  - audit.write
guardrails:
  - id: high-value
    kind: value-threshold
    label: Allocate an order above the approval threshold
    gates: inventory.reserveStock
    thresholdMyr: 100000
    valueField: order.totalValueMyr
  - id: controlled-goods
    kind: control-list
    label: Allocate an order containing controlled goods
    gates: inventory.reserveStock
    lists:
      - MAQIS
      - SIRIM
      - MITI
      - MDA
      - Drug Control Authority
  - id: bonded-cross-zone
    kind: custom
    label: Allocate across a bonded zone boundary
    gates: inventory.reserveStock
    requiresApproval: |
      (input) => input.order.crossZone === true && input.order.bonded === true
---

# Order Management

## Purpose

Given an order and the current state of inventory, customers, and zones,
produce a fulfilment decision: whether to accept the order, how to route it,
which lines to allocate, which to backorder, and which exceptions require
human attention. The skill returns a decision, it does not commit one.

The order-management skill sits between intake (a customer, EDI feed, or
marketplace pushes an order in) and execution (picking, packing, gate-out,
and declaration). It is deliberately the only skill that makes allocation
decisions, so that prioritisation logic lives in one place.

## When to invoke

- A new sales, purchase, transfer, or work order arrives and needs
  validation.
- An existing order needs re-evaluation after an inventory change, a
  customer credit-status change, or a cut-off boundary is crossed.
- An order amendment arrives and the current allocation is invalidated.
- A cancellation arrives and the reservation must be released.

Do not invoke for:

- Filing declarations. Use `customs.prepareDeclaration`.
- Moving bonded goods. Use `zone.updateBondedLedger`.
- Physically picking or packing. Those are downstream, human-driven actions.
- Price or promotion calculation. That is a commercial system's job.

## Inputs

```ts
{
  orderId: string;
  orderType: 'sales' | 'purchase' | 'transfer' | 'work';
  customer: {
    id: string;
    tier: 'standard' | 'silver' | 'gold' | 'platinum';
    creditHold: boolean;
  };
  lines: Array<{
    lineNo: number;
    sku: string;
    qty: number;
    uom: 'EA' | 'KG' | 'L' | 'M3' | 'CTN' | 'PLT';
  }>;
  shipTo: {
    country: string;
    postcode: string;
    zone: string;
  };
  requestedShipDate: string;
  channel: 'b2b' | 'b2c' | 'marketplace' | 'internal';
  crossZone?: boolean;
  bonded?: boolean;
  totalValueMyr?: number;
}
```

## Outputs

```ts
{
  decision: 'accept' | 'hold' | 'reject' | 'cancelled';
  reason?: string;
  routing?: {
    fulfillment: 'single-ship' | 'split-ship' | 'backorder' | 'cross-dock';
    sites: string[];
    shipDate: string;
  };
  allocations: Array<{
    lineNo: number;
    sku: string;
    qtyAllocated: number;
    slot?: string;
    status: 'allocated' | 'backordered' | 'blocked';
  }>;
  backorders: Array<{
    lineNo: number;
    sku: string;
    qtyShort: number;
    expectedRestock?: string;
  }>;
  exceptions: Array<{
    code: ExceptionCode;
    severity: 'blocking' | 'warning' | 'info';
    lineNo?: number;
    message: string;
    suggestedAction: string;
  }>;
  handoffs: string[];
  audit: {
    skillId: 'order-management';
    rulesApplied: string[];
  };
}
```

## Operating procedure

1. **Load the order.** Call `order.get`. If not found, return `reject` with
   reason `order-not-found`.
2. **Detect duplicate submission.** If `idempotencyKey` matches a prior
   submission, return the existing decision.
3. **Validate the customer.** Call `customer.get` and `customer.creditStatus`.
   If `creditHold` is true, return `hold`.
4. **Validate every line.** For each line, call `tariff.get`. Unknown SKU →
   reject. Partial rejection is not supported.
5. **Classify the order.** bonded / cross-zone / controlled / cold-chain /
   hazmat. These drive guardrails and handoffs.
6. **Check availability.** Call `inventory.findAvailable` per line.
7. **Prioritise.** Tier → ship date → value → channel → age. Applied in
   order; later rules break ties in earlier ones. Do not combine into a
   single score.
8. **Decide routing.** single-ship / split-ship / backorder / cross-dock.
9. **Allocate.** Call `inventory.reserveStock` in priority order.
10. **Record audit.** Call `audit.write` with decision, rules, exceptions.
11. **Return the decision.** Do not commit a status change.

## Rules

### Validation rules

| Rule | Condition | Action |
| ---- | --------- | ------ |
| `order-not-found` | `order.get` returns null | Reject |
| `unknown-sku` | Any line's SKU not in the SKU master | Reject |
| `invalid-uom` | UOM not valid for the SKU | Reject |
| `invalid-postcode` | Postcode does not match country | Hold |
| `credit-hold` | Customer on credit hold | Hold |
| `missing-permit` | Controlled good, no permit on file | Hold |
| `bonded-cross-zone-unapproved` | Bonded goods crossing a zone | Hold |
| `duplicate-submission` | Same idempotency key seen before | Return prior decision |

### Prioritisation rules (in order)

1. `tier-priority-{platinum,gold,silver,standard}`
2. `ship-date-earliest-first`
3. `value-descending`
4. `channel-b2b-before-b2c`
5. `age-oldest-first`

### Routing rules

- `single-site-preferred`
- `split-ship-threshold`
- `backorder-window`
- `cross-dock-passthrough`

## Exception codes

| Code | Severity | Meaning |
| ---- | -------- | ------- |
| `order-not-found` | blocking | Order id does not exist |
| `unknown-sku` | blocking | SKU not in master |
| `invalid-uom` | blocking | UOM invalid for SKU |
| `invalid-postcode` | blocking | Postcode and country mismatch |
| `credit-hold` | blocking | Customer on credit hold |
| `missing-permit` | blocking | Controlled good, no permit |
| `bonded-cross-zone-unapproved` | blocking | Bonded goods crossing a zone |
| `duplicate-submission` | warning | Idempotency key already seen |
| `partial-stock` | warning | Some lines backordered |
| `cold-chain-slot-required` | warning | Cold-chain slot needed |
| `hazmat-zone-required` | warning | Hazmat zone needed |
| `cut-off-imminent` | info | Within carrier cut-off |
| `preferential-rate-eligible` | info | FTA rate may apply |

## Handoffs

| Next skill | Triggered when |
| ---------- | -------------- |
| `inventory.recommendSlot` | Allocation succeeded; slot needed |
| `customs.suggestHsCode` | Line's HS code unclassified |
| `customs.prepareDeclaration` | Order involves cross-border movement |
| `zone.issueGatePass` | Order ready to leave the zone |
| `risk.detectAnomalies` | Order pattern unusual for customer |

## Refusal cases

Refuse and return an exception rather than guess when:

- HS classification is unclear on a bonded line.
- Origin is ambiguous but a preferential rate is claimed.
- Value is undeclared and the order is above the guardrail threshold.
- Customer credit state cannot be verified.

## Evaluation

Suite defined in `eval/eval.json`; fixtures in `reference/golden.jsonl`.

```bash
pnpm skills:eval --skill order-management
```
