"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Radio } from "lucide-react"
import { useSocket } from "@/providers/SocketProvider"

interface StreamEvent {
  id: string
  timestamp: Date
  type: "info" | "warning" | "critical" | "update"
  message: string
  source?: string
}

interface TwinLiveStreamProps {
  events?: StreamEvent[]
  maxEvents?: number
  className?: string
  subscribeEvent?: string
}

const TYPE_STYLES: Record<StreamEvent["type"], string> = {
  info: "text-slate-300",
  warning: "text-yellow-400",
  critical: "text-red-400",
  update: "text-green-400",
}

function makeEventId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function TwinLiveStream({ events = [], maxEvents = 20, className, subscribeEvent = 'twin:update' }: TwinLiveStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { subscribe } = useSocket()
  const [liveEvents, setLiveEvents] = useState<StreamEvent[]>([])

  useEffect(() => {
    const unsubscribe = subscribeEvent
      ? subscribe(subscribeEvent, (payload: any) => {
          const message = payload?.state
            ? `Twin ${payload.channel} state updated — status: ${payload.state.status ?? 'unknown'}`
            : JSON.stringify(payload)

          setLiveEvents((current) => [
            ...current,
            {
              id: makeEventId('twin'),
              timestamp: new Date(),
              type: payload?.state?.status === 'CRITICAL' ? 'critical' : 'update',
              message,
              source: 'DigitalTwin',
            } as StreamEvent,
          ].slice(-maxEvents))
        })
      : () => {}

    return unsubscribe
  }, [subscribe, subscribeEvent, maxEvents])

  const visible = useMemo(() => {
    const combined = [...events, ...liveEvents]
    return combined.slice(-maxEvents)
  }, [events, liveEvents, maxEvents])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [visible.length])

  return (
    <div className={cn("rounded-xl border border-slate-700 bg-slate-950 overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900">
        <Radio className="h-3 w-3 text-green-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Live Stream</span>
        <span className="ml-auto text-xs text-slate-500">{visible.length} events</span>
      </div>
      <div className="h-48 overflow-y-auto p-3 space-y-1 font-mono">
        {visible.map((e) => (
          <div key={e.id} className="flex gap-2 text-xs">
            <span className="text-slate-600 flex-shrink-0">
              {e.timestamp.toLocaleTimeString()}
            </span>
            {e.source && <span className="text-indigo-400 flex-shrink-0">[{e.source}]</span>}
            <span className={TYPE_STYLES[e.type]}>{e.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
