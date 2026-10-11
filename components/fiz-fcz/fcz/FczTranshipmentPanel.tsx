'use client';

/**
 * FczTranshipmentPanel
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type FczTranshipmentPanelValues = Record<string, unknown>;
export interface FczTranshipmentPanelProps {
  initial?: FczTranshipmentPanelValues;
  submitting?: boolean;
  onSubmit: (v: FczTranshipmentPanelValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function FczTranshipmentPanel({ initial = {}, submitting, onSubmit, onCancel }: FczTranshipmentPanelProps) {
  const [values, setValues] = React.useState<FczTranshipmentPanelValues>(initial);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));
  return (
    <form className="space-y-4 p-4" onSubmit={(e) => { e.preventDefault(); void onSubmit(values); }}>
      <div className="space-y-1">
        <Label htmlFor="ref">Reference</Label>
        <Input id="ref" value={String(values.ref ?? '')} onChange={set('ref')} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}

export default FczTranshipmentPanel;
