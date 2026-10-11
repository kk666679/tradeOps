import { Injectable } from '@nestjs/common';

export interface MemoryEntry { id: string; tenantId: string; agentId: string; kind: 'short-term'|'long-term'|'episodic'; key: string; value: unknown; at: string }

@Injectable()
export class MemoryService {
  private store: MemoryEntry[] = [];
  remember(e: Omit<MemoryEntry, 'id' | 'at'>): MemoryEntry {
    const entry: MemoryEntry = { ...e, id: crypto.randomUUID(), at: new Date().toISOString() };
    this.store.push(entry); return entry;
  }
  recall(tenantId: string, agentId: string, key?: string): MemoryEntry[] {
    return this.store.filter((e) => e.tenantId === tenantId && e.agentId === agentId && (!key || e.key === key));
  }
}
