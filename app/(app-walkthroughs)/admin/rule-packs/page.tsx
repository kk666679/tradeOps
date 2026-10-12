import type { Metadata } from 'next';
import { AdminUnavailable } from '../_components/other-admin';

export const metadata: Metadata = { title: 'Rule Packs' };

export default function Page() {
  return (
    <AdminUnavailable
      title="Rule Packs"
      description="Rule pack records and deployments are not available from this page."
      source="The Prisma schema contains rule-pack entities, but the AppRouter has no rulePack list or CRUD procedure."
    />
  );
}
