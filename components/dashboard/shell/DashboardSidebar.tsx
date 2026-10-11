'use client';
import * as React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { ChevronDown, LayoutDashboard, Warehouse, ShoppingCart, Package, Globe, Zap, Cpu, Plug, Factory, Store, Bot, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface NavLeaf { label: string; href: string }

const GROUP_ICONS: Record<string, React.ElementType> = {
  Operations: Package,
  Zones: Globe,
  Intelligence: Cpu,
  Integrations: Plug,
};

const ITEM_ICONS: Record<string, React.ElementType> = {
  'Trade OPS': LayoutDashboard,
  WMS: Warehouse,
  'Order Mgmt': ShoppingCart,
  FIZ: Factory,
  FCZ: Store,
  Bonded: Package,
  'Bonded Workflow': Zap,
  Dashboard: LayoutDashboard,
  'Digital Twin': Cpu,
  'Custom Agents': Bot,
  Integrations: Plug,
};

const GROUPS: [string, [string, string][]][] = [
  ['Operations', [['Trade OPS', '/trade-ops'], ['WMS', '/wms'], ['Order Mgmt', '/order-management']]],
  ['Zones', [['FIZ', '/fiz'], ['FCZ', '/fcz'], ['Bonded', '/bonded'], ['Bonded Workflow', '/bonded-workflow']]],
  ['Intelligence', [['Dashboard', '/dashboard'], ['Digital Twin', '/digital-twin'], ['Custom Agents', '/custom-agents']]],
  ['Integrations', [['Integrations', '/integration']]],
];

// Per-feature sub-page dropdowns. Every href below maps to a real route under app/(app)/.
const SUBPAGES: Record<string, NavLeaf[]> = {
  'Trade OPS': [
    { label: 'Overview', href: '/trade-ops' },
    { label: 'Declarations', href: '/trade-ops/declarations' },
    { label: 'Clearance', href: '/trade-ops/clearance' },
    { label: 'Compliance', href: '/trade-ops/compliance' },
    { label: 'HS Classification', href: '/trade-ops/hs-classification' },
    { label: 'Duty Calculator', href: '/trade-ops/duty-calculator' },
    { label: 'Permits & Licenses', href: '/trade-ops/permits' },
    { label: 'Documents', href: '/trade-ops/documents' },
    { label: 'Trade Finance', href: '/trade-ops/trade-finance' },
    { label: 'Analytics', href: '/trade-ops/analytics' },
  ],
  WMS: [
    { label: 'Overview', href: '/wms' },
    { label: 'Gate', href: '/wms/gate' },
    { label: 'Inbound', href: '/wms/inbound' },
    { label: 'Inventory', href: '/wms/inventory' },
    { label: 'Outbound', href: '/wms/outbound' },
    { label: 'Movement', href: '/wms/movement' },
    { label: 'Slotting', href: '/wms/slotting' },
    { label: 'Bonded Ledger', href: '/wms/bonded' },
    { label: 'Exemption', href: '/wms/exemption' },
    { label: 'Forecasting', href: '/wms/forecasting' },
    { label: 'Logistics', href: '/wms/logistics' },
  ],
  'Order Mgmt': [
    { label: 'Overview', href: '/order-management' },
    { label: 'Purchase', href: '/order-management/purchase' },
    { label: 'Manufacturing', href: '/order-management/manufacturing' },
    { label: 'Fulfilment', href: '/order-management/fulfilment' },
    { label: 'Customs', href: '/order-management/customs' },
    { label: 'Trading', href: '/order-management/trading' },
    { label: 'Transhipment', href: '/order-management/transhipment' },
    { label: 'Approvals', href: '/order-management/approvals' },
    { label: 'Analytics', href: '/order-management/analytics' },
  ],
  FIZ: [
    { label: 'Overview', href: '/fiz' },
    { label: 'Raw Materials', href: '/fiz/raw-materials' },
    { label: 'Machinery', href: '/fiz/machinery' },
    { label: 'Production Inputs', href: '/fiz/production-inputs' },
    { label: 'Finished Goods', href: '/fiz/finished-goods' },
    { label: 'Wastage', href: '/fiz/wastage' },
    { label: 'Subcontract', href: '/fiz/subcontract' },
    { label: 'Operators', href: '/fiz/operators' },
    { label: 'Approvals', href: '/fiz/approvals' },
    { label: 'Analytics', href: '/fiz/analytics' },
  ],
  FCZ: [
    { label: 'Overview', href: '/fcz' },
    { label: 'Transhipment', href: '/fcz/transhipment' },
    { label: 'Break-bulk', href: '/fcz/break-bulk' },
    { label: 'Repackaging', href: '/fcz/repackaging' },
    { label: 'Re-export', href: '/fcz/reexport' },
    { label: 'Entrepot', href: '/fcz/entrepot' },
    { label: 'Value-add', href: '/fcz/value-add' },
    { label: 'Trading Houses', href: '/fcz/trading-houses' },
    { label: 'Analytics', href: '/fcz/analytics' },
  ],
  Dashboard: [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Operations', href: '/dashboard/operations' },
    { label: 'Customs', href: '/dashboard/customs' },
    { label: 'Agents', href: '/dashboard/agents' },
    { label: 'Alerts', href: '/dashboard/alerts' },
    { label: 'SLA', href: '/dashboard/sla' },
  ],
  'Digital Twin': [
    { label: 'Overview', href: '/digital-twin' },
    { label: 'Simulation', href: '/digital-twin/simulation' },
    { label: 'Graph', href: '/digital-twin/graph' },
    { label: 'Live', href: '/digital-twin/live' },
    { label: 'Reasoning', href: '/digital-twin/reasoning' },
    { label: 'Agents', href: '/digital-twin/agents' },
    { label: 'Tasks', href: '/digital-twin/tasks' },
    { label: 'Zones', href: '/digital-twin/zones' },
    { label: 'Analytics', href: '/digital-twin/analytics' },
  ],
  'Custom Agents': [
    { label: 'Overview', href: '/custom-agents' },
    { label: 'Builder', href: '/custom-agents/builder' },
    { label: 'Customs Agents', href: '/custom-agents/customs-agents' },
    { label: 'Orchestration', href: '/custom-agents/orchestration' },
    { label: 'Supervision', href: '/custom-agents/supervision' },
    { label: 'Registry', href: '/custom-agents/registry' },
    { label: 'Policy', href: '/custom-agents/policy' },
    { label: 'Memory', href: '/custom-agents/memory' },
    { label: 'Monitoring', href: '/custom-agents/monitoring' },
    { label: 'Analytics', href: '/custom-agents/analytics' },
    { label: 'Audit', href: '/custom-agents/audit' },
    { label: 'AI', href: '/custom-agents/ai' },
  ],
  Integrations: [
    { label: 'Overview', href: '/integration' },
    { label: 'ERP', href: '/integration/erp' },
    { label: 'WMS', href: '/integration/wms' },
    { label: 'TMS', href: '/integration/tms' },
    { label: 'EDI', href: '/integration/edi' },
    { label: 'Customs', href: '/integration/customs' },
    { label: 'Auth', href: '/integration/auth' },
    { label: 'Webhook', href: '/integration/webhook' },
    { label: 'Agent Mesh', href: '/integration/agent-mesh' },
    { label: 'FIZ-FCZ', href: '/integration/fiz-fcz' },
    { label: 'Health', href: '/integration/health' },
  ],
};

interface SidebarProps {
  isCollapsed?: boolean;
}

export function DashboardSidebar({ isCollapsed: isCollapsedProp }: SidebarProps) {
  const pathname = usePathname();
  // Internal collapse state so the built-in toggle works even when no prop is passed.
  const [collapsedInternal, setCollapsedInternal] = React.useState(false);
  const isCollapsed = isCollapsedProp ?? collapsedInternal;
  const [openGroups, setOpenGroups] = React.useState<string[]>(['Operations']);
  // Per-feature dropdown open state, keyed by feature label.
  const [openFeatures, setOpenFeatures] = React.useState<string[]>([]);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => (prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]));
  };

  const toggleFeature = (label: string) => {
    setOpenFeatures((prev) => (prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]));
  };

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));

  // Auto-expand the group + feature that own the current route so deep links open in context.
  React.useEffect(() => {
    if (!pathname) return;
    const activeFeature = GROUPS.flatMap(([g, items]) =>
      items.map(([label, href]) => ({ group: g, label, href }))
    ).find((f) => isActive(f.href));
    if (!activeFeature) return;
    setOpenGroups((prev) => (prev.includes(activeFeature.group) ? prev : [...prev, activeFeature.group]));
    setOpenFeatures((prev) => (prev.includes(activeFeature.label) ? prev : [...prev, activeFeature.label]));
  }, [pathname]);

  return (
    <aside className={cn('border-r bg-background transition-all duration-300', isCollapsed ? 'w-16' : 'w-60')}>
      <div className="p-3">
        <Link href="/dashboard" className="flex items-center" aria-label="TradeOps Dashboard">
          {!isCollapsed && <BrandLogo size="md" variant="full" />}
          {isCollapsed && <BrandLogo size="md" variant="compact" />}
        </Link>
      </div>
      <nav className="space-y-2 p-2 text-sm">
        {GROUPS.map(([group, items]) => {
          const GroupIcon = GROUP_ICONS[group];
          const isOpen = openGroups.includes(group);

          return (
            <div key={group}>
              {!isCollapsed && (
                <Collapsible open={isOpen} onOpenChange={(open) => toggleGroup(group)}>
                  <CollapsibleTrigger className="flex w-full items-center gap-2 px-2 py-1.5 text-xs uppercase text-muted-foreground hover:text-foreground transition-colors">
                    <GroupIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{group}</span>
                    <span className="ml-auto transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown className="h-3 w-3" />
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="space-y-1 pt-1">
                      {items.map(([label, href]) => {
                        const ItemIcon = ITEM_ICONS[label];
                        const active = isActive(href);
                        return (
                          <Link
                            key={href}
                            href={href}
                            className={cn(
                              'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                              active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            <ItemIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              {isCollapsed && (
                <div className="relative group">
                  <button className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors" aria-label={group}>
                    <GroupIcon className="h-4 w-4 shrink-0 mx-auto" />
                  </button>
                  <div className="absolute left-full top-0 ml-2 w-48 rounded-md border bg-popover p-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {items.map(([label, href]) => {
                      const ItemIcon = ITEM_ICONS[label];
                      const active = isActive(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          className={cn(
                            'flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors',
                            active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <ItemIcon className="h-4 w-4 shrink-0" />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
export default DashboardSidebar;