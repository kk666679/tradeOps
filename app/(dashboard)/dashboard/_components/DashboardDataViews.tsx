'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomsStatusCard } from '@/components/dashboard/cards/CustomsStatusCard';
import { StatCard } from '@/components/dashboard/cards/StatCard';
import { TasksWidget } from '@/components/dashboard/widgets/TasksWidget';
import { AlertsFeed } from '@/components/dashboard/widgets/AlertsFeed';
import { DutySuspensionWidget } from '@/components/dashboard/widgets/DutySuspensionWidget';
import { trpc } from '@/lib/trpc';

function QueryState({
  loading,
  error,
  empty,
  emptyMessage = 'No records are available for this view yet.',
  retry,
  children,
}: {
  loading: boolean;
  error?: unknown;
  empty: boolean;
  emptyMessage?: string;
  retry: () => void;
  children: React.ReactNode;
}) {
  if (loading) {
    return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading live dashboard data…</p>;
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/40 p-4 text-sm">
        <span>{error instanceof Error ? error.message : 'Unable to load dashboard data.'}</span>
        <Button type="button" variant="outline" onClick={retry}>Retry</Button>
      </div>
    );
  }

  if (empty) {
    return (
      <Card><CardContent className="py-6 text-sm text-muted-foreground">{emptyMessage}</CardContent></Card>
    );
  }

  return <>{children}</>;
}

export function AgentsDataView() {
  const agents = trpc.customAgents.registry.list.useQuery({ take: 100 }, { retry: false });
  const tasks = trpc.task.list.useQuery({ take: 100 }, { retry: false });
  const loading = agents.isLoading || tasks.isLoading;
  const error = agents.error ?? tasks.error;
  const empty = agents.data?.length === 0 && tasks.data?.length === 0;

  return (
    <QueryState
      loading={loading}
      error={error}
      empty={empty}
      retry={() => { void agents.refetch(); void tasks.refetch(); }}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Registered agents" value={agents.data?.length ?? '—'} hint="Registry records returned" />
        <TasksWidget title="Task records" value={tasks.data?.length ?? '—'} hint="Task records returned" />
      </div>
    </QueryState>
  );
}

export function AlertsDataView() {
  const query = trpc.tradeOps.analytics.getMetrics.useQuery(undefined, { retry: false });
  const empty = query.data !== undefined && query.data.openFindings === 0;

  return (
    <QueryState
      loading={query.isLoading}
      error={query.error}
      empty={empty}
      emptyMessage="No open compliance findings were reported by TradeOps analytics."
      retry={() => { void query.refetch(); }}
    >
      {query.data && (
        <AlertsFeed
          title="Open compliance findings"
          value={query.data.openFindings}
          hint="Live aggregate from TradeOps analytics"
        />
      )}
    </QueryState>
  );
}

export function CustomsDataView() {
  const query = trpc.tradeOps.analytics.getMetrics.useQuery(undefined, { retry: false });
  const data = query.data;
  const empty = data !== undefined
    && data.declarations + data.clearance + data.openFindings + data.permits + data.documents + data.dutyCalculations === 0;

  return (
    <QueryState loading={query.isLoading} error={query.error} empty={empty} retry={() => { void query.refetch(); }}>
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CustomsStatusCard title="Declarations" value={data.declarations} hint="TradeOps declarations" />
          <CustomsStatusCard title="Clearance records" value={data.clearance} hint="TradeOps clearance records" />
          <DutySuspensionWidget title="Duty calculations" value={data.dutyCalculations} hint="TradeOps duty calculations" />
          <CustomsStatusCard title="Open findings" value={data.openFindings} hint="Awaiting resolution" />
          <CustomsStatusCard title="Permits" value={data.permits} hint="TradeOps permits" />
          <CustomsStatusCard title="Documents" value={data.documents} hint="TradeOps documents" />
        </div>
      )}
    </QueryState>
  );
}

export function OperationsDataView() {
  const query = trpc.dashboard.getMetrics.useQuery(undefined, { retry: false });
  const data = query.data;
  const empty = data !== undefined && data.inventoryCount + data.cargoCount + data.activeOutboundCount === 0;

  return (
    <QueryState loading={query.isLoading} error={query.error} empty={empty} retry={() => { void query.refetch(); }}>
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Inventory items" value={data.inventoryCount} hint="Recorded in warehouse" />
          <StatCard title="Cargo records" value={data.cargoCount} hint="Across all cargo types" />
          <StatCard title="Active outbound orders" value={data.activeOutboundCount} hint="Allocated, picking, or packed" />
        </div>
      )}
    </QueryState>
  );
}

export function SlaDataView() {
  const query = trpc.dashboard.getMetrics.useQuery(undefined, { retry: false });
  const data = query.data;
  const empty = data !== undefined
    && data.inventoryCount + data.cargoCount + data.activeOutboundCount + data.warningCount === 0;

  return (
    <QueryState loading={query.isLoading} error={query.error} empty={empty} retry={() => { void query.refetch(); }}>
      {data && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Current API metrics provide workload indicators, not SLA targets or attainment.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <TasksWidget title="Active outbound orders" value={data.activeOutboundCount} hint="Allocated, picking, or packed" />
            <TasksWidget title="Open compliance findings" value={data.warningCount} hint="Awaiting resolution" />
          </div>
        </>
      )}
    </QueryState>
  );
}
