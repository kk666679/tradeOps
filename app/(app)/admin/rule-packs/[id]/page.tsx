import type { Metadata } from 'next';
import { AdminUnavailable } from '../../_components/other-admin';

export const metadata: Metadata = { title: 'Rule Pack Details' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminUnavailable
      title="Rule Pack Details"
      description={`Rule pack ${id}`}
      source="The AppRouter does not expose a matching rulePack.byId procedure; no detail data or editable fields are available."
    />
  );
}
