import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SettingsDetail } from '../SettingsDetail';

export const metadata: Metadata = { title: 'API keys' };

export default function Page() {
  return (
    <>
      <PageHeader title="API keys" description="API credential management for this organization." />
      <SettingsDetail kind="api-keys" />
    </>
  );
}
