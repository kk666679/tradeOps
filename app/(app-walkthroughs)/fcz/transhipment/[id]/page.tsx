import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczDetail } from '../../_components/FczRouteViews';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Transhipment ${id}` };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <PageHeader title={`Transhipment ${id}`} description="Transhipment details and tracking" />
      <FczDetail kind="transhipment" id={id} />
    </div>
  );
}