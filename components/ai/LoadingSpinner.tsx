"use client"
import * as React from "react"
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={className ?? "animate-spin h-4 w-4"} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}
export default LoadingSpinner
