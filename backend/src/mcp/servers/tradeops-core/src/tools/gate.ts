// servers/tradeops-core/src/tools/gate.ts

import { z } from "zod";
import type { ToolResult } from "../../../../shared/schemas/mrtr";
import { complete, inputRequired } from "../../../../shared/schemas/mrtr";
import type { PrismaService } from "../../../../../prisma/prisma.service";
import { requireActiveZone } from "../database";
import {
  buildGateApprovalRequests,
  REQUEST_ID,
  type GateApprovalResponses,
  type GateException,
} from "../mrtr/gate-approval";

const gateApprovalResponsesSchema = z.object({
  [REQUEST_ID.WEIGHT_OVERRIDE]: z.object({
    approve: z.boolean(),
    reason: z.string(),
    notes: z.string().optional(),
  }).optional(),
  [REQUEST_ID.ANPR_OVERRIDE]: z.object({
    approve: z.boolean(),
    replacementPlate: z.string().optional(),
  }).optional(),
  [REQUEST_ID.BONDED_REMAIN]: z.object({ approve: z.boolean() }).optional(),
  [REQUEST_ID.SUPERVISOR_ID]: z.object({ employeeId: z.string().min(1) }).optional(),
}).strict();

export const GateInInput = z.object({
  tenantId: z.string().min(1),
  containerId: z.string().min(1),
  plate: z.string().min(1),
  manifestWeightKg: z.number().positive(),
  observedWeightKg: z.number().nonnegative(),
  observedPlate: z.string().min(1),
  zone: z.enum(["CFS", "FIZ", "FCZ"]),
  inputResponses: gateApprovalResponsesSchema.optional(),
});
export type GateInInput = z.infer<typeof GateInInput>;

export const GateOutInput = z.object({
  tenantId: z.string().min(1),
  containerId: z.string().min(1),
  hasBondedRemainder: z.boolean(),
  inputResponses: gateApprovalResponsesSchema.optional(),
});
export type GateOutInput = z.infer<typeof GateOutInput>;

export interface GateEvent {
  eventId?: string;
  containerId: string;
  direction: "in" | "out";
  at: string;
  approvedBy?: string;
  overrideReason?: string;
}

const WEIGHT_TOLERANCE_KG = 50;

export async function handleGateIn(
  raw: GateInInput,
): Promise<ToolResult<GateEvent>> {
  const input = GateInInput.parse(raw);
  const weightDelta = Math.abs(input.observedWeightKg - input.manifestWeightKg);
  const weightMismatch = weightDelta > WEIGHT_TOLERANCE_KG;
  const anprMismatch = input.observedPlate.toUpperCase() !== input.plate.toUpperCase();

  const responses: GateApprovalResponses = input.inputResponses ?? {};
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
    containerId: input.containerId,
    direction: "in",
    at: new Date().toISOString(),
    overrideReason:
      responses[REQUEST_ID.WEIGHT_OVERRIDE]?.reason ??
      (anprApproved ? "anpr_override" : undefined),
  });
}

export async function handleGateOut(
  raw: GateOutInput,
): Promise<ToolResult<GateEvent>> {
  const input = GateOutInput.parse(raw);
  const responses: GateApprovalResponses = input.inputResponses ?? {};
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
    containerId: input.containerId,
    direction: "out",
    at: new Date().toISOString(),
    approvedBy: supervisorId,
  });
}

export async function persistGateEvent(
  prisma: PrismaService,
  input: GateInInput | GateOutInput,
  event: GateEvent,
  actorId: string,
): Promise<GateEvent> {
  const isGateIn = "zone" in input;
  const zoneId = isGateIn
    ? (await requireActiveZone(prisma, input.tenantId, input.zone)).id
    : (await prisma.cargo.findFirst({
      where: { tenantId: input.tenantId, containerNo: input.containerId },
      select: { zoneId: true },
    }))?.zoneId;
  if (!zoneId) {
    throw new Error(`container ${input.containerId} is not linked to a zone in this tenant`);
  }

  let plateNo: string | null = null;
  let weightKg: number | null = null;
  let kind: string;
  let payload: {
    source: string;
    actorId: string;
    containerId: string;
    [key: string]: string | number | boolean | undefined;
  };
  let approvedBy: string | undefined;
  if (isGateIn) {
    const responses = input.inputResponses ?? {};
    const weightDelta = Math.abs(input.observedWeightKg - input.manifestWeightKg);
    const weightApproved = responses[REQUEST_ID.WEIGHT_OVERRIDE]?.approve === true;
    const anprMismatch = input.observedPlate.toUpperCase() !== input.plate.toUpperCase();
    const anprApproved = responses[REQUEST_ID.ANPR_OVERRIDE]?.approve === true;
    plateNo = input.observedPlate;
    weightKg = input.observedWeightKg;
    kind = weightDelta > WEIGHT_TOLERANCE_KG || anprMismatch ? "EXCEPTION" : "MCP_GATE_IN";
    approvedBy = weightApproved || anprApproved ? actorId : undefined;
    payload = {
      source: "mcp",
      actorId,
      containerId: input.containerId,
      manifestWeightKg: input.manifestWeightKg,
      approvedWeightOverride: weightApproved,
      approvedAnprOverride: anprApproved,
    };
  } else {
    const responses = input.inputResponses ?? {};
    const supervisorId = responses[REQUEST_ID.SUPERVISOR_ID]?.employeeId;
    const bondedApproved = responses[REQUEST_ID.BONDED_REMAIN]?.approve === true;
    kind = input.hasBondedRemainder ? "EXCEPTION" : "MCP_GATE_OUT";
    approvedBy = supervisorId;
    payload = {
      source: "mcp",
      actorId,
      containerId: input.containerId,
      hasBondedRemainder: input.hasBondedRemainder,
      approvedBondedRemainder: bondedApproved,
      ...(supervisorId ? { supervisorId } : {}),
    };
  }
  const record = await prisma.gateEvent.create({
    data: {
      tenantId: input.tenantId,
      zoneId,
      direction: event.direction === "in" ? "IN" : "OUT",
      plateNo,
      weightKg,
      kind,
      payload,
    },
  });
  return { ...event, eventId: record.id, at: record.at.toISOString(), approvedBy };
}
