"use client"

import type { NodeProps } from "@xyflow/react"

import type { LaneFlowNode } from "../types"

/**
 * Non-interactive lane (zone container). Rendered behind the step cards,
 * purely as a grouping affordance.
 */
export function LaneNode({ data }: NodeProps<LaneFlowNode>) {
  return (
    <div className="lane-card">
      <div className="lane-head">
        <span className="lane-title">{data.title}</span>
        <span className="lane-sub">{data.subtitle}</span>
      </div>
    </div>
  )
}

export default LaneNode
