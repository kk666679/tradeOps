import type { Metadata } from 'next'
import { WorkflowStudioEntry } from '@/components/workflow-studio/workflow-studio'

export const metadata: Metadata = { title: 'Workflow Studio · Canvas' }

export default function Page() {
  return <WorkflowStudioEntry />
}
