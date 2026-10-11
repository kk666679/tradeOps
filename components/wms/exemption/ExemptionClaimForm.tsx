'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ExemptionClaimFormValues = Record<string, unknown>;
export interface ExemptionClaimFormProps { initial?: ExemptionClaimFormValues; submitting?: boolean; zone?: 'FIZ' | 'FCZ'; onSubmit: (v: ExemptionClaimFormValues) => void | Promise<void>; onCancel?: () => void; }
export function ExemptionClaimForm({ initial = {}, submitting, zone = 'FIZ', onSubmit, onCancel }: ExemptionClaimFormProps) {
  const [values, setValues] = React.useState<ExemptionClaimFormValues>({ zone, ...initial });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));
  return (
    <form className="space-y-4 p-4" onSubmit={(e) => { e.preventDefault(); void onSubmit(values); }}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1"><Label htmlFor="ref">Reference</Label><Input id="ref" value={String(values.ref ?? '')} onChange={set('ref')} /></div>
        <div className="space-y-1"><Label htmlFor="zone">Zone</Label><Input id="zone" value={String(values.zone ?? zone)} onChange={set('zone')} /></div>
        <div className="space-y-1"><Label htmlFor="hs">HS Code</Label><Input id="hs" value={String(values.hs ?? '')} onChange={set('hs')} /></div>
        <div className="space-y-1"><Label htmlFor="qty">Quantity</Label><Input id="qty" type="number" value={String(values.qty ?? '')} onChange={set('qty')} /></div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}
export default ExemptionClaimForm;
