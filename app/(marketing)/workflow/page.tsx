import { WorkflowStudioDesktop } from '@/components/marketing/workflow/WorkflowStudioDesktop';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TwinForge & BrokerDesk Studio',
  description:
    'Unified orchestration for FIZ, FCZ & customs workflows. TwinForge Studio with BrokerDesk v4 — compose, connect, simulate, and govern your digital twin workflow graph with immutable audit trails.',
};

export default function WorkflowPage() {
  return <WorkflowStudioDesktop />;
}
