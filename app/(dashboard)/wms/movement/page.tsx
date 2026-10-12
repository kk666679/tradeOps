import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinMovementLayer } from '@/components/digital-twin/zones/TwinMovementLayer';

export const metadata: Metadata = { title: 'Movement Tracking' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Movement Tracking" description="Inter-zone movements, exceptions, and real-time tracking" />
      <TwinMovementLayer />
    </div>
  );
}