/**
 * rule-loader
 * Domain: shared
 * Auto-scaffolded service — swap in real adapters.
 */

export interface RuleLoaderInput { [k: string]: unknown }
export interface RuleLoaderResult { ok: boolean; data?: unknown; error?: string }

export class RuleLoader {
  async run(input: RuleLoaderInput): Promise<RuleLoaderResult> {
    try { return { ok: true, data: input }; }
    catch (e) { return { ok: false, error: (e as Error).message }; }
  }
}

export const ruleLoader = new RuleLoader();
