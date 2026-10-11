'use client';
import * as React from 'react';
export interface BomDutyImpactCardProps { dutySuspended: number; dutyPaid: number; scheme?: string; currency?: string; }
export function BomDutyImpactCard({ dutySuspended, dutyPaid, scheme = 'FIZ', currency = 'MYR' }: BomDutyImpactCardProps) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
      <div className="text-xs uppercase text-emerald-800">Duty impact · {scheme}</div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div><span className="text-emerald-700">Suspended</span><div className="font-mono font-semibold text-emerald-900">{currency} {dutySuspended.toLocaleString()}</div></div>
        <div><span className="text-emerald-700">Paid</span><div className="font-mono font-semibold text-emerald-900">{currency} {dutyPaid.toLocaleString()}</div></div>
      </div>
    </div>
  );
}
export default BomDutyImpactCard;
