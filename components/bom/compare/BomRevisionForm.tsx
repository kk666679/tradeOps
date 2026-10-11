'use client';
import * as React from 'react';

export type BomRevisionFormValues = Record<string, unknown>;
export interface BomRevisionFormProps {
  initial?: BomRevisionFormValues;
  submitting?: boolean;
  onSubmit: (v: BomRevisionFormValues) => void | Promise<void>;
  onCancel?: () => void;
}

const FIELDS: { key: string; label: string; type?: string }[] = [
  { key: 'version', label: 'version' },
  { key: 'note', label: 'note' },
  { key: 'effectiveFrom', label: 'effectiveFrom' },
];

export function BomRevisionForm({ initial = {}, submitting, onSubmit, onCancel }: BomRevisionFormProps) {
  const [v, setV] = React.useState<BomRevisionFormValues>(initial);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setV((x) => ({ ...x, [k]: e.target.value }));
  return (
    <form className="space-y-4 rounded-lg border bg-white p-6" onSubmit={(e) => { e.preventDefault(); void onSubmit(v); }}>
      <div className="grid gap-4 md:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block space-y-1 text-sm">
            <span className="text-slate-600">{f.label}</span>
            <input type={f.type ?? 'text'} value={String(v[f.key] ?? '')} onChange={set(f.key)} className="w-full rounded-md border px-3 py-2" />
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
          {submitting ? 'Saving…' : 'Save'}
        </button>
        {onCancel ? <button type="button" onClick={onCancel} className="rounded-md border px-4 py-2 text-sm">Cancel</button> : null}
      </div>
    </form>
  );
}
export default BomRevisionForm;
