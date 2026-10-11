'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AILoadingState } from '@/components/common/ailoading-state'
import { AIErrorState } from '@/components/common/aierror-state'

export interface TradeOpsDetailQuery {
  data?: Record<string, unknown> | null
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => void
}

export interface TradeOpsDetailConfig {
  title: string
  description: string
  backHref: string
  fields: { key: string; label: string; render?: (value: unknown) => string }[]
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  if (value instanceof Date) return value.toLocaleString()
  return String(value)
}

export function TradeOpsDetailPage({ query, config }: { query: TradeOpsDetailQuery; config: TradeOpsDetailConfig }) {
  const { isLoading, isError, data, refetch } = query

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={config.backHref}>
            <ArrowLeft data-icon="inline-start" />Back
          </Link>
        </Button>
        <PageHeader title={config.title} description={config.description} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Record detail</span>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw data-icon="inline-start" />Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AILoadingState message="Loading record…" />
          ) : isError ? (
            <AIErrorState title="Could not load record" message="We could not load this record." onRetry={() => refetch()} />
          ) : !data ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">Record not found.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href={config.backHref}>Back to list</Link>
              </Button>
            </div>
          ) : (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {config.fields.map((field) => (
                <div className="rounded-lg border p-4" key={field.key}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{field.label}</dt>
                  <dd className="mt-1 text-sm">{field.render ? field.render(data[field.key]) : formatValue(data[field.key])}</dd>
                </div>
              ))}
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  )
}