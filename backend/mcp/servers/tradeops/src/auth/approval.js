const required = [
    { pattern: /^declaration\.submit$/, role: "broker" },
    { pattern: /^ledger\.move$/, role: "senior_broker" },
    { pattern: /^gate\.bondedOut$/, role: "principal" },
];
export function requiredApprovalFor(tool) {
    for (const r of required)
        if (r.pattern.test(tool))
            return r.role;
    return null;
}
export function assertApproval(tool, tokens) {
    const role = requiredApprovalFor(tool);
    if (!role)
        return;
    const now = Date.now();
    const ok = tokens.some((t) => t.action === tool && t.signerRole === role && new Date(t.expiresAt).getTime() > now);
    if (!ok)
        throw new Error(`approval required: ${tool} (role=${role})`);
}
//# sourceMappingURL=approval.js.map