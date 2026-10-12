import AgentBuilderWizard, {
  type AgentBuilderWizardValues,
} from '@/components/custom-agents/builder/AgentBuilderWizard';

export default function NewAgentBuilderPage() {
  const handleSubmit = async (values: AgentBuilderWizardValues) => {
    // TODO: persist / navigate / call API
    console.log('submitted', values);
  };

  return <AgentBuilderWizard onSubmit={handleSubmit} />;
}