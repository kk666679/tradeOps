'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, RefreshCw, Search } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AILoadingState } from '@/components/common/ailoading-state'
import { AIErrorState } from '@/components/common/aierror-state'

export interface TradeOpsListQuery {
  data?: Array<Record<string, unknown>>
  isLoading: boolean
  isError: boolean
  error: unknown
  isFetching: boolean
  refetch: () => void
}

export interface TradeOpsListConfig {
  title: string
  description: string
  createHref?: string
  empty: string
  /** Route prefix used to build per-record "View" links. */
  detailHref?: string
  /** Columns to render. If omitted, derived from the first record. */
  columns?: string[]
  /** Optional client-side exact-match filter applied after search. */
  filter?: { field: string; value: string }
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return 'Details available'
  return String(value)
}

export function TradeOpsListPage({ query, config }: { query: TradeOpsListQuery; config: TradeOpsListConfig }) {
  const [search, setSearch] = React.useState('')
  const rows = query.data ?? []
  const filtered = React.useMemo(() => {
    const filter = config.filter
    const scoped = filter ? rows.filter((row) => row[filter.field] === filter.value) : rows
    return scoped.filter((row) => {
      const serialized = JSON.stringify(row ?? {});
      return serialized.toLowerCase().includes(search.toLowerCase());
    })
  }, [rows, search, config.filter])
  const columns = config.columns ?? (filtered.length && filtered[0] ? Object.keys(filtered[0] as Record<string, unknown>).filter((key) => !['id', 'tenantId', 'metadata', 'updatedAt'].includes(key)).slice(0, 5) : [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={config.title} description={config.description} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            className="pl-9"
            placeholder={`Search ${config.title.toLowerCase()}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={`Search ${config.title}`}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching}><RefreshCw data-icon="inline-start" />Refresh</Button>
          {config.createHref && (
            <Button asChild>
              <Link href={config.createHref}>
                <Plus data-icon="inline-start" />New record
              </Link>
            </Button>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Records</span>
            <Badge variant="secondary">{query.isLoading ? 'Loading' : filtered.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <AILoadingState message={`Loading ${config.title.toLowerCase()}…`} />
          ) : query.isError ? (
            <AIErrorState title="Could not load records" message="We could not load these records." onRetry={() => query.refetch()} />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">{search ? 'No records match your search.' : config.empty}</p>
              {config.createHref && (
                <Button asChild>
                  <Link href={config.createHref}>
                    <Plus data-icon="inline-start" />Create first record
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    {columns.map((column) => (
                      <th className="px-3 py-3 font-medium" key={column}>
                        {column.replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                    <th className="px-3 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr className="border-b last:border-0" key={String(row.id)}>
                      {columns.map((column) => (
                        <td className="px-3 py-3" key={column}>
                          {displayValue(row[column])}
                        </td>
                      ))}
                      <td className="px-3 py-3">
                        {config.detailHref ? (
                          <Button variant="link" size="sm" asChild>
                            <Link href={`${config.detailHref}/${encodeURIComponent(String(row.id))}`}>View</Link>
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}