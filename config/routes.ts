/**
 * Typed application route registry.
 * Import from here instead of hardcoding URLs in components.
 *
 * All routes are for the authenticated app (app/(app)/*).
 * Public marketing routes are in MARKETING_ROUTES below.
 */

export const APP_ROUTES = {
  // Core
  dashboard: '/dashboard',
  orders: '/order-management',
  agents: '/custom-agents',
  integrations: '/integration',
  profile: '/settings/profile',
  dashboardOperations: '/dashboard/operations',
  dashboardCustoms: '/dashboard/customs',
  dashboardAgents: '/dashboard/agents',
  dashboardAlerts: '/dashboard/alerts',
  dashboardSla: '/dashboard/sla',

  // WMS
  wms: '/wms',
  wmsGate: '/wms/gate',
  wmsInbound: '/wms/inbound',
  wmsInventory: '/wms/inventory',
  wmsOutbound: '/wms/outbound',
  wmsMovement: '/wms/movement',
  wmsSlotting: '/wms/slotting',
  wmsBonded: '/wms/bonded',
  wmsExemption: '/wms/exemption',
  wmsForecasting: '/wms/forecasting',
  wmsLogistics: '/wms/logistics',

  // Trade Ops
  tradeOps: '/trade-ops',
  tradeOpsDeclarations: '/trade-ops/declarations',
  tradeOpsDeclarationsNew: '/trade-ops/declarations/new',
  tradeOpsClearance: '/trade-ops/clearance',
  tradeOpsCompliance: '/trade-ops/compliance',
  tradeOpsHsClassification: '/trade-ops/hs-classification',
  tradeOpsDutyCalculator: '/trade-ops/duty-calculator',
  tradeOpsPermits: '/trade-ops/permits',
  tradeOpsDocuments: '/trade-ops/documents',
  tradeOpsTradeFinance: '/trade-ops/trade-finance',
  tradeOpsAnalytics: '/trade-ops/analytics',

  // FIZ
  fiz: '/fiz',
  fizRawMaterials: '/fiz/raw-materials',
  fizMachinery: '/fiz/machinery',
  fizProductionInputs: '/fiz/production-inputs',
  fizFinishedGoods: '/fiz/finished-goods',
  fizWastage: '/fiz/wastage',
  fizSubcontract: '/fiz/subcontract',
  fizOperators: '/fiz/operators',
  fizApprovals: '/fiz/approvals',
  fizAnalytics: '/fiz/analytics',

  // FCZ
  fcz: '/fcz',
  fczTranshipment: '/fcz/transhipment',
  fczBreakBulk: '/fcz/break-bulk',
  fczRepackaging: '/fcz/repackaging',
  fczReexport: '/fcz/reexport',
  fczEntrepot: '/fcz/entrepot',
  fczValueAdd: '/fcz/value-add',
  fczTradingHouses: '/fcz/trading-houses',
  fczAnalytics: '/fcz/analytics',

  // Bonded
  bonded: '/bonded',
  bondedWorkflow: '/bonded-workflow',

  // Order Management
  orderManagement: '/order-management',
  orderManagementPurchase: '/order-management/purchase',
  orderManagementManufacturing: '/order-management/manufacturing',
  orderManagementFulfilment: '/order-management/fulfilment',
  orderManagementCustoms: '/order-management/customs',
  orderManagementTrading: '/order-management/trading',
  orderManagementTranshipment: '/order-management/transhipment',
  orderManagementApprovals: '/order-management/approvals',
  orderManagementAnalytics: '/order-management/analytics',

  // Custom Agents
  customAgents: '/custom-agents',
  customAgentsBuilder: '/custom-agents/builder',
  customAgentsBuilderNew: '/custom-agents/builder/new',
  customAgentsCustomsAgents: '/custom-agents/customs-agents',
  customAgentsOrchestration: '/custom-agents/orchestration',
  customAgentsSupervision: '/custom-agents/supervision',
  customAgentsRegistry: '/custom-agents/registry',
  customAgentsPolicy: '/custom-agents/policy',
  customAgentsMemory: '/custom-agents/memory',
  customAgentsMonitoring: '/custom-agents/monitoring',
  customAgentsAnalytics: '/custom-agents/analytics',
  customAgentsAudit: '/custom-agents/audit',
  customAgentsAi: '/custom-agents/ai',

  // Workflow Studio (React Flow authoring surface)
  workflow: '/workflow',
  workflowRuns: '/workflow/runs',
  workflowDatasets: '/workflow/datasets',

  // Digital Twin
  digitalTwin: '/digital-twin',
  digitalTwinSimulation: '/digital-twin/simulation',
  digitalTwinGraph: '/digital-twin/graph',
  digitalTwinLive: '/digital-twin/live',
  digitalTwinReasoning: '/digital-twin/reasoning',
  digitalTwinAgents: '/digital-twin/agents',
  digitalTwinTasks: '/digital-twin/tasks',
  digitalTwinZones: '/digital-twin/zones',
  digitalTwinAnalytics: '/digital-twin/analytics',

  // TwinForge (Digital Twin Studio — DT-ISaaS)
  twinForge: '/twinforge',
  twinForgeServices: '/twinforge/services',
  twinForgePortfolio: '/twinforge/portfolio',
  twinForgeTenants: '/twinforge/tenants',
  twinForgeLabs: '/twinforge/labs',
  twinForgeMarketplace: '/twinforge/marketplace',
  twinForgeSla: '/twinforge/sla',
  twinForgeOutcomes: '/twinforge/outcomes',
  twinForgeRoadmap: '/twinforge/roadmap',
  twinForgeExperience: '/twinforge/experience',
  twinForgeStudio: '/twinforge/studio',

  // Integration
  integration: '/integration',
  integrationErp: '/integration/erp',
  integrationWms: '/integration/wms',
  integrationTms: '/integration/tms',
  integrationEdi: '/integration/edi',
  integrationCustoms: '/integration/customs',
  integrationAuth: '/integration/auth',
  integrationWebhook: '/integration/webhook',
  integrationAgentMesh: '/integration/agent-mesh',
  integrationFizFcz: '/integration/fiz-fcz',
  integrationHealth: '/integration/health',

  // Cargo
  cargo: '/cargo',
  cargoNew: '/cargo/new',
  cargoAnalytics: '/cargo/analytics',

  // Admin
  admin: '/admin',
  adminTenants: '/admin/tenants',
  adminUsers: '/admin/users',
  adminZones: '/admin/zones',
  adminRoles: '/admin/roles',
  adminRulePacks: '/admin/rule-packs',
  adminAuditLog: '/admin/audit-log',
  adminBilling: '/admin/billing',

  // Settings
  settings: '/settings',
  settingsProfile: '/settings/profile',
  settingsSecurity: '/settings/security',
  settingsNotifications: '/settings/notifications',
  settingsOrganization: '/settings/organization',
  settingsApiKeys: '/settings/api-keys',
  settingsIntegrations: '/settings/integrations',

  // Search
  search: '/search',
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

/** Public marketing routes (no auth required) */
export const MARKETING_ROUTES = {
  home: '/',
  login: '/login',
  signIn: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  mfa: '/mfa',
  demo: '/demo',
  pricing: '/pricing',
  workflow: '/workflow',
  solutions: '/solutions',
  product: '/product',
  about: '/about',
  careers: '/careers',
  contact: '/contact',
  security: '/security',
  customers: '/customers',
  changelog: '/changelog',
  apiDocs: '/api-docs',
  newsletter: '/newletters',
  legalPrivacy: '/legal/privacy',
  legalTerms: '/legal/terms',
  legalDpa: '/legal/dpa',
  legalSla: '/legal/sla',
} as const;

export type MarketingRoute = (typeof MARKETING_ROUTES)[keyof typeof MARKETING_ROUTES];
