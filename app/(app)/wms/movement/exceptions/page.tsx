import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinMovementLayer } from '@/components/digital-twin/zones/TwinMovementLayer';

export const metadata: Metadata = { title: 'Movement Exceptions' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Movement Exceptions" description="Track and resolve movement exceptions" />
      <TwinMovementLayer />
    </div>
  );
}