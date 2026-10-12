'use client';

import { useMemo, useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { CargoForm, type CargoFormValues } from './core/CargoForm';
import { CargoList, type CargoListRow } from './core/CargoList';
import { trpc } from '@/lib/trpc';

interface CargoRecord extends CargoListRow {
  kind: string;
  description: string | null;
  containerNo: string | null;
  blNo: string | null;
}

export function CargoWorkspace() {
  const [search, setSearch] = useState('');
  const [editingCargo, setEditingCargo] = useState<CargoRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const utils = trpc.useUtils();
  const cargoQuery = trpc.cargo.main.list.useQuery({ take: 100 }, { refetchInterval: 30_000 });
  const createCargo = trpc.cargo.main.create.useMutation({
    onSuccess: async () => {
      await utils.cargo.main.list.invalidate();
      setIsCreating(false);
    },
  });
  const updateCargo = trpc.cargo.main.update.useMutation({
    onSuccess: async () => {
      await utils.cargo.main.list.invalidate();
      setEditingCargo(null);
    },
  });
  const deleteCargo = trpc.cargo.main.delete.useMutation({
    onSuccess: () => utils.cargo.main.list.invalidate(),
  });

  const records = (cargoQuery.data ?? []) as CargoRecord[];
  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return records;
    return records.filter((record) =>
      [record.ref, record.description, record.containerNo, record.blNo]
        .some((value) => value?.toLowerCase().includes(normalizedSearch)),
    );
  }, [records, search]);

  const rows = filteredRecords.map(({ id, ref, zone, status, description }) => ({
    id,
    ref,
    zone,
    status,
    meta: description ?? undefined,
  }));

  async function saveCargo(values: CargoFormValues) {
    const payload = {
      ref: String(values.ref ?? '').trim(),
      kind: String(values.kind ?? 'GENERAL'),
      description: String(values.description ?? '').trim() || null,
    };

    if (editingCargo) {
      await updateCargo.mutateAsync({ id: editingCargo.id, ...payload });
    } else {
      await createCargo.mutateAsync(payload);
    }
  }

  function removeCargo(cargo: CargoListRow) {
    if (window.confirm(`Delete cargo ${cargo.ref}? This cannot be undone.`)) {
      deleteCargo.mutate({ id: cargo.id });
    }
  }

  const formError = createCargo.error ?? updateCargo.error;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cargo"
        description="Create, search, and maintain cargo records."
        action={(
          <Button onClick={() => { setEditingCargo(null); setIsCreating(true); }}>
            <Plus /> New cargo
          </Button>
        )}
      />

      {(isCreating || editingCargo) && (
        <section className="space-y-3 rounded-md border border-border p-4" aria-labelledby="cargo-form-title">
          <h2 id="cargo-form-title" className="font-semibold">{editingCargo ? `Edit ${editingCargo.ref}` : 'New cargo record'}</h2>
          <CargoForm
            key={editingCargo?.id ?? 'new-cargo'}
            initial={editingCargo ? { ref: editingCargo.ref, kind: editingCargo.kind, description: editingCargo.description ?? '' } : undefined}
            submitting={createCargo.isPending || updateCargo.isPending}
            onSubmit={saveCargo}
            onCancel={() => { setIsCreating(false); setEditingCargo(null); }}
          />
          {formError && <p role="alert" className="text-sm text-destructive">{formError.message}</p>}
        </section>
      )}

      <section className="space-y-3" aria-label="Cargo records">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search cargo records" className="pl-9" placeholder="Search reference, description, container, or bill of lading" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Button type="button" variant="outline" size="icon" title="Refresh cargo records" aria-label="Refresh cargo records" onClick={() => void cargoQuery.refetch()} disabled={cargoQuery.isFetching}>
            <RefreshCw className={cargoQuery.isFetching ? 'animate-spin' : ''} />
          </Button>
        </div>

        {cargoQuery.error ? (
          <div role="alert" className="flex items-center justify-between gap-4 rounded-md border border-destructive/40 p-4 text-sm">
            <span>Could not load cargo records: {cargoQuery.error.message}</span>
            <Button type="button" variant="outline" onClick={() => void cargoQuery.refetch()}>Retry</Button>
          </div>
        ) : cargoQuery.isPending ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading cargo records…</p>
        ) : (
          <div className="overflow-hidden rounded-md border border-border">
            <CargoList
              rows={rows}
              empty={search ? 'No cargo matches this search.' : 'No cargo records yet.'}
              onSelect={(row) => setEditingCargo(records.find((record) => record.id === row.id) ?? null)}
              onDelete={removeCargo}
              deletingId={deleteCargo.isPending ? ((deleteCargo.variables ?? undefined) as { id?: string } | undefined)?.id : undefined}
            />
          </div>
        )}
        {deleteCargo.error && <p role="alert" className="text-sm text-destructive">{deleteCargo.error.message}</p>}
      </section>
    </div>
  );
}