'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { ZoneSwitcher } from './ZoneSwitcher';
import { RoleSwitcher } from './RoleSwitcher';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Workflow context labels: maps routes to workflow metadata
 * Used by DashboardHeader to show contextual information about
 * bonded operations and other special workflow states
 */
const WORKFLOW_LABELS: Record<string, { label: string; status: 'live' | 'pending' | 'closed' }> = {
  '/bonded-workflow': { label: 'Bonded Workflow', status: 'live' },
  '/bonded': { label: 'Bonded Zone', status: 'live' },
};

/**
 * Section titles: maps primary routes to display names
 * Complements MarketingNavbar by providing page-level context
 */
const SECTION_TITLES: Record<string, string> = {
  '/trade-ops': 'Trade Operations',
  '/wms': 'Warehouse Management',
  '/fcz': 'Free Commercial Zone',
  '/fiz': 'Free Industrial Zone',
  '/order-management': 'Order Management',
  '/dashboard': 'Command Center',
  '/digital-twin': 'Digital Twin',
  '/custom-agents': 'Custom Agents',
  '/integration': 'Integrations',
  '/settings': 'Settings',
  '/bonded': 'Bonded Zone',
  '/bonded-workflow': 'Bonded Workflow',
};

interface DashboardHeaderProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ isSidebarCollapsed = false, onToggleSidebar }: DashboardHeaderProps) {
  const [zone, setZone] = React.useState<'ALL' | 'FIZ' | 'FCZ'>('ALL');
  const pathname = usePathname();
  const workflow = WORKFLOW_LABELS[pathname];
  
  // Extract the section title from the current route
  const sectionTitle = React.useMemo(() => {
    for (const [route, title] of Object.entries(SECTION_TITLES)) {
      if (pathname === route || (route !== '/' && pathname?.startsWith(route + '/'))) {
        return title;
      }
    }
    return null;
  }, [pathname]);

  return (
    <header className="flex flex-col border-b bg-background gap-0">
      {/* Main header row: Sidebar toggle, page context, and controls */}
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        {/* Left section: Sidebar toggle and page context */}
        <div className="flex items-center gap-4 min-w-0">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onToggleSidebar}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isSidebarCollapsed}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
          
          {/* Page title and workflow context */}
          <div className="hidden sm:flex items-center gap-3 min-w-0">
            {sectionTitle && (
              <div className="text-sm font-semibold text-foreground truncate">
                {sectionTitle}
              </div>
            )}
            {workflow && (
              <div className="flex items-center gap-2">
                <Badge 
                  variant={workflow.status === 'live' ? 'default' : 'secondary'} 
                  className="text-[10px] shrink-0"
                >
                  {workflow.status === 'live' ? '● Live' : workflow.status}
                </Badge>
                <span className="text-xs text-muted-foreground hidden md:inline">{workflow.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right section: Context-specific controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Workflow-specific action */}
          {pathname?.startsWith('/bonded') && !pathname?.includes('/bonded-workflow') ? (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/bonded-workflow">Open workflow</Link>
            </Button>
          ) : null}
          
          {/* Zone context selector */}
          <ZoneSwitcher value={zone} onChange={setZone} />
          
          {/* Role context selector */}
          <RoleSwitcher />
        </div>
      </div>

      {/* Breadcrumb row: Visible on md+ screens */}
      <div className="hidden md:flex border-t">
        <Breadcrumb />
      </div>
    </header>
  );
}
export default DashboardHeader;