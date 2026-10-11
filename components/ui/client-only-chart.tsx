"use client"
import * as React from "react"
export function ClientOnlyChart({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted ? <>{children}</> : <>{fallback ?? null}</>
}
export default ClientOnlyChart
