'use client';
import { useMemo, useState, type FormEvent } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WmsZoneContextBar } from '@/components/wms/core/WmsZoneContextBar';
import { InventoryList, type InventoryListRow } from './InventoryList';
import { trpc } from '@/lib/trpc';

export interface InventoryDashboardProps { zoneId?: string; className?: string; }

interface InventoryRecord {
  id: string;
  sku: string;
  qty: number;
  uom: string;
  bonded: boolean;
  description: string | null;
  zoneId: string | null;
  status?: 'AVAILABLE' | 'HOLD' | 'DAMAGED' | 'QUARANTINE';
}

export function InventoryDashboard({ zoneId, className }: InventoryDashboardProps) {
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInventory, setEditingInventory] = useState<InventoryRecord | null>(null);
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [qty, setQty] = useState('0');
  const [uom, setUom] = useState('EA');
  const [bonded, setBonded] = useState(false);
  const utils = trpc.useUtils();
  const inventoryQuery = trpc.wms.inventory.list.useQuery({ take: 100 }, { refetchInterval: 30_000 });
  const createInventory = trpc.wms.inventory.create.useMutation({
    onSuccess: async () => {
      await utils.wms.inventory.list.invalidate();
      setShowCreateForm(false);
      setSku('');
      setDescription('');
      setQty('0');
      setUom('EA');
      setBonded(false);
    },
  });
  const updateInventory = trpc.wms.inventory.update.useMutation({
    onSuccess: async () => {
      await utils.wms.inventory.list.invalidate();
      setShowCreateForm(false);
      setEditingInventory(null);
      setSku('');
      setDescription('');
      setQty('0');
      setUom('EA');
      setBonded(false);
    },
  });
  const deleteInventory = trpc.wms.inventory.delete.useMutation({
    onSuccess: () => utils.wms.inventory.list.invalidate(),
  });
  const records = (inventoryQuery.data ?? []) as InventoryRecord[];
  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter((record) => `${record.sku} ${record.description ?? ''}`.toLowerCase().includes(term));
  }, [records, search]);
  const rows = filteredRecords.map((record) => ({
    id: record.id,
    ref: record.sku,
    status: record.status,
    meta: `${record.qty} ${record.uom}${record.bonded ? ' · bonded' : ''}${record.description ? ` · ${record.description}` : ''}`,
  }));
  const totalQty = records.reduce((total, record) => total + record.qty, 0);
  const bondedCount = records.filter((record) => record.bonded).length;
  const exceptionCount = records.filter((record) => record.status !== 'AVAILABLE').length;

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      sku: sku.trim(),
      description: description.trim() || null,
      qty: Number(qty),
      uom: uom.trim().toUpperCase() || 'EA',
      bonded,
      ...(editingInventory?.zoneId ? { zoneId: editingInventory.zoneId } : zoneId ? { zoneId } : {}),
    };
    if (editingInventory) {
      await updateInventory.mutateAsync({ id: editingInventory.id, ...payload });
    } else {
      await createInventory.mutateAsync({ ...payload, status: 'AVAILABLE' });
    }
  }

  function beginEdit(row: InventoryListRow) {
    const record = records.find((item) => item.id === row.id);
    if (!record) return;
    setEditingInventory(record);
    setSku(record.sku);
    setDescription(record.description ?? '');
    setQty(String(record.qty));
    setUom(record.uom);
    setBonded(record.bonded);
    setShowCreateForm(true);
  }

  function cancelEdit() {
    setShowCreateForm(false);
    setEditingInventory(null);
    setSku('');
    setDescription('');
    setQty('0');
    setUom('EA');
    setBonded(false);
  }

  function removeInventory(row: InventoryListRow) {
    if (window.confirm(`Delete inventory record ${row.ref}? This cannot be undone.`)) {
      deleteInventory.mutate({ id: row.id });
    }
  }

  return (
    <section className={className}>
      <WmsZoneContextBar zoneId={zoneId} />
      <header className="my-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">Warehouse stock records and bonded inventory.</p>
        </div>
        <Button type="button" onClick={() => { if (showCreateForm) cancelEdit(); else setShowCreateForm(true); }}>
          <Plus /> {showCreateForm ? 'Close form' : 'Add inventory'}
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle>Inventory records</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{inventoryQuery.isLoading || inventoryQuery.isError ? '—' : records.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total quantity</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{inventoryQuery.isLoading || inventoryQuery.isError ? '—' : totalQty.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle>Bonded records</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{inventoryQuery.isLoading || inventoryQuery.isError ? '—' : bondedCount}</CardContent></Card>
        <Card><CardHeader><CardTitle>Non-available</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{inventoryQuery.isLoading || inventoryQuery.isError ? '—' : exceptionCount}</CardContent></Card>
      </div>
      {showCreateForm && (
        <form className="my-4 grid gap-3 rounded-md border border-border p-4 md:grid-cols-2" onSubmit={handleSave}>
          <h2 className="font-semibold md:col-span-2">{editingInventory ? `Edit ${editingInventory.sku}` : 'New inventory record'}</h2>
          <div className="space-y-1"><label className="text-sm font-medium" htmlFor="inventory-sku">SKU</label><Input id="inventory-sku" value={sku} onChange={(event) => setSku(event.target.value)} required /></div>
          <div className="space-y-1"><label className="text-sm font-medium" htmlFor="inventory-qty">Quantity</label><Input id="inventory-qty" type="number" min="0" step="any" value={qty} onChange={(event) => setQty(event.target.value)} required /></div>
          <div className="space-y-1"><label className="text-sm font-medium" htmlFor="inventory-uom">Unit of measure</label><Input id="inventory-uom" value={uom} onChange={(event) => setUom(event.target.value)} required /></div>
          <div className="space-y-1"><label className="text-sm font-medium" htmlFor="inventory-description">Description</label><Input id="inventory-description" value={description} onChange={(event) => setDescription(event.target.value)} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bonded} onChange={(event) => setBonded(event.target.checked)} /> Bonded stock</label>
          <div className="flex items-center gap-2 md:justify-end">
            <Button type="submit" disabled={createInventory.isPending || updateInventory.isPending}>{createInventory.isPending || updateInventory.isPending ? 'Saving…' : 'Save inventory'}</Button>
            <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
          </div>
          {(createInventory.error ?? updateInventory.error) && <p role="alert" className="text-sm text-destructive md:col-span-2">{(createInventory.error ?? updateInventory.error)?.message}</p>}
        </form>
      )}
      <div className="my-4 flex items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search inventory" className="pl-9" placeholder="Search SKU or description" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <Button type="button" variant="outline" size="icon" title="Refresh inventory" aria-label="Refresh inventory" disabled={inventoryQuery.isFetching} onClick={() => void inventoryQuery.refetch()}>
          <RefreshCw className={inventoryQuery.isFetching ? 'animate-spin' : ''} />
        </Button>
      </div>
      {inventoryQuery.error ? (
        <div role="alert" className="flex items-center justify-between gap-4 rounded-md border border-destructive/40 p-4 text-sm">
          <span>Could not load inventory: {inventoryQuery.error.message}</span>
          <Button type="button" variant="outline" onClick={() => void inventoryQuery.refetch()}>Retry</Button>
        </div>
      ) : inventoryQuery.isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading inventory…</p>
      ) : (
        <div className="overflow-hidden rounded-md border border-border">
          <InventoryList
            rows={rows}
            empty={search ? 'No inventory matches this search.' : 'No inventory records yet.'}
            onSelect={beginEdit}
            onDelete={removeInventory}
            deletingId={deleteInventory.isPending ? deleteInventory.variables?.id : undefined}
          />
        </div>
      )}
      {deleteInventory.error && <p role="alert" className="text-sm text-destructive">{deleteInventory.error.message}</p>}
    </section>
  );
}
export default InventoryDashboard;
