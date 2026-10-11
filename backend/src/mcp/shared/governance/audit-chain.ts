// shared/governance/audit-chain.ts

import { createHash } from "node:crypto";

export interface AuditEntry {
  id: string;
  sequence: number;
  at: string;
  actor: string;
  agentId?: string;
  tenantId: string;
  tool: string;
  inputHash: string;
  outputSummary: string;
  ruleSetVersion?: string;
  controlIds?: string[];
  prevHash: string;
  hash: string;
}

export class AuditChain {
  private entries: AuditEntry[] = [];
  private sequence = 0;

  append(input: Omit<AuditEntry, "sequence" | "prevHash" | "hash">): AuditEntry {
    const prev = this.entries[this.entries.length - 1];
    const seq = ++this.sequence;
    const canonical = JSON.stringify({
      sequence: seq,
      at: input.at,
      actor: input.actor,
      agentId: input.agentId ?? null,
      tenantId: input.tenantId,
      tool: input.tool,
      inputHash: input.inputHash,
      outputSummary: input.outputSummary,
      ruleSetVersion: input.ruleSetVersion ?? null,
      controlIds: input.controlIds ?? [],
      prevHash: prev?.hash ?? "",
    });
    const hash = createHash("sha256").update(canonical).digest("hex");
    const entry: AuditEntry = {
      ...input,
      sequence: seq,
      prevHash: prev?.hash ?? "",
      hash,
    };
    this.entries.push(entry);
    return entry;
  }

  verify(): boolean {
    let prevHash = "";
    for (const e of this.entries) {
      if (e.prevHash !== prevHash) return false;
      const canonical = JSON.stringify({
        sequence: e.sequence,
        at: e.at,
        actor: e.actor,
        agentId: e.agentId ?? null,
        tenantId: e.tenantId,
        tool: e.tool,
        inputHash: e.inputHash,
        outputSummary: e.outputSummary,
        ruleSetVersion: e.ruleSetVersion ?? null,
        controlIds: e.controlIds ?? [],
        prevHash: e.prevHash,
      });
      const recomputed = createHash("sha256").update(canonical).digest("hex");
      if (recomputed !== e.hash) return false;
      prevHash = e.hash;
    }
    return true;
  }

  snapshot(): AuditEntry[] {
    return [...this.entries];
  }
}

export function hashToolInput(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input ?? null)).digest("hex");
}
