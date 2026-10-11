import type { WorkflowStepDefinition } from "../types"

/**
 * Control & close-out — duty reconciliation and audit close.
 * Event identifiers and agent names are preserved exactly from the reference
 * implementation.
 */
export const CLOSE_OUT_STEPS: readonly WorkflowStepDefinition[] = [
  {
    id: "close-recon",
    zone: "control",
    step: "R",
    title: "Duty reconciliation",
    sub: "Suspension / zero-duty close",
    description:
      "Bonded movements are reconciled against the ledger: what entered, what was consumed, what was excised, and what left. Duty suspension is closed only when the balances agree.",
    event: "ledger.duty.reconciled",
    agent: "Reconciliation Agent",
    module: "Trade OPS",
    status: "pending",
    dutyStatus: "suspended",
    supportingAgents: ["Customs Agent", "Inventory Agent"],
    exceptionAgents: ["Reconciliation Agent", "Risk / Compliance"],
    exceptionTarget: "close-risk",
  },
  {
    id: "close-audit",
    zone: "control",
    step: "A",
    title: "Audit close",
    sub: "Evidence pack · period lock",
    description:
      "The evidence pack for the period is assembled and the period is locked. Every event referenced by the reconciliation is hash-chained, so the pack cannot be edited after the fact.",
    event: "audit.period.closed",
    agent: "Auditor Agent",
    module: "Custom Agents",
    status: "pending",
    dutyStatus: "n_a",
    supportingAgents: ["Ledger Agent", "Risk / Compliance"],
    exceptionAgents: ["Auditor Agent", "Risk / Compliance"],
    exceptionTarget: "close-risk",
  },
]

/** Footnote nodes attached to the control lane. */
export const CONTROL_NOTES: readonly {
  id: string
  title: string
  sub: string
  event: string
}[] = [
  {
    id: "close-ledger",
    title: "Bonded ledger",
    sub: "Every step = one hash-chained event",
    event: "ledger.append",
  },
  {
    id: "close-risk",
    title: "Exception / hold",
    sub: "Anomalies · escalations · SLA",
    event: "risk.hold.raised",
  },
]

/** Bridge note between the FIZ and FCZ lanes. */
export const ZONE_TRANSFER_NOTE: {
  id: string
  title: string
  sub: string
  event: string
} = {
  id: "zone-transfer",
  title: "Bonded transfer",
  sub: "FIZ → FCZ · duty-suspended",
  event: "zone.transfer.fiz_fcz",
}