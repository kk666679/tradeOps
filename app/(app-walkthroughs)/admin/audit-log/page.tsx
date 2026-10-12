import type { Metadata } from 'next';
import { AuditLogView } from '../_components/other-admin';

export const metadata: Metadata = { title: 'Audit Log' };

export default function Page() {
  return <AuditLogView />;
}
