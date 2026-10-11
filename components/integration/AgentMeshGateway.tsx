'use client';

/**
 * AgentMeshGateway
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';

export interface AgentMeshGatewayProps { endpoint?: string; onResult?: (payload: unknown) => void; }

export function AgentMeshGateway({ endpoint = '/api', onResult }: AgentMeshGatewayProps) {
  const [busy, setBusy] = React.useState(false);
  const send = async (body: unknown) => {
    setBusy(true);
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      onResult?.(await res.json());
    } finally { setBusy(false); }
  };
  return (
    <button className="rounded border px-3 py-1 text-sm" disabled={busy} onClick={() => send({})}>
      {busy ? 'Sending…' : 'Send'}
    </button>
  );
}

export default AgentMeshGateway;
