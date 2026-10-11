'use client';
import * as React from 'react';
export interface BomFiltersProps {
  value?: string;
  zone?: 'FIZ' | 'FCZ' | 'ALL';
  status?: 'ALL' | 'DRAFT' | 'APPROVED' | 'ARCHIVED';
  onChange?: (v: string) => void;
  onZoneChange?: (z: 'FIZ' | 'FCZ' | 'ALL') => void;
  onStatusChange?: (s: 'ALL' | 'DRAFT' | 'APPROVED' | 'ARCHIVED') => void;
}
export function BomFilters({ value = '', zone = 'ALL', status = 'ALL', onChange, onZoneChange, onStatusChange }: BomFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2">
      <input className="max-w-xs rounded-md border px-3 py-1.5 text-sm" placeholder="Search ref / HS / component…" value={value} onChange={(e) => onChange?.(e.target.value)} />
      <select className="rounded-md border px-3 py-1.5 text-sm" value={zone} onChange={(e) => onZoneChange?.(e.target.value as 'FIZ' | 'FCZ' | 'ALL')}>
        <option value="ALL">All zones</option><option value="FIZ">FIZ</option><option value="FCZ">FCZ</option>
      </select>
      <select className="rounded-md border px-3 py-1.5 text-sm" value={status} onChange={(e) => onStatusChange?.(e.target.value as 'ALL' | 'DRAFT' | 'APPROVED' | 'ARCHIVED')}>
        <option value="ALL">All statuses</option><option value="DRAFT">Draft</option><option value="APPROVED">Approved</option><option value="ARCHIVED">Archived</option>
      </select>
    </div>
  );
}
export default BomFilters;
