// components/brokerage/regulatory/ruleSet.ts
import type { RegulatoryControl } from "../types";
import { JKDM_CONTROL_CATALOG, JKDM_RULE_SET_VERSION } from "./controlCatalog";

/**
 * A RuleSet is a snapshot of the controls applicable at a moment in time.
 * Its `version` is stamped onto every ControlEvaluation so a decision can be
 * replayed against the exact rule set that produced it.
 */
export interface RuleSet {
  version: string;
  jurisdiction: "MY";
  effectiveFrom: string;
  publishedAt: string;
  supersedes?: string;
  controls: RegulatoryControl[];
}

export const DEFAULT_RULE_SET: RuleSet = {
  version: JKDM_RULE_SET_VERSION,
  jurisdiction: "MY",
  effectiveFrom: "2025-04-22",
  publishedAt: "2025-04-22",
  controls: JKDM_CONTROL_CATALOG,
};

/** Returns only the controls active in the rule set at a given date. */
export function controlsEffectiveAt(ruleSet: RuleSet, at: Date): RegulatoryControl[] {
  return ruleSet.controls.filter((c) => {
    const from = new Date(c.effectiveFrom).getTime();
    if (Number.isFinite(from) && at.getTime() < from) return false;
    if (c.effectiveUntil) {
      const until = new Date(c.effectiveUntil).getTime();
      if (Number.isFinite(until) && at.getTime() > until) return false;
    }
    return true;
  });
}
