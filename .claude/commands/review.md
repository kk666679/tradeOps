---
description: Review the staged diff for correctness, security, and style
allowed-tools: [Read, Grep, Glob, "Bash(git diff:*)"]
argument-hint: "[path]"
---

Staged diff to review: !`git diff --cached -- $ARGUMENTS`

Review for:

1. Correctness against the rules in `CLAUDE.md`.
2. Tenant-scope leakage (`tenantId` filter present on every tenant-scoped query).
3. Missing Zod validation on tRPC inputs.
4. Missing `source` / `retrievedAt` on any tariff rate.
5. Agent tools called outside their declared scope.

Output in the `regulatory-review` style.
