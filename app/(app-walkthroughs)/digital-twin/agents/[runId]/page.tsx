import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TwinAgentHandoffView } from '@/components/workflow-studio/digital-twin/agents/TwinAgentHandoffView';
import { TwinAgentInspector } from '@/components/workflow-studio/digital-twin/agents/TwinAgentInspector';
import { TwinAgentRunTimeline } from '@/components/workflow-studio/digital-twin/agents/TwinAgentRunTimeline';

interface PageProps {
  params: Promise<{ runId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { runId } = await params;
  return { title: `Agent Run ${runId}` };
}

export default async function Page({ params }: PageProps) {
  const { runId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title={`Agent Run ${runId}`} description="Execution details and handoff history for this digital-twin agent run" />
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinAgentInspector
          title="Run details"
          value={runId}
          hint="Run-specific metrics will appear when execution data is available."
        />
        <TwinAgentHandoffView
          title="Agent handoffs"
          value="—"
          hint="No handoff data is available for this run."
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run activity</CardTitle>
        </CardHeader>
        <CardContent>
          <TwinAgentRunTimeline />
        </CardContent>
      </Card>
    </div>
  );
}
