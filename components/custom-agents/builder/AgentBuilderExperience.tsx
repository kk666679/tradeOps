'use client';

import { AgentBuilderWizard } from '@/components/custom-agents/builder/AgentBuilderWizard';
import { AgentIdentityForm } from '@/components/custom-agents/builder/AgentIdentityForm';
import { AgentSkillPicker } from '@/components/custom-agents/builder/AgentSkillPicker';
import { AgentToolBinder } from '@/components/custom-agents/builder/AgentToolBinder';
import { AgentKnowledgeBinder } from '@/components/custom-agents/builder/AgentKnowledgeBinder';
import { AgentGuardrailEditor } from '@/components/custom-agents/builder/AgentGuardrailEditor';
import { AgentScheduleEditor } from '@/components/custom-agents/builder/AgentScheduleEditor';
import { AgentEscalationPolicy } from '@/components/custom-agents/builder/AgentEscalationPolicy';
import { AgentTestBench } from '@/components/custom-agents/builder/AgentTestBench';
import { AgentSimulationRun } from '@/components/custom-agents/builder/AgentSimulationRun';
import { AgentPublishPanel } from '@/components/custom-agents/builder/AgentPublishPanel';

const handleSubmit = async (values: Record<string, unknown>) => {
  // console.log('Submit:', values);
};

const handleCancel = () => {
  // console.log('Cancel');
};

export function AgentBuilderExperience() {
  return (
    <>
      <AgentBuilderWizard onSubmit={handleSubmit} onCancel={handleCancel} />
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentIdentityForm onSubmit={handleSubmit} onCancel={handleCancel} />
        <AgentSkillPicker onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentToolBinder onSubmit={handleSubmit} onCancel={handleCancel} />
        <AgentKnowledgeBinder onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentGuardrailEditor onSubmit={handleSubmit} onCancel={handleCancel} />
        <AgentScheduleEditor onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentEscalationPolicy />
        <AgentTestBench />
      </div>
      <AgentSimulationRun />
      <AgentPublishPanel onSubmit={handleSubmit} onCancel={handleCancel} />
    </>
  );
}
