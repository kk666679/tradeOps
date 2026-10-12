import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinGraph } from '@/components/digital-twin/graph/TwinGraph';
import { TwinZoomControls } from '@/components/digital-twin/graph/TwinZoomControls';
import { TwinMiniMap } from '@/components/digital-twin/graph/TwinMiniMap';
import { TwinLayoutSelector } from '@/components/digital-twin/graph/TwinLayoutSelector';
import { TwinLegend } from '@/components/digital-twin/graph/TwinLegend';

export const metadata: Metadata = { title: 'Supply Chain Graph' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Supply Chain Graph" description="Interactive supply chain topology and flow visualization" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <TwinLayoutSelector />
          <TwinZoomControls />
        </div>
        <TwinMiniMap />
      </div>
      <TwinGraph />
      <TwinLegend />
    </div>
  );
}