export type AgentStatus = 'draft' | 'published' | 'deprecated';
export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'awaiting_approval';
export interface AgentDefinition { id: string; name: string; version: string; status: AgentStatus; skills: AgentSkill[]; tools: AgentTool[]; guardrails: AgentGuardrail[]; }
export interface AgentSkill { id: string; name: string; level: number; }
export interface AgentTool { id: string; kind: 'http' | 'sql' | 'customs' | 'zone' | 'doc' | 'llm'; config: Record<string, unknown>; }
export interface AgentGuardrail { id: string; rule: string; action: 'warn' | 'block' | 'escalate'; }
export interface AgentRun { id: string; agentId: string; status: RunStatus; startedAt: string; endedAt?: string; steps: AgentStep[]; }
export interface AgentStep { id: string; runId: string; kind: 'think' | 'tool' | 'handoff' | 'approve'; payload: unknown; at: string; }
export interface AgentHandoff { fromRunId: string; toAgentId: string; reason: string; }
export interface AgentPolicy { id: string; scope: string; rules: string[]; }
export interface AgentAuditEntry { id: string; runId: string; actor: 'agent' | 'human'; action: string; at: string; evidence?: string; }
export interface AgentEscalation { id: string; runId: string; reason: string; severity: 'low' | 'medium' | 'high'; }
export interface AgentMemoryRecord { id: string; agentId: string; key: string; value: unknown; at: string; }
