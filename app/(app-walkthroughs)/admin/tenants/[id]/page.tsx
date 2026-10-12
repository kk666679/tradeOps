import type { Metadata } from 'next';
import { TenantEditor } from '../../_components/tenants';

export const metadata: Metadata = { title: 'Manage Tenant' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TenantEditor id={id} />;
}
