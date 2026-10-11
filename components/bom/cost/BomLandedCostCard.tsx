'use client';
import * as React from 'react';
export interface BomLandedCostCardProps { exWorks: number; freight: number; insurance: number; duty: number; tax: number; currency?: string; }
export function BomLandedCostCard({ exWorks, freight, insurance, duty, tax, currency = 'MYR' }: BomLandedCostCardProps) {
  const landed = exWorks + freight + insurance + duty + tax;
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-xs uppercase text-slate-500">Landed cost</div>
      <div className="mt-1 text-2xl font-semibold">{currency + ' ' + landed.toLocaleString()}</div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div><span className="text-slate-500">Ex-works</span><div className="font-mono">{exWorks.toLocaleString()}</div></div>
        <div><span className="text-slate-500">Freight</span><div className="font-mono">{freight.toLocaleString()}</div></div>
        <div><span className="text-slate-500">Insurance</span><div className="font-mono">{insurance.toLocaleString()}</div></div>
        <div><span className="text-slate-500">Duty</span><div className="font-mono">{duty.toLocaleString()}</div></div>
        <div><span className="text-slate-500">Tax</span><div className="font-mono">{tax.toLocaleString()}</div></div>
      </div>
    </div>
  );
}
export default BomLandedCostCard;
