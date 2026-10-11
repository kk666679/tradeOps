'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoneSwitcher } from '@/components/dashboard/shell/ZoneSwitcher';

export interface LiquidCargoDashboardProps { zone?: 'FIZ' | 'FCZ' | 'ALL'; className?: string; }
export function LiquidCargoDashboard({ zone = 'ALL', className }: LiquidCargoDashboardProps) {
  return (
    <section className={className}>
      <header className="My4 flex ItemsCenter JustifyBetween">
        <h1 className="text-xl FontSemibold">Liquid Cargo Dashboard</h1>
        <ZoneSwitcher value={zone} />
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle>Open</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">0</CardContent></Card>
        <Card><CardHeader><CardTitle>In Transit</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">0</CardContent></Card>
        <Card><CardHeader><CardTitle>Held</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">0</CardContent></Card>
        <Card><CardHeader><CardTitle>Exceptions</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">None</CardContent></Card>
      </div>
    </section>
  );
}
export default LiquidCargoDashboard;
