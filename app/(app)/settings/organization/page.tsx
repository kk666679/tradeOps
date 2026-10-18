import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SettingsDetail } from '../SettingsDetail';

export const metadata: Metadata = { title: 'Organization' };

export default function Page() {
  return (
    <>
      <PageHeader title="Organization" description="Review the tenant context associated with the signed-in account." />
      <SettingsDetail kind="organization" />
    </>
  );
}
