---
name: declaration-lifecycle
description: Prepare, gate, and (with approval) submit a customs declaration.
approval: required_for_submit
---

# Declaration lifecycle workflow

1. **Prepare** — `declaration.prepare` (K1/K2/K3/K7/K8/K9).
2. **Gate** — `mcp__trade-compliance__gate.evaluate`.
3. **Blocked?** — if `allowedToProceed` is false, stop and report.
4. **Review?** — if `requiresHumanReview` is true, collect input via MRTR.
5. **Approval** — human approval is mandatory before submission.
6. **Submit** — `declaration.submit` returns a Task handle.
7. **Poll** — poll via `tasks/get` until completion.

Never treat an internal workflow status as an official customs decision.
