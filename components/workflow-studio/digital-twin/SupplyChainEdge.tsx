import { cn } from "@/lib/utils"
import type { TwinEdge } from "./TwinGraph"

interface SupplyChainEdgeProps {
  edge: TwinEdge
  className?: string
}

const STATUS_STYLES: Record<NonNullable<TwinEdge["status"]>, string> = {
  active: "text-green-400",
  delayed: "text-yellow-400",
  blocked: "text-red-400",
}

export function SupplyChainEdge({ edge, className }: SupplyChainEdgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/60 text-xs",
        STATUS_STYLES[edge.status ?? "active"],
        className
      )}
    >
      <span className="font-mono">{edge.from}</span>
      <span className="text-slate-500">→</span>
      <span className="font-mono">{edge.to}</span>
      {edge.label && <span className="text-slate-400 ml-auto">{edge.label}</span>}
      {edge.flow !== undefined && (
        <span className="ml-auto font-medium">{edge.flow} units/h</span>
      )}
    </div>
  )
}
