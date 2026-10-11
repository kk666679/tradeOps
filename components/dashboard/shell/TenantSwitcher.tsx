'use client';
import * as React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface TenantOption { id: string; name: string; }
export function TenantSwitcher({ tenants = [], value, onChange }: { tenants?: TenantOption[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange?.(v)}>
      <SelectTrigger className="w-48"><SelectValue placeholder="Tenant" /></SelectTrigger>
      <SelectContent>{tenants.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
    </Select>
  );
}
export default TenantSwitcher;
