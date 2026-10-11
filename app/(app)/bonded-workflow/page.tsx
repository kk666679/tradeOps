import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedWorkflowExplorer } from '@/components/fiz-fcz/workflow/BondedWorkflowExplorer';
import { BondedLedgerEventInspector } from '@/components/fiz-fcz/workflow/BondedLedgerEventInspector';
import { ExceptionPathSummary } from '@/components/fiz-fcz/workflow/ExceptionPathSummary';
import { AgentOrchestrationMatrix } from '@/components/fiz-fcz/workflow/AgentOrchestrationMatrix';
import { DigitalTwinOverlay } from '@/components/fiz-fcz/workflow/DigitalTwinOverlay';

export const metadata: Metadata = {
  title: 'Bonded Workflow',
  description:
    'End-to-end FIZ → FCZ bonded trade workflow: physical flow, document flow, bonded-ledger event flow, and agent control flow across six modules.',
};

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bonded Workflow"
        description="End-to-end FIZ → FCZ bonded trade flow with immutable ledger events, agent orchestration, and exception paths"
        action={
          <a
            href="/bonded"
            className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent"
          >
            Zone overview →
          </a>
        }
      />

      <BondedWorkflowExplorer className="w-full" />

      <div className="grid gap-6 lg:grid-cols-2">
        <BondedLedgerEventInspector />
        <ExceptionPathSummary />
      </div>

      <AgentOrchestrationMatrix />

      <DigitalTwinOverlay />
    </div>
  );
}