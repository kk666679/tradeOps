"use client";
import { useMemo } from "react";
import type {
  AccreditationData, BrokerClient, Declaration, RegulatoryGateResult,
} from "../types";
import { evaluateRegulatoryGate } from "../regulatory";
import { DEFAULT_RULE_SET } from "../regulatory/ruleSet";

export interface UseAccreditationHealthOptions {
  accreditation: AccreditationData;
  client: BrokerClient;
  declaration: Declaration;
  actor?: string;
  ruleSetVersion?: string;
}

export interface AccreditationHealth {
  healthy: boolean;
  allowedToProceed: boolean;
  requiresHumanReview: boolean;
  passCount: number;
  reviewCount: number;
  failCount: number;
  notApplicableCount: number;
  blockingControlIds: string[];
  gateResult: RegulatoryGateResult;
}

export function useAccreditationHealth({
  accreditation, client, declaration, actor = "system",
  ruleSetVersion = DEFAULT_RULE_SET.version,
}: UseAccreditationHealthOptions): AccreditationHealth {
  return useMemo(() => {
    const gateResult = evaluateRegulatoryGate(DEFAULT_RULE_SET.controls, {
      accreditation, client, declaration, actor, ruleSetVersion,
      channel: declaration.channel,
    });
    let pass = 0, review = 0, fail = 0, na = 0;
    for (const e of gateResult.evaluations) {
      if (e.outcome === "PASS") pass++;
      else if (e.outcome === "REVIEW") review++;
      else if (e.outcome === "FAIL") fail++;
      else na++;
    }
    return {
      healthy: fail === 0,
      allowedToProceed: gateResult.allowedToProceed,
      requiresHumanReview: gateResult.requiresHumanReview,
      passCount: pass, reviewCount: review, failCount: fail, notApplicableCount: na,
      blockingControlIds: gateResult.blockingControlIds,
      gateResult,
    };
  }, [accreditation, client, declaration, actor, ruleSetVersion]);
}
