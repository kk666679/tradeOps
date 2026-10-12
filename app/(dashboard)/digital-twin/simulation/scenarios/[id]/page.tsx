import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinScenarioBuilder } from '@/components/digital-twin/simulation/TwinScenarioBuilder';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Scenario ${id}` };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <PageHeader title={`Scenario ${id}`} description="Scenario configuration and parameters" />
      <TwinScenarioBuilder />
    </div>
  );
}