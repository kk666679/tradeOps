'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface CargoFiltersProps { value?: string; zone?: 'FIZ' | 'FCZ' | 'ALL'; onChange?: (v: string) => void; onZoneChange?: (z: 'FIZ' | 'FCZ' | 'ALL') => void; onApply?: () => void; }
export function CargoFilters({ value = '', zone = 'ALL', onChange, onZoneChange, onApply }: CargoFiltersProps) {
  return (
    <div className="flex flex-wrap ItemsCenter gap-2 p-2">
      <Input className="max-w-xs" placeholder="Search ref / HS / tenant…" value={value} onChange={(e) => onChange?.(e.target.value)} />
      <Select value={zone} onValueChange={(v) => onZoneChange?.(v as any)}>
        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Zones</SelectItem>
          <SelectItem value="FIZ">FIZ</SelectItem>
          <SelectItem value="FCZ">FCZ</SelectItem>
        </SelectContent>
      </Select>
      <Button size="sm" variant="outline" onClick={onApply}>Apply</Button>
    </div>
  );
}
export default CargoFilters;
