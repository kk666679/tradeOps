// backend/mcp/servers/tradeops/src/auth/approval.ts
// High-stakes action gates. If the action requires approval, the caller
// must present an approval token; otherwise the call is refused.

export interface ApprovalToken {
  id: string;
  actorId: string;
  action: string;
  approvedAt: string;
  expiresAt: string;
  signerRole: "broker" | "senior_broker" | "compliance" | "principal";
}

const required: Array<{ pattern: RegExp; role: ApprovalToken["signerRole"] }> = [
  { pattern: /^declaration\.submit$/, role: "broker" },
  { pattern: /^ledger\.move$/,        role: "senior_broker" },
  { pattern: /^gate\.bondedOut$/,     role: "principal" },
];

export function requiredApprovalFor(tool: string): ApprovalToken["signerRole"] | null {
  for (const r of required) if (r.pattern.test(tool)) return r.role;
  return null;
}

export function assertApproval(tool: string, tokens: ApprovalToken[]): void {
  const role = requiredApprovalFor(tool);
  if (!role) return;
  const now = Date.now();
  const ok = tokens.some(
    (t) => t.action === tool && t.signerRole === role && new Date(t.expiresAt).getTime() > now,
  );
  if (!ok) throw new Error(`approval required: ${tool} (role=${role})`);
}
