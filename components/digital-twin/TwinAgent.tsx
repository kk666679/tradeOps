"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Bot, Play, Square, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TwinAgentAction {
  id: string
  label: string
  description: string
  onExecute: () => Promise<string>
}

interface TwinAgentProps {
  name: string
  description?: string
  actions: TwinAgentAction[]
  className?: string
}

export function TwinAgent({ name, description, actions, className }: TwinAgentProps) {
  const [running, setRunning] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})

  const execute = async (action: TwinAgentAction) => {
    setRunning(action.id)
    try {
      const result = await action.onExecute()
      setResults((r) => ({ ...r, [action.id]: result }))
    } finally {
      setRunning(null)
    }
  }

  return (
    <div className={cn("rounded-xl border border-slate-700 bg-slate-800/60 p-4 space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-indigo-400" />
        <div>
          <p className="text-sm font-semibold text-slate-100">{name}</p>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="space-y-2">
        {actions.map((action) => (
          <div key={action.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-200">{action.label}</p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={running !== null}
                onClick={() => execute(action)}
              >
                {running === action.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </Button>
            </div>
            {results[action.id] && (
              <p className="text-xs text-green-400 bg-green-950/40 rounded px-2 py-1">
                {results[action.id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
