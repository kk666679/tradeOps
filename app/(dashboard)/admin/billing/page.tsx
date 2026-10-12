import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Billing & Invoicing' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Invoicing" description="Manage billing, invoices, subscriptions, and payment history" />
      <Card>
        <CardHeader><CardTitle>Billing & Invoicing</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Billing components to be implemented.</CardContent>
      </Card>
    </div>
  );
}