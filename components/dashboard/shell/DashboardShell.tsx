'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileViewport, setIsMobileViewport] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setIsMobileMenuOpen(false), [pathname]);
  React.useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobileViewport(media.matches);
    updateViewport();
    media.addEventListener('change', updateViewport);
    return () => media.removeEventListener('change', updateViewport);
  }, []);
  React.useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  const toggleSidebar = () => {
    if (isMobileViewport) {
      setIsMobileMenuOpen((open) => !open);
      return;
    }
    setIsSidebarCollapsed((collapsed) => !collapsed);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex min-h-0 flex-1">
        {isMobileMenuOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
        )}
        <DashboardSidebar isCollapsed={isSidebarCollapsed} isMobileOpen={isMobileMenuOpen} />
        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <DashboardHeader
            isSidebarCollapsed={isSidebarCollapsed}
            isMobileMenuOpen={isMobileMenuOpen}
            isMobileViewport={isMobileViewport}
            onToggleSidebar={toggleSidebar}
          />
          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-5 lg:p-6 max-w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default DashboardShell;
