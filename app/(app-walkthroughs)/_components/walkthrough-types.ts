export type WalkthroughDomain =
  | 'admin'
  | 'bonded'
  | 'cargo'
  | 'custom-agents'
  | 'digital-twin'
  | 'fcz'
  | 'fiz'
  | 'integration'
  | 'order-management'
  | 'search'
  | 'settings'
  | 'trade-ops'
  | 'wms';

export type WalkthroughAudience =
  | 'admin'
  | 'operator'
  | 'broker'
  | 'developer'
  | 'mixed';

export interface WalkthroughRoute {
  label: string;
  href: string;
  description: string;
}

export interface WalkthroughWorkflowStep {
  instruction: string;
  href: string;
  routeLabel: string;
}

export interface WalkthroughWorkflow {
  title: string;
  purpose: string;
  steps: WalkthroughWorkflowStep[];
}

export interface WalkthroughConcept {
  term: string;
  definition: string;
}

export interface WalkthroughSource {
  concept: string;
  path: string;
}

export interface WalkthroughRelatedDomain {
  domain: WalkthroughDomain;
  label: string;
  href: string;
  relationship: string;
}

export interface WalkthroughTroubleshooting {
  symptom: string;
  check: string;
  location: string;
}

export interface WalkthroughSpec {
  /** Optional persisted workflow to run when a walkthrough seeds a real workflow. */
  seedWorkflowId?: string;
  domain: WalkthroughDomain;
  title: string;
  summary: string;
  audience: WalkthroughAudience;
  prerequisites: string[];
  keyRoutes: WalkthroughRoute[];
  concepts: WalkthroughConcept[];
  workflows: WalkthroughWorkflow[];
  dataSources: string[];
  permissions: string[];
  relatedDomains: WalkthroughRelatedDomain[];
  troubleshooting: WalkthroughTroubleshooting[];
  whereThingsLive: WalkthroughSource[];
  lastUpdated: string;
}
