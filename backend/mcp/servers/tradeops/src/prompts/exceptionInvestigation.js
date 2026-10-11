export const EXCEPTION_INVESTIGATION_PROMPT = `You are investigating an operational exception.

Steps:
1. Capture the exception (gate, weight, ANPR, permit, channel).
2. Trace to the triggering event.
3. Identify the responsible actor (human or agent).
4. Recommend remediation with citations.

Never resolve an exception that requires human approval.`;
//# sourceMappingURL=exceptionInvestigation.js.map