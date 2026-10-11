import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizApprovalWorkflow } from '@/components/fiz-fcz/fiz/FizApprovalWorkflow';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Approval ${id}` };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <PageHeader title={`Approval ${id}`} description="Approval workflow details and status" />
      <FizApprovalWorkflow />
    </div>
  );
}