'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type CargoFormValues = Record<string, unknown>;
export interface CargoFormProps { initial?: CargoFormValues; submitting?: boolean; onSubmit: (v: CargoFormValues) => void | Promise<void>; onCancel?: () => void; }
export function CargoForm({ initial = {}, submitting, onSubmit, onCancel }: CargoFormProps) {
  const [v, setV] = React.useState<CargoFormValues>({ kind: 'GENERAL', ...initial });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setV((x) => ({ ...x, [k]: e.target.value }));
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void onSubmit(v); }}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1"><Label htmlFor="cargo-ref">Reference</Label><Input id="cargo-ref" value={String(v.ref ?? '')} onChange={set('ref')} required /></div>
        <div className="space-y-1">
          <Label htmlFor="cargo-kind">Cargo type</Label>
          <Select value={String(v.kind ?? 'GENERAL')} onValueChange={(kind) => setV((current) => ({ ...current, kind }))}>
            <SelectTrigger id="cargo-kind"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="BULK">Bulk</SelectItem>
              <SelectItem value="DRY_BULK">Dry bulk</SelectItem>
              <SelectItem value="LIQUID_BULK">Liquid bulk</SelectItem>
              <SelectItem value="BREAK_BULK">Break bulk</SelectItem>
              <SelectItem value="CONTAINERIZED">Containerized</SelectItem>
              <SelectItem value="HAZMAT">Hazmat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 md:col-span-2"><Label htmlFor="cargo-description">Description</Label><Input id="cargo-description" value={String(v.description ?? '')} onChange={set('description')} /></div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}
export default CargoForm;
