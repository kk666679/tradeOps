'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TmsGatewayProps { endpoint?: string; zone?: 'FIZ' | 'FCZ' | 'ALL'; onResult?: (payload: unknown) => void; }
export function TmsGateway({ endpoint = '/api/integration', zone = 'ALL', onResult }: TmsGatewayProps) {
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<boolean | null>(null);
  const send = async (body: unknown) => {
    setBusy(true); setErr(null); setOk(null);
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...((body as any) ?? {}), zone }) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      setOk(true); onResult?.(await res.json());
    } catch (e) { setErr((e as Error).message); setOk(false); }
    finally { setBusy(false); }
  };
  return (
    <div className="flex items-center gap-2">
      <Badge variant={zone === 'FIZ' ? 'default' : zone === 'FCZ' ? 'secondary' : 'outline'}>{zone}</Badge>
      <Button size="sm" disabled={busy} onClick={() => send({})}>{busy ? 'Sending…' : 'Send'}</Button>
      {ok === true ? <Badge variant="default">ok</Badge> : null}
      {err ? <span className="text-xs text-red-600">{err}</span> : null}
    </div>
  );
}
export default TmsGateway;
