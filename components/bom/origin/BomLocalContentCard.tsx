'use client';
import * as React from 'react';
export interface BomLocalContentCardProps { pct: number; scheme: string; }
export function BomLocalContentCard({ pct, scheme }: BomLocalContentCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-xs uppercase text-slate-500">Local content · {scheme}</div>
      <div className="mt-1 text-3xl font-semibold">{pct}%</div>
    </div>
  );
}
export default BomLocalContentCard;
