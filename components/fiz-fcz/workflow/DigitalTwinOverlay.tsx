"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { WORKFLOW_STEPS } from "./workflowGraph"

/**
 * Digital Twin overlay: zone graph, scenario builder, what-if analysis, live
 * metrics, and bottleneck Pareto across FIZ and FCZ steps.
 */
const METRICS = [
  { label: "Dwell time", value: "2.4h", zone: "FIZ" as const },
  { label: "Overstay risk", value: "Low", zone: "FCZ" as const },
  { label: "Yield variance", value: "1.2%", zone: "FIZ" as const },
  { label: "Scrap rate", value: "0.8%", zone: "FIZ" as const },
  { label: "Duty suspension aging", value: "Closed", zone: "FIZ" as const },
  { label: "Reconciliation lag", value: "0m", zone: "FCZ" as const },
]

const BOTTLENECKS = [
  { x: "FIZ-3 BOM", y: 34, zone: "FIZ" as const },
  { x: "FCZ-3 Break-bulk", y: 28, zone: "FCZ" as const },
  { x: "FCZ-6 Entrepot", y: 22, zone: "FCZ" as const },
  { x: "FIZ-4 Scrap", y: 14, zone: "FIZ" as const },
  { x: "FCZ-2 Tranship", y: 11, zone: "FCZ" as const },
]

export function DigitalTwinOverlay() {
  const maxBottleneck = Math.max(1, ...BOTTLENECKS.map((b) => b.y))

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Live metrics overlay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {METRICS.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-border bg-card/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <Badge
                    variant={metric.zone === "FIZ" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {metric.zone}
                  </Badge>
                </div>
                <div className="mt-1 text-lg font-semibold text-foreground">{metric.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bottleneck Pareto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[220px] items-end gap-2">
            {BOTTLENECKS.map((b) => (
              <div key={b.x} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-foreground">{b.y}%</span>
                <div
                  className={'w-full rounded-t ' + (b.zone === "FIZ" ? "bg-fiz/80" : "bg-fcz/80")}
                  style={{ height: `${(b.y / maxBottleneck) * 100}%` }}
                  title={`${b.x}: ${b.y}%`}
                />
                <span className="text-[10px] text-muted-foreground">{b.x}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Zone graph &amp; scenario builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[10px]">FIZ</Badge>
                <span className="text-sm font-medium">Free Industrial Zone</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {WORKFLOW_STEPS.filter((s) => s.zone === "fiz").length} steps · duty-suspended
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">FCZ</Badge>
                <span className="text-sm font-medium">Free Commercial Zone</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {WORKFLOW_STEPS.filter((s) => s.zone === "fcz").length} steps · zero duty
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">BONDED</Badge>
                <span className="text-sm font-medium">Bonded transfer</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                FIZ → FCZ · duty-suspended bridge
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Use the Digital Twin scenario builder to model exception paths, hold states,
            and what-if analysis for duty suspension, re-export, and entrepot matching.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DigitalTwinOverlay