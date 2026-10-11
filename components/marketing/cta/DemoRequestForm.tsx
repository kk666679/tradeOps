'use client';
import * as React from 'react';

export interface DemoRequestValues { name: string; email: string; company: string; zones: string }

export interface DemoRequestFormProps {
  onSubmit?: (v: DemoRequestValues) => void | Promise<void>;
  submitting?: boolean;
}

export function DemoRequestForm({ onSubmit, submitting }: DemoRequestFormProps) {
  const [v, setV] = React.useState<DemoRequestValues>({ name: '', email: '', company: '', zones: '1' });
  const set = (k: keyof DemoRequestValues) => (e: React.ChangeEvent<HTMLInputElement>) => setV((x) => ({ ...x, [k]: e.target.value }));
  return (
    <form className="space-y-3 rounded-lg border bg-white p-6" onSubmit={(e) => { e.preventDefault(); void onSubmit?.(v); }}>
      <label className="block space-y-1 text-sm"><span className="text-slate-600">Name</span><input className="w-full rounded-md border px-3 py-2" value={v.name} onChange={set('name')} required /></label>
      <label className="block space-y-1 text-sm"><span className="text-slate-600">Work email</span><input type="email" className="w-full rounded-md border px-3 py-2" value={v.email} onChange={set('email')} required /></label>
      <label className="block space-y-1 text-sm"><span className="text-slate-600">Company</span><input className="w-full rounded-md border px-3 py-2" value={v.company} onChange={set('company')} required /></label>
      <label className="block space-y-1 text-sm"><span className="text-slate-600">Number of zones</span><input type="number" className="w-full rounded-md border px-3 py-2" value={v.zones} onChange={set('zones')} min="1" /></label>
      <button type="submit" disabled={submitting} className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">{submitting ? 'Sending...' : 'Request demo'}</button>
    </form>
  );
}
export default DemoRequestForm;
