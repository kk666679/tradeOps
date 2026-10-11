'use client';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';

export interface WmsZoneContextBarProps { zoneId?: string; zoneType?: 'FIZ' | 'FCZ' | 'BONDED' | 'FTZ'; name?: string; }
export function WmsZoneContextBar({ zoneId, zoneType = 'FIZ', name }: WmsZoneContextBarProps) {
  return (
    <div className="flex items-center justify-between rounded border bg-muted/30 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <Badge variant={zoneType === 'FIZ' ? 'default' : 'secondary'}>{zoneType}</Badge>
        <span className="font-medium">{name ?? zoneId ?? 'Zone not selected'}</span>
      </div>
      <div className="text-xs text-muted-foreground">Duty suspension: {zoneType === 'FIZ' ? 'Active' : 'N/A'}</div>
    </div>
  );
}
export default WmsZoneContextBar;
