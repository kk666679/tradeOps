import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizOperatorRegistry } from '@/components/fiz-fcz/fiz/FizOperatorRegistry';

export const metadata: Metadata = { title: 'New Operator' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Operator Registration" description="Register new FIZ operator" />
      <FizOperatorRegistry />
    </div>
  );
}