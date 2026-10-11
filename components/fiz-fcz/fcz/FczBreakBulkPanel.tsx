'use client';

/**
 * FczBreakBulkPanel
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type FczBreakBulkPanelValues = Record<string, unknown>;
export interface FczBreakBulkPanelProps {
  initial?: FczBreakBulkPanelValues;
  submitting?: boolean;
  onSubmit?: (v: FczBreakBulkPanelValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function FczBreakBulkPanel({ initial = {}, submitting, onSubmit, onCancel }: FczBreakBulkPanelProps) {
  const [values, setValues] = React.useState<FczBreakBulkPanelValues>(initial);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));
  return (
    <form className="space-y-4 p-4" onSubmit={(e) => { e.preventDefault(); if (onSubmit) void onSubmit(values); }}>
      <div className="space-y-1">
        <Label htmlFor="ref">Reference</Label>
        <Input id="ref" value={String(values.ref ?? '')} onChange={set('ref')} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || !onSubmit}>{submitting ? 'Saving…' : onSubmit ? 'Save' : 'Not connected'}</Button>
        {!onSubmit ? <p role="status" className="text-xs text-muted-foreground">This form is not connected to a save service. No changes will be stored.</p> : null}
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}

export default FczBreakBulkPanel;
