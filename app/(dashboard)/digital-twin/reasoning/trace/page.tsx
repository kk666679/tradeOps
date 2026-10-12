import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinDecisionTrace } from '@/components/digital-twin/reasoning/TwinDecisionTrace';

export const metadata: Metadata = { title: 'Decision Trace' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Decision Trace" description="AI decision audit trail and reasoning steps" />
      <TwinDecisionTrace />
    </div>
  );
}