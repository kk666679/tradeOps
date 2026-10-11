'use client';

/**
 * FizSubcontractPanel
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type FizSubcontractPanelValues = Record<string, unknown>;
export interface FizSubcontractPanelProps {
  initial?: FizSubcontractPanelValues;
  submitting?: boolean;
  onSubmit: (v: FizSubcontractPanelValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function FizSubcontractPanel({ initial = {}, submitting, onSubmit, onCancel }: FizSubcontractPanelProps) {
  const [values, setValues] = React.useState<FizSubcontractPanelValues>(initial);
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

export default FizSubcontractPanel;
