'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FizMachineryImport } from '@/components/fiz-fcz/fiz/FizMachineryImport';
import { FizProductionInputTracker } from '@/components/fiz-fcz/fiz/FizProductionInputTracker';
import { ZoneThroughputChart } from '@/components/fiz-fcz/analytics/ZoneThroughputChart';
import { trpc } from '@/lib/trpc';

type ListItem = { id: string; label: string; meta: string };
type Kind = 'machinery' | 'production' | 'subcontract' | 'wastage' | 'operators';
type InputField = { key: string; label: string; type?: string; required?: boolean };
type MachineryRecord = { id: string; ref: string; description: string; status: string };
type ProductionRecord = { id: string; ref: string; inputQty: number; inputUom: string; outputQty: number; outputUom: string; createdAt: Date };
type SubcontractRecord = { id: string; ref: string; subcontractor: string; status: string };
type WastageRecord = { id: string; ref: string; description: string; qty: number; uom: string };
type OperatorRecord = { id: string; name: string; code: string };

function QueryState({
  loading,
  error,
  retry,
  empty,
  children,
}: {
  loading: boolean;
  error?: unknown;
  retry: () => void;
  empty?: boolean;
  children: React.ReactNode;
}) {
  if (loading) return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading live FIZ records…</p>;
  if (error) return (
    <div role="alert" className="flex items-center justify-between gap-3 rounded-md border border-destructive/40 p-4 text-sm">
      <span>{error instanceof Error ? error.message : 'Unable to load FIZ data.'}</span>
      <Button type="button" variant="outline" onClick={retry}>Retry</Button>
    </div>
  );
  if (empty) return <p className="rounded-md border p-4 text-sm text-muted-foreground">No records are available yet.</p>;
  return <>{children}</>;
}

function RecordList({ items, remove, removing, onSelect }: { items: ListItem[]; remove?: (id: string) => void; removing?: boolean; onSelect?: (id: string) => void }) {
  if (!items.length) return <p className="rounded-md border p-4 text-sm text-muted-foreground">No records are available yet.</p>;
  return (
    <div className="divide-y rounded-md border">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate font-medium">{item.label}</p>
            <p className="truncate text-sm text-muted-foreground">{item.meta || item.id}</p>
          </div>
          {onSelect ? <Button type="button" variant="outline" onClick={() => onSelect(item.id)}>View / edit</Button> : null}
          {remove ? <Button type="button" variant="outline" disabled={removing} onClick={() => remove(item.id)}>Delete</Button> : null}
        </div>
      ))}
    </div>
  );
}

function RecordEditor({
  id,
  loading,
  error,
  value,
  notFound,
  label,
  saving,
  saveError,
  onSave,
}: {
  id: string;
  loading: boolean;
  error?: unknown;
  value?: string;
  notFound: boolean;
  label: string;
  saving: boolean;
  saveError?: unknown;
  onSave: (value: string) => void;
}) {
  const [draft, setDraft] = React.useState('');
  React.useEffect(() => { if (value !== undefined) setDraft(value); }, [value, id]);
  if (loading) return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading record details…</p>;
  if (error) return <p role="alert" className="rounded-md border p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Unable to load record details.'}</p>;
  if (notFound) return <p className="rounded-md border p-4 text-sm text-muted-foreground">No record was found for this ID.</p>;
  if (value === undefined) return null;
  return <form className="flex flex-wrap items-end gap-2 rounded-md border p-4" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
    <div className="space-y-1"><Label htmlFor={`record-field-${id}`}>{label}</Label><Input id={`record-field-${id}`} required value={draft} onChange={(event) => setDraft(event.target.value)} /></div>
    <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Update'}</Button>
    {saveError ? <p role="alert" className="w-full text-sm text-destructive">{saveError instanceof Error ? saveError.message : 'Unable to update this record.'}</p> : null}
  </form>;
}

function asText(value: unknown) {
  if (value instanceof Date) return value.toLocaleDateString();
  if (value === null || value === undefined || value === '') return '';
  return String(value);
}

function item(label: unknown, meta: unknown, id: string): ListItem {
  return { id, label: asText(label) || id, meta: asText(meta) };
}

function MachineryList() {
  const [selectedId, setSelectedId] = React.useState('');
  const query = trpc.fiz.machinery.list.useQuery({ take: 200 }, { retry: false });
  const detail = trpc.fiz.machinery.byId.useQuery({ id: selectedId }, { retry: false, enabled: Boolean(selectedId) });
  const update = trpc.fiz.machinery.update.useMutation({ onSuccess: async () => { await detail.refetch(); await query.refetch(); } });
  const remove = trpc.fiz.machinery.delete.useMutation({ onSuccess: async () => query.refetch() });
  const rows = (query.data ?? []).map((r: MachineryRecord) => item(r.ref, [r.description, r.status].filter(Boolean).join(' · '), r.id));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    <RecordList items={rows} onSelect={setSelectedId} remove={(id) => { void remove.mutateAsync({ id }).catch(() => undefined); }} removing={remove.isPending} />
    {selectedId ? <RecordEditor id={selectedId} loading={detail.isLoading} error={detail.error} value={detail.data?.ref} notFound={detail.data === null} label="Reference" saving={update.isPending} saveError={update.error} onSave={(ref) => { void update.mutateAsync({ id: selectedId, ref }).catch(() => undefined); }} /> : null}
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

function ProductionList() {
  const [selectedId, setSelectedId] = React.useState('');
  const query = trpc.fiz.production.list.useQuery({ take: 200 }, { retry: false });
  const detail = trpc.fiz.production.byId.useQuery({ id: selectedId }, { retry: false, enabled: Boolean(selectedId) });
  const update = trpc.fiz.production.update.useMutation({ onSuccess: async () => { await detail.refetch(); await query.refetch(); } });
  const remove = trpc.fiz.production.delete.useMutation({ onSuccess: async () => query.refetch() });
  const rows = (query.data ?? []).map((r: ProductionRecord) => item(r.ref, `${r.inputQty} ${r.inputUom} → ${r.outputQty} ${r.outputUom}`, r.id));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    <RecordList items={rows} onSelect={setSelectedId} remove={(id) => { void remove.mutateAsync({ id }).catch(() => undefined); }} removing={remove.isPending} />
    {selectedId ? <RecordEditor id={selectedId} loading={detail.isLoading} error={detail.error} value={detail.data?.ref} notFound={detail.data === null} label="Reference" saving={update.isPending} saveError={update.error} onSave={(ref) => { void update.mutateAsync({ id: selectedId, ref }).catch(() => undefined); }} /> : null}
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

function SubcontractList() {
  const [selectedId, setSelectedId] = React.useState('');
  const query = trpc.fiz.subcontract.list.useQuery({ take: 200 }, { retry: false });
  const detail = trpc.fiz.subcontract.byId.useQuery({ id: selectedId }, { retry: false, enabled: Boolean(selectedId) });
  const update = trpc.fiz.subcontract.update.useMutation({ onSuccess: async () => { await detail.refetch(); await query.refetch(); } });
  const remove = trpc.fiz.subcontract.delete.useMutation({ onSuccess: async () => query.refetch() });
  const rows = (query.data ?? []).map((r: SubcontractRecord) => item(r.ref, `${r.subcontractor} · ${r.status}`, r.id));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    <RecordList items={rows} onSelect={setSelectedId} remove={(id) => { void remove.mutateAsync({ id }).catch(() => undefined); }} removing={remove.isPending} />
    {selectedId ? <RecordEditor id={selectedId} loading={detail.isLoading} error={detail.error} value={detail.data?.ref} notFound={detail.data === null} label="Reference" saving={update.isPending} saveError={update.error} onSave={(ref) => { void update.mutateAsync({ id: selectedId, ref }).catch(() => undefined); }} /> : null}
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

function WastageList() {
  const [selectedId, setSelectedId] = React.useState('');
  const query = trpc.fiz.wastage.list.useQuery({ take: 200 }, { retry: false });
  const detail = trpc.fiz.wastage.byId.useQuery({ id: selectedId }, { retry: false, enabled: Boolean(selectedId) });
  const update = trpc.fiz.wastage.update.useMutation({ onSuccess: async () => { await detail.refetch(); await query.refetch(); } });
  const remove = trpc.fiz.wastage.delete.useMutation({ onSuccess: async () => query.refetch() });
  const rows = (query.data ?? []).map((r: WastageRecord) => item(r.ref, `${r.description} · ${r.qty} ${r.uom}`, r.id));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    <RecordList items={rows} onSelect={setSelectedId} remove={(id) => { void remove.mutateAsync({ id }).catch(() => undefined); }} removing={remove.isPending} />
    {selectedId ? <RecordEditor id={selectedId} loading={detail.isLoading} error={detail.error} value={detail.data?.ref} notFound={detail.data === null} label="Reference" saving={update.isPending} saveError={update.error} onSave={(ref) => { void update.mutateAsync({ id: selectedId, ref }).catch(() => undefined); }} /> : null}
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

export function FizEntityList({ kind }: { kind: Exclude<Kind, 'operators'> }) {
  if (kind === 'machinery') return <MachineryList />;
  if (kind === 'production') return <ProductionList />;
  if (kind === 'subcontract') return <SubcontractList />;
  return <WastageList />;
}

function DashboardData() {
  const operators = trpc.fiz.operators.list.useQuery({ take: 200 }, { retry: false });
  const production = trpc.fiz.production.list.useQuery({ take: 200 }, { retry: false });
  const machinery = trpc.fiz.machinery.list.useQuery({ take: 200 }, { retry: false });
  const subcontract = trpc.fiz.subcontract.list.useQuery({ take: 200 }, { retry: false });
  const wastage = trpc.fiz.wastage.list.useQuery({ take: 200 }, { retry: false });
  const queries = [operators, production, machinery, subcontract, wastage];
  const failed = queries.find((query) => query.error);
  const retry = () => queries.forEach((query) => { void query.refetch(); });
  return (
    <div className="space-y-4">
      <QueryState
        loading={queries.some((query) => query.isLoading)}
        error={failed?.error}
        retry={retry}
        empty={queries.every((query) => query.data?.length === 0)}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ['Operators', operators.data?.length ?? 0],
            ['Production inputs', production.data?.length ?? 0],
            ['Machinery records', machinery.data?.length ?? 0],
            ['Subcontract orders', subcontract.data?.length ?? 0],
            ['Wastage records', wastage.data?.length ?? 0],
          ].map(([label, count]) => <Card key={label}><CardHeader><CardTitle className="text-sm">{label}</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{count}</CardContent></Card>)}
        </div>
      </QueryState>
    </div>
  );
}

export function FizHomeData() {
  return <DashboardData />;
}

function FormFields({ fields, values, onChange }: { fields: InputField[]; values: Record<string, string>; onChange: (key: string, value: string) => void }) {
  return <div className="grid gap-4 sm:grid-cols-2">
    {fields.map((field) => <div key={field.key} className="space-y-1">
      <Label htmlFor={field.key}>{field.label}</Label>
      <Input id={field.key} type={field.type ?? 'text'} required={field.required ?? true} value={values[field.key] ?? ''} onChange={(e) => onChange(field.key, e.target.value)} />
    </div>)}
  </div>;
}

function OperatorChoice({ operatorId, onChange }: { operatorId: string; onChange: (value: string) => void }) {
  const operators = trpc.fiz.operators.list.useQuery({ take: 200 }, { retry: false });
  if (operators.isLoading) return <p role="status" className="text-sm text-muted-foreground">Loading operators…</p>;
  if (operators.error) return <p role="alert" className="text-sm text-destructive">{operators.error.message}</p>;
  if (!operators.data?.length) return <p role="alert" className="text-sm text-destructive">Register an operator before creating this FIZ record.</p>;
  return <div className="space-y-1">
    <Label htmlFor="operatorId">Operator</Label>
    <select id="operatorId" required value={operatorId} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
      <option value="">Select an operator</option>
      {operators.data.map((operator: OperatorRecord) => <option key={operator.id} value={operator.id}>{operator.name} ({operator.code})</option>)}
    </select>
  </div>;
}

function CreateResource({ kind }: { kind: Kind }) {
  const router = useRouter();
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [operatorId, setOperatorId] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const utils = trpc.useUtils();
  const setValue = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));

  const operatorCreate = trpc.fiz.operators.create.useMutation();
  const machineryCreate = trpc.fiz.machinery.create.useMutation();
  const productionCreate = trpc.fiz.production.create.useMutation();
  const subcontractCreate = trpc.fiz.subcontract.create.useMutation();
  const wastageCreate = trpc.fiz.wastage.create.useMutation();
  const isPending = [operatorCreate.isPending, machineryCreate.isPending, productionCreate.isPending, subcontractCreate.isPending, wastageCreate.isPending].some(Boolean);

  const fields: Record<Kind, InputField[]> = {
    operators: [{ key: 'code', label: 'Operator code' }, { key: 'name', label: 'Operator name' }],
    machinery: [{ key: 'ref', label: 'Reference' }, { key: 'hsCode', label: 'HS code' }, { key: 'description', label: 'Description' }],
    production: [
      { key: 'ref', label: 'Reference' }, { key: 'inputHs', label: 'Input HS code' }, { key: 'inputQty', label: 'Input quantity', type: 'number' },
      { key: 'inputUom', label: 'Input unit' }, { key: 'outputHs', label: 'Output HS code' }, { key: 'outputQty', label: 'Output quantity', type: 'number' }, { key: 'outputUom', label: 'Output unit' },
    ],
    subcontract: [
      { key: 'ref', label: 'Reference' }, { key: 'subcontractor', label: 'Subcontractor' }, { key: 'inputHs', label: 'Input HS code' },
      { key: 'inputQty', label: 'Input quantity', type: 'number' }, { key: 'outputHs', label: 'Output HS code' }, { key: 'outputQty', label: 'Output quantity', type: 'number' },
    ],
    wastage: [{ key: 'ref', label: 'Reference' }, { key: 'description', label: 'Description' }, { key: 'qty', label: 'Quantity', type: 'number' }, { key: 'uom', label: 'Unit' }, { key: 'reason', label: 'Reason' }],
  };
  const valid = Object.values(values).every((value) => value.trim() !== '') && (kind === 'operators' || Boolean(operatorId));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    if (!valid) {
      setFormError('Complete all required fields and choose an operator.');
      return;
    }
    const number = (key: string) => Number(values[key]);
    try {
      if (kind === 'operators') {
        await operatorCreate.mutateAsync({ code: values.code.trim(), name: values.name.trim() });
        await utils.fiz.operators.list.invalidate();
      }
      if (kind === 'machinery') {
        await machineryCreate.mutateAsync({ operatorId, ref: values.ref.trim(), hsCode: values.hsCode.trim(), description: values.description.trim() });
        await utils.fiz.machinery.list.invalidate();
      }
      if (kind === 'production') {
        await productionCreate.mutateAsync({
          operatorId, ref: values.ref.trim(), inputHs: values.inputHs.trim(), inputQty: number('inputQty'), inputUom: values.inputUom.trim(),
          outputHs: values.outputHs.trim(), outputQty: number('outputQty'), outputUom: values.outputUom.trim(),
        });
        await utils.fiz.production.list.invalidate();
      }
      if (kind === 'subcontract') {
        await subcontractCreate.mutateAsync({
          operatorId, ref: values.ref.trim(), subcontractor: values.subcontractor.trim(), inputHs: values.inputHs.trim(), inputQty: number('inputQty'),
          outputHs: values.outputHs.trim(), outputQty: number('outputQty'),
        });
        await utils.fiz.subcontract.list.invalidate();
      }
      if (kind === 'wastage') {
        await wastageCreate.mutateAsync({
          operatorId, ref: values.ref.trim(), description: values.description.trim(), qty: number('qty'), uom: values.uom.trim(), reason: values.reason.trim(),
        });
        await utils.fiz.wastage.list.invalidate();
      }
      const routes: Record<Kind, string> = { operators: '/fiz/operators', machinery: '/fiz/machinery', production: '/fiz/production-inputs', subcontract: '/fiz/subcontract', wastage: '/fiz/wastage' };
      router.push(routes[kind]);
      router.refresh();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save this record.');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-md border p-4">
      {kind !== 'operators' ? <OperatorChoice operatorId={operatorId} onChange={setOperatorId} /> : null}
      <FormFields fields={fields[kind]} values={values} onChange={setValue} />
      <Button type="submit" disabled={isPending || (kind !== 'operators' && !operatorId)}>{isPending ? 'Saving…' : 'Save record'}</Button>
      {formError ? <p role="alert" className="text-sm text-destructive">{formError}</p> : null}
      {[operatorCreate.error, machineryCreate.error, productionCreate.error, subcontractCreate.error, wastageCreate.error].filter(Boolean).map((error, i) => <p key={i} role="alert" className="text-sm text-destructive">{error?.message}</p>)}
    </form>
  );
}

export function FizCreateForm({ kind }: { kind: Kind }) {
  return <CreateResource kind={kind} />;
}

export function FizUnavailable({ entity }: { entity: string }) {
  return <Card><CardContent className="py-6 text-sm text-muted-foreground">{entity} records are not available through the current FIZ tRPC API. No sample data is shown.</CardContent></Card>;
}

export function FizAnalyticsData() {
  const production = trpc.fiz.production.list.useQuery({ take: 200 }, { retry: false });
  const machinery = trpc.fiz.machinery.list.useQuery({ take: 200 }, { retry: false });
  const wastage = trpc.fiz.wastage.list.useQuery({ take: 200 }, { retry: false });
  const queries = [production, machinery, wastage];
  const failed = queries.find((query) => query.error);
  const retry = () => queries.forEach((query) => { void query.refetch(); });
  const byDate = new Map<string, number>();
  for (const record of production.data ?? []) {
    const date = record.createdAt.toLocaleDateString();
    byDate.set(date, (byDate.get(date) ?? 0) + 1);
  }
  const throughput = [...byDate].map(([x, y]) => ({ x, y }));
  return <div className="space-y-4">
    <QueryState loading={queries.some((query) => query.isLoading)} error={failed?.error} retry={retry}>
      <div className="grid gap-4 sm:grid-cols-3">
        <FizProductionInputTracker title="Production inputs" value={production.data?.length ?? 0} hint="Live records returned by the FIZ production API" />
        <FizMachineryImport title="Machinery imports" value={machinery.data?.length ?? 0} hint="Live records returned by the FIZ machinery API" />
        <Card><CardHeader><CardTitle>Wastage records</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{wastage.data?.length ?? 0}<p className="mt-1 text-xs font-normal text-muted-foreground">Live records returned by the FIZ wastage API</p></CardContent></Card>
      </div>
      <section className="space-y-2 rounded-md border p-4">
        <h2 className="font-medium">Production entries by recorded date</h2>
        {throughput.length
          ? <ZoneThroughputChart data={throughput} />
          : <p className="py-6 text-center text-sm text-muted-foreground">No production entries are available to chart.</p>}
      </section>
    </QueryState>
  </div>;
}
