'use client';
import * as React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'OPS_MANAGER', 'WAREHOUSE_STAFF', 'CUSTOMER'] as const;
export type Role = typeof ROLES[number];
export function RoleSwitcher({ value = 'ADMIN', onChange }: { value?: Role; onChange?: (v: Role) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange?.(v as Role)}>
      <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
      <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
    </Select>
  );
}
export default RoleSwitcher;
