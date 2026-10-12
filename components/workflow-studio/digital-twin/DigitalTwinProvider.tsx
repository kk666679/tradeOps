"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TwinState {
  mode: "live" | "simulation" | "replay"
  connected: boolean
  lastSync: Date | null
  activeTwinId: string | null
}

interface DigitalTwinContextValue extends TwinState {
  setMode: (mode: TwinState["mode"]) => void
  setActiveTwin: (id: string | null) => void
  connect: () => void
  disconnect: () => void
}

const DigitalTwinContext = createContext<DigitalTwinContextValue | null>(null)

export function useDigitalTwin() {
  const ctx = useContext(DigitalTwinContext)
  if (!ctx) throw new Error("useDigitalTwin must be used within DigitalTwinProvider")
  return ctx
}

export function DigitalTwinProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TwinState>({
    mode: "live",
    connected: false,
    lastSync: null,
    activeTwinId: null,
  })

  const value: DigitalTwinContextValue = {
    ...state,
    setMode: (mode) => setState((s) => ({ ...s, mode })),
    setActiveTwin: (id) => setState((s) => ({ ...s, activeTwinId: id })),
    connect: () => setState((s) => ({ ...s, connected: true, lastSync: new Date() })),
    disconnect: () => setState((s) => ({ ...s, connected: false })),
  }

  return <DigitalTwinContext.Provider value={value}>{children}</DigitalTwinContext.Provider>
}
