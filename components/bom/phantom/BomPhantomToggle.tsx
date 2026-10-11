'use client';
import * as React from 'react';
export interface BomPhantomToggleProps { value: boolean; onChange: (v: boolean) => void; label?: string; }
export function BomPhantomToggle({ value, onChange, label = 'Phantom' }: BomPhantomToggleProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="accent-sky-500" />
      {label}
    </label>
  );
}
export default BomPhantomToggle;
