import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczTradingHouseRegistry } from '@/components/fiz-fcz/fcz/FczTradingHouseRegistry';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Trading House ${id}` };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <PageHeader title={`Trading House ${id}`} description="Trading house details and compliance" />
      <FczTradingHouseRegistry />
    </div>
  );
}