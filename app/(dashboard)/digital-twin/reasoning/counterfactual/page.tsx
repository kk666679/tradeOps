import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinCounterfactualView } from '@/components/digital-twin/reasoning/TwinCounterfactualView';

export const metadata: Metadata = { title: 'Counterfactual Analysis' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Counterfactual Analysis" description="What-if scenario comparison and alternative outcomes" />
      <TwinCounterfactualView />
    </div>
  );
}