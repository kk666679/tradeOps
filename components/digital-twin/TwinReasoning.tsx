import { cn } from "@/lib/utils"
import { Brain } from "lucide-react"

interface ReasoningStep {
  step: number
  thought: string
  confidence?: number
  outcome?: string
}

interface TwinReasoningProps {
  steps: ReasoningStep[]
  conclusion?: string
  className?: string
}

export function TwinReasoning({ steps, conclusion, className }: TwinReasoningProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-indigo-400">
        <Brain className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Twin Reasoning</span>
      </div>
      <div className="space-y-2">
        {steps.map((s) => (
          <div key={s.step} className="flex gap-3 text-xs">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold">
              {s.step}
            </span>
            <div className="space-y-0.5">
              <p className="text-slate-300">{s.thought}</p>
              {s.outcome && <p className="text-green-400">→ {s.outcome}</p>}
              {s.confidence !== undefined && (
                <p className="text-slate-500">Confidence: {s.confidence}%</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {conclusion && (
        <div className="border-t border-slate-700 pt-2 text-xs text-indigo-300 font-medium">
          Conclusion: {conclusion}
        </div>
      )}
    </div>
  )
}
