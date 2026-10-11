export interface ProviderInfo {
  id: string;
  name: string;
  models?: ModelDefinition[];
  enabled?: boolean;
  website?: string;
  [key: string]: unknown;
}

export interface ModelDefinition {
  id: string;
  name: string;
  contextWindow?: number;
  maxOutput?: number;
  pricing?: { input: number; output: number };
  provider?: string;
  [key: string]: unknown;
}
