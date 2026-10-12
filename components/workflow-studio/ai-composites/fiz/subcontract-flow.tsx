'use client';

/**
 * SubcontractFlow
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface SubcontractFlowProps { className?: string; zone?: 'FIZ' | 'FCZ' | 'BONDED'; tenantId?: string; }

/** Composite surface for fiz. Composes AiElements primitives. */
export function SubcontractFlow({ className, zone = 'FIZ', tenantId }: SubcontractFlowProps) {
  return (
    <div className={className ?? 'SpaceY4'} data-zone={zone} data-tenant={tenantId}>
      <header className="flex ItemsCenter JustifyBetween">
        <h2 className="text-base FontSemibold">SubcontractFlow</h2>
        <span className="text-xs text-muted-foreground">zone {zone}</span>
      </header>
      <div className="rounded border bg-muted/20 p-4 text-sm text-muted-foreground">
        Compose from <code>AiElements</code>: agent, plan, task, tool, checkpoint, StreamingText, ApprovalGate, AuditTrace.
      </div>
    </div>
  );
}

export default SubcontractFlow;
