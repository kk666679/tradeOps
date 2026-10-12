import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SettingsDetail } from '../SettingsDetail';

export const metadata: Metadata = { title: 'Notifications' };

export default function Page() {
  return (
    <>
      <PageHeader title="Notifications" description="Notification delivery preferences for this account." />
      <SettingsDetail kind="notifications" />
    </>
  );
}
