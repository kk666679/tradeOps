"use client"

import * as React from "react"

import { WORKFLOW_STEPS } from "./workflowGraph"
import { ZONE_LABELS } from "./types"
import type { WorkflowZone, WorkflowStepDefinition } from "./types"

export interface WorkflowStepListProps {
  steps?: readonly WorkflowStepDefinition[]
  selectedId?: string | null
  onSelect: (nodeId: string) => void
}

const ZONE_ORDER: readonly WorkflowZone[] = ["fiz", "fcz", "control"]

function groupByZone(steps: readonly WorkflowStepDefinition[]) {
  return ZONE_ORDER.map((zone) => ({
    zone,
    label: ZONE_LABELS[zone],
    steps: steps.filter((step) => step.zone === zone),
  })).filter((group) => group.steps.length > 0)
}

/**
 * Linear, fully keyboard-accessible rendering of the same workflow model used
 * by the diagram. Used on small screens and by anyone who prefers a list.
 */
export function WorkflowStepList({
  steps = WORKFLOW_STEPS,
  selectedId = null,
  onSelect,
}: WorkflowStepListProps) {
  const groups = React.useMemo(() => groupByZone(steps), [steps])

  return (
    <div className="h-full overflow-y-auto bg-background p-3">
      <div className="space-y-5">
        {groups.map((group) => (
          <section key={group.zone}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </h3>
            <ol className="space-y-2">
              {group.steps.map((step) => {
                const selected = step.id === selectedId
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(step.id)}
                      aria-current={selected ? "step" : undefined}
                      className={`w-full rounded-lg border bg-card p-3 text-left transition hover:border-primary/50 ${
                        selected ? "border-primary ring-1 ring-primary/40" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                          {step.step}
                        </span>
                        <span className="text-sm font-medium text-foreground">{step.title}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{step.sub}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{step.event}</code>
                        <span className="rounded-full border border-border px-2 py-0.5">{step.agent}</span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}

export default WorkflowStepList
