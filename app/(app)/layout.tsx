import * as React from 'react';
import { DashboardShell } from '@/components/dashboard/shell/DashboardShell';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { SocketProvider } from '@/providers/SocketProvider';

/**
 * AppLayout wraps all authenticated app routes with:
 * - SocketProvider: Real-time WebSocket connectivity
 * - DashboardShell: Integrated navigation (MarketingNavbar → DashboardSidebar → DashboardHeader)
 * - CommandPalette: Global command palette with Cmd/Ctrl+K keyboard shortcut
 * 
 * Navigation hierarchy:
 * 1. MarketingNavbar: Primary top-level navigation (Product, Solutions, Customers, Pricing, Docs, Security)
 * 2. DashboardSidebar: Secondary left navigation (Operations, Zones, Intelligence, Integrations)
 * 3. DashboardHeader: Tertiary header with context controls (Zone switcher, Role switcher)
 * 4. CommandPalette: Global overlay accessible via Cmd/Ctrl+K
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <DashboardShell>{children}</DashboardShell>
      <CommandPalette />
    </SocketProvider>
  );
}
