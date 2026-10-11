'use client';

/**
 * TradeOpsDashboard
 *
 * Live KPI strip for the TradeOps landing page. Drives its numbers from the
 * typed `tradeOps.analytics.getMetrics` query so the dashboard reflects real
 * aggregates over declarations, clearance, compliance, permits, and duty.
 */

import * as React from 'react';
import { AlertTriangle, FileText, Gauge, ShieldCheck, Wallet } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { AILiveBadge } from '@/components/common/ailive-badge';
import { AIMetricCard } from '@/components/common/aimetric-card';
import { AIErrorState } from '@/components/common/aierror-state';
import { AILoadingState } from '@/components/common/ailoading-state';

export interface TradeOpsDashboardProps { className?: string; }

export function TradeOpsDashboard({ className }: TradeOpsDashboardProps) {
  const { data, isLoading, isError, error, refetch } = trpc.tradeOps.analytics.getMetrics.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  if (isLoading) {
    return (
      <section className={className}>
        <AILoadingState message="Loading TradeOps dashboard…" />
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className={className}>
        <AIErrorState
          title="Could not load TradeOps dashboard"
          message={error instanceof Error ? error.message : 'We could not load TradeOps analytics.'}
          onRetry={() => refetch()}
        />
      </section>
    );
  }

  const cards = [
    { title: 'Declarations', value: data.declarations, icon: FileText, trend: { value: 0, label: 'total' } },
    { title: 'Clearance records', value: data.clearance, icon: Gauge, trend: { value: 0, label: 'total' } },
    { title: 'Open findings', value: data.openFindings, icon: AlertTriangle, trend: { value: 0, label: 'unresolved' } },
    { title: 'Permits', value: data.permits, icon: ShieldCheck, trend: { value: 0, label: 'total' } },
    { title: 'Documents', value: data.documents, icon: FileText, trend: { value: 0, label: 'total' } },
    { title: 'Duty calculations', value: data.dutyCalculations, icon: Wallet, trend: { value: 0, label: 'total' } },
  ];

  return (
    <section className={className}>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Trade Ops Dashboard</h1>
          <p className="text-sm text-muted-foreground">Live aggregates across declarations, clearance, and compliance.</p>
        </div>
        <AILiveBadge status="live" pulse />
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <AIMetricCard
            key={card.title}
            title={card.title}
            value={card.value}
            trend={card.trend}
            icon={card.icon}
            description="Updated 30s ago"
          />
        ))}
      </div>
    </section>
  );
}

export default TradeOpsDashboard;