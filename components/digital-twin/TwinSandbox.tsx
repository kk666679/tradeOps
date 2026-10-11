"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { FlaskConical, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TwinSandboxProps {
  title?: string
  description?: string
  onRun?: (params: Record<string, string>) => Promise<string>
  params?: Array<{ key: string; label: string; defaultValue: string }>
  children?: ReactNode
  className?: string
}

export function TwinSandbox({
  title = "Simulation Sandbox",
  description,
  onRun,
  params = [],
  children,
  className,
}: TwinSandboxProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(params.map((p) => [p.key, p.defaultValue]))
  )
  const [result, setResult] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const run = async () => {
    if (!onRun) return
    setRunning(true)
    try {
      const r = await onRun(values)
      setResult(r)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className={cn("rounded-xl border border-slate-700 bg-slate-800/60 p-4 space-y-4", className)}>
      <div className="flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-purple-400" />
        <div>
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
      </div>

      {params.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {params.map((p) => (
            <div key={p.key}>
              <label className="text-xs text-slate-400 mb-1 block">{p.label}</label>
              <input
                className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
                value={values[p.key]}
                onChange={(e) => setValues((v) => ({ ...v, [p.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      )}

      {children}

      {onRun && (
        <div className="flex gap-2">
          <Button size="sm" onClick={run} disabled={running} className="bg-purple-700 hover:bg-purple-600 text-white">
            <Play className="h-3 w-3 mr-1" />
            {running ? "Running…" : "Run Simulation"}
          </Button>
          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300" onClick={() => setResult(null)}>
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      )}

      {result && (
        <div className="text-xs bg-slate-900 rounded p-3 text-green-300 border border-slate-700">
          {result}
        </div>
      )}
    </div>
  )
}
