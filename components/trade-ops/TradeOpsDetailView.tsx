'use client'

import * as React from 'react'
import { trpc } from '@/lib/trpc/react'
import { TradeOpsDetailPage, type TradeOpsDetailConfig } from './TradeOpsDetailPage'

export type TradeOpsDetailProcedure =
  | 'declarations'
  | 'clearance'
  | 'permits'
  | 'documents'
  | 'tradeFinance'

function DeclarationDetail({ id, config }: { id: string; config: TradeOpsDetailConfig }) {
  const query = trpc.tradeOps.declarations.byId.useQuery({ id })
  return <TradeOpsDetailPage query={query} config={config} />
}
function ClearanceDetail({ id, config }: { id: string; config: TradeOpsDetailConfig }) {
  const query = trpc.tradeOps.clearance.byId.useQuery({ id })
  return <TradeOpsDetailPage query={query} config={config} />
}
function PermitDetail({ id, config }: { id: string; config: TradeOpsDetailConfig }) {
  const query = trpc.tradeOps.permits.byId.useQuery({ id })
  return <TradeOpsDetailPage query={query} config={config} />
}
function DocumentDetail({ id, config }: { id: string; config: TradeOpsDetailConfig }) {
  const query = trpc.tradeOps.documents.byId.useQuery({ id })
  return <TradeOpsDetailPage query={query} config={config} />
}
function TradeFinanceDetail({ id, config }: { id: string; config: TradeOpsDetailConfig }) {
  const query = trpc.tradeOps.tradeFinance.byId.useQuery({ id })
  return <TradeOpsDetailPage query={query} config={config} />
}

export function TradeOpsDetailView({
  procedure,
  id,
  config,
}: {
  procedure: TradeOpsDetailProcedure
  id: string
  config: TradeOpsDetailConfig
}) {
  switch (procedure) {
    case 'declarations': return <DeclarationDetail id={id} config={config} />
    case 'clearance':    return <ClearanceDetail id={id} config={config} />
    case 'permits':      return <PermitDetail id={id} config={config} />
    case 'documents':    return <DocumentDetail id={id} config={config} />
    case 'tradeFinance': return <TradeFinanceDetail id={id} config={config} />
  }
}
