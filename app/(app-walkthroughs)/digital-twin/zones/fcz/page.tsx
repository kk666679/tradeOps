import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinFczLayer } from '@/components/digital-twin/zones/TwinFczLayer';

export const metadata: Metadata = { title: 'FCZ Zone' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="FCZ Zone" description="Free Commercial Zone digital twin layer" />
      <TwinFczLayer />
    </div>
  );
}