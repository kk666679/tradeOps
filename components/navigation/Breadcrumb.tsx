'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Breadcrumb Navigation Component
 * Automatically generates breadcrumb trail from current pathname
 * 
 * Features:
 * - Auto-generate path from URL
 * - Clickable navigation
 * - Mobile-optimized
 * - Accessibility compliant
 * - Active state indication
 */
export function Breadcrumb() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);

  // Route label mappings for user-friendly display
  const routeLabels: Record<string, string> = {
    'trade-ops': 'Trade Operations',
    'order-management': 'Order Management',
    'digital-twin': 'Digital Twin',
    'custom-agents': 'Custom Agents',
    'wms': 'Warehouse Management',
    'fcz': 'Free Commercial Zone',
    'fiz': 'Free Industrial Zone',
    'bonded-workflow': 'Bonded Workflow',
    'dashboard': 'Dashboard',
    'integration': 'Integrations',
    'settings': 'Settings',
    'declarations': 'Declarations',
    'clearance': 'Clearance',
    'compliance': 'Compliance',
    'hs-classification': 'HS Classification',
    'duty-calculator': 'Duty Calculator',
    'permits': 'Permits & Licenses',
    'documents': 'Documents',
    'trade-finance': 'Trade Finance',
    'analytics': 'Analytics',
    'gate': 'Gate',
    'inbound': 'Inbound',
    'inventory': 'Inventory',
    'outbound': 'Outbound',
    'movement': 'Movement',
    'slotting': 'Slotting',
    'bonded': 'Bonded Ledger',
    'exemption': 'Exemption',
    'forecasting': 'Forecasting',
    'logistics': 'Logistics',
  };

  // Generate breadcrumbs from pathname
  React.useEffect(() => {
    const segments = pathname
      .split('/')
      .filter(segment => segment && segment !== '(app)' && segment !== 'app');

    // Always include home
    const crumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard' }
    ];

    // Add segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || capitalize(segment);
      
      // Don't add the last segment as a link (it's the current page)
      if (index < segments.length - 1) {
        crumbs.push({ label, href: currentPath });
      } else {
        // Add current page as non-linked item
        crumbs.push({ label, href: currentPath });
      }
    });

    setBreadcrumbs(crumbs);
  }, [pathname]);

  // If only home breadcrumb, don't show (already in navbar)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-2"
      aria-label="Breadcrumb navigation"
    >
      {/* Home link */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        title="Go to dashboard"
      >
        <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">Home</span>
      </Link>

      {/* Breadcrumb items */}
      {breadcrumbs.slice(1).map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 2;

        return (
          <React.Fragment key={crumb.href}>
            {/* Divider */}
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/50 shrink-0" />

            {/* Breadcrumb item */}
            {isLast ? (
              <span className="text-foreground font-medium truncate">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors truncate"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/**
 * Capitalize first letter of string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

export default Breadcrumb;
