import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Tenant Management' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tenant Management" description="Manage tenants, subscriptions, and tenant-level settings" />
      <Card>
        <CardHeader><CardTitle>Tenant Management</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Tenant management components to be implemented.</CardContent>
      </Card>
    </div>
  );
}