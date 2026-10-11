'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface HazmatComplianceCardProps { unClass?: string; packingGroup?: string; segregation?: 'ok' | 'warn' | 'violation'; }
export function HazmatComplianceCard({ unClass, packingGroup, segregation = 'ok' }: HazmatComplianceCardProps) {
  const variant = segregation === 'violation' ? 'destructive' : segregation === 'warn' ? 'secondary' : 'default';
  return (
    <Card>
      <CardHeader className="flex flex-row ItemsCenter JustifyBetween"><CardTitle>Hazmat Compliance</CardTitle><Badge variant={variant}>{segregation}</Badge></CardHeader>
      <CardContent className="SpaceY1 text-xs">
        <div className="flex JustifyBetween"><span className="text-muted-foreground">UN class</span><span>{unClass ?? '—'}</span></div>
        <div className="flex JustifyBetween"><span className="text-muted-foreground">Packing group</span><span>{packingGroup ?? '—'}</span></div>
      </CardContent>
    </Card>
  );
}
export default HazmatComplianceCard;
