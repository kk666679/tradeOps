import type { WorkflowStepDefinition } from "../types"

/**
 * Bonded ledger event schema.
 *
 * Every workflow step appends exactly one immutable event to the bonded
 * ledger. Events are hash-chained: each event carries the `prevHash` of its
 * predecessor, so the sequence can be verified after the fact and any
 * tampering is detectable.
 */

/** Canonical fields emitted by every bonded-ledger event. */
export interface BondedLedgerEvent {
  eventId: string
  eventType: string
  zone: "FIZ" | "FCZ" | "CONTROL"
  step: number | string
  timestamp: string
  actor: string
  agent: string
  module: string
  refs: string[]
  hsCode?: string
  qty?: number
  uom?: string
  value?: number
  dutyStatus: "suspended" | "zero" | "excised" | "n_a"
  prevHash: string
  hash: string
}

/** Exception paths that can branch off a step. */
export interface ExceptionPath {
  id: string
  fromStep: string
  agent: string
  reason: string
  holdNote?: string
  createsEvent: boolean
  notifyRisk: boolean
}

/** Hash-chain helper — produces a deterministic SHA-256 over the canonical JSON. */
export async function computeEventHash(event: Omit<BondedLedgerEvent, "hash">): Promise<string> {
  const canonical = JSON.stringify({
    eventId: event.eventId,
    eventType: event.eventType,
    zone: event.zone,
    step: event.step,
    timestamp: event.timestamp,
    actor: event.actor,
    agent: event.agent,
    module: event.module,
    refs: event.refs,
    hsCode: event.hsCode ?? null,
    qty: event.qty ?? null,
    uom: event.uom ?? null,
    value: event.value ?? null,
    dutyStatus: event.dutyStatus,
    prevHash: event.prevHash,
  })

  const encoder = new TextEncoder()
  const data = encoder.encode(canonical)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return `sha256:${hashHex}`
}

/** Build a complete ledger event from a workflow step definition + inputs. */
export async function buildLedgerEvent(
  step: WorkflowStepDefinition,
  input: {
    eventId: string
    timestamp: string
    actor: string
    refs: string[]
    qty?: number
    uom?: string
    value?: number
    prevHash: string
  },
): Promise<BondedLedgerEvent> {
  const base: Omit<BondedLedgerEvent, "hash"> = {
    eventId: input.eventId,
    eventType: step.event,
    zone: step.zone === "control" ? "CONTROL" : step.zone.toUpperCase() as "FIZ" | "FCZ",
    step: step.step,
    timestamp: input.timestamp,
    actor: input.actor,
    agent: step.agent,
    module: step.module,
    refs: input.refs,
    hsCode: step.hsCode,
    qty: input.qty,
    uom: input.uom,
    value: input.value,
    dutyStatus: step.dutyStatus,
    prevHash: input.prevHash,
  }
  return { ...base, hash: await computeEventHash(base) }
}

/** The ten exception paths that must be designed early. */
export const EXCEPTION_PATHS: readonly ExceptionPath[] = [
  {
    id: "exc-short-shipment",
    fromStep: "fiz-1",
    agent: "Risk / Compliance",
    reason: "Short shipment or over-receipt detected at raw material intake",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-hs-mismatch",
    fromStep: "fiz-2",
    agent: "Customs Agent",
    reason: "HS code mismatch on machinery classification",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-yield-variance",
    fromStep: "fiz-3",
    agent: "BOM / Yield Agent",
    reason: "BOM yield variance beyond tolerance",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-scrap-not-excised",
    fromStep: "fiz-4",
    agent: "Waste Agent",
    reason: "Scrap not reason-coded or not excised",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-transhipment-overstay",
    fromStep: "fcz-2",
    agent: "Transhipment Agent",
    reason: "Transhipment overstay beyond bonded window",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-breakbulk-mismatch",
    fromStep: "fcz-3",
    agent: "Break-bulk Agent",
    reason: "Break-bulk quantity mismatch parent/child",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-repack-undeclared",
    fromStep: "fcz-4",
    agent: "Repackaging Agent",
    reason: "Repackaging value-add not declared",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-entrepot-mismatch",
    fromStep: "fcz-6",
    agent: "Entrepot Agent",
    reason: "Entrepot import/export mismatch",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-duty-not-closed",
    fromStep: "close-recon",
    agent: "Reconciliation Agent",
    reason: "Duty suspension not closed after export",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
  {
    id: "exc-audit-evidence-missing",
    fromStep: "close-audit",
    agent: "Auditor Agent",
    reason: "Audit evidence missing or hash mismatch",
    holdNote: "close-risk",
    createsEvent: true,
    notifyRisk: true,
  },
]

/** Map step id → exception paths that branch off it. */
export const EXCEPTIONS_BY_STEP: ReadonlyMap<string, readonly ExceptionPath[]> = new Map(
  EXCEPTION_PATHS.map((path) => [path.fromStep, [path]]),
)