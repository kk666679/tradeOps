import React, { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { AISearchBar, AIDataTable } from '@/components/common';
import { Badge } from '@/components/ui/badge';
import { Package, Truck } from 'lucide-react';

const columns = [
  // Define dry cargo table columns: id, cargoId, tons, moisture, status, origin->destination
  {
    accessorKey: 'cargoId',
    header: 'Cargo ID',
  },
  // ... more columns
];

const DryCargoList = () => {
  const [search, setSearch] = useState('');

  const { data } = trpc.cargo.bulk.list.useQuery({ take: 200 });
  const items = (data ?? []).filter((item: { type?: string; cargoId?: string }) =>
    item.type === 'dry' && (item.cargoId ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <AISearchBar placeholder="Search dry cargo..." onChange={setSearch} />
      <AIDataTable data={items} columns={columns} />
    </div>
  );
};

export default DryCargoList;
