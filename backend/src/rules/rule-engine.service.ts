import { Injectable } from '@nestjs/common';

export interface Rule { id: string; when: string; then: string; severity: 'info'|'warn'|'block' }

@Injectable()
export class RuleEngineService {
  private rules: Rule[] = [];
  register(rules: Rule[]) { this.rules.push(...rules); }
  all(): Rule[] { return this.rules; }
  evaluate(_input: unknown): { hits: Rule[] } {
    // Replace with real expression evaluation.
    return { hits: [] };
  }
}
