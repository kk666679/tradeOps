---
description: Deploy the TradeOps application to the target environment
allowed-tools: [Read, "Bash(pnpm build)", "Bash(pnpm deploy:*)", "Bash(kubectl:*)"]
argument-hint: "<staging|production>"
disable-model-invocation: true
---

# /deploy $1

1. Verify the working tree is clean (`git status --porcelain` empty).
2. Run `pnpm typecheck && pnpm lint && pnpm test`.
3. Build: `pnpm build`.
4. Deploy to `$1`.
5. Report the release hash and the deploy log URL.

Refuse if the working tree is dirty, or if `$1` is neither `staging` nor
`production`.
