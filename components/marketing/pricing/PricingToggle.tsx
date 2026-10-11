'use client';
import * as React from 'react';

export interface PricingToggleProps { annual: boolean; onChange: (annual: boolean) => void }

export function PricingToggle({ annual, onChange }: PricingToggleProps) {
  return (
    <div className="inline-flex rounded-md border p-1 text-xs">
      <button onClick={() => onChange(false)} className={'rounded px-3 py-1 ' + (!annual ? 'bg-white shadow-sm font-medium' : 'text-slate-500')}>Monthly</button>
      <button onClick={() => onChange(true)} className={'rounded px-3 py-1 ' + (annual ? 'bg-white shadow-sm font-medium' : 'text-slate-500')}>Annual · save 17%</button>
    </div>
  );
}
export default PricingToggle;
