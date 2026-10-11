'use client'

import * as React from 'react'
import { trpc } from '@/lib/trpc/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AILoadingState } from '@/components/common/ailoading-state'
import { AIErrorState } from '@/components/common/aierror-state'

export function TradeOpsAnalyticsView() {
  const { data, isLoading, isError, error, refetch } = trpc.tradeOps.analytics.getMetrics.useQuery(undefined)

  if (isLoading) return <AILoadingState message="Loading analytics…" />

  if (isError || !data)
    return (
      <AIErrorState
        title="Could not load analytics"
        message={error instanceof Error ? error.message : 'We could not load analytics.'}
        onRetry={() => refetch()}
      />
    )

  const cards = [
    { label: 'Declarations', value: data.declarations },
    { label: 'Clearance records', value: data.clearance },
    { label: 'Open findings', value: data.openFindings },
    { label: 'Permits', value: data.permits },
    { label: 'Documents', value: data.documents },
    { label: 'Duty calculations', value: data.dutyCalculations },
  ]

  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold">{card.value}</CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Declarations by status</CardTitle></CardHeader>
        <CardContent>
          {Object.keys(data.byStatus).length === 0 ? (
            <p className="text-sm text-muted-foreground">No declarations yet.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(data.byStatus).map(([status, count]) => (
                <li className="flex items-center justify-between rounded-md border p-3" key={status}>
                  <span className="text-sm text-muted-foreground">{status}</span>
                  <span className="font-mono text-sm font-semibold">{count as number}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  )
}
