'use client';
import * as React from 'react';
import { BomVolumeChart } from './BomVolumeChart';
export function BomAnalytics() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 text-sm font-medium">BOM volume · 12 months</div>
        <BomVolumeChart />
      </div>
    </div>
  );
}
export default BomAnalytics;
