import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';

export const metadata: Metadata = { title: 'Webhook Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Webhook Integration" description="Webhook subscriptions and delivery management" />
      <p className="text-muted-foreground">Webhook integration components to be added.</p>
    </div>
  );
}