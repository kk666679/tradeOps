"use client"
import * as React from "react"
export interface ProgressBarProps {
  value?: number
  progress?: number
  color?: string
  className?: string
}
export function ProgressBar({ value, progress, color, className }: ProgressBarProps) {
  const v = value ?? progress ?? 0
  return (
    <div className={className} role="progressbar" aria-valuenow={v}>
      <div style={{ width: `${Math.min(100, Math.max(0, v))}%` }} className={`h-full ${color ?? 'bg-primary'}`} />
    </div>
  )
}
export default ProgressBar
