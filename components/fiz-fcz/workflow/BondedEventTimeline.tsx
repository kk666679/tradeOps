"use client"

import * as React from "react"

import type { WorkflowZone } from "./types"

export interface TimelineEntry {
  time: string
  event: string
  zone: WorkflowZone
  note: string
  status: "ok" | "hold"
}

/** Illustrative sample consignment — no live data is implied. */
export const SAMPLE_EVENTS: readonly TimelineEntry[] = [
  {
    time: "08:12",
    event: "fiz.raw.received",
    zone: "fiz",
    note: "24 pallets · HS 3909.50 · duty-suspended intake",
    status: "ok",
  },
  {
    time: "09:40",
    event: "fiz.production.consumed",
    zone: "fiz",
    note: "WO-8842 · yield 96.4% · BOM v12",
    status: "ok",
  },
  {
    time: "11:05",
    event: "zone.transfer.fiz_fcz",
    zone: "control",
    note: "Bonded transfer · 18 pallets · transfer permit TP-2210",
    status: "ok",
  },
  {
    time: "13:20",
    event: "fcz.repack.value_added",
    zone: "fcz",
    note: "Repacked for re-export · value added tracked separately",
    status: "ok",
  },
  {
    time: "15:02",
    event: "risk.hold.raised",
    zone: "control",
    note: "Seal verification hold · escalated to Risk / Compliance",
    status: "hold",
  },
  {
    time: "16:00",
    event: "ledger.duty.reconciled",
    zone: "control",
    note: "18 pallets matched · duty suspension closed for the period",
    status: "ok",
  },
]

const ZONE_TAG: Record<WorkflowZone, string> = {
  fiz: "FIZ",
  fcz: "FCZ",
  control: "CTRL",
}

export function BondedEventTimeline({ events = SAMPLE_EVENTS }: { events?: readonly TimelineEntry[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Bonded event timeline</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Sample
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        One consignment, six ledger events. The same events drive the diagram — illustrative values only.
      </p>

      <ol className="mt-4 space-y-0">
        {events.map((entry, index) => (
          <li key={`${entry.time}-${entry.event}`} className="relative flex gap-3 pb-4 pl-1 last:pb-0">
            {index < events.length - 1 ? (
              <span className="absolute left-[9px] top-4 bottom-0 w-px bg-border" aria-hidden="true" />
            ) : null}
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                entry.status === "hold" ? "bg-cargo-500" : "bg-clear-500"
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{entry.time}</span>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                  {entry.event}
                </span>
                <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {ZONE_TAG[entry.zone]}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{entry.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default BondedEventTimeline
