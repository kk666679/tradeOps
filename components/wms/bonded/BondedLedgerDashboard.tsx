'use client';
import * as React from 'react';
export interface BondedLedgerDashboardEntry { id: string; at: string; ref: string; debit: number; credit: number; balance: number; }
export interface BondedLedgerDashboardProps { entries?: BondedLedgerDashboardEntry[]; }
export function BondedLedgerDashboard({ entries = [] }: BondedLedgerDashboardProps) {
  return (
    <table className="w-full text-xs">
      <thead className="bg-muted/40 uppercase"><tr><th className="p-2 text-left">At</th><th className="p-2 text-left">Ref</th><th className="p-2 text-right">Debit</th><th className="p-2 text-right">Credit</th><th className="p-2 text-right">Balance</th></tr></thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.id} className="border-b last:border-0">
            <td className="p-2">{e.at}</td><td className="p-2 font-mono">{e.ref}</td>
            <td className="p-2 text-right">{e.debit.toFixed(2)}</td>
            <td className="p-2 text-right">{e.credit.toFixed(2)}</td>
            <td className="p-2 text-right font-semibold">{e.balance.toFixed(2)}</td>
          </tr>
        ))}
        {entries.length === 0 ? <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No movements</td></tr> : null}
      </tbody>
    </table>
  );
}
export default BondedLedgerDashboard;
