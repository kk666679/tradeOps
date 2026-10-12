"use client";

import { useMemo } from "react";
import type { WorkflowDefinition, ValidationResult, JkdmCapabilitySnapshot } from "../types/workflow";
import { validateWorkflow } from "../lib/workflow-validation";

export function useWorkflowValidation(def: WorkflowDefinition, caps?: JkdmCapabilitySnapshot): ValidationResult {
  return useMemo(() => validateWorkflow(def, caps), [def, caps]);
}
