'use client';
import * as React from 'react';
export interface BomViewerComponent { id: string; hs: string; description: string; qtyPer: number; uom: string; dutyRate?: number; }
export interface BomViewerProps { components?: BomViewerComponent[]; }
export function BomViewer({ components = [] }: BomViewerProps) {
  return (
    <div className="rounded border">
      <div className="border-b bg-muted/40 p-2 text-xs font-medium uppercase">Bill of Materials</div>
      <table className="w-full text-xs">
        <tbody>
          {components.map((c) => (
            <tr key={c.id} className="border-b last:border-0">
              <td className="p-2 font-mono">{c.hs}</td>
              <td className="p-2">{c.description}</td>
              <td className="p-2 text-right">{c.qtyPer} {c.uom}</td>
              <td className="p-2 text-right">{c.dutyRate != null ? (c.dutyRate * 100).toFixed(1) + '%' : '—'}</td>
            </tr>
          ))}
          {components.length === 0 ? <tr><td className="p-4 text-center text-muted-foreground">No components</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}
export default BomViewer;
