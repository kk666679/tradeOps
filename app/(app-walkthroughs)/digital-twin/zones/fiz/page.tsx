import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinFizLayer } from '@/components/workflow-studio/digital-twin/zones/TwinFizLayer';

export const metadata: Metadata = { title: 'FIZ Zone' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="FIZ Zone" description="Free Industrial Zone digital twin layer" />
      <TwinFizLayer />
    </div>
  );
}