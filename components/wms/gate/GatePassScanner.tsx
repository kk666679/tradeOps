'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface GatePassScannerScanResult { ref: string; direction: 'IN' | 'OUT'; ok: boolean; detail?: string; }
export interface GatePassScannerProps { onScan?: (r: GatePassScannerScanResult) => void; }
export function GatePassScanner({ onScan }: GatePassScannerProps) {
  const [ref, setRef] = React.useState('');
  const [last, setLast] = React.useState<GatePassScannerScanResult | null>(null);
  const scan = () => {
    const r: GatePassScannerScanResult = { ref, direction: 'IN', ok: ref.length >= 4, detail: ref.length < 4 ? 'Invalid ref' : 'Accepted' };
    setLast(r); onScan?.(r);
  };
  return (
    <div className="space-y-2 rounded border p-3">
      <Input placeholder="Scan / enter gate pass ref" value={ref} onChange={(e) => setRef(e.target.value)} />
      <Button size="sm" onClick={scan}>Scan</Button>
      {last ? <Badge variant={last.ok ? 'default' : 'destructive'}>{last.ref || '—'} · {last.detail}</Badge> : null}
    </div>
  );
}
export default GatePassScanner;
