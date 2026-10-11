import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Rule Packs' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Rule Packs" description="Manage compliance rule packs, versions, and deployments" />
      <Card>
        <CardHeader><CardTitle>Rule Pack Management</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Rule pack management components to be implemented.</CardContent>
      </Card>
    </div>
  );
}