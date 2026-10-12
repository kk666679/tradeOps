import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinRunInspector } from '@/components/digital-twin/simulation/TwinRunInspector';

interface PageProps {
  params: Promise<{ runId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { runId } = await params;
  return { title: `Simulation Run ${runId}` };
}

export default async function Page({ params }: PageProps) {
  const { runId } = await params;
  return (
    <div className="space-y-6">
      <PageHeader title={`Simulation Run ${runId}`} description="Run results, metrics, and analysis" />
      <TwinRunInspector />
    </div>
  );
}