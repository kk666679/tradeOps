'use client';

import { useEffect, useState } from 'react';
import { AuditTrace } from '@/components/ai/audit/audit-trace';
import { ChainOfCustody } from '@/components/ai/audit/chain-of-custody';
import { EvidencePack } from '@/components/ai/audit/evidence-pack';

export default function AuditPage() {
  const [events, setEvents] = useState<Array<{ id: string; at: string; actor: string; action: string; target?: string }>>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/audit')
      .then((r) => r.json())
      .then((d: { events?: typeof events }) => setEvents(d.events ?? []));
  }, []);

  return (
    <div className="grid h-full grid-cols-1 gap-3 p-4 lg:grid-cols-[1fr_360px]">
      <div className="ai-panel overflow-auto p-3">
        <div className="ai-panel-title mb-3">Audit trail ({events.length})</div>
          <AuditTrace
            entries={events.map((event) => ({
              ...event,
              actor: event.actor === 'human' || event.actor === 'system' ? event.actor : 'agent',
            }))}
            onSelect={(event) => setSelected(event.id)}
          />
      </div>
      <aside className="flex flex-col gap-3">
        <div className="ai-panel p-3">
          <div className="ai-panel-title mb-3">Chain of custody</div>
          <ChainOfCustody links={[]} />
        </div>
        <div className="ai-panel p-3">
          <div className="ai-panel-title mb-3">Evidence pack</div>
          <EvidencePack runId="audit" artifacts={events.map((event) => ({ id: event.id, label: `${event.action} · ${event.at}` }))} />
        </div>
      </aside>
    </div>
  );
}
