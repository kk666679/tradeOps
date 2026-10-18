import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SettingsDetail } from '../SettingsDetail';

export const metadata: Metadata = { title: 'Profile' };

export default function Page() {
  return (
    <>
      <PageHeader title="Profile" description="View the account identity currently returned by the authentication API." />
      <SettingsDetail kind="profile" />
    </>
  );
}
