---
description: Run the full test suite — unit, integration, tariff, e2e
allowed-tools: ["Bash(pnpm test:*)", "Bash(pnpm typecheck)", "Bash(pnpm lint)"]
---

Run:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test` (unit + integration)
4. `pnpm test:tariff`
5. `pnpm test:e2e`

Aggregate the results. Report pass/fail per suite and the first failure
with its full stack trace.
