// shared/governance/policy-enforcement.ts

export type PolicyDecision = "allow" | "deny" | "require_approval";

export interface PolicyContext {
  tenantId: string;
  actorId: string;
  agentId?: string;
  tool: string;
  valueMYR?: number;
  zone?: "FIZ" | "FCZ" | "CFS";
}

export interface PolicyRule {
  id: string;
  description: string;
  evaluate(ctx: PolicyContext): PolicyDecision | null;
}

export class PolicyEngine {
  constructor(private rules: PolicyRule[]) {}

  evaluate(ctx: PolicyContext): { decision: PolicyDecision; ruleId?: string } {
    for (const rule of this.rules) {
      const d = rule.evaluate(ctx);
      if (d) return { decision: d, ruleId: rule.id };
    }
    return { decision: "allow" };
  }

  enforce(ctx: PolicyContext): void {
    const { decision, ruleId } = this.evaluate(ctx);
    if (decision === "deny") throw new Error(`policy denied by ${ruleId}`);
    if (decision === "require_approval") {
      throw new Error(`policy requires approval (${ruleId})`);
    }
  }
}

export const HighValueRequiresApproval: PolicyRule = {
  id: "tradeops/high-value",
  description: "Declarations above the tenant threshold require human approval",
  evaluate(ctx) {
    if (ctx.tool !== "declaration.submit") return null;
    if ((ctx.valueMYR ?? 0) > 250_000) return "require_approval";
    return null;
  },
};

export const AgentCannotMoveBonded: PolicyRule = {
  id: "tradeops/agent-bonded",
  description: "Agents cannot move bonded goods",
  evaluate(ctx) {
    if (!ctx.agentId) return null;
    if (ctx.tool === "ledger.move" || ctx.tool === "gate.bondedOut") return "require_approval";
    return null;
  },
};
