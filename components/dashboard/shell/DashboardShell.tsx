'use client';
import * as React from 'react';
import { MarketingNavbar } from '@/components/marketing/layout/MarketingNavbar';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingNavbar />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isCollapsed={isSidebarCollapsed} />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed((v) => !v)} />
          <main className="min-w-0 flex-1 overflow-x-hidden p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
export default DashboardShell;
