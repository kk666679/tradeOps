import { WorkflowStudio } from '@/components/workflow-studio/WorkflowStudio';

export const metadata = {
  title: 'Workflow studio — Brokerage',
};

export const dynamic = 'force-dynamic';

export default function WorkflowStudioPage() {
  return <WorkflowStudio />;
}
