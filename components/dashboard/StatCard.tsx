'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  loading?: boolean
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="border border-slate-200/70">
        <CardHeader className="rounded-t-xl bg-slate-50 px-6 py-4">
          <div className="h-5 w-24 animate-pulse rounded bg-slate-300" />
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-300" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200/70 transition hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 rounded-t-xl bg-slate-50 px-6 py-4">
        <CardTitle className="text-sm font-medium text-slate-700">
          {title}
        </CardTitle>
        {icon && <div className="text-slate-400">{icon}</div>}
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="text-2xl font-bold text-slate-950">{value}</div>
        {subtitle && (
          <p className="text-xs text-slate-600 mt-1">{subtitle}</p>
        )}
        {trend && (
          <div
            className={`mt-2 text-xs font-semibold ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}
