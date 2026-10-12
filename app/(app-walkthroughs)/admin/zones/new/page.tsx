import type { Metadata } from 'next';
import { AdminUnavailable } from '../../_components/other-admin';

export const metadata: Metadata = { title: 'Add Zone' };

export default function Page() {
  return (
    <AdminUnavailable
      title="Add Zone"
      description="Zone creation is unavailable until a matching backend procedure is exposed."
      source="The AppRouter has no zone.create procedure; no form is shown to avoid presenting a nonfunctional action."
    />
  );
}
