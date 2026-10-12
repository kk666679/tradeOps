import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SettingsDetail } from '../SettingsDetail';

export const metadata: Metadata = { title: 'Security' };

export default function Page() {
  return (
    <>
      <PageHeader title="Security" description="Authentication and account protection controls." />
      <SettingsDetail kind="security" />
    </>
  );
}
