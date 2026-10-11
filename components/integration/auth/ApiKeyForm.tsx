'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ApiKeyFormValues = Record<string, unknown>;
export interface ApiKeyFormProps { initial?: ApiKeyFormValues; submitting?: boolean; zone?: 'FIZ' | 'FCZ'; onSubmit: (v: ApiKeyFormValues) => void | Promise<void>; onCancel?: () => void; }
export function ApiKeyForm({ initial = {}, submitting, zone = 'FIZ', onSubmit, onCancel }: ApiKeyFormProps) {
  const [v, setV] = React.useState<ApiKeyFormValues>({ zone, ...initial });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setV((x) => ({ ...x, [k]: e.target.value }));
  return (
    <form className="space-y-4 p-4" onSubmit={(e) => { e.preventDefault(); void onSubmit(v); }}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1"><Label htmlFor="ref">Reference</Label><Input id="ref" value={String(v.ref ?? '')} onChange={set('ref')} /></div>
        <div className="space-y-1"><Label htmlFor="zone">Zone</Label><Input id="zone" value={String(v.zone ?? zone)} onChange={set('zone')} /></div>
        <div className="space-y-1"><Label htmlFor="hs">HS Code</Label><Input id="hs" value={String(v.hs ?? '')} onChange={set('hs')} /></div>
        <div className="space-y-1"><Label htmlFor="qty">Quantity</Label><Input id="qty" type="number" value={String(v.qty ?? '')} onChange={set('qty')} /></div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}
export default ApiKeyForm;
