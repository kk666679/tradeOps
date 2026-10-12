// components/workflow-studio/templates/index.ts
import importClearanceK1 from "./import-clearance-k1.json";
import exportK8 from "./export-k8.json";
import missingDocumentEscalation from "./missing-document-escalation.json";
import type { WorkflowDefinition } from "../types/workflow";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  definition: WorkflowDefinition;
}

export const TEMPLATES: WorkflowTemplate[] = [
  importClearanceK1 as unknown as WorkflowTemplate,
  exportK8 as unknown as WorkflowTemplate,
  missingDocumentEscalation as unknown as WorkflowTemplate,
];
