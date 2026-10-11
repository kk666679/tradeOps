// backend/mcp/servers/tradeops/src/types/events.ts

export type EventKind =
  | "gate.in"
  | "gate.out"
  | "inventory.allocated"
  | "ledger.entry.posted"
  | "iot.device.telemetry"
  | "audit.record";

export interface DomainEvent<TPayload = unknown> {
  id: string;
  kind: EventKind;
  at: string;
  tenantId: string;
  actorId: string;
  agentId?: string;
  payload: TPayload;
  auditChainHash?: string;
}
