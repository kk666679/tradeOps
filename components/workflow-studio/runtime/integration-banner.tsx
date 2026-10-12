"use client";

import type { JkdmCapabilitySnapshot } from "../types/workflow";

export interface IntegrationBannerProps {
  caps: JkdmCapabilitySnapshot | null;
}

export function IntegrationBanner({ caps }: IntegrationBannerProps) {
  if (!caps) {
    return (
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-1.5 font-mono text-[10.5px] text-[var(--text-muted)]">
        JKDM integration status unknown
      </div>
    );
  }

  const { mode, submitDeclaration, requiresManualRecording, productionEnabled, transportVerified } = caps;

  let label = "";
  let color = "var(--text-muted)";
  let bg = "var(--bg-subtle)";
  let detail = "";

  if (mode === "production" && submitDeclaration) {
    label = "JKDM production integration active";
    color = "#10b981";
    bg = "rgba(16,185,129,0.08)";
    detail = "Submissions route through the verified transport.";
  } else if (mode === "production" && !submitDeclaration) {
    label = "JKDM production enabled — transport not verified";
    color = "#f59e0b";
    bg = "rgba(245,158,11,0.08)";
    detail = productionEnabled && !transportVerified
      ? "JKDM_PRODUCTION_ENABLED is set but JKDM_TRANSPORT_VERIFIED is not. Submission is refused."
      : "The transport is not yet implemented against official JKDM documentation.";
  } else if (mode === "development") {
    label = "JKDM development simulation";
    color = "#f59e0b";
    bg = "rgba(245,158,11,0.08)";
    detail = "Synthetic responses only. Every result is marked synthetic. Never use in production.";
  } else {
    label = "Manual processing required";
    color = "#8b5cf6";
    bg = "rgba(139,92,246,0.08)";
    detail = requiresManualRecording
      ? "No JKDM integration is configured. Record responses after submitting out-of-band."
      : "";
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-1.5 font-mono text-[10.5px]"
      style={{ background: bg, color }}>
      <span className="font-semibold uppercase tracking-wider">{label}</span>
      <span className="text-[var(--text-muted)]">{detail}</span>
      <span className="ml-auto flex items-center gap-2 text-[var(--text-muted)]">
        <span>mode: {mode}</span>
        <span>submit: {submitDeclaration ? "yes" : "no"}</span>
        <span>status: {caps.queryDeclarationStatus ? "yes" : "no"}</span>
      </span>
    </div>
  );
}
