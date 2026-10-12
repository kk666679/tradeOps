import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinReasoning } from '@/components/digital-twin/reasoning/TwinReasoning';
import { TwinDecisionTrace } from '@/components/digital-twin/reasoning/TwinDecisionTrace';
import { TwinExplainabilityPanel } from '@/components/digital-twin/reasoning/TwinExplainabilityPanel';
import { TwinCounterfactualView } from '@/components/digital-twin/reasoning/TwinCounterfactualView';

export const metadata: Metadata = { title: 'AI Reasoning' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Reasoning" description="Decision traces, explainability, and counterfactual analysis" />
      <TwinReasoning />
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinDecisionTrace />
        <TwinExplainabilityPanel />
      </div>
      <TwinCounterfactualView />
    </div>
  );
}