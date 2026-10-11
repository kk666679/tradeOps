'use client';
import * as React from 'react';
export interface BomUploadProps { onUpload?: (file: File) => void | Promise<void>; }
export function BomUpload({ onUpload }: BomUploadProps) {
  const [drag, setDrag] = React.useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) void onUpload?.(f); }}
      className={'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center ' + (drag ? 'border-sky-400 bg-sky-50' : 'border-slate-300')}
    >
      <div className="text-sm font-medium">Drop CSV or Excel</div>
      <div className="text-xs text-slate-500">Columns: hs_code, description, qty_per, uom, origin, duty_rate</div>
      <input type="file" accept=".csv,.xlsx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onUpload?.(f); }} />
    </label>
  );
}
export default BomUpload;
