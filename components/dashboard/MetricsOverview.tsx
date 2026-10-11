'use client'

import { Package, Container, Truck, AlertCircle } from 'lucide-react'
import { StatCard } from './StatCard'
import { DashboardGrid } from './DashboardGrid'
import { trpc } from '@/lib/trpc'
import { Button } from '@/components/ui/button'

export function MetricsOverview() {
  const { data, error, isLoading, refetch } = trpc.dashboard.getMetrics.useQuery(undefined, {
    refetchInterval: 30_000,
    retry: false,
  })

  if (error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/40 p-4 text-sm">
        <span>Unable to load dashboard metrics. Check your connection and access, then retry.</span>
        <Button type="button" variant="outline" onClick={() => void refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <DashboardGrid columns={4} gap="md">
      <StatCard
        title="Inventory Items"
        value={data?.inventoryCount ?? 0}
        subtitle="Recorded in warehouse"
        icon={<Package className="h-4 w-4" />}
        loading={isLoading}
      />
      <StatCard
        title="Cargo Records"
        value={data?.cargoCount ?? 0}
        subtitle="Across all cargo types"
        icon={<Container className="h-4 w-4" />}
        loading={isLoading}
      />
      <StatCard
        title="Active Outbound Orders"
        value={data?.activeOutboundCount ?? 0}
        subtitle="Allocated, picking, or packed"
        icon={<Truck className="h-4 w-4" />}
        loading={isLoading}
      />
      <StatCard
        title="Open Compliance Findings"
        value={data?.warningCount ?? 0}
        subtitle="Awaiting resolution"
        icon={<AlertCircle className="h-4 w-4" />}
        loading={isLoading}
      />
    </DashboardGrid>
  )
}
