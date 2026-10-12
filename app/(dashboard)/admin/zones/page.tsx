import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Zone Administration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Zone Administration" description="Configure warehouse zones, boundaries, and zone-specific rules" />
      <Card>
        <CardHeader><CardTitle>Zone Administration</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Zone administration components to be implemented.</CardContent>
      </Card>
    </div>
  );
}