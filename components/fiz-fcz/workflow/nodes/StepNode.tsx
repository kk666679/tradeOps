"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"

import type { StepFlowNode } from "../types"

const DUTY_LABEL: Record<string, string> = {
  suspended: "SUSPENDED",
  zero: "ZERO DUTY",
  excised: "EXCISED",
  n_a: "N/A",
}

const STATUS_LABEL: Record<string, string> = {
  pending: "PENDING",
  in_progress: "ACTIVE",
  completed: "DONE",
  exception: "EXCEPTION",
  on_hold: "ON HOLD",
}

/**
 * Workflow step card: sequence badge, zone tag, title, sub-line, and the
 * ledger event + owning agent footer. Carries the six-module substrate
 * fields: module overlay, status, HS code, and duty status.
 */
export function StepNode({ data, selected }: NodeProps<StepFlowNode>) {
  const {
    step,
    zoneLabel,
    title,
    sub,
    event,
    agent,
    module: moduleLabel,
    status,
    hsCode,
    dutyStatus,
    supportingAgents,
    exceptionAgents,
    dimmed,
    onPath,
  } = data

  return (
    <div
      className="step-card"
      data-selected={selected ? "true" : undefined}
      data-dimmed={dimmed ? "true" : undefined}
      data-on-path={onPath ? "true" : undefined}
      data-status={status}
    >
      <div className="step-top">
        <span className="step-num">{step}</span>
        <span className="step-zone-tag">{zoneLabel}</span>
      </div>
      <div className="step-title">{title}</div>
      <div className="step-sub">{sub}</div>
      <div className="step-foot">
        <code className="step-event" title={event}>
          {event}
        </code>
        <span className="step-agent">{agent}</span>
      </div>

      <div className="step-meta">
        <span className="step-module">{moduleLabel}</span>
        <span className="step-duty" data-duty={dutyStatus}>{DUTY_LABEL[dutyStatus] ?? dutyStatus}</span>
        {hsCode ? <span className="step-hs">HS {hsCode}</span> : null}
        <span className="step-status-dot" data-status={status} title={STATUS_LABEL[status] ?? status} />
      </div>

      {/* Hidden connection points — all four handles accept both source and
          target so edges can flow in any direction (FIZ top-down, FCZ
          bottom-up, lateral zone-transfer, right-exit to close-out). */}
      <Handle type="source" position={Position.Top} id="t" className="rf-hidden-handle" />
      <Handle type="target" position={Position.Top} id="t-in" className="rf-hidden-handle" />
      <Handle type="source" position={Position.Left} id="l" className="rf-hidden-handle" />
      <Handle type="target" position={Position.Left} id="l-in" className="rf-hidden-handle" />
      <Handle type="source" position={Position.Bottom} id="b" className="rf-hidden-handle" />
      <Handle type="target" position={Position.Bottom} id="b-in" className="rf-hidden-handle" />
      <Handle type="source" position={Position.Right} id="r" className="rf-hidden-handle" />
      <Handle type="target" position={Position.Right} id="r-in" className="rf-hidden-handle" />
    </div>
  )
}

export default StepNode