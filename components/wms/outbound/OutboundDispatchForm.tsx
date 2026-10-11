'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type OutboundDispatchFormValues = Record<string, unknown>;
export interface OutboundDispatchFormProps { initial?: OutboundDispatchFormValues; submitting?: boolean; zone?: 'FIZ' | 'FCZ'; onSubmit?: (v: OutboundDispatchFormValues) => void | Promise<void>; onCancel?: () => void; }
export function OutboundDispatchForm({ initial = {}, submitting, zone = 'FIZ', onSubmit, onCancel }: OutboundDispatchFormProps) {
  const [values, setValues] = React.useState<OutboundDispatchFormValues>({ zone, ...initial });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));
  return (
    <form className="space-y-4 p-4" onSubmit={(e) => { e.preventDefault(); if (onSubmit) void onSubmit(values); }}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1"><Label htmlFor="ref">Reference</Label><Input id="ref" value={String(values.ref ?? '')} onChange={set('ref')} /></div>
        <div className="space-y-1"><Label htmlFor="zone">Zone</Label><Input id="zone" value={String(values.zone ?? zone)} onChange={set('zone')} /></div>
        <div className="space-y-1"><Label htmlFor="hs">HS Code</Label><Input id="hs" value={String(values.hs ?? '')} onChange={set('hs')} /></div>
        <div className="space-y-1"><Label htmlFor="qty">Quantity</Label><Input id="qty" type="number" value={String(values.qty ?? '')} onChange={set('qty')} /></div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || !onSubmit}>{submitting ? 'Saving…' : onSubmit ? 'Save' : 'Not connected'}</Button>
        {!onSubmit ? <p role="status" className="text-xs text-muted-foreground">This form is not connected to a save service. No changes will be stored.</p> : null}
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}
export default OutboundDispatchForm;
