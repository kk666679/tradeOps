/**
 * Role-based access control: role → tool ACL.
 *
 * Roles are coarse-grained; every MCP tool is tagged with the roles allowed to
 * invoke it. A caller's effective role is resolved by `authenticate` and passed
 * to `authorize`, which checks the ACL before a tool handler ever runs.
 */

/** Coarse-grained roles in the Trade OPS platform. */
export type Role = 'viewer' | 'operator' | 'customs_officer' | 'auditor' | 'admin';

export const ALL_ROLES: readonly Role[] = [
  'viewer',
  'operator',
  'customs_officer',
  'auditor',
  'admin',
];

/** Tools are classified by the sensitivity of their side effects. */
export type ToolTier = 'read' | 'write' | 'privileged' | 'agent';

/**
 * Minimum role required per tool tier. `admin` bypasses all checks.
 *   read       → viewer
 *   write      → operator (mutates zone/ledger state)
 *   privileged → customs_officer (customs / audit / cross-zone close)
 *   agent      → admin (orchestration & agent mesh control)
 */
export const TIER_MIN_ROLE: Record<ToolTier, Role> = {
  read: 'viewer',
  write: 'operator',
  privileged: 'customs_officer',
  agent: 'admin',
};

const ROLE_RANK: Record<Role, number> = {
  viewer: 0,
  operator: 1,
  customs_officer: 2,
  auditor: 2,
  admin: 4,
};

/** True when `role` satisfies the minimum required `role` for a tier. */
export function roleSatisfies(role: Role, required: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

/** Registry mapping every tool name to its tier. Populated by `registerTools`. */
const toolTiers = new Map<string, ToolTier>();

export function setToolTier(name: string, tier: ToolTier): void {
  toolTiers.set(name, tier);
}

export function getToolTier(name: string): ToolTier | undefined {
  return toolTiers.get(name);
}

export function allToolTiers(): Record<string, ToolTier> {
  return Object.fromEntries(toolTiers);
}

export interface RbacDecision {
  allowed: boolean;
  reason?: string;
  requiredRole?: Role;
}

/**
 * Decide whether `role` may invoke `tool`. Unknown tools default to the most
 * restrictive tier (privileged) so a tool registered without a tier cannot be
 * silently opened up.
 */
export function authorizeTool(role: Role, tool: string): RbacDecision {
  if (role === 'admin') return { allowed: true };
  const tier = toolTiers.get(tool) ?? 'privileged';
  const required = TIER_MIN_ROLE[tier];
  if (roleSatisfies(role, required)) return { allowed: true, requiredRole: required };
  return {
    allowed: false,
    reason: `role '${role}' is not permitted to call '${tool}' (tier '${tier}' requires '${required}')`,
    requiredRole: required,
  };
}

/** Reset the tier registry (tests only). */
export function __resetRbac(): void {
  toolTiers.clear();
}
