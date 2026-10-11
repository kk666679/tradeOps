'use client';

import * as React from 'react';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { AIStatistic, AISearchBar, AIDataTable } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Package, Droplets, Truck, Thermometer } from 'lucide-react';

interface BulkCargoItem {
  id: string;
  type: 'dry' | 'liquid';
  cargoId: string;
  tons: number;
  origin: string;
  destination: string;
  status: 'loading' | 'transit' | 'delivered' | 'issue';
  density: number;
  moisture: number;
  updatedAt: Date;
}

const STATUS_VARIANT: Record<BulkCargoItem['status'], string> = {
  loading: 'secondary',
  transit: 'default',
  delivered: 'success',
  issue: 'destructive',
};

const COLUMNS = [
  { key: 'cargoId', label: 'Cargo ID' },
  { key: 'type', label: 'Type' },
  { key: 'tons', label: 'Tons' },
  { key: 'origin', label: 'Origin' },
  { key: 'destination', label: 'Destination' },
  {
    key: 'status',
    label: 'Status',
    render: (status: BulkCargoItem['status']) => (
      <Badge variant={STATUS_VARIANT[status] as any} className="capitalize">
        {status}
      </Badge>
    ),
  },
];

const INITIAL_DATA: BulkCargoItem[] = [
  {
    id: 'bulk-001',
    type: 'dry',
    cargoId: 'CARGO-001',
    tons: 1500,
    origin: 'Shanghai',
    destination: 'Los Angeles',
    status: 'transit',
    density: 0.85,
    moisture: 12,
    updatedAt: new Date(),
  },
];

export default function BulkCargoList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const { data: cargoData } = trpc.cargo.bulk.list.useQuery(
    { take: 200 },
    { initialData: INITIAL_DATA }
  );

  const items: BulkCargoItem[] = cargoData ?? INITIAL_DATA;
  const visibleItems = items.filter((item) => {
    const matchesSearch = `${item.cargoId} ${item.origin} ${item.destination}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch && (!statusFilter || item.status === statusFilter);
  });

  const totalTons = visibleItems.reduce((sum, i) => sum + (i.tons ?? 0), 0);
  const inTransit = visibleItems.filter((i) => i.status === 'transit').length;
  const issues = visibleItems.filter((i) => i.status === 'issue').length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Bulk Cargo List</h1>
        <p className="text-sm text-muted-foreground">
          Dry and liquid bulk shipments across all active lanes.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <AIStatistic label="Total Shipments" value={items.length} icon={Package} />
        <AIStatistic label="Total Tons" value={totalTons} icon={Droplets} />
        <AIStatistic label="In Transit" value={inTransit} icon={Truck} />
        <AIStatistic label="Issues" value={issues} icon={Thermometer} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <AISearchBar
          placeholder="Search bulk cargo..."
          onChange={setSearch as any}
        />
      </div>

      <AIDataTable
        data={visibleItems}
        columns={COLUMNS as any}
        enablePagination={false}
      />
    </div>
  );
}