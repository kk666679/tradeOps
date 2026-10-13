import type {
  KpiSnapshot, MarketplaceApp, OutcomeContract, PortfolioAccount,
  RoadmapItem, SlaMetric, TenantOnboardingStage,
} from './types';

export const DEMO_PORTFOLIO: PortfolioAccount[] = [
  { id: 'pf-01', tenantName: 'Bayan Lepas FIZ Authority',   tier: 'enterprise',   zoneKind: 'FIZ',     status: 'live',       twinCount: 4, assetsCovered: 1820, mrr: 142000, since: '2025-02-14', csm: 'A. Rahim',   slaAttainment: 0.997, nps: 62 },
  { id: 'pf-02', tenantName: 'Port Klang FCZ Operator',      tier: 'enterprise',   zoneKind: 'FCZ',     status: 'live',       twinCount: 6, assetsCovered: 3140, mrr: 216000, since: '2024-11-03', csm: 'S. Tan',     slaAttainment: 0.994, nps: 58 },
  { id: 'pf-03', tenantName: 'Johor Port Authority',          tier: 'enterprise',   zoneKind: 'PORT',    status: 'at-risk',    twinCount: 3, assetsCovered: 940,  mrr: 118000, since: '2025-06-20', csm: 'M. Faiz',    slaAttainment: 0.968, nps: 41 },
  { id: 'pf-04', tenantName: 'Kulim Hi-Tech Park',            tier: 'professional', zoneKind: 'PARK',    status: 'live',       twinCount: 2, assetsCovered: 610,  mrr: 48000,  since: '2025-09-12', csm: 'N. Kumar',   slaAttainment: 0.998, nps: 71 },
  { id: 'pf-05', tenantName: 'Penang International Airport',  tier: 'enterprise',   zoneKind: 'AIRPORT', status: 'onboarding', twinCount: 1, assetsCovered: 220,  mrr: 0,      since: '2026-01-08', csm: 'L. Chen',    slaAttainment: 1.0,   nps: null },
  { id: 'pf-06', tenantName: 'Sabah State Utilities',          tier: 'sovereign',    zoneKind: 'UTILITY', status: 'live',       twinCount: 5, assetsCovered: 4210, mrr: 385000, since: '2025-04-01', csm: 'R. Ibrahim', slaAttainment: 0.999, nps: 66 },
];

export const DEMO_SLA: SlaMetric[] = [
  { id: 'sla-01', tenantId: 'pf-01', metric: 'Twin uptime',            target: 0.995, actual: 0.997, unit: 'ratio', window: '30d',  status: 'met' },
  { id: 'sla-02', tenantId: 'pf-01', metric: 'Alert latency (p95)',    target: 2000,  actual: 1420,  unit: 'ms',    window: '24h',  status: 'met' },
  { id: 'sla-03', tenantId: 'pf-02', metric: 'Data freshness',         target: 300,   actual: 240,   unit: 's',     window: '24h',  status: 'met' },
  { id: 'sla-04', tenantId: 'pf-02', metric: 'Model drift detected',   target: 0,     actual: 1,     unit: 'count', window: '7d',   status: 'at-risk' },
  { id: 'sla-05', tenantId: 'pf-03', metric: 'Twin uptime',            target: 0.995, actual: 0.968, unit: 'ratio', window: '30d',  status: 'breached' },
  { id: 'sla-06', tenantId: 'pf-03', metric: 'Incident MTTR',          target: 60,    actual: 112,   unit: 'min',   window: '30d',  status: 'breached' },
  { id: 'sla-07', tenantId: 'pf-04', metric: 'Twin uptime',            target: 0.995, actual: 0.998, unit: 'ratio', window: '30d',  status: 'met' },
  { id: 'sla-08', tenantId: 'pf-06', metric: 'Sovereign audit logs',   target: 1,     actual: 1,     unit: 'ratio', window: '30d',  status: 'met' },
];

export const DEMO_OUTCOMES: OutcomeContract[] = [
  { id: 'oc-01', tenantId: 'pf-02', outcome: 'Energy savings — cargo handling',      baselineValue: 100, currentValue: 79,  targetValue: 78,  unit: 'index',  sharePct: 0.15, estimatedMonthlyValue: 18400, since: '2025-01-15' },
  { id: 'oc-02', tenantId: 'pf-01', outcome: 'Unplanned downtime reduction',          baselineValue: 100, currentValue: 74,  targetValue: 72,  unit: 'index',  sharePct: 0.18, estimatedMonthlyValue: 22600, since: '2025-03-02' },
  { id: 'oc-03', tenantId: 'pf-02', outcome: 'Customs clearance time (FIZ→FCZ)',      baselineValue: 100, currentValue: 58,  targetValue: 55,  unit: 'index',  sharePct: 0.12, estimatedMonthlyValue: 31200, since: '2025-06-10' },
  { id: 'oc-04', tenantId: 'pf-06', outcome: 'Grid distribution loss reduction',      baselineValue: 100, currentValue: 84,  targetValue: 82,  unit: 'index',  sharePct: 0.20, estimatedMonthlyValue: 47800, since: '2025-08-05' },
];

export const DEMO_MARKETPLACE: MarketplaceApp[] = [
  { id: 'mk-01', vendor: 'TwinForge',       name: 'Gate Traffic Optimizer',      category: 'Logistics',    layer: 'twinsaas',  installs: 42, rating: 4.8, revenueSharePct: 0.25, status: 'certified',    tags: ['gate', 'queues'] },
  { id: 'mk-02', vendor: 'TwinForge',       name: 'Bonded Stock Ledger',          category: 'Customs',      layer: 'twinsaas',  installs: 38, rating: 4.7, revenueSharePct: 0.25, status: 'certified',    tags: ['bonded', 'ledger'] },
  { id: 'mk-03', vendor: 'Siemens',         name: 'Simcenter Co-simulation',      category: 'Simulation',   layer: 'twinpaas',  installs: 21, rating: 4.6, revenueSharePct: 0.20, status: 'certified',    tags: ['fmi', 'physics'] },
  { id: 'mk-04', vendor: 'Omniverse Lab',   name: 'XR Command Bridge',            category: 'Experience',   layer: 'twinsaas',  installs: 12, rating: 4.4, revenueSharePct: 0.30, status: 'under-review', tags: ['xr', 'omniverse'] },
  { id: 'mk-05', vendor: 'Cesium',          name: 'GIS Reality Overlay',          category: 'Visualisation',layer: 'twinsaas',  installs: 33, rating: 4.9, revenueSharePct: 0.15, status: 'certified',    tags: ['gis', '3d-tiles'] },
  { id: 'mk-06', vendor: 'Certik',          name: 'Ledger Attestation',           category: 'Security',     layer: 'twinops',   installs: 9,  rating: 4.2, revenueSharePct: 0.35, status: 'certified',    tags: ['audit', 'ledger'] },
  { id: 'mk-07', vendor: 'Legacy SI',       name: 'SCADA Bridge (Modbus)',        category: 'Integration',  layer: 'twinpaas',  installs: 18, rating: 4.0, revenueSharePct: 0.25, status: 'deprecated',   tags: ['scada', 'modbus'] },
];

export const DEMO_ROADMAP: RoadmapItem[] = [
  { id: 'rm-01', phase: 'foundation', title: 'Studio setup & platform selection',   owner: 'Studio Director', startMonth: 0, endMonth: 3,  progress: 1.0,  milestone: 'Platform ADR signed',       dependencies: [] },
  { id: 'rm-02', phase: 'foundation', title: 'Pilot scoping — Bayan Lepas FIZ',     owner: 'A. Rahim',        startMonth: 1, endMonth: 3,  progress: 0.85, milestone: 'Pilot charter approved',    dependencies: ['rm-01'] },
  { id: 'rm-03', phase: 'pilot',      title: 'First FIZ twin (IoT + dashboard)',    owner: 'N. Kumar',        startMonth: 3, endMonth: 6,  progress: 0.62, milestone: 'Twin #1 in production',     dependencies: ['rm-02'] },
  { id: 'rm-04', phase: 'pilot',      title: 'Customs SMK/ePAM connector pilot',    owner: 'S. Tan',          startMonth: 4, endMonth: 6,  progress: 0.40, milestone: 'Pre-clearance live',        dependencies: ['rm-02'] },
  { id: 'rm-05', phase: 'commercial', title: 'Subscription launch (3 customers)',   owner: 'Studio Director', startMonth: 6, endMonth: 12, progress: 0.22, milestone: 'MRR > MYR 300k',            dependencies: ['rm-03'] },
  { id: 'rm-06', phase: 'commercial', title: 'Marketplace v1 (10 certified apps)',  owner: 'K. Lim',          startMonth: 8, endMonth: 12, progress: 0.10, milestone: 'Marketplace GA',            dependencies: ['rm-05'] },
  { id: 'rm-07', phase: 'scale',      title: 'Multi-zone rollout (10 zones)',       owner: 'A. Rahim',        startMonth: 12,endMonth: 24, progress: 0.0,  milestone: '10 zones live',             dependencies: ['rm-05'] },
  { id: 'rm-08', phase: 'scale',      title: 'Sovereign cloud for national scale',  owner: 'R. Ibrahim',      startMonth: 14,endMonth: 24, progress: 0.0,  milestone: 'Sovereign deployment live', dependencies: ['rm-05'] },
];

export const DEMO_KPI: KpiSnapshot[] = [
  { id: 'kpi-01', label: 'Time to first twin',   value: 82,   unit: 'days',  target: 90,   trend: 'down', note: 'Faster than target — Bayan Lepas FIZ' },
  { id: 'kpi-02', label: 'Simulation accuracy',  value: 96.4, unit: '%',     target: 95,   trend: 'up',   note: 'Rolling 30-day median' },
  { id: 'kpi-03', label: 'Downtime reduction',   value: 26,   unit: '%',     target: 25,   trend: 'up',   note: 'Across active enterprise twins' },
  { id: 'kpi-04', label: 'Energy savings',       value: 21,   unit: '%',     target: 20,   trend: 'up',   note: 'Port Klang cargo handling' },
  { id: 'kpi-05', label: 'Clearance reduction',  value: 42,   unit: '%',     target: 40,   trend: 'up',   note: 'FIZ→FCZ pre-clearance pilot' },
  { id: 'kpi-06', label: 'Twin uptime (30d)',    value: 99.6, unit: '%',     target: 99.5, trend: 'flat', note: 'Enterprise + Sovereign tiers' },
  { id: 'kpi-07', label: 'Customer ROI horizon', value: 16,   unit: 'months',target: 18,   trend: 'down', note: 'Weighted across portfolio' },
];

export const DEMO_TENANT_ONBOARDING: TenantOnboardingStage[] = [
  { stage: 'scope',      label: 'Scope & charter',          daysElapsed: 4,  daysBudget: 5,   status: 'done' },
  { stage: 'data-audit', label: 'Data audit & readiness',   daysElapsed: 9,  daysBudget: 10,  status: 'done' },
  { stage: 'capture',    label: 'Reality capture',          daysElapsed: 18, daysBudget: 21,  status: 'done' },
  { stage: 'model',      label: 'Model factory (3D + ontology)', daysElapsed: 22, daysBudget: 28, status: 'active' },
  { stage: 'integrate',  label: 'Integration (IoT, ERP, customs)', daysElapsed: 0,  daysBudget: 30, status: 'pending' },
  { stage: 'deploy',     label: 'Twin core deployment',     daysElapsed: 0,  daysBudget: 14,  status: 'pending' },
  { stage: 'operate',    label: 'Twin Operations Centre handover', daysElapsed: 0, daysBudget: 7, status: 'pending' },
];
