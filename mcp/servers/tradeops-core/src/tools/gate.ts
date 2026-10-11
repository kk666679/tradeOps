// servers/tradeops-core/src/tools/gate.ts

import { z } from "zod";
import type { ToolResult } from "../../../../shared/schemas/mrtr";
import { complete, inputRequired } from "../../../../shared/schemas/mrtr";
import {
  buildGateApprovalRequests,
  REQUEST_ID,
  type GateApprovalResponses,
  type GateException,
} from "../mrtr/gate-approval";

export const GateInInput = z.object({
  tenantId: z.string(),
  containerId: z.string(),
  plate: z.string(),
  manifestWeightKg: z.number().positive(),
  observedWeightKg: z.number().nonnegative(),
  observedPlate: z.string(),
  zone: z.enum(["CFS", "FIZ", "FCZ"]),
  inputResponses: z.record(z.unknown()).optional(),
});
export type GateInInput = z.infer<typeof GateInInput>;

export const GateOutInput = z.object({
  tenantId: z.string(),
  containerId: z.string(),
  hasBondedRemainder: z.boolean(),
  inputResponses: z.record(z.unknown()).optional(),
});
export type GateOutInput = z.infer<typeof GateOutInput>;

export interface GateEvent {
  eventId: string;
  containerId: string;
  direction: "in" | "out";
  at: string;
  approvedBy?: string;
  overrideReason?: string;
}

const WEIGHT_TOLERANCE_KG = 50;

export async function handleGateIn(raw: GateInInput): Promise<ToolResult<GateEvent>> {
  const input = GateInInput.parse(raw);
  const weightDelta = Math.abs(input.observedWeightKg - input.manifestWeightKg);
  const weightMismatch = weightDelta > WEIGHT_TOLERANCE_KG;
  const anprMismatch = input.observedPlate.toUpperCase() !== input.plate.toUpperCase();

  const responses = (input.inputResponses ?? {}) as GateApprovalResponses;
  const weightApproved = responses[REQUEST_ID.WEIGHT_OVERRIDE]?.approve === true;
  const anprApproved = responses[REQUEST_ID.ANPR_OVERRIDE]?.approve === true;

  if (weightMismatch && !weightApproved) {
    const ex: GateException = {
      kind: "weight_mismatch",
      expected: String(input.manifestWeightKg),
      observed: String(input.observedWeightKg),
      containerId: input.containerId,
    };
    return inputRequired(
      buildGateApprovalRequests(ex),
      "Weighbridge discrepancy requires broker confirmation before gate-in.",
    );
  }
  if (anprMismatch && !anprApproved) {
    const ex: GateException = {
      kind: "anpr_mismatch",
      expected: input.plate,
      observed: input.observedPlate,
      containerId: input.containerId,
    };
    return inputRequired(
      buildGateApprovalRequests(ex),
      "ANPR plate mismatch requires broker confirmation before gate-in.",
    );
  }

  return complete<GateEvent>({
    eventId: crypto.randomUUID(),
    containerId: input.containerId,
    direction: "in",
    at: new Date().toISOString(),
    overrideReason:
      responses[REQUEST_ID.WEIGHT_OVERRIDE]?.reason ??
      (anprApproved ? "anpr_override" : undefined),
  });
}

export async function handleGateOut(raw: GateOutInput): Promise<ToolResult<GateEvent>> {
  const input = GateOutInput.parse(raw);
  const responses = (input.inputResponses ?? {}) as GateApprovalResponses;
  const bondedApproved = responses[REQUEST_ID.BONDED_REMAIN]?.approve === true;
  const supervisorId = responses[REQUEST_ID.SUPERVISOR_ID]?.employeeId;

  if (input.hasBondedRemainder && (!bondedApproved || !supervisorId)) {
    const ex: GateException = {
      kind: "bonded_remainder",
      expected: "no bonded goods",
      observed: "bonded goods present",
      containerId: input.containerId,
    };
    return inputRequired(
      buildGateApprovalRequests(ex),
      "Bonded goods detected. Supervisor authorisation required for gate-out.",
    );
  }

  return complete<GateEvent>({
    eventId: crypto.randomUUID(),
    containerId: input.containerId,
    direction: "out",
    at: new Date().toISOString(),
    approvedBy: supervisorId,
  });
}
