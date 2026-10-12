import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Audit Log' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" description="System audit trail, compliance logs, and security events" />
      <Card>
        <CardHeader><CardTitle>Audit Log</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Audit log components to be implemented.</CardContent>
      </Card>
    </div>
  );
}