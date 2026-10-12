import type { Metadata } from 'next'
import { WorkflowDirectory } from '@/components/workflow-studio/workflow-directory'

export const metadata: Metadata = { title: 'Workflow Studio' }

export default function Page() {
  return <WorkflowDirectory />
}
