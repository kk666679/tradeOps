'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WmsZoneContextBar } from '@/components/wms/core/WmsZoneContextBar';

export interface LogisticsDistributionDashboardProps { zoneId?: string; className?: string; }
export function LogisticsDistributionDashboard({ zoneId, className }: LogisticsDistributionDashboardProps) {
  return (
    <section className={className}>
      <WmsZoneContextBar zoneId={zoneId} />
      <header className="my-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Logistics Distribution Dashboard</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle>Inbound</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">0 today</CardContent></Card>
        <Card><CardHeader><CardTitle>Outbound</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">0 today</CardContent></Card>
        <Card><CardHeader><CardTitle>Bonded Stock</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">0 SKUs</CardContent></Card>
        <Card><CardHeader><CardTitle>Exceptions</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">None</CardContent></Card>
      </div>
    </section>
  );
}
export default LogisticsDistributionDashboard;
