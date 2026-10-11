"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { WORKFLOW_STEPS } from "./workflowGraph"

/**
 * Agent orchestration matrix: every step maps to a primary agent, supporting
 * agents, and exception agents. The Custom Agents module provides the
 * 7-agent mesh (registry, builder, orchestration, supervision, policy,
 * monitoring, audit, memory, evals) within which these domain agents run.
 */
export function AgentOrchestrationMatrix() {
  const rows = React.useMemo(() => [...WORKFLOW_STEPS], [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agent orchestration matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-4">Step</th>
                <th className="pb-2 pr-4">Primary</th>
                <th className="pb-2 pr-4">Supporting</th>
                <th className="pb-2 pr-4">Exception</th>
                <th className="pb-2">Module</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((step) => (
                <tr key={step.id} className="border-t border-border">
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                        {step.step}
                      </span>
                      <span className="font-medium text-foreground">{step.title}</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <Badge variant="default" className="text-[11px]">
                      {step.agent}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {step.supportingAgents.map((agent) => (
                        <Badge key={agent} variant="outline" className="text-[10px]">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {step.exceptionAgents.map((agent) => (
                        <Badge key={agent} variant="destructive" className="text-[10px]">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-2">
                    <span className="text-xs text-muted-foreground">{step.module}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default AgentOrchestrationMatrix