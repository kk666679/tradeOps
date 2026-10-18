import type { Metadata } from 'next';
import { TenantCreateForm } from '../../_components/tenants';

export const metadata: Metadata = { title: 'Add Tenant' };

export default function Page() {
  return <TenantCreateForm />;
}
