export interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: readonly NavSection[] = [
  {
    label: 'Operations',
    items: [
      {
        label: 'Trade Ops',
        href: '/trade-ops',
        icon: 'file',
        children: [
          { label: 'Declarations', href: '/trade-ops/declarations' },
          { label: 'Clearance', href: '/trade-ops/clearance' },
        ],
      },
      { label: 'WMS', href: '/wms', icon: 'warehouse' },
      { label: 'Order Mgmt', href: '/order-management', icon: 'cart' },
    ],
  },
  {
    label: 'Zones',
    items: [
      { label: 'FCZ', href: '/fcz', icon: 'globe' },
      { label: 'FIZ', href: '/fiz', icon: 'factory' },
      { label: 'Cargo', href: '/cargo', icon: 'container' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Workflow', href: '/workflow', icon: 'workflow', children: [
        { label: 'Studio', href: '/workflow' },
        { label: 'Runs', href: '/workflow/runs' },
        { label: 'Datasets', href: '/workflow/datasets' },
      ]},
      { label: 'Custom Agents', href: '/custom-agents', icon: 'cpu' },
      { label: 'Digital Twin', href: '/digital-twin', icon: 'globe' },
      { label: 'TwinForge', href: '/twinforge', icon: 'layers' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { label: 'Overview', href: '/integration', icon: 'plug' },
    ],
  },
  {
    label: 'Walkthroughs',
    items: [
      { label: 'All walkthroughs', href: '/walkthrough', icon: 'book' },
    ],
  },
];
