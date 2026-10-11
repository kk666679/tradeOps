'use client';

import { useState } from "react";
import { AIDataTable } from "@/components/common/aidata-table";
import { AISearchBar } from "@/components/common/aisearch-bar";
import { AIStatusIndicator } from "@/components/common/aistatus-indicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreHorizontal } from "lucide-react";
import { trpc } from "@/lib/trpc";

type CargoRow = {
  id: string;
  type: string;
  status: string;
  origin: string;
  destination: string;
  weight: number;
  value: number;
  eta: string;
};

const columns = [
  {
    key: "id",
    label: "Cargo ID",
    render: (v: string) => (
      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">#{v}</span>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (v: string) => (
      <Badge variant={v === "Container" ? "default" : "secondary"}>{v}</Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (v: string) => (
      <AIStatusIndicator status={v as any} label={v} size="sm" />
    ),
  },
  {
    key: "origin",
    label: "Origin",
    render: (v: string) => (
      <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{v}</div>
    ),
  },
  {
    key: "weight",
    label: "Weight",
    render: (v: number) => `${v} tons`,
  },
  {
    key: "value",
    label: "Value",
    render: (v: number) => (
      <span className="font-mono">${v?.toLocaleString()}</span>
    ),
  },
  {
    key: "eta",
    label: "ETA",
    render: (v: string) => new Date(v).toLocaleDateString(),
  },
];

const initialData: CargoRow[] = [
  { id: "CARGO001", type: "Container", status: "online", origin: "Shanghai", destination: "Los Angeles", weight: 25.4, value: 125000, eta: "2024-12-15" },
  { id: "CARGO002", type: "Bulk", status: "warning", origin: "Rotterdam", destination: "New York", weight: 45.2, value: 89000, eta: "2024-12-14" },
  { id: "CARGO003", type: "Container", status: "success", origin: "Singapore", destination: "Long Beach", weight: 32.1, value: 210000, eta: "2024-12-13" },
  { id: "CARGO004", type: "Refrigerated", status: "idle", origin: "Tokyo", destination: "Seattle", weight: 18.7, value: 145000, eta: "2024-12-16" },
];

export default function CargoList() {
  const [search, setSearch] = useState("");

  const filtered = initialData.filter(
    (row) =>
      !search ||
      row.id.toLowerCase().includes(search.toLowerCase()) ||
      row.origin.toLowerCase().includes(search.toLowerCase()) ||
      row.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold">Cargo Inventory</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <AISearchBar
            placeholder="Search cargo by ID, origin…"
            onSearch={setSearch}
          />
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <AIDataTable
        data={filtered}
        columns={columns}
        striped
        hoverable
        className="shadow-lg"
      />
    </div>
  );
}
