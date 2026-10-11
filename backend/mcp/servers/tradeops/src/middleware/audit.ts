// backend/mcp/servers/tradeops/src/middleware/audit.ts

import { createHash } from "node:crypto";

export interface AuditRecord {
  id: string;
  at: string;
  tenantId: string;
  actorId: string;
  agentId?: string;
  tool: string;
  inputHash: string;
  outputSummary: string;
  prevHash: string;
  hash: string;
}

const chain: AuditRecord[] = [];

export function recordAudit(input: Omit<AuditRecord, "prevHash" | "hash">): AuditRecord {
  const prev = chain[chain.length - 1];
  const canonical = JSON.stringify({
    id: input.id,
    at: input.at,
    tenantId: input.tenantId,
    actorId: input.actorId,
    agentId: input.agentId ?? null,
    tool: input.tool,
    inputHash: input.inputHash,
    outputSummary: input.outputSummary,
    prevHash: prev?.hash ?? "",
  });
  const hash = createHash("sha256").update(canonical).digest("hex");
  const rec: AuditRecord = { ...input, prevHash: prev?.hash ?? "", hash };
  chain.push(rec);
  return rec;
}

export function verifyChain(): boolean {
  let prev = "";
  for (const r of chain) {
    if (r.prevHash !== prev) return false;
    const canonical = JSON.stringify({
      id: r.id,
      at: r.at,
      tenantId: r.tenantId,
      actorId: r.actorId,
      agentId: r.agentId ?? null,
      tool: r.tool,
      inputHash: r.inputHash,
      outputSummary: r.outputSummary,
      prevHash: r.prevHash,
    });
    const recomputed = createHash("sha256").update(canonical).digest("hex");
    if (recomputed !== r.hash) return false;
    prev = r.hash;
  }
  return true;
}

export function snapshotChain(): AuditRecord[] {
  return [...chain];
}

export function hashInput(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input ?? null)).digest("hex");
}
