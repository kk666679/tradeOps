'use client';
import * as React from 'react';
import { BomWhereUsedList } from './BomWhereUsedList';
export interface BomWhereUsedProps { hsCode: string; }
export function BomWhereUsed({ hsCode }: BomWhereUsedProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-white p-3 text-sm">Where-used reverse lookup for <span className="font-mono">{hsCode}</span></div>
      <BomWhereUsedList />
    </div>
  );
}
export default BomWhereUsed;
