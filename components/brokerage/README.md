# Brokerage Module — JKDM-configurable regulatory control architecture

Real-world customs brokerage workflows for Malaysian trade operations, driven by
a **configurable rule registry** rather than hard-coded UI rules. Based on
**Customs Act 1967 §90** and the JKDM guideline *"Panduan Ejen Kastam di bawah
Seksyen 90 Akta Kastam 1967"* (version 2, 25 April 2025), with form purposes
verified against the JKDM prescribed-forms reference.

## Three-layer architecture

### Layer 1 — Operations
Clients · Shipment intake · Declaration preparation · K1/K2/K3/K7/K8/K9 ·
Document evidence.

### Layer 2 — Regulatory controls
Configurable rules · Licence checks · Prohibitions and restrictions · Duties
and taxes · Channel instructions · Bond requirements. Each declaration is
evaluated against the active rule set through an explicit `regulatory-gate`.

### Layer 3 — Authorization and accreditation
Accreditation · Delegated authority · Human approval · Release eligibility ·
Decision evidence.

A declaration cannot bypass a failed mandatory control. A workflow approval is
**not** a JKDM customs release.

## The configurable rule model

The regulatory engine is data-driven:

- `RegulatoryControl` — a single rule (severity, mandatory, effective dates,
  references, evaluator, version, parameters).
- `RegulatoryReference` — the legal source. Carries `verificationStatus`
  (VERIFIED / PENDING_REVIEW / SUPERSEDED); the UI never presents a
  non-verified reference as authoritative.
- `ControlEvaluation` — a record of evaluating one control, with the rule
  version that was applied.
- `RegulatoryGateResult` — the aggregate outcome, including blocking control
  IDs and the rule set version stamped at evaluation time.

Controls are catalogued in `regulatory/controlCatalog.ts`. This file can be
replaced at runtime by a persisted administration UI or a newer JKDM baseline
without rewriting any UI component.

### Form code vs form purpose

`K1 / K2 / K3 / K7 / K8 / K9` are **codes**, not interchangeable purposes.
`Kastam No. 6` is a **general bond**. `Kastam No. 7` is a **traveller
declaration**. The system must verify each code against the current JKDM
prescribed-forms reference before enabling it for a transaction — see
`form.purpose.verified` in the control catalog.

## Layers of traceability

Every evaluation carries:

- the **control ID** and **version**,
- the **rule set version** (`jkdm-my-2025.04.22.1` by default),
- the **references** with their verification status,
- the **actor** and **timestamp**,
- the **evidence IDs** the evaluator relied on.

Those fields flow through to `AuditChainEntry` and `EvidencePackBuilder` so a
decision can be replayed against the exact rule set that produced it.

## Simulation vs JKDM decision

`runBrokerageSimulation` evaluates the rule catalog locally. It never contacts
JKDM, never assigns an actual channel, and never issues a release. All
simulation log entries are prefixed `[SIMULATION]`.

## Files

- `regulatory/controlCatalog.ts` — the JKDM control definitions
- `regulatory/regulatoryEngine.ts` — pure evaluators and the gate
- `regulatory/ruleSet.ts` — versioned wrapper with effective-date filtering
- `workflow/brokerageWorkflowGraph.ts` — builds the layered graph from the catalog
- `workflow/BrokerageWorkflowExplorer.tsx` — the interactive explorer
- `workflow/RegulatoryHealthPanel.tsx` — shows the gate result
- `workflow/Section90Checklist.tsx` — printable audit, driven by the gate
- `workflow/BorangCTrace.tsx` — traces a signed declaration back to the rule set

## Accessibility

- All nodes have `role`, `tabIndex`, `aria-label`
- Keyboard navigation across nodes
- Colour is never the only signal (icons + labels accompany all statuses)
- Focus rings on all interactive elements
- `prefers-reduced-motion` respected in the simulation
