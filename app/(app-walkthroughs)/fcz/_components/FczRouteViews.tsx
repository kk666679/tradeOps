'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FczBreakBulkPanel, type FczBreakBulkPanelValues } from '@/components/fiz-fcz/fcz/FczBreakBulkPanel';
import { FczEntrepotTradePanel, type FczEntrepotTradePanelValues } from '@/components/fiz-fcz/fcz/FczEntrepotTradePanel';
import { FczReexportPanel, type FczReexportPanelValues } from '@/components/fiz-fcz/fcz/FczReexportPanel';
import { FczTranshipmentPanel, type FczTranshipmentPanelValues } from '@/components/fiz-fcz/fcz/FczTranshipmentPanel';
import { FczTradingHouseRegistry } from '@/components/fiz-fcz/fcz/FczTradingHouseRegistry';
import { ZoneRevenueCard } from '@/components/fiz-fcz/analytics/ZoneRevenueCard';
import { ZoneThroughputChart } from '@/components/fiz-fcz/analytics/ZoneThroughputChart';
import { ZoneTenantMixChart } from '@/components/fiz-fcz/analytics/ZoneTenantMixChart';
import { trpc } from '@/lib/trpc';

type Row = { id: string; label: string; meta: string };
type Kind = 'breakBulk' | 'entrepot' | 'reexport' | 'tradingHouses' | 'transhipment';
type BreakBulkRecord = { id: string; ref: string; parentCargoRef: string | null; status: string; houseId: string | null };
type EntrepotRecord = { id: string; importRef: string; exportRef: string; matchedValue: number | null; currency: string; houseId: string | null };
type ReexportRecord = { id: string; ref: string; originCountry: string | null; destCountry: string | null; status: string; value: number | null; currency: string; houseId: string | null };
type TranshipmentRecord = { id: string; ref: string; fromCountry: string | null; toCountry: string | null; status: string; houseId: string | null };
type HouseRecord = { id: string; name: string; code: string; status: string };

function QueryState({ loading, error, retry, empty, children }: { loading: boolean; error?: unknown; retry: () => void; empty?: boolean; children: React.ReactNode }) {
  if (loading) return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading live FCZ records…</p>;
  if (error) return <div role="alert" className="flex items-center justify-between gap-3 rounded-md border border-destructive/40 p-4 text-sm">
    <span>{error instanceof Error ? error.message : 'Unable to load FCZ data.'}</span>
    <Button type="button" variant="outline" onClick={retry}>Retry</Button>
  </div>;
  if (empty) return <p className="rounded-md border p-4 text-sm text-muted-foreground">No FCZ records are available yet.</p>;
  return <>{children}</>;
}

function row(id: string, label: unknown, meta: unknown): Row {
  const text = (value: unknown) => value === null || value === undefined ? '' : String(value);
  return { id, label: text(label) || id, meta: text(meta) };
}

function RowList({ rows, remove, removing, onSelect }: { rows: Row[]; remove?: (id: string) => void; removing?: boolean; onSelect?: (id: string) => void }) {
  if (!rows.length) return <p className="rounded-md border p-4 text-sm text-muted-foreground">No records are available yet.</p>;
  return <div className="divide-y rounded-md border">
    {rows.map((record) => <div key={record.id} className="flex items-center justify-between gap-4 p-4">
      <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onSelect?.(record.id)}>
        <span className="block truncate font-medium">{record.label}</span>
        <span className="block truncate text-sm text-muted-foreground">{record.meta || record.id}</span>
      </button>
      {remove ? <Button type="button" variant="outline" disabled={removing} onClick={() => remove(record.id)}>Delete</Button> : null}
    </div>)}
  </div>;
}

function RowEditor({ id, value, notFound, label, loading, error, pending, updateError, onSave }: {
  id: string;
  value?: string;
  notFound: boolean;
  label: string;
  loading: boolean;
  error?: unknown;
  pending: boolean;
  updateError?: unknown;
  onSave: (value: string) => void;
}) {
  const [draft, setDraft] = React.useState('');
  React.useEffect(() => { if (value !== undefined) setDraft(value); }, [value, id]);
  if (loading) return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading record details…</p>;
  if (error) return <p role="alert" className="rounded-md border p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Unable to load this record.'}</p>;
  if (notFound) return <p className="rounded-md border p-4 text-sm text-muted-foreground">No record was found for this ID.</p>;
  if (value === undefined) return null;
  return <form className="flex flex-wrap items-end gap-2 rounded-md border p-4" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
    <div className="space-y-1"><Label htmlFor={`fcz-record-${id}`}>{label}</Label><Input id={`fcz-record-${id}`} required value={draft} onChange={(event) => setDraft(event.target.value)} /></div>
    <Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Update'}</Button>
    {updateError ? <p role="alert" className="w-full text-sm text-destructive">{updateError instanceof Error ? updateError.message : 'Unable to update this record.'}</p> : null}
  </form>;
}

function BreakBulkList() {
  const [selectedId, setSelectedId] = React.useState('');
  const query = trpc.fcz.breakBulk.list.useQuery({ take: 200 }, { retry: false });
  const detail = trpc.fcz.breakBulk.byId.useQuery({ id: selectedId }, { retry: false, enabled: Boolean(selectedId) });
  const update = trpc.fcz.breakBulk.update.useMutation({ onSuccess: async () => { await detail.refetch(); await query.refetch(); } });
  const remove = trpc.fcz.breakBulk.delete.useMutation({ onSuccess: async () => query.refetch() });
  const rows = (query.data ?? []).map((r: BreakBulkRecord) => row(r.id, r.ref, `${r.parentCargoRef ?? 'No parent cargo'} · ${r.status}`));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    <RowList rows={rows} onSelect={setSelectedId} remove={(id) => { void remove.mutateAsync({ id }).catch(() => undefined); }} removing={remove.isPending} />
    {selectedId ? <RowEditor id={selectedId} value={detail.data?.ref} notFound={detail.data === null} label="Reference" loading={detail.isLoading} error={detail.error} pending={update.isPending} updateError={update.error} onSave={(ref) => { void update.mutateAsync({ id: selectedId, ref }).catch(() => undefined); }} /> : null}
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

function EntrepotList() {
  const [selectedId, setSelectedId] = React.useState('');
  const query = trpc.fcz.entrepot.list.useQuery({ take: 200 }, { retry: false });
  const detail = trpc.fcz.entrepot.byId.useQuery({ id: selectedId }, { retry: false, enabled: Boolean(selectedId) });
  const update = trpc.fcz.entrepot.update.useMutation({ onSuccess: async () => { await detail.refetch(); await query.refetch(); } });
  const remove = trpc.fcz.entrepot.delete.useMutation({ onSuccess: async () => query.refetch() });
  const rows = (query.data ?? []).map((r: EntrepotRecord) => row(r.id, `${r.importRef} ↔ ${r.exportRef}`, `${r.matchedValue ?? 'Value not set'} ${r.currency}`));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    <RowList rows={rows} onSelect={setSelectedId} remove={(id) => { void remove.mutateAsync({ id }).catch(() => undefined); }} removing={remove.isPending} />
    {selectedId ? <RowEditor id={selectedId} value={detail.data?.importRef} notFound={detail.data === null} label="Import reference" loading={detail.isLoading} error={detail.error} pending={update.isPending} updateError={update.error} onSave={(importRef) => { void update.mutateAsync({ id: selectedId, importRef }).catch(() => undefined); }} /> : null}
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

function ReexportList() {
  const [selectedId, setSelectedId] = React.useState('');
  const query = trpc.fcz.reexport.list.useQuery({ take: 200 }, { retry: false });
  const detail = trpc.fcz.reexport.byId.useQuery({ id: selectedId }, { retry: false, enabled: Boolean(selectedId) });
  const update = trpc.fcz.reexport.update.useMutation({ onSuccess: async () => { await detail.refetch(); await query.refetch(); } });
  const remove = trpc.fcz.reexport.delete.useMutation({ onSuccess: async () => query.refetch() });
  const rows = (query.data ?? []).map((r: ReexportRecord) => row(r.id, r.ref, `${r.originCountry ?? 'Origin not set'} → ${r.destCountry ?? 'Destination not set'} · ${r.status}`));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    <RowList rows={rows} onSelect={setSelectedId} remove={(id) => { void remove.mutateAsync({ id }).catch(() => undefined); }} removing={remove.isPending} />
    {selectedId ? <RowEditor id={selectedId} value={detail.data?.ref} notFound={detail.data === null} label="Reference" loading={detail.isLoading} error={detail.error} pending={update.isPending} updateError={update.error} onSave={(ref) => { void update.mutateAsync({ id: selectedId, ref }).catch(() => undefined); }} /> : null}
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

function TranshipmentList() {
  const router = useRouter();
  const query = trpc.fcz.transhipment.list.useQuery({ take: 200 }, { retry: false });
  const remove = trpc.fcz.transhipment.delete.useMutation({ onSuccess: async () => query.refetch() });
  const rows = (query.data ?? []).map((r: TranshipmentRecord) => row(r.id, r.ref, `${r.fromCountry ?? 'Origin not set'} → ${r.toCountry ?? 'Destination not set'} · ${r.status}`));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    <RowList rows={rows} onSelect={(id) => router.push(`/fcz/transhipment/${encodeURIComponent(id)}`)} remove={(id) => { void remove.mutateAsync({ id }).catch(() => undefined); }} removing={remove.isPending} />
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

function TradingHouseList() {
  const router = useRouter();
  const query = trpc.fcz.tradingHouses.list.useQuery({ take: 200 }, { retry: false });
  const remove = trpc.fcz.tradingHouses.delete.useMutation({ onSuccess: async () => query.refetch() });
  const items = (query.data ?? []).map((house: HouseRecord) => ({ id: house.id, label: house.name, meta: `${house.code} · ${house.status}` }));
  return <QueryState loading={query.isLoading} error={query.error} retry={() => { void query.refetch(); }}>
    {items.length ? <FczTradingHouseRegistry items={items} onSelect={(house) => router.push(`/fcz/trading-houses/${encodeURIComponent(house.id)}`)} /> : <p className="rounded-md border p-4 text-sm text-muted-foreground">No trading houses are registered yet.</p>}
    {items.map((house: Row) => <Button key={house.id} type="button" variant="ghost" disabled={remove.isPending} onClick={() => { void remove.mutateAsync({ id: house.id }).catch(() => undefined); }}>Delete {house.label}</Button>)}
    {remove.error ? <p role="alert" className="mt-2 text-sm text-destructive">{remove.error.message}</p> : null}
  </QueryState>;
}

export function FczEntityList({ kind }: { kind: Kind }) {
  if (kind === 'breakBulk') return <BreakBulkList />;
  if (kind === 'entrepot') return <EntrepotList />;
  if (kind === 'reexport') return <ReexportList />;
  if (kind === 'transhipment') return <TranshipmentList />;
  return <TradingHouseList />;
}

function DashboardData() {
  const breakBulk = trpc.fcz.breakBulk.list.useQuery({ take: 200 }, { retry: false });
  const entrepot = trpc.fcz.entrepot.list.useQuery({ take: 200 }, { retry: false });
  const reexport = trpc.fcz.reexport.list.useQuery({ take: 200 }, { retry: false });
  const transhipment = trpc.fcz.transhipment.list.useQuery({ take: 200 }, { retry: false });
  const houses = trpc.fcz.tradingHouses.list.useQuery({ take: 200 }, { retry: false });
  const queries = [breakBulk, entrepot, reexport, transhipment, houses];
  const failed = queries.find((query) => query.error);
  const retry = () => queries.forEach((query) => { void query.refetch(); });
  return <div className="space-y-4">
    <QueryState
      loading={queries.some((query) => query.isLoading)}
      error={failed?.error}
      retry={retry}
      empty={queries.every((query) => query.data?.length === 0)}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Break bulk', breakBulk.data?.length ?? 0], ['Entrepôt matches', entrepot.data?.length ?? 0],
          ['Re-exports', reexport.data?.length ?? 0], ['Transhipments', transhipment.data?.length ?? 0],
          ['Trading houses', houses.data?.length ?? 0],
        ].map(([label, value]) => <Card key={label}><CardHeader><CardTitle className="text-sm">{label}</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{value}</CardContent></Card>)}
      </div>
    </QueryState>
  </div>;
}

export function FczHomeData() {
  return <DashboardData />;
}

function HouseChoice({ houseId, onChange }: { houseId: string; onChange: (id: string) => void }) {
  const query = trpc.fcz.tradingHouses.list.useQuery({ take: 200 }, { retry: false });
  if (query.isLoading) return <p role="status" className="text-sm text-muted-foreground">Loading trading houses…</p>;
  if (query.error) return <p role="alert" className="text-sm text-destructive">{query.error.message}</p>;
  if (!query.data?.length) return <p className="text-sm text-muted-foreground">No trading house selected; this association is optional.</p>;
  return <div className="space-y-1">
    <Label htmlFor="houseId">Trading house (optional)</Label>
    <select id="houseId" value={houseId} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
      <option value="">No trading house</option>
      {query.data.map((house: HouseRecord) => <option key={house.id} value={house.id}>{house.name} ({house.code})</option>)}
    </select>
  </div>;
}

function HouseCreateForm() {
  const router = useRouter();
  const create = trpc.fcz.tradingHouses.create.useMutation();
  const utils = trpc.useUtils();
  const [code, setCode] = React.useState('');
  const [name, setName] = React.useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await create.mutateAsync({ code: code.trim(), name: name.trim() });
      await utils.fcz.tradingHouses.list.invalidate();
      router.push('/fcz/trading-houses');
    } catch {
      // The mutation error is rendered below.
    }
  };
  return <form onSubmit={submit} className="space-y-4 rounded-md border p-4">
    <div className="space-y-1"><Label htmlFor="house-code">Trading house code</Label><Input id="house-code" required value={code} onChange={(e) => setCode(e.target.value)} /></div>
    <div className="space-y-1"><Label htmlFor="house-name">Trading house name</Label><Input id="house-name" required value={name} onChange={(e) => setName(e.target.value)} /></div>
    <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Saving…' : 'Register trading house'}</Button>
    {create.error ? <p role="alert" className="text-sm text-destructive">{create.error.message}</p> : null}
  </form>;
}

function CreateRecord({ kind }: { kind: Kind }) {
  const router = useRouter();
  const [houseId, setHouseId] = React.useState('');
  const [additional, setAdditional] = React.useState<Record<string, string>>({});
  const [failure, setFailure] = React.useState('');
  const utils = trpc.useUtils();
  const breakBulk = trpc.fcz.breakBulk.create.useMutation();
  const entrepot = trpc.fcz.entrepot.create.useMutation();
  const reexport = trpc.fcz.reexport.create.useMutation();
  const transhipment = trpc.fcz.transhipment.create.useMutation();
  const isPending = breakBulk.isPending || entrepot.isPending || reexport.isPending || transhipment.isPending;
  const set = (key: string, value: string) => setAdditional((current) => ({ ...current, [key]: value }));
  const fields: Array<{ key: string; label: string; required?: boolean }> = kind === 'entrepot' ? [
    { key: 'importRef', label: 'Import reference' }, { key: 'exportRef', label: 'Export reference' },
  ] : kind === 'transhipment' ? [
    { key: 'fromCountry', label: 'Origin country', required: false }, { key: 'toCountry', label: 'Destination country', required: false },
  ] : kind === 'reexport' ? [
    { key: 'originCountry', label: 'Origin country', required: false }, { key: 'destCountry', label: 'Destination country', required: false },
  ] : [
    { key: 'parentCargoRef', label: 'Parent cargo reference', required: false },
    { key: 'childCargoRefs', label: 'Child cargo references (comma-separated)', required: false },
  ];
  const shouldUseReferencePanel = kind !== 'tradingHouses';
  const submit = async (values: Record<string, unknown>) => {
    setFailure('');
    const ref = String(values.ref ?? additional.ref ?? '').trim();
    if (kind !== 'entrepot' && !ref) {
      setFailure('Reference is required.');
      return;
    }
    if (kind === 'entrepot' && (!additional.importRef?.trim() || !additional.exportRef?.trim())) {
      setFailure('Import and export references are required.');
      return;
    }
    try {
      if (kind === 'breakBulk') await breakBulk.mutateAsync({
        ref,
        houseId: houseId || undefined,
        parentCargoRef: additional.parentCargoRef || undefined,
        childCargoRefs: (additional.childCargoRefs ?? '').split(',').map((cargoRef) => cargoRef.trim()).filter(Boolean),
      });
      if (kind === 'entrepot') await entrepot.mutateAsync({ importRef: additional.importRef?.trim(), exportRef: additional.exportRef?.trim(), houseId: houseId || undefined });
      if (kind === 'reexport') await reexport.mutateAsync({ ref, houseId: houseId || undefined, originCountry: additional.originCountry || undefined, destCountry: additional.destCountry || undefined });
      if (kind === 'transhipment') await transhipment.mutateAsync({ ref, houseId: houseId || undefined, fromCountry: additional.fromCountry || undefined, toCountry: additional.toCountry || undefined });
      const endpoint = { breakBulk: 'break-bulk', entrepot: 'entrepot', reexport: 'reexport', transhipment: 'transhipment', tradingHouses: 'trading-houses' }[kind];
      if (kind === 'breakBulk') await utils.fcz.breakBulk.list.invalidate();
      if (kind === 'entrepot') await utils.fcz.entrepot.list.invalidate();
      if (kind === 'reexport') await utils.fcz.reexport.list.invalidate();
      if (kind === 'transhipment') await utils.fcz.transhipment.list.invalidate();
      router.push(`/fcz/${endpoint}`);
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'Unable to save this FCZ record.');
    }
  };
  if (kind === 'tradingHouses') return <HouseCreateForm />;
  return <div className="space-y-4 rounded-md border p-4">
    <HouseChoice houseId={houseId} onChange={setHouseId} />
    {fields.map((field) => <div key={field.key} className="space-y-1">
      <Label htmlFor={field.key}>{field.label}</Label>
      <Input id={field.key} required={field.required ?? true} value={additional[field.key] ?? ''} onChange={(event) => set(field.key, event.target.value)} />
    </div>)}
    {shouldUseReferencePanel && kind === 'breakBulk' ? <FczBreakBulkPanel onSubmit={submit as (v: FczBreakBulkPanelValues) => void} submitting={isPending} /> : null}
    {shouldUseReferencePanel && kind === 'entrepot' ? <FczEntrepotTradePanel onSubmit={submit as (v: FczEntrepotTradePanelValues) => void} submitting={isPending} /> : null}
    {shouldUseReferencePanel && kind === 'reexport' ? <FczReexportPanel onSubmit={submit as (v: FczReexportPanelValues) => void} submitting={isPending} /> : null}
    {shouldUseReferencePanel && kind === 'transhipment' ? <FczTranshipmentPanel onSubmit={submit as (v: FczTranshipmentPanelValues) => void} submitting={isPending} /> : null}
    {failure ? <p role="alert" className="text-sm text-destructive">{failure}</p> : null}
    {[breakBulk.error, entrepot.error, reexport.error, transhipment.error].filter(Boolean).map((error, i) => <p key={i} role="alert" className="text-sm text-destructive">{error?.message}</p>)}
  </div>;
}

export function FczCreateForm({ kind }: { kind: Kind }) {
  return <CreateRecord kind={kind} />;
}

function TranshipmentDetail({ id }: { id: string }) {
  const query = trpc.fcz.transhipment.byId.useQuery({ id }, { retry: false, enabled: Boolean(id) });
  const update = trpc.fcz.transhipment.update.useMutation({ onSuccess: async () => query.refetch() });
  const remove = trpc.fcz.transhipment.delete.useMutation();
  const [ref, setRef] = React.useState('');
  React.useEffect(() => { if (query.data) setRef(query.data.ref); }, [query.data]);
  const router = useRouter();
  if (query.isLoading) return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading transhipment…</p>;
  if (query.error) return <p role="alert" className="rounded-md border p-4 text-sm text-destructive">{query.error.message}</p>;
  if (!query.data) return <p className="rounded-md border p-4 text-sm text-muted-foreground">No transhipment was found for this ID.</p>;
  const record = query.data;
  return <Card>
    <CardHeader><CardTitle>{record.ref}</CardTitle><p className="text-sm text-muted-foreground">{record.status}</p></CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 text-sm"><p>Origin: {record.fromCountry || '—'}</p><p>Destination: {record.toCountry || '—'}</p><p>Vessel in: {record.vesselIn || '—'}</p><p>Vessel out: {record.vesselOut || '—'}</p></div>
      <form className="flex flex-wrap items-end gap-2" onSubmit={(event) => { event.preventDefault(); void update.mutateAsync({ id, ref }).catch(() => undefined); }}>
        <div className="space-y-1"><Label htmlFor="ref-edit">Reference</Label><Input id="ref-edit" required value={ref} onChange={(event) => setRef(event.target.value)} /></div>
        <Button type="submit" disabled={update.isPending}>{update.isPending ? 'Saving…' : 'Update reference'}</Button>
        <Button type="button" variant="destructive" disabled={remove.isPending} onClick={() => { void remove.mutateAsync({ id }).then(() => router.push('/fcz/transhipment')).catch(() => undefined); }}>Delete</Button>
      </form>
      {[update.error, remove.error].filter(Boolean).map((error, i) => <p key={i} role="alert" className="text-sm text-destructive">{error?.message}</p>)}
    </CardContent>
  </Card>;
}

function TradingHouseDetail({ id }: { id: string }) {
  const query = trpc.fcz.tradingHouses.byId.useQuery({ id }, { retry: false, enabled: Boolean(id) });
  const update = trpc.fcz.tradingHouses.update.useMutation({ onSuccess: async () => query.refetch() });
  const remove = trpc.fcz.tradingHouses.delete.useMutation();
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const router = useRouter();
  React.useEffect(() => { if (query.data) { setName(query.data.name); setCode(query.data.code); } }, [query.data]);
  if (query.isLoading) return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading trading house…</p>;
  if (query.error) return <p role="alert" className="rounded-md border p-4 text-sm text-destructive">{query.error.message}</p>;
  if (!query.data) return <p className="rounded-md border p-4 text-sm text-muted-foreground">No trading house was found for this ID.</p>;
  return <Card><CardHeader><CardTitle>{query.data.name}</CardTitle><p className="text-sm text-muted-foreground">Status: {query.data.status}</p></CardHeader>
    <CardContent className="space-y-4">
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); void update.mutateAsync({ id, code, name }).catch(() => undefined); }}>
        <div className="space-y-1"><Label htmlFor="house-code">Code</Label><Input id="house-code" required value={code} onChange={(event) => setCode(event.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="house-name">Name</Label><Input id="house-name" required value={name} onChange={(event) => setName(event.target.value)} /></div>
        <div className="flex gap-2 sm:col-span-2"><Button type="submit" disabled={update.isPending}>{update.isPending ? 'Saving…' : 'Update trading house'}</Button>
          <Button type="button" variant="destructive" disabled={remove.isPending} onClick={() => { void remove.mutateAsync({ id }).then(() => router.push('/fcz/trading-houses')).catch(() => undefined); }}>Delete</Button></div>
      </form>
      {[update.error, remove.error].filter(Boolean).map((error, i) => <p key={i} role="alert" className="text-sm text-destructive">{error?.message}</p>)}
    </CardContent></Card>;
}

export function FczDetail({ kind, id }: { kind: 'transhipment' | 'tradingHouses'; id: string }) {
  return kind === 'transhipment' ? <TranshipmentDetail id={id} /> : <TradingHouseDetail id={id} />;
}

export function FczUnavailable({ entity }: { entity: string }) {
  return <Card><CardContent className="py-6 text-sm text-muted-foreground">{entity} records are not available through the current FCZ tRPC API. No sample data is shown.</CardContent></Card>;
}

export function FczAnalyticsData() {
  const breakBulk = trpc.fcz.breakBulk.list.useQuery({ take: 200 }, { retry: false });
  const entrepot = trpc.fcz.entrepot.list.useQuery({ take: 200 }, { retry: false });
  const reexport = trpc.fcz.reexport.list.useQuery({ take: 200 }, { retry: false });
  const transhipment = trpc.fcz.transhipment.list.useQuery({ take: 200 }, { retry: false });
  const houses = trpc.fcz.tradingHouses.list.useQuery({ take: 200 }, { retry: false });
  const queries = [breakBulk, entrepot, reexport, transhipment, houses];
  const failed = queries.find((query) => query.error);
  const retry = () => queries.forEach((query) => { void query.refetch(); });
  const valueByCurrency = new Map<string, number>();
  for (const record of (reexport.data ?? []) as ReexportRecord[]) {
    const currency = record.currency || 'Unspecified currency';
    valueByCurrency.set(currency, (valueByCurrency.get(currency) ?? 0) + (record.value ?? 0));
  }
  const recordedValue = [...valueByCurrency].map(([currency, value]) => `${currency} ${value.toLocaleString()}`).join(' · ') || 'No recorded value';
  const throughput = [
    { x: 'Break bulk', y: breakBulk.data?.length ?? 0 },
    { x: 'Entrepôt matches', y: entrepot.data?.length ?? 0 },
    { x: 'Re-exports', y: reexport.data?.length ?? 0 },
    { x: 'Transhipments', y: transhipment.data?.length ?? 0 },
  ].filter((point) => point.y > 0);
  const associationCounts = new Map<string, number>();
  for (const record of [...(breakBulk.data ?? []), ...(entrepot.data ?? []), ...(reexport.data ?? []), ...(transhipment.data ?? [])] as Array<BreakBulkRecord | EntrepotRecord | ReexportRecord | TranshipmentRecord>) {
    if (record.houseId) associationCounts.set(record.houseId, (associationCounts.get(record.houseId) ?? 0) + 1);
  }
  const tenantMix = (houses.data ?? []).flatMap((house: HouseRecord) => {
    const count = associationCounts.get(house.id) ?? 0;
    return count ? [{ x: house.name, y: count }] : [];
  });
  return <QueryState loading={queries.some((query) => query.isLoading)} error={failed?.error} retry={retry}>
    <div className="space-y-6">
      <ZoneRevenueCard title="Recorded re-export value" value={recordedValue} hint={`From ${reexport.data?.length ?? 0} live re-export records; values remain separated by currency.`} />
      <section className="space-y-2 rounded-md border p-4">
        <h2 className="font-medium">FCZ records by operation</h2>
        {throughput.length ? <ZoneThroughputChart data={throughput} /> : <p className="py-6 text-center text-sm text-muted-foreground">No FCZ records are available to chart.</p>}
      </section>
      <section className="space-y-2 rounded-md border p-4">
        <h2 className="font-medium">Records associated with trading houses</h2>
        {tenantMix.length ? <ZoneTenantMixChart data={tenantMix} /> : <p className="py-6 text-center text-sm text-muted-foreground">No records are currently associated with trading houses.</p>}
      </section>
    </div>
  </QueryState>;
}
