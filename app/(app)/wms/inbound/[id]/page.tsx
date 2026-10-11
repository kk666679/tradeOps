import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InboundReceiptDetail } from '@/components/wms/inbound/InboundReceiptDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Inbound Receipt ${id}` };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <PageHeader title={`Inbound Receipt ${id}`} description="Receipt details, customs linkage, and activity log" />
      <InboundReceiptDetail id={id} />
    </div>
  );
}