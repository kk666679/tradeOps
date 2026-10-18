import type { Metadata } from 'next';
import { AdminUnavailable } from '../../_components/other-admin';

export const metadata: Metadata = { title: 'Zone Details' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminUnavailable
      title="Zone Details"
      description={`Zone ${id}`}
      source="The AppRouter has no matching zone.byId procedure; no zone details or editable fields are available."
    />
  );
}
