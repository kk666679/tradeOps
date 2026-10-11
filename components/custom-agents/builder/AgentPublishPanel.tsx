'use client';

/**
 * AgentPublishPanel
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type AgentPublishPanelValues = Record<string, unknown>;
export interface AgentPublishPanelProps {
  initial?: AgentPublishPanelValues;
  submitting?: boolean;
  onSubmit: (v: AgentPublishPanelValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function AgentPublishPanel({ initial = {}, submitting, onSubmit, onCancel }: AgentPublishPanelProps) {
  const [values, setValues] = React.useState<AgentPublishPanelValues>(initial);
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

export default AgentPublishPanel;
