"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface TwinNode {
  id: string
  label: string
  type: "warehouse" | "port" | "carrier" | "supplier" | "customer" | "hub"
  status: "healthy" | "warning" | "critical" | "offline"
  x: number
  y: number
  metrics?: Record<string, string | number>
}

export interface TwinEdge {
  id: string
  from: string
  to: string
  label?: string
  flow?: number
  status?: "active" | "delayed" | "blocked"
}

interface TwinGraphProps {
  nodes: TwinNode[]
  edges: TwinEdge[]
  onNodeClick?: (node: TwinNode) => void
  className?: string
  children?: ReactNode
}

const STATUS_COLORS: Record<TwinNode["status"], string> = {
  healthy: "bg-green-500 border-green-600",
  warning: "bg-yellow-500 border-yellow-600",
  critical: "bg-red-500 border-red-600",
  offline: "bg-gray-400 border-gray-500",
}

const EDGE_COLORS: Record<NonNullable<TwinEdge["status"]>, string> = {
  active: "stroke-green-400",
  delayed: "stroke-yellow-400",
  blocked: "stroke-red-400",
}

export function TwinGraph({ nodes, edges, onNodeClick, className, children }: TwinGraphProps) {
  return (
    <div className={cn("relative w-full h-full bg-slate-950 rounded-xl overflow-hidden", className)}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from)
          const to = nodes.find((n) => n.id === edge.to)
          if (!from || !to) return null
          return (
            <line
              key={edge.id}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              strokeWidth={2}
              strokeDasharray={edge.status === "delayed" ? "6 3" : undefined}
              className={cn("opacity-60", EDGE_COLORS[edge.status ?? "active"])}
            />
          )
        })}
      </svg>

      {nodes.map((node) => (
        <button
          key={node.id}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group",
            onNodeClick && "cursor-pointer"
          )}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onClick={() => onNodeClick?.(node)}
        >
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2 shadow-lg group-hover:scale-125 transition-transform",
              STATUS_COLORS[node.status]
            )}
          />
          <span className="text-xs text-slate-300 whitespace-nowrap">{node.label}</span>
        </button>
      ))}

      {children}
    </div>
  )
}
