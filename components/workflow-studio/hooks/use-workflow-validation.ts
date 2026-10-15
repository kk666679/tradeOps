"use client";

import { useMemo } from "react";
import type { WorkflowDefinition, ValidationResult, JkdmCapabilitySnapshot } from "../types/workflow";
import { validateWorkflow } from "../lib/workflow-validation";

function isSupportedNodeSet(value: unknown): value is ReadonlySet<string> {
  return value instanceof Set || (typeof value === "object" && value !== null && "has" in value && typeof (value as { has?: unknown }).has === "function");
}

export function useWorkflowValidation(
  def: WorkflowDefinition,
  capsOrSupported?: JkdmCapabilitySnapshot | ReadonlySet<string>,
  supported?: ReadonlySet<string>,
): ValidationResult {
  return useMemo(() => {
    if (isSupportedNodeSet(capsOrSupported)) {
      return validateWorkflow(def, undefined, capsOrSupported);
    }
    return validateWorkflow(def, capsOrSupported, supported);
  }, [def, capsOrSupported, supported]);
}
