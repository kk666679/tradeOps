/* ═══════════════════════════════════════════════════════════
   TwinForge Studio — DT-ISaaS types
   ═══════════════════════════════════════════════════════════ */

export type ServiceLayer =
  | 'iaas' | 'twinpaas' | 'twinsaas' | 'twinops' | 'outcomeaas';

export type ServiceMaturity =
  | 'ga' | 'preview' | 'beta' | 'planned';

export type LabId =
  | 'intake' | 'reality-capture' | 'model-factory' | 'integration-factory'
  | 'simulation' | 'experience' | 'operations' | 'marketplace';

export type TierId = 'starter' | 'professional' | 'enterprise' | 'sovereign';

export type RoadmapPhase =
  | 'foundation' | 'pilot' | 'commercial' | 'scale';

export type KpiTrend = 'up' | 'down' | 'flat';

export interface ServiceDefinition {
  id: string;
  layer: ServiceLayer;
  code: string;
  name: string;
  summary: string;
  deliverables: string[];
  sla: string;
  maturity: ServiceMaturity;
  tags: string[];
}

export interface LabDefinition {
  id: LabId;
  name: string;
  function: string;
  owner: string;
  utilisation: number;   // 0..1
  queueDepth: number;
  slaDays: string;
  activeInitiatives: number;
}

export interface TierDefinition {
  id: TierId;
  name: string;
  target: string;
  features: string[];
  pricingModel: string;
  monthlyBase: number;      // MYR
  usageUnit: string;
  usageUnitPrice: number;
}

export interface PortfolioAccount {
  id: string;
  tenantName: string;
  tier: TierId;
  zoneKind: 'FIZ' | 'FCZ' | 'PORT' | 'AIRPORT' | 'UTILITY' | 'PARK';
  status: 'onboarding' | 'live' | 'at-risk' | 'churned';
  twinCount: number;
  assetsCovered: number;
  mrr: number;
  since: string;
  csm: string;
  slaAttainment: number;
  nps: number | null;
}

export interface SlaMetric {
  id: string;
  tenantId: string;
  metric: string;
  target: number;
  actual: number;
  unit: string;
  window: string;
  status: 'met' | 'at-risk' | 'breached';
}

export interface OutcomeContract {
  id: string;
  tenantId: string;
  outcome: string;
  baselineValue: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  sharePct: number;
  estimatedMonthlyValue: number;
  since: string;
}

export interface MarketplaceApp {
  id: string;
  vendor: string;
  name: string;
  category: string;
  layer: ServiceLayer;
  installs: number;
  rating: number;
  revenueSharePct: number;
  status: 'certified' | 'under-review' | 'deprecated';
  tags: string[];
}

export interface RoadmapItem {
  id: string;
  phase: RoadmapPhase;
  title: string;
  owner: string;
  startMonth: number;
  endMonth: number;
  progress: number;   // 0..1
  milestone: string;
  dependencies: string[];
}

export interface KpiSnapshot {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  trend: KpiTrend;
  note: string;
}

export interface TenantOnboardingStage {
  stage:
    | 'scope' | 'data-audit' | 'capture' | 'model' | 'integrate'
    | 'deploy' | 'operate';
  label: string;
  daysElapsed: number;
  daysBudget: number;
  status: 'done' | 'active' | 'pending' | 'blocked';
}
