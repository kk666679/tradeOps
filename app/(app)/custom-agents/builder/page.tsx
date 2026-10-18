import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentBuilderExperience } from '@/components/custom-agents/builder/AgentBuilderExperience';

export const metadata: Metadata = { title: 'Agent Builder' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agent Builder" description="Wizard, identity, skills, tools, knowledge, guardrails, schedule, escalation, test, simulation, and publish" />
      <AgentBuilderExperience />
    </div>
  );
}