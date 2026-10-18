import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';

export const metadata: Metadata = { title: 'Auth Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Auth Integration" description="OAuth clients, API keys, and secrets management" />
      <p className="text-muted-foreground">Auth integration components to be added.</p>
    </div>
  );
}