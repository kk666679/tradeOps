"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"

import type { AgentFlowNode } from "../types"

/**
 * Agent directory card. Displays the agent name and its responsibility;
 * the events it owns are surfaced in the detail panel and agent directory.
 *
 * Carries the same hidden handle set as the other node types so edges can
 * attach on any side without changing the card's appearance.
 */
export function AgentNode({ data }: NodeProps<AgentFlowNode>) {
  const { name, role, dimmed } = data

  return (
    <div className="agent-card" data-dimmed={dimmed ? "true" : undefined}>
      <div className="agent-name">{name}</div>
      <div className="agent-role">{role}</div>
      <Handle key="handle-top" type="target" position={Position.Top} id="t" className="rf-hidden-handle" />
      <Handle key="handle-left" type="target" position={Position.Left} id="l" className="rf-hidden-handle" />
      <Handle key="handle-bottom" type="source" position={Position.Bottom} id="b" className="rf-hidden-handle" />
      <Handle key="handle-right" type="source" position={Position.Right} id="r" className="rf-hidden-handle" />
    </div>
  )
}

export default AgentNode
