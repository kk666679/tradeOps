'use client';

/**
 * AgentAuditTrail
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';

export interface AgentAuditTrailEntry { id: string; at: string; title: string; detail?: string; }
export interface AgentAuditTrailProps { entries?: AgentAuditTrailEntry[]; }

export function AgentAuditTrail({ entries = [] }: AgentAuditTrailProps) {
  return (
    <ol className="relative ml-3 border-l">
      {entries.map((e) => (
        <li key={e.id} className="mb-4 ml-4">
          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
          <time className="text-xs text-muted-foreground">{e.at}</time>
          <div className="font-medium">{e.title}</div>
          {e.detail ? <div className="text-sm text-muted-foreground">{e.detail}</div> : null}
        </li>
      ))}
      {entries.length === 0 ? <li className="ml-4 text-sm text-muted-foreground">No events</li> : null}
    </ol>
  );
}

export default AgentAuditTrail;
