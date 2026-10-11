/**
 * Command Palette Routes Configuration
 * Centralized route definition for the command palette
 * Update this file to add or modify routes without touching the component
 */

export interface SearchItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  category: 'route' | 'recent' | 'action';
  icon?: React.ReactNode;
}

export const COMMAND_PALETTE_ROUTES: SearchItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', category: 'route', description: 'Command center' },
  { id: 'trade-ops', label: 'Trade Operations', href: '/trade-ops', category: 'route', description: 'Customs & agents' },
  { id: 'wms', label: 'Warehouse Management', href: '/wms', category: 'route', description: 'WMS & inventory' },
  { id: 'order-mgmt', label: 'Order Management', href: '/order-management', category: 'route', description: 'Purchase to fulfillment' },
  { id: 'digital-twin', label: 'Digital Twin', href: '/digital-twin', category: 'route', description: 'Simulation & analytics' },
  { id: 'custom-agents', label: 'Custom Agents', href: '/custom-agents', category: 'route', description: 'Agent orchestration' },
  { id: 'fiz', label: 'Free Industrial Zone', href: '/fiz', category: 'route', description: 'FIZ operations' },
  { id: 'fcz', label: 'Free Commercial Zone', href: '/fcz', category: 'route', description: 'FCZ operations' },
  { id: 'bonded', label: 'Bonded Zones', href: '/bonded', category: 'route', description: 'Bonded operations' },
  { id: 'integration', label: 'Integrations', href: '/integration', category: 'route', description: 'Third-party integrations' },
  { id: 'settings', label: 'Settings', href: '/settings', category: 'route', description: 'User preferences' },
];
