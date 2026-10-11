'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface FczDutyStatusCardProps { zone?: 'FIZ' | 'FCZ'; suspended?: boolean; scheme?: string; }
export function FczDutyStatusCard({ zone = 'FIZ', suspended = true, scheme }: FczDutyStatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row ItemsCenter JustifyBetween">
        <CardTitle>Duty Status</CardTitle>
        <Badge variant={zone === 'FIZ' ? 'default' : 'secondary'}>{zone}</Badge>
      </CardHeader>
      <CardContent className="SpaceY1 text-sm">
        <div className="flex JustifyBetween"><span className="text-muted-foreground">Suspension</span><span>{suspended ? 'Active' : 'Not applicable'}</span></div>
        {scheme ? <div className="flex JustifyBetween"><span className="text-muted-foreground">Scheme</span><span>{scheme}</span></div> : null}
      </CardContent>
    </Card>
  );
}
export default FczDutyStatusCard;
