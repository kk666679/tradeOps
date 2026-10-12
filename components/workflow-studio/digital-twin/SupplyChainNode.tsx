import { cn } from "@/lib/utils"
import type { TwinNode } from "./TwinGraph"

interface SupplyChainNodeProps {
  node: TwinNode
  selected?: boolean
  onClick?: (node: TwinNode) => void
}

const TYPE_ICONS: Record<TwinNode["type"], string> = {
  warehouse: "🏭",
  port: "⚓",
  carrier: "🚢",
  supplier: "🏗️",
  customer: "🏢",
  hub: "🔄",
}

const STATUS_RING: Record<TwinNode["status"], string> = {
  healthy: "ring-green-400",
  warning: "ring-yellow-400",
  critical: "ring-red-400 animate-pulse",
  offline: "ring-gray-400",
}

export function SupplyChainNode({ node, selected, onClick }: SupplyChainNodeProps) {
  return (
    <button
      onClick={() => onClick?.(node)}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 transition-all",
        selected && "ring-2 ring-offset-1 ring-offset-slate-900",
        selected && STATUS_RING[node.status]
      )}
    >
      <span className="text-2xl">{TYPE_ICONS[node.type]}</span>
      <span className="text-xs font-medium text-slate-200">{node.label}</span>
      <span
        className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          node.status === "healthy" && "bg-green-900 text-green-300",
          node.status === "warning" && "bg-yellow-900 text-yellow-300",
          node.status === "critical" && "bg-red-900 text-red-300",
          node.status === "offline" && "bg-gray-800 text-gray-400"
        )}
      >
        {node.status}
      </span>
      {node.metrics && (
        <div className="text-xs text-slate-400 space-y-0.5">
          {Object.entries(node.metrics).map(([k, v]) => (
            <div key={k}>{k}: <span className="text-slate-200">{v}</span></div>
          ))}
        </div>
      )}
    </button>
  )
}
