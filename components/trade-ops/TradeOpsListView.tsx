'use client'

import * as React from 'react'
import { trpc } from '@/lib/trpc/react'
import { TradeOpsListPage, type TradeOpsListConfig } from './TradeOpsListPage'

export type TradeOpsListProcedure =
  | 'declarations'
  | 'clearance'
  | 'compliance'
  | 'documents'
  | 'permits'
  | 'duty'
  | 'hsClassification'
  | 'hsCodeRulings'
  | 'tradeFinance'

// Each inner component calls exactly one hook at the top level.
function DeclarationsView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.declarations.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}
function ClearanceView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.clearance.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}
function ComplianceView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.compliance.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}
function DocumentsView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.documents.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}
function PermitsView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.permits.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}
function DutyView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.duty.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}
function HsClassificationView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.hsClassification.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}
function HsCodeRulingsView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.hsCodeRulings.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}
function TradeFinanceView({ config }: { config: TradeOpsListConfig }) {
  const query = trpc.tradeOps.tradeFinance.list.useQuery({ take: 100 })
  return <TradeOpsListPage query={query} config={config} />
}

export function TradeOpsListView({
  procedure,
  config,
}: {
  procedure: TradeOpsListProcedure
  config: TradeOpsListConfig
}) {
  switch (procedure) {
    case 'declarations':    return <DeclarationsView config={config} />
    case 'clearance':       return <ClearanceView config={config} />
    case 'compliance':      return <ComplianceView config={config} />
    case 'documents':       return <DocumentsView config={config} />
    case 'permits':         return <PermitsView config={config} />
    case 'duty':            return <DutyView config={config} />
    case 'hsClassification':return <HsClassificationView config={config} />
    case 'hsCodeRulings':   return <HsCodeRulingsView config={config} />
    case 'tradeFinance':    return <TradeFinanceView config={config} />
  }
}
