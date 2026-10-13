---
name: sea-freight
description: >
  Prepare, validate, and orchestrate an international ocean freight shipment:
  verify booking details, check bill of lading fields, select a container
  type, resolve Incoterms risk transfer, decompose the freight quote into
  base rate and surcharges, assess demurrage and detention exposure, and
  flag carrier-liability gaps against the declared cargo value. Does not book
  with a carrier, file a BOL, or move bonded goods.
version: 1.0.0
agent_kinds:
  - ops
  - customs
  - zone
  - risk
scopes:
  - shipment.get
  - shipment.validateDocumentation
  - shipment.prepareBolDraft
  - consignment.get
  - tariff.get
  - carrier.getRates
  - carrier.getSchedule
  - carrier.getFreeTime
  - port.getCutoff
  - port.getCongestion
  - incoterms.resolve
  - container.select
  - insurance.checkCoverage
  - compliance.screenCargo
  - audit.write
guardrails:
  - id: high-value
    kind: value-threshold
    label: Prepare an ocean shipment above the approval threshold
    gates: shipment.prepareBolDraft
    thresholdMyr: 250000
    valueField: shipment.declaredValueMyr
  - id: controlled-goods
    kind: control-list
    label: Prepare a shipment containing controlled goods
    gates: shipment.prepareBolDraft
    lists:
      - MAQIS
      - SIRIM
      - MITI
      - MDA
      - Drug Control Authority
  - id: dangerous-goods
    kind: custom
    label: Prepare a shipment containing dangerous goods
    gates: shipment.prepareBolDraft
    requiresApproval: |
      (input) => input.shipment.isDangerousGoods === true
  - id: bonded-cross-zone
    kind: custom
    label: Prepare a shipment moving bonded goods across a zone
    gates: shipment.prepareBolDraft
    requiresApproval: |
      (input) => input.shipment.bonded === true && input.shipment.crossZone === true
---

# Sea Freight

## Purpose

Given a shipment request and the current state of documentation, cargo,
carriers, and port conditions, produce an ocean freight preparation
decision: whether the shipment is ready to book, which container is
appropriate, which Incoterms apply, what the freight will actually cost,
what demurrage and detention exposure exists, and which exceptions
require human attention. The skill returns a decision and a draft BOL
preparation; it does not book with a carrier.

The sea-freight skill sits between shipment intake (a customer, forwarder,
or ERP pushes a shipment in) and physical execution (booking, haulage,
loading, and carriage). It is the only skill that makes container
selection and Incoterms decisions, so that the rules live in one place.

## When to invoke

- A new ocean shipment arrives and needs pre-booking validation.
- An existing booking needs re-validation after cargo details change.
- A shipment's documentation needs a pre-issuance BOL review.
- A shipment's freight cost needs decomposition into base rate and
  surcharges for margin analysis.
- A shipment's demurrage and detention exposure needs assessment before
  the vessel arrives.

Do not invoke for:

- Booking with a carrier. That is a separate, approval-gated action.
- Air or road freight. Those are different skills.
- Customs classification or duty calculation. Use the customs skills.
- Physically stuffing or stripping a container. That is a CFS operation.
- Moving bonded goods across a zone. Use `zone.updateBondedLedger`.

## Inputs

```ts
{
  shipmentId: string;
  shipmentType: 'FCL' | 'LCL' | 'breakbulk';
  shipper: { id: string; name: string; address: string };
  consignee: { id: string; name: string; address: string };
  notifyParty?: { id: string; name: string; address: string };
  cargo: {
    description: string;
    hsCode?: string;
    quantity: number;
    uom: 'CTN' | 'PLT' | 'CBM' | 'KG' | 'EA';
    grossWeightKg: number;
    volumeCbm: number;
    isDangerousGoods: boolean;
    isTemperatureControlled: boolean;
    isOversized: boolean;
    declaredValueMyr: number;
  };
  route: {
    portOfLoading: string;      // UN/LOCODE
    portOfDischarge: string;    // UN/LOCODE
    placeOfReceipt?: string;    // inland origin
    placeOfDelivery?: string;   // inland destination
  };
  requestedDeparture?: string;  // ISO 8601
  requestedArrival?: string;    // ISO 8601
  incoterms: string;            // 'EXW' | 'FCA' | 'FOB' | 'CFR' | 'CIF' | 'CPT' | 'CIP' | 'DAP' | 'DPU' | 'DDP'
  incotermsPlace: string;       // named place per Incoterms
  carrierId?: string;
  containerType?: string;       // requested by the caller, optional
  bonded?: boolean;
  crossZone?: boolean;
  insuranceOnFile?: boolean;
}
```

## Outputs

```ts
{
  decision: 'ready' | 'hold' | 'reject';
  reason?: string;

  readiness: {
    documentation: DocumentationCheck;
    incoterms: IncotermsResolution;
    container: ContainerSelection;
    cost: CostBreakdown;
    risk: RiskAssessment;
  };

  exceptions: Array<{
    code: ExceptionCode;
    severity: 'blocking' | 'warning' | 'info';
    message: string;
    suggestedAction: string;
  }>;

  handoffs: string[];
  audit: {
    skillId: 'sea-freight';
    rulesApplied: string[];
  };
}
```

## Operating procedure

1. **Load the shipment.** Call `shipment.get`. If not found, return
   `reject` with reason `shipment-not-found`.

2. **Idempotency check.** If the caller supplies an `idempotencyKey` and
   a matching shipment already exists, return the prior decision.

3. **Screen the cargo.** Call `compliance.screenCargo` with the cargo
   description and destination. If the cargo is sanctioned, embargoed, or
   denied at the destination, return `reject` with reason
   `compliance-screen-failed`.

4. **Validate documentation.** Call `shipment.validateDocumentation` with
   the shipper, consignee, notify party, and cargo details. Missing or
   malformed fields are recorded. A blocking documentation error returns
   `hold`.

5. **Resolve Incoterms.** Call `incoterms.resolve` with the declared
   Incoterms and named place. The resolution returns risk-transfer point,
   cost-transfer point, insurance obligation, and the recommended
   Incoterms for container shipments. If the declared Incoterms is
   FAS, FOB, CFR, or CIF and the shipment type is FCL or LCL, raise the
   `incoterms-not-container-appropriate` exception and suggest FCA or CIP.

6. **Select the container.** Call `container.select` with the cargo
   characteristics and the requested container type (if any). The
   selection considers volume, weight, temperature, dimensions, and road
   weight limits at both ends of the journey. If the requested container
   type is unsuitable, record the discrepancy and recommend the correct
   type.

7. **Check insurance coverage.** Call `insurance.checkCoverage` with the
   cargo value, the Incoterms, and the insurance status. If the
   risk-transfer point is not covered by insurance, raise the
   `insurance-gap` exception at severity `blocking`.

8. **Decompose the freight cost.** Call `carrier.getRates` with the route,
   container type, and carrier. The rate is decomposed into base ocean
   freight, BAF, CAF, THC, and other surcharges. Flag any surcharge above
   the historical norm.

9. **Assess demurrage exposure.** Call `carrier.getFreeTime` and
   `port.getCongestion`. Compute the expected free time and estimate
   demurrage and detention exposure based on the current port conditions
   and the requester's historical clearance time.

10. **Check cutoffs.** Call `port.getCutoff` with the port of loading and
    the requested departure. If the documentation or cargo cutoff is
    within 48 hours, raise the `cutoff-imminent` exception at severity
    `warning`.

11. **Prepare the BOL draft.** Call `shipment.prepareBolDraft` with the
    validated details. The draft is not filed; it is a preparation step.
    The guardrails declared above have already run by this point.

12. **Audit.** Call `audit.write` with the decision, the readiness
    assessment, the guardrails that fired, and the exceptions raised.

13. **Return.** Return the decision, the readiness assessment, and the
    handoffs.

## Rules

### Validation rules

| Rule | Condition | Outcome |
| ---- | --------- | ------- |
| `shipment-not-found` | `shipment.get` returns null | Reject |
| `compliance-screen-failed` | Cargo is sanctioned or denied at destination | Reject |
| `missing-consignee` | Consignee is absent or incomplete | Hold |
| `missing-notify-party` | Notify party is required but absent | Hold |
| `invalid-unlocode` | Port code is not a valid UN/LOCODE | Reject |
| `weight-volume-mismatch` | Declared weight or volume is inconsistent with the cargo | Hold |
| `dangerous-goods-declaration-missing` | Cargo is DG but no DG declaration | Reject |
| `temperature-equipment-unavailable` | Reefer required but not available on route | Hold |
| `oversized-cargo-not-flat-rack` | Oversized cargo but no flat rack or open top booked | Hold |
| `duplicate-submission` | Idempotency key already seen | Return prior decision |

### Incoterms rules

| Rule | Condition | Outcome |
| ---- | --------- | ------- |
| `incoterms-not-container-appropriate` | FAS, FOB, CFR, or CIF used with FCL or LCL | Warning; suggest FCA or CIP |
| `incoterms-risk-cost-divergence` | CIF or CFR: seller pays freight, risk passes at loading | Info; ensure insurance is clear |
| `incoterms-exw-insurance-gap` | EXW: risk transfers before insurance attaches | Warning; recommend FCA or buyer endorsement |
| `incoterms-ddp-difficulty` | DDP: seller must clear import in destination country | Info; confirm capability |

### Container selection rules

| Rule | Condition | Outcome |
| ---- | --------- | ------- |
| `container-volume-underutilized` | Container is less than 60% utilized by volume | Warning; consider downgrade or LCL |
| `container-weight-over-limit` | Gross weight exceeds road weight limit at origin or destination | Blocking; recommend 20ft or split |
| `container-reefer-required` | Temperature-controlled cargo | Info; reefer selected, confirm power availability |
| `container-flat-rack-required` | Oversized cargo | Info; flat rack or open top selected |
| `container-high-cube-appropriate` | Light, bulky cargo | Info; high cube recommended |

### Cost rules

| Rule | Condition | Outcome |
| ---- | --------- | ------- |
| `surcharge-above-norm` | A surcharge exceeds the historical norm for the lane | Warning; verify with carrier |
| `base-rate-above-norm` | Base rate exceeds the historical norm for the lane | Warning; compare with alternative carriers |
| `thc-mismatch` | THC at origin and destination are asymmetric by more than 20% | Info; verify with agents |
| `demurrage-exposure-high` | Estimated demurrage exposure exceeds threshold | Warning; pre-alert documentation |

### Guardrails (applied by the runtime, not by this skill)

- **`high-value`** — declared value above MYR 250,000.
- **`controlled-goods`** — any HS code carries a control-list flag.
- **`dangerous-goods`** — cargo is flagged as dangerous goods.
- **`bonded-cross-zone`** — bonded goods crossing a zone boundary.

When a guardrail fires, the runtime raises an approval request and returns
control to the caller with a `GUARDRAIL_PENDING` error.

## Exception codes

| Code | Severity | Meaning |
| ---- | -------- | ------- |
| `shipment-not-found` | blocking | Shipment id does not exist |
| `compliance-screen-failed` | blocking | Cargo denied at destination |
| `missing-consignee` | blocking | Consignee information incomplete |
| `missing-notify-party` | blocking | Notify party required but absent |
| `invalid-unlocode` | blocking | Port code invalid |
| `weight-volume-mismatch` | blocking | Cargo measurements inconsistent |
| `dangerous-goods-declaration-missing` | blocking | DG cargo without declaration |
| `temperature-equipment-unavailable` | blocking | Reefer not available |
| `oversized-cargo-not-flat-rack` | blocking | Oversized cargo without special equipment |
| `insurance-gap` | blocking | Risk transfer not covered by insurance |
| `incoterms-not-container-appropriate` | warning | FAS/FOB/CFR/CIF with FCL/LCL |
| `incoterms-exw-insurance-gap` | warning | EXW insurance gap |
| `container-volume-underutilized` | warning | Container underutilized by volume |
| `surcharge-above-norm` | warning | Surcharge above historical norm |
| `base-rate-above-norm` | warning | Base rate above historical norm |
| `demurrage-exposure-high` | warning | High demurrage exposure |
| `cutoff-imminent` | info | Within 48 hours of cutoff |
| `thc-mismatch` | info | THC asymmetry at origin and destination |
| `duplicate-submission` | info | Idempotency key already seen |

## Handoffs

| Next skill | Triggered when |
| ---------- | -------------- |
| `customs.suggestHsCode` | HS code is absent or unclassified |
| `customs.prepareDeclaration` | Cross-border movement requires a declaration |
| `ops.requestBooking` | Shipment is ready and booking should proceed |
| `inventory.recommendSlot` | Cargo needs storage before departure |
| `risk.detectAnomalies` | Route or cargo pattern is unusual for the shipper |

## Refusal cases

The skill refuses and returns an exception rather than proceeding when:

- **The destination is under sanctions or embargo.** No workaround exists.
- **The cargo is dangerous goods without a DG declaration.** Refuse and
  hold. Do not prepare a BOL draft under an assumed DG classification.
- **The declared cargo measurements are internally inconsistent.** Weight
  and volume that do not match the description indicate a data error.
- **The declared Incoterms is incompatible with the shipment type and the
  requester insists on proceeding.** Record the warning; do not override.
- **Insurance is absent when the declared Incoterms places risk with the
  requester.** Refuse and hold until insurance is confirmed.

## Examples

See `reference/golden.jsonl` for the full evaluation set.

### Ready shipment — clean FCL export

Input:

```json
{
  "shipmentId": "SHP-2026-000101",
  "shipmentType": "FCL",
  "shipper": { "id": "SHIP-001", "name": "Acme Trading", "address": "Port Klang, MY" },
  "consignee": { "id": "CON-001", "name": "Rotterdam Imports BV", "address": "Rotterdam, NL" },
  "cargo": {
    "description": "Furniture, wooden, assembled",
    "hsCode": "940330",
    "quantity": 240,
    "uom": "CTN",
    "grossWeightKg": 8400,
    "volumeCbm": 48,
    "isDangerousGoods": false,
    "isTemperatureControlled": false,
    "isOversized": false,
    "declaredValueMyr": 120000
  },
  "route": {
    "portOfLoading": "MYPKG",
    "portOfDischarge": "NLRTM"
  },
  "requestedDeparture": "2026-11-15",
  "incoterms": "CIP",
  "incotermsPlace": "Rotterdam",
  "insuranceOnFile": true
}
```

Output:

```json
{
  "decision": "ready",
  "readiness": {
    "documentation": { "errors": [], "warnings": [] },
    "incoterms": {
      "riskTransferPoint": "on handover to first carrier",
      "costTransferPoint": "at destination",
      "insuranceObligation": "seller, comprehensive cover",
      "containerAppropriate": true
    },
    "container": {
      "recommendedType": "40' Dry Van",
      "utilization": 0.72,
      "rationale": "48 CBM, 8,400 kg; well within 40' dry van limits"
    },
    "cost": {
      "baseFreightMyr": 12600,
      "surcharges": [
        { "code": "BAF", "amountMyr": 4050 },
        { "code": "CAF", "amountMyr": 1130 },
        { "code": "THC", "amountMyr": 1580 }
      ],
      "totalMyr": 19360
    },
    "risk": {
      "demurrageExposureMyr": 0,
      "detentionExposureMyr": 0,
      "insuranceGap": false
    }
  },
  "exceptions": [],
  "handoffs": ["ops.requestBooking"],
  "audit": {
    "skillId": "sea-freight",
    "rulesApplied": ["compliance-screen", "documentation-check", "incoterms-resolution", "container-selection", "cost-decomposition"]
  }
}
```

## Evaluation

Suite defined in `eval/eval.json`; fixtures in `reference/golden.jsonl`.

```bash
pnpm skills:eval --skill sea-freight
```
