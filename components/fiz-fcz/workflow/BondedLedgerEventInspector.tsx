"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { buildLedgerEvent } from "./data/ledger"
import { WORKFLOW_STEPS } from "./workflowGraph"
import type { BondedLedgerEvent } from "./data/ledger"

/**
 * Renders the canonical ledger-event payload for every step in the backbone,
 * demonstrating hash chaining across the end-to-end flow.
 */
export function BondedLedgerEventInspector() {
  const [chain, setChain] = React.useState<BondedLedgerEvent[]>([])

  React.useEffect(() => {
    let prevHash = "genesis"
    const events: BondedLedgerEvent[] = []
    for (const step of WORKFLOW_STEPS) {
      const event = buildLedgerEvent(step, {
        eventId: `evt_${step.id}`,
        timestamp: new Date().toISOString(),
        actor: "system",
        refs: [`PO-${step.step}`, `ASN-${step.step}`, `DECL-${step.step}`],
        qty: step.step === 1 || step.step === 3 ? 100 : undefined,
        uom: step.step === 1 || step.step === 3 ? "PCS" : undefined,
        value: step.step === 1 || step.step === 5 ? 5000 : undefined,
        prevHash,
      })
      events.push(event)
      prevHash = event.hash
    }
    setChain(events)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bonded ledger event chain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
          {chain.map((event) => (
            <div
              key={event.eventId}
              className="rounded-lg border border-border bg-card/60 p-2.5 font-mono text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">{event.eventId}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {event.eventType}
                </Badge>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-muted-foreground">
                <span>zone: {event.zone}</span>
                <span>step: {event.step}</span>
                <span>agent: {event.agent}</span>
                <span>module: {event.module}</span>
                {event.qty ? <span>qty: {event.qty} {event.uom}</span> : null}
                {event.value ? <span>value: {event.value}</span> : null}
                <span>duty: {event.dutyStatus}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>prev: {event.prevHash.slice(0, 14)}…</span>
                <span className="text-foreground">hash: {event.hash.slice(0, 14)}…</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BondedLedgerEventInspector