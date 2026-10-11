"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { EXCEPTIONS_BY_STEP, EXCEPTION_PATHS } from "./data/ledger"
import { STEP_BY_ID } from "./workflowGraph"

/**
 * Summarises the ten exception paths that must be designed early. Each
 * exception creates a ledger event, notifies the Risk/Compliance Agent, and
 * optionally places the flow on hold.
 */
export function ExceptionPathSummary() {
  const paths = React.useMemo(() => [...EXCEPTION_PATHS], [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Exception paths</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
          {paths.map((path) => {
            const step = STEP_BY_ID.get(path.fromStep)
            return (
              <div
                key={path.id}
                className="rounded-lg border border-border bg-card/60 p-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {step?.title ?? path.fromStep}
                  </span>
                  <Badge variant="destructive" className="text-[10px]">
                    {path.agent}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{path.reason}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-alert-500" />
                    creates event
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cargo-500" />
                    notifies Risk/Compliance
                  </span>
                  {path.holdNote ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      hold → {path.holdNote}
                    </span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default ExceptionPathSummary