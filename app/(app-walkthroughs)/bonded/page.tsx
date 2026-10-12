import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedWorkflowExplorer } from '@/components/fiz-fcz/workflow/BondedWorkflowExplorer';
import { BondedLedgerEventInspector } from '@/components/fiz-fcz/workflow/BondedLedgerEventInspector';
import { ExceptionPathSummary } from '@/components/fiz-fcz/workflow/ExceptionPathSummary';
import { AgentOrchestrationMatrix } from '@/components/fiz-fcz/workflow/AgentOrchestrationMatrix';
import { DigitalTwinOverlay } from '@/components/fiz-fcz/workflow/DigitalTwinOverlay';

export const metadata: Metadata = {
  title: 'Bonded Zone',
  description:
    'Bonded trade overview: FIZ → FCZ workflow, ledger events, agent orchestration, and exception paths across six modules.',
};

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bonded Zone"
        description="End-to-end bonded trade flow with immutable ledger events, agent orchestration, and exception paths"
        action={
          <a
            href="/bonded-workflow"
            className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent"
          >
            Full workflow →
          </a>
        }
      />

      <BondedWorkflowExplorer variant="preview" className="w-full" />

      <div className="grid gap-6 lg:grid-cols-2">
        <BondedLedgerEventInspector />
        <ExceptionPathSummary />
      </div>

      <AgentOrchestrationMatrix />

      <DigitalTwinOverlay />
    </div>
  );
}