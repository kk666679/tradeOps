import type { Metadata } from 'next';
import { AdminUnavailable } from '../_components/other-admin';

export const metadata: Metadata = { title: 'Zone Administration' };

export default function Page() {
  return (
    <AdminUnavailable
      title="Zone Administration"
      description="Zone records and boundaries cannot be read or edited here."
      source="A Zone model exists in the data schema, but the AppRouter has no matching zone list or CRUD procedure."
    />
  );
}
