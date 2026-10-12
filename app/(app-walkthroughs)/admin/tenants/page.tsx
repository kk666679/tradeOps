import type { Metadata } from 'next';
import { TenantList } from '../_components/tenants';

export const metadata: Metadata = { title: 'Tenant Management' };

export default function Page() {
  return <TenantList />;
}
