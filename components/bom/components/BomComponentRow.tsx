'use client';
import * as React from 'react';
export interface BomComponentRowProps { hsCode: string; description: string; qtyPer: number; uom: string; onEdit?: () => void; onRemove?: () => void; }
export function BomComponentRow({ hsCode, description, qtyPer, uom, onEdit, onRemove }: BomComponentRowProps) {
  return (
    <div className="flex items-center gap-3 rounded border bg-white p-2 text-sm">
      <span className="font-mono text-xs text-slate-500">{hsCode}</span>
      <span className="flex-1 truncate">{description}</span>
      <span className="font-mono text-xs">{qtyPer} {uom}</span>
      <button onClick={onEdit} className="rounded border px-2 py-0.5 text-xs">Edit</button>
      <button onClick={onRemove} className="rounded border px-2 py-0.5 text-xs text-red-600">Remove</button>
    </div>
  );
}
export default BomComponentRow;
