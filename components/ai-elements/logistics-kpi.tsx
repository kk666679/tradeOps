"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AIBadge } from '@common/aibadge'
import { Truck, Clock3, CheckCircle2 } from 'lucide-react'

export function LogisticsKPI() {
  return (
    <Card className="border border-slate-200/70 shadow-sm">
      <CardHeader className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Logistics KPI</CardTitle>
            <p className="text-sm text-slate-600">Operational performance across transport and warehouse execution.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 px-6 pb-6 text-slate-700 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Delivery Accuracy</p>
          <p className="mt-3 text-3xl font-bold">98.6%</p>
          <AIBadge variant="success">Stable</AIBadge>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Avg Transit Time</p>
          <p className="mt-3 text-3xl font-bold">11.4d</p>
          <AIBadge variant="info">Optimized</AIBadge>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Throughput</p>
          <p className="mt-3 text-3xl font-bold">12.4K</p>
          <AIBadge variant="secondary">On target</AIBadge>
        </div>
      </CardContent>
    </Card>
  )
}
