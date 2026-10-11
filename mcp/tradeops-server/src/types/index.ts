/**
 * Type re-exports and utility types for the MCP server.
 *
 * Re-exports the canonical ledger schema from events.ts and adds MCP-specific types
 * (McpContext, SessionData, RBAC roles, approval tokens).
 */

// Re-export canonical ledger schema and utilities
export {
  LEDGER_SCHEMA_VERSION,
  LEDGER_ZONES,
  LedgerZoneSchema,
  type LedgerZone,
  DUTY_STATUSES,
  DutyStatusSchema,
  type DutyStatus,
  LedgerEventSchema,
  type LedgerEvent,
  type LedgerEventHashInput,
  computeEventHash,
  sealEvent,
  GENESIS_HASH,
  verifyEventChain,
  type ChainVerification,
  parseLedgerEvent,
  safeParseLedgerEvent,
} from './events.js';

/**
 * MCP request context — passed through the middleware chain.
 * Includes the authenticated session, user identity, roles, and request tracking.
 */
export interface McpContext {
  sessionId: string;
  userId: string;
  roles: string[];
  requestId: string;
}

/**
 * In-memory session data stored by SessionStore.
 * Carries the caller's identity and lifecycle timestamps.
 */
export interface SessionData {
  userId: string;
  roles: string[];
  createdAt: number;
  lastSeen: number;
}

/** Role names used in RBAC decisions. */
export type RbacRole = 'viewer' | 'operator' | 'admin';

/** Approval token — non-empty string grants approval authority for state-changing tools. */
export type ApprovalToken = string;
