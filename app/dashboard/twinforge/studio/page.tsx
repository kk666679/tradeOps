import { TwinForgeWorkflowStudio } from '@/components/workflow-studio/digital-twin/twinforge/studio/TwinForgeWorkflowStudio';

export const metadata = { title: 'Workflow studio' };
export const dynamic = 'force-dynamic';

export default function TwinForgeWorkflowStudioPage() {
  return <TwinForgeWorkflowStudio />;
}