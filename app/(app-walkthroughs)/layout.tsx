import * as React from 'react';
import { DashboardShell } from '@/components/dashboard/shell/DashboardShell';
import { SocketProvider } from '@/providers/SocketProvider';

/**
 * AppLayout wraps all authenticated app routes with:
 * - SocketProvider: Real-time WebSocket connectivity
 * - DashboardShell: Responsive sidebar and authenticated application command bar
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <DashboardShell>{children}</DashboardShell>
    </SocketProvider>
  );
}
