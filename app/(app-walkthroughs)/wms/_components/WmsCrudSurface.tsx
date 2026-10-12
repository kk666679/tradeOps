'use client';

import * as React from 'react';
import { trpc } from '@/lib/trpc/react';

export type WmsResource =
  | 'bonded'
  | 'exemption'
  | 'forecasting'
  | 'gate'
  | 'inbound'
  | 'inventory'
  | 'movement'
  | 'outbound'
  | 'slotting';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'datetime-local' | 'checkbox';
  required?: boolean;
};

const fieldsByResource: Record<WmsResource, Field[]> = {
  bonded: [
    { name: 'zoneId', label: 'Zone ID', required: true },
    { name: 'hsCode', label: 'HS code', required: true },
    { name: 'description', label: 'Description' },
    { name: 'qty', label: 'Quantity', type: 'number', required: true },
    { name: 'uom', label: 'Unit of measure' },
    { name: 'value', label: 'Value', type: 'number' },
    { name: 'currency', label: 'Currency' },
  ],
  exemption: [
    { name: 'schemeId', label: 'Scheme ID', required: true },
    { name: 'ref', label: 'Reference', required: true },
    { name: 'amount', label: 'Amount', type: 'number', required: true },
    { name: 'currency', label: 'Currency' },
    { name: 'status', label: 'Status' },
  ],
  forecasting: [
    { name: 'ref', label: 'Reference', required: true },
    { name: 'status', label: 'Status' },
  ],
  gate: [
    { name: 'zoneId', label: 'Zone ID', required: true },
    { name: 'ref', label: 'Reference', required: true },
    { name: 'direction', label: 'Direction', required: true },
    { name: 'status', label: 'Status' },
    { name: 'plateNo', label: 'Vehicle plate' },
    { name: 'driverName', label: 'Driver name' },
    { name: 'sealNo', label: 'Seal number' },
  ],
  inbound: [
    { name: 'ref', label: 'Reference', required: true },
    { name: 'status', label: 'Status' },
    { name: 'asnRef', label: 'ASN reference' },
    { name: 'etaAt', label: 'ETA', type: 'datetime-local' },
  ],
  inventory: [
    { name: 'sku', label: 'SKU', required: true },
    { name: 'hsCode', label: 'HS code' },
    { name: 'description', label: 'Description' },
    { name: 'qty', label: 'Quantity', type: 'number' },
    { name: 'uom', label: 'Unit of measure' },
    { name: 'unitValue', label: 'Unit value', type: 'number' },
    { name: 'currency', label: 'Currency' },
    { name: 'bonded', label: 'Bonded', type: 'checkbox' },
    { name: 'status', label: 'Status' },
  ],
  movement: [
    { name: 'ref', label: 'Reference', required: true },
    { name: 'status', label: 'Status' },
    { name: 'carrier', label: 'Carrier' },
    { name: 'vehicleNo', label: 'Vehicle number' },
    { name: 'fromZoneId', label: 'From zone ID' },
    { name: 'toZoneId', label: 'To zone ID' },
    { name: 'departedAt', label: 'Departed at', type: 'datetime-local' },
    { name: 'arrivedAt', label: 'Arrived at', type: 'datetime-local' },
  ],
  outbound: [
    { name: 'ref', label: 'Reference', required: true },
    { name: 'status', label: 'Status' },
    { name: 'customerRef', label: 'Customer reference' },
    { name: 'shipTo', label: 'Ship to' },
    { name: 'dispatchedAt', label: 'Dispatched at', type: 'datetime-local' },
  ],
  slotting: [
    { name: 'zoneId', label: 'Zone ID', required: true },
    { name: 'code', label: 'Slot code', required: true },
    { name: 'aisle', label: 'Aisle' },
    { name: 'rack', label: 'Rack' },
    { name: 'level', label: 'Level' },
    { name: 'bin', label: 'Bin' },
    { name: 'status', label: 'Status' },
  ],
};

function getRows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

function inputValue(value: unknown, type: Field['type']): string | boolean {
  if (type === 'checkbox') return value === true;
  if (value == null) return '';
  if (value instanceof Date) {
    const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
  }
  if (type === 'datetime-local' && typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60_000);
      return local.toISOString().slice(0, 16);
    }
  }
  return String(value);
}

function displayValue(value: unknown): string {
  if (value == null || value === '') return '—';
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function toMutationValue(value: string | boolean, type: Field['type']): unknown {
  if (type === 'checkbox') return value;
  if (value === '') return undefined;
  if (type === 'number') return Number(value);
  if (type === 'datetime-local' && typeof value === 'string') return new Date(value).toISOString();
  return value;
}

export function WmsCrudSurface({
  resource,
  id,
  title,
  allowCreate = false,
  allowUpdate = true,
}: {
  resource: WmsResource;
  id?: string;
  title: string;
  allowCreate?: boolean;
  allowUpdate?: boolean;
}) {
  const listQuery = trpc.wms[resource].list.useQuery(
    { take: 100 },
    { enabled: !id, retry: false },
  );
  const detailQuery = trpc.wms[resource].byId.useQuery(
    { id: id ?? '' },
    { enabled: Boolean(id), retry: false },
  );
  const createMutation = trpc.wms[resource].create.useMutation();
  const updateMutation = trpc.wms[resource].update.useMutation();
  const [editing, setEditing] = React.useState<Record<string, unknown> | null>(null);
  const [values, setValues] = React.useState<Record<string, string | boolean>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const query = id ? detailQuery : listQuery;
  const records = getRows(listQuery.data);
  const record = id ? (detailQuery.data as Record<string, unknown> | null | undefined) : undefined;
  const fields = fieldsByResource[resource];
  const pending = createMutation.isPending || updateMutation.isPending;

  const startEditing = (row?: Record<string, unknown>) => {
    const next = row ?? {};
    setEditing(row ?? {});
    setValues(Object.fromEntries(fields.map((field) => [field.name, inputValue(next[field.name], field.type)])));
    setFormError(null);
    setSaved(false);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSaved(false);
    const payload = Object.fromEntries(
      fields
        .map((field) => [field.name, toMutationValue(values[field.name] ?? '', field.type)] as const)
        .filter(([, value]) => value !== undefined),
    );

    try {
      if (editing?.id) {
        await updateMutation.mutateAsync({ id: String(editing.id), ...payload } as never);
      } else {
        await createMutation.mutateAsync(payload as never);
      }
      setSaved(true);
      setEditing(editing?.id ? null : {});
      setValues({});
      if (!id) await listQuery.refetch();
      else await detailQuery.refetch();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'The WMS record could not be saved.');
    }
  };

  return (
    <section className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold capitalize">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Live records from the {resource} service.
          </p>
        </div>
        {allowCreate && !id && !editing && (
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
            onClick={() => startEditing()}
          >
            Create record
          </button>
        )}
      </div>

      {query.isLoading && <p className="text-sm text-muted-foreground">Loading records…</p>}
      {query.error && (
        <div role="alert" className="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
          <p>Unable to load {resource} records: {query.error.message}</p>
          <button
            type="button"
            className="mt-2 rounded-md border px-2 py-1 text-foreground"
            onClick={() => void query.refetch()}
          >
            Retry
          </button>
        </div>
      )}
      {saved && <p role="status" className="text-sm text-emerald-700">Record saved.</p>}

      {id && record && (
        <dl className="grid gap-3 sm:grid-cols-2">
          {Object.entries(record)
            .filter(([key]) => key !== 'tenantId')
            .map(([key, value]) => (
              <div key={key} className="min-w-0 border-b pb-2">
                <dt className="text-xs font-medium uppercase text-muted-foreground">{key}</dt>
                <dd className="break-words text-sm">{displayValue(value)}</dd>
              </div>
            ))}
        </dl>
      )}
      {id && !detailQuery.isLoading && !detailQuery.error && !record && (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          No {resource} record was found for this ID.
        </p>
      )}

      {!id && !listQuery.isLoading && !listQuery.error && records.length === 0 && (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          No {resource} records were returned.
        </p>
      )}

      {!id && records.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-muted-foreground">
              <tr>
                {['ref', 'sku', 'code', 'hsCode', 'status', 'zoneId', 'qty', 'createdAt']
                  .filter((key) => records.some((row) => row[key] != null))
                  .map((key) => <th className="px-3 py-2" key={key}>{key}</th>)}
                {allowUpdate && <th className="px-3 py-2 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((row, index) => (
                <tr className="border-b last:border-0" key={String(row.id ?? index)}>
                  {['ref', 'sku', 'code', 'hsCode', 'status', 'zoneId', 'qty', 'createdAt']
                    .filter((key) => records.some((item) => item[key] != null))
                    .map((key) => <td className="max-w-64 truncate px-3 py-2" key={key}>{displayValue(row[key])}</td>)}
                  {allowUpdate && (
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        className="rounded-md border px-2 py-1 text-xs hover:bg-accent"
                        onClick={() => startEditing(row)}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {id && record && allowUpdate && !editing && (
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
          onClick={() => startEditing(record)}
        >
          Edit record
        </button>
      )}

      {editing && (allowCreate || Boolean(editing.id) || Boolean(id)) && (
        <form className="space-y-4 border-t pt-4" onSubmit={submit}>
          <h3 className="font-medium">{editing.id ? 'Update record' : 'Create record'}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label className="space-y-1 text-sm" key={field.name}>
                <span className="block text-muted-foreground">{field.label}</span>
                <input
                  aria-label={field.label}
                  className="h-9 w-full rounded-md border bg-background px-3"
                  type={field.type === 'checkbox' ? 'checkbox' : field.type ?? 'text'}
                  required={field.required && !editing.id}
                  checked={field.type === 'checkbox' ? Boolean(values[field.name]) : undefined}
                  value={field.type === 'checkbox' ? undefined : String(values[field.name] ?? '')}
                  onChange={(event) => setValues((current) => ({
                    ...current,
                    [field.name]: field.type === 'checkbox' ? event.target.checked : event.target.value,
                  }))}
                />
              </label>
            ))}
          </div>
          {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
          <div className="flex gap-2">
            <button className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50" disabled={pending} type="submit">
              {pending ? 'Saving…' : editing.id ? 'Save changes' : 'Create'}
            </button>
            <button className="rounded-md border px-3 py-2 text-sm" onClick={() => { setEditing(null); setFormError(null); }} type="button">
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
