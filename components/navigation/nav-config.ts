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
          { label: 'Permits', href: '/trade-ops/permits' },
          { label: 'Documents', href: '/trade-ops/documents' },
          { label: 'HS classification', href: '/trade-ops/hs-classification' },
          { label: 'Duty calculator', href: '/trade-ops/duty-calculator' },
          { label: 'Compliance', href: '/trade-ops/compliance' },
          { label: 'Trade finance', href: '/trade-ops/trade-finance' },
          { label: 'Analytics', href: '/trade-ops/analytics' },
        ],
      },
      {
        label: 'WMS',
        href: '/wms',
        icon: 'warehouse',
        children: [
          { label: 'Inbound', href: '/wms/inbound' },
          { label: 'Outbound', href: '/wms/outbound' },
          { label: 'Inventory', href: '/wms/inventory' },
          { label: 'Movement', href: '/wms/movement' },
          { label: 'Gate', href: '/wms/gate' },
          { label: 'Slotting', href: '/wms/slotting' },
          { label: 'Bonded', href: '/wms/bonded' },
          { label: 'Exemption', href: '/wms/exemption' },
          { label: 'Forecasting', href: '/wms/forecasting' },
          { label: 'Logistics', href: '/wms/logistics' },
        ],
      },
      {
        label: 'Order Mgmt',
        href: '/order-management',
        icon: 'cart',
        children: [
          { label: 'Purchase', href: '/order-management/purchase' },
          { label: 'Trading', href: '/order-management/trading' },
          { label: 'Manufacturing', href: '/order-management/manufacturing' },
          { label: 'Fulfilment', href: '/order-management/fulfilment' },
          { label: 'Customs', href: '/order-management/customs' },
          { label: 'Transhipment', href: '/order-management/transhipment' },
          { label: 'Approvals', href: '/order-management/approvals' },
          { label: 'Analytics', href: '/order-management/analytics' },
        ],
      },
    ],
  },
  {
    label: 'Zones',
    items: [
      {
        label: 'FCZ',
        href: '/fcz',
        icon: 'globe',
        children: [
          { label: 'Trading houses', href: '/fcz/trading-houses' },
          { label: 'Entrepot', href: '/fcz/entrepot' },
          { label: 'Break-bulk', href: '/fcz/break-bulk' },
          { label: 'Re-export', href: '/fcz/reexport' },
          { label: 'Repackaging', href: '/fcz/repackaging' },
          { label: 'Transhipment', href: '/fcz/transhipment' },
          { label: 'Value-add', href: '/fcz/value-add' },
          { label: 'Analytics', href: '/fcz/analytics' },
        ],
      },
      {
        label: 'FIZ',
        href: '/fiz',
        icon: 'factory',
        children: [
          { label: 'Operators', href: '/fiz/operators' },
          { label: 'Raw materials', href: '/fiz/raw-materials' },
          { label: 'Production inputs', href: '/fiz/production-inputs' },
          { label: 'Machinery', href: '/fiz/machinery' },
          { label: 'Finished goods', href: '/fiz/finished-goods' },
          { label: 'Subcontract', href: '/fiz/subcontract' },
          { label: 'Wastage', href: '/fiz/wastage' },
          { label: 'Approvals', href: '/fiz/approvals' },
          { label: 'Analytics', href: '/fiz/analytics' },
        ],
      },
      {
        label: 'Cargo',
        href: '/cargo',
        icon: 'container',
        children: [
          { label: 'Bulk', href: '/cargo/bulk' },
          { label: 'FCZ flows', href: '/cargo/fcz' },
          { label: 'FIZ flows', href: '/cargo/fiz' },
          { label: 'Hazmat', href: '/cargo/hazmat' },
          { label: 'Analytics', href: '/cargo/analytics' },
        ],
      },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      {
        label: 'Custom Agents',
        href: '/custom-agents',
        icon: 'cpu',
        children: [
          { label: 'Registry', href: '/custom-agents/registry' },
          { label: 'Builder', href: '/custom-agents/builder' },
          { label: 'Orchestration', href: '/custom-agents/orchestration' },
          { label: 'AI workers', href: '/custom-agents/ai' },
          { label: 'Memory', href: '/custom-agents/memory' },
          { label: 'Policies', href: '/custom-agents/policy' },
          { label: 'Monitoring', href: '/custom-agents/monitoring' },
          { label: 'Supervision', href: '/custom-agents/supervision' },
          { label: 'Customs agents', href: '/custom-agents/customs-agents' },
          { label: 'Audit', href: '/custom-agents/audit' },
          { label: 'Analytics', href: '/custom-agents/analytics' },
        ],
      },
      {
        label: 'Digital Twin',
        href: '/digital-twin',
        icon: 'globe',
        children: [
          { label: 'Live', href: '/digital-twin/live' },
          { label: 'Graph', href: '/digital-twin/graph' },
          { label: 'Agents', href: '/digital-twin/agents' },
          { label: 'Reasoning', href: '/digital-twin/reasoning' },
          { label: 'Simulation', href: '/digital-twin/simulation' },
          { label: 'Tasks', href: '/digital-twin/tasks' },
          { label: 'Zones', href: '/digital-twin/zones' },
          { label: 'Analytics', href: '/digital-twin/analytics' },
        ],
      },
    ],
  },
  {
    label: 'Integrations',
    items: [
      {
        label: 'Overview',
        href: '/integration',
        icon: 'plug',
        children: [
          { label: 'Core systems', href: '/integration/erp' },
          { label: 'ERP customers', href: '/integration/erp/customers' },
          { label: 'ERP inventory', href: '/integration/erp/inventory' },
          { label: 'ERP invoices', href: '/integration/erp/invoices' },
          { label: 'WMS stock', href: '/integration/wms/stock' },
          { label: 'WMS movements', href: '/integration/wms/movements' },
          { label: 'WMS gate', href: '/integration/wms/gate' },
          { label: 'FIZ / FCZ', href: '/integration/fiz-fcz' },
          { label: 'Customs', href: '/integration/customs' },
          { label: 'Customs declarations', href: '/integration/customs/declarations' },
          { label: 'Customs permits', href: '/integration/customs/permits' },
          { label: 'Customs tariff', href: '/integration/customs/tariff' },
          { label: 'EDI / ASYCUDA', href: '/integration/edi' },
          { label: 'EDI mappings', href: '/integration/edi/mappings' },
          { label: 'EDI segments', href: '/integration/edi/segments' },
          { label: 'TMS', href: '/integration/tms' },
          { label: 'TMS carriers', href: '/integration/tms/carriers' },
          { label: 'TMS routes', href: '/integration/tms/routes' },
          { label: 'TMS shipments', href: '/integration/tms/shipments' },
          { label: 'Agent mesh', href: '/integration/agent-mesh' },
          { label: 'Webhooks', href: '/integration/webhook' },
          { label: 'Webhook subscriptions', href: '/integration/webhook/subscriptions' },
          { label: 'Webhook deliveries', href: '/integration/webhook/deliveries' },
          { label: 'Auth', href: '/integration/auth' },
          { label: 'API keys', href: '/integration/auth/api-keys' },
          { label: 'OAuth clients', href: '/integration/auth/oauth-clients' },
          { label: 'Secrets', href: '/integration/auth/secrets' },
          { label: 'Health', href: '/integration/health' },
        ],
      },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Tenants', href: '/admin/tenants', icon: 'building' },
      { label: 'Users', href: '/admin/users', icon: 'users' },
      { label: 'Roles', href: '/admin/roles', icon: 'shield' },
      { label: 'Rule packs', href: '/admin/rule-packs', icon: 'file' },
      { label: 'Zones', href: '/admin/zones', icon: 'globe' },
      { label: 'Billing', href: '/admin/billing', icon: 'card' },
      { label: 'Audit log', href: '/admin/audit-log', icon: 'clock' },
    ],
  },
  {
    label: 'Walkthroughs',
    items: [
      { label: 'All walkthroughs', href: '/walkthrough', icon: 'book' },
      { label: 'Admin', href: '/admin/walkthrough', icon: 'book' },
      { label: 'Bonded', href: '/bonded/walkthrough', icon: 'book' },
      { label: 'Cargo', href: '/cargo/walkthrough', icon: 'book' },
      { label: 'Custom agents', href: '/custom-agents/walkthrough', icon: 'book' },
      { label: 'Digital twin', href: '/digital-twin/walkthrough', icon: 'book' },
      { label: 'FCZ', href: '/fcz/walkthrough', icon: 'book' },
      { label: 'FIZ', href: '/fiz/walkthrough', icon: 'book' },
      { label: 'Integration', href: '/integration/walkthrough', icon: 'book' },
      { label: 'Order mgmt', href: '/order-management/walkthrough', icon: 'book' },
      { label: 'Search', href: '/search/walkthrough', icon: 'book' },
      { label: 'Settings', href: '/settings/walkthrough', icon: 'book' },
      { label: 'Trade ops', href: '/trade-ops/walkthrough', icon: 'book' },
      { label: 'WMS', href: '/wms/walkthrough', icon: 'book' },
    ],
  },
];