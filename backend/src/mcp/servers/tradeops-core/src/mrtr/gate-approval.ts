// servers/tradeops-core/src/mrtr/gate-approval.ts

import type { InputRequest } from "../../../../shared/schemas/mrtr";

export const REQUEST_ID = {
  WEIGHT_OVERRIDE: "confirm_weight_override",
  ANPR_OVERRIDE:   "confirm_anpr_override",
  BONDED_REMAIN:   "confirm_bonded_remainder",
  SUPERVISOR_ID:   "supervisor_identity",
} as const;

export interface GateException {
  kind: "weight_mismatch" | "anpr_mismatch" | "bonded_remainder";
  expected: string;
  observed: string;
  containerId: string;
}

export function buildGateApprovalRequests(
  exception: GateException,
): Record<string, InputRequest> {
  switch (exception.kind) {
    case "weight_mismatch":
      return {
        [REQUEST_ID.WEIGHT_OVERRIDE]: {
          kind: "elicitation",
          prompt:
            `Weighbridge reading ${exception.observed} kg differs from manifest ${exception.expected} kg ` +
            `for container ${exception.containerId}. Approve gate-in with observed weight?`,
          schema: {
            type: "object",
            required: ["approve", "reason"],
            properties: {
              approve: { type: "boolean" },
              reason: { type: "string", enum: ["minor_tolerance", "reweigh", "manifest_correction", "other"] },
              notes: { type: "string" },
            },
          },
          meta: { severity: "warning", containerId: exception.containerId },
        },
      };

    case "anpr_mismatch":
      return {
        [REQUEST_ID.ANPR_OVERRIDE]: {
          kind: "elicitation",
          prompt:
            `ANPR plate ${exception.observed} does not match manifest plate ${exception.expected} ` +
            `for container ${exception.containerId}. Proceed?`,
          schema: {
            type: "object",
            required: ["approve"],
            properties: {
              approve: { type: "boolean" },
              replacementPlate: { type: "string" },
            },
          },
        },
      };

    case "bonded_remainder":
      return {
        [REQUEST_ID.BONDED_REMAIN]: {
          kind: "elicitation",
          prompt:
            `Container ${exception.containerId} still holds bonded goods. ` +
            `Gate-out requires supervisor sign-off.`,
          schema: {
            type: "object",
            required: ["approve"],
            properties: { approve: { type: "boolean" } },
          },
        },
        [REQUEST_ID.SUPERVISOR_ID]: {
          kind: "elicitation",
          prompt: "Enter the supervisor employee ID authorising this gate-out.",
          schema: { type: "object", required: ["employeeId"], properties: { employeeId: { type: "string" } } },
        },
      };
  }
}

export interface GateApprovalResponses {
  [REQUEST_ID.WEIGHT_OVERRIDE]?: { approve: boolean; reason: string; notes?: string };
  [REQUEST_ID.ANPR_OVERRIDE]?: { approve: boolean; replacementPlate?: string };
  [REQUEST_ID.BONDED_REMAIN]?: { approve: boolean };
  [REQUEST_ID.SUPERVISOR_ID]?: { employeeId: string };
}
