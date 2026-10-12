import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'User Management' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage system users, roles, and permissions" />
      <Card>
        <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">User management components to be implemented.</CardContent>
      </Card>
    </div>
  );
}