"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"

import type { NoteFlowNode } from "../types"

/**
 * Footnote / bridge node (bonded transfer, bonded ledger, exception hold).
 */
export function NoteNode({ data, selected }: NodeProps<NoteFlowNode>) {
  const { title, sub, event, dimmed, onPath } = data

  return (
    <div
      className="note-card"
      data-selected={selected ? "true" : undefined}
      data-dimmed={dimmed ? "true" : undefined}
      data-on-path={onPath ? "true" : undefined}
    >
      <div className="note-title">{title}</div>
      <div className="note-sub">{sub}</div>
      {event ? <div className="note-event">{event}</div> : null}

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
