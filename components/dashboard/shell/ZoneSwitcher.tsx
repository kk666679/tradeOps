'use client';
import * as React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface ZoneSwitcherProps { value?: 'ALL' | 'FIZ' | 'FCZ'; onChange?: (v: 'ALL' | 'FIZ' | 'FCZ') => void; }
export function ZoneSwitcher({ value = 'ALL', onChange }: ZoneSwitcherProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange?.(v as any)}>
      <SelectTrigger className="w-36"><SelectValue placeholder="Zone" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All zones</SelectItem>
        <SelectItem value="FIZ">FIZ</SelectItem>
        <SelectItem value="FCZ">FCZ</SelectItem>
      </SelectContent>
    </Select>
  );
}
export default ZoneSwitcher;
